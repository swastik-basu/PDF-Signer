import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getDocumentById, downloadOriginalPdf } from "../api/documentsApi";
import { getMySignatures } from "../api/signaturesApi";
import { createPlacement, getPlacementsByDocument } from "../api/placementsApi";
import { generateSignedPdf } from "../api/pdfApi";
import { loadPdf, renderPageToCanvas } from "../utils/pdfUtils";
import { useToast } from "../context/ToastContext";

// Default box sizes in PDF points (1pt = 1/72in) for each signature type.
const DEFAULT_SIZE = {
  SIGNATURE: { width: 180, height: 70 },
  INITIALS: { width: 90, height: 50 },
};

const CANVAS_TARGET_WIDTH = 700;

export default function PlacementEditor() {
  const { id } = useParams();
  const documentId = Number(id);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const canvasRef = useRef(null);
  const stageRef = useRef(null);

  const [doc, setDoc] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageGeometry, setPageGeometry] = useState(null);

  const [signatures, setSignatures] = useState([]);
  const [activeSignature, setActiveSignature] = useState(null);

  const [placements, setPlacements] = useState([]); // local, unsaved + existing
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [draggingExisting, setDraggingExisting] = useState(null);

  // ---- Load document, PDF bytes, and signature templates ----
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [docRes, pdfRes, sigRes, placementsRes] = await Promise.allSettled([
          getDocumentById(documentId),
          downloadOriginalPdf(documentId),
          getMySignatures(),
          getPlacementsByDocument(documentId),
        ]);

        if (cancelled) return;

        if (docRes.status === "fulfilled") setDoc(docRes.value.data);

        if (pdfRes.status === "fulfilled") {
          const arrayBuffer = await pdfRes.value.data.arrayBuffer();
          const loaded = await loadPdf(arrayBuffer);
          setPdfDoc(loaded);
          setNumPages(loaded.numPages);
        } else {
          setError("Could not load the PDF from the server.");
        }

        if (sigRes.status === "fulfilled") {
          const sigs = sigRes.value.data || [];
          setSignatures(sigs);
          if (sigs.length) setActiveSignature(sigs[0]);
        }

        if (placementsRes.status === "fulfilled") {
          const existing = (placementsRes.value.data || []).map((p) => ({
            ...p,
            localId: `existing-${p.id}`,
            saved: true,
          }));
          setPlacements(existing);
        }
      } catch {
        if (!cancelled) setError("Something went wrong while loading the document.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [documentId]);

  // ---- Render current page whenever pdfDoc or pageNumber changes ----
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;
    let cancelled = false;
    renderPageToCanvas(pdfDoc, pageNumber, canvasRef.current, CANVAS_TARGET_WIDTH).then((geo) => {
      if (!cancelled) setPageGeometry(geo);
    });
    return () => {
      cancelled = true;
    };
  }, [pdfDoc, pageNumber]);

  // ---- Coordinate helpers ----
  // Converts a click/drop point (px, relative to the canvas) into a
  // placement payload in PDF point coordinates. The box is centered on
  // the given point. PDF coordinates use a bottom-left origin, so we flip
  // the y axis: yCoordinate = pageHeight - yFromTop - height.
  // NOTE: if your PDFBox-based backend expects a top-left origin instead,
  // change yCoordinate to simply `topPt`.
  const pointToPlacement = useCallback(
    (px, py, sizePt) => {
      if (!pageGeometry) return null;
      const { scale, pageHeightPt } = pageGeometry;
      const xPt = px / scale;
      const yFromTopPt = py / scale;
      const leftPt = xPt - sizePt.width / 2;
      const topPt = yFromTopPt - sizePt.height / 2;
      return {
        xCoordinate: Math.max(0, leftPt),
        yCoordinate: Math.max(0, pageHeightPt - topPt - sizePt.height),
      };
    },
    [pageGeometry]
  );

  // Converts a stored placement (PDF points, bottom-left origin) back to
  // on-screen pixel position/size for the overlay box.
  const placementToBox = useCallback(
    (placement) => {
      if (!pageGeometry) return null;
      const { scale, pageHeightPt } = pageGeometry;
      const widthPx = placement.width * scale;
      const heightPx = placement.height * scale;
      const leftPx = placement.xCoordinate * scale;
      const topPx = (pageHeightPt - placement.yCoordinate - placement.height) * scale;
      return { left: leftPx, top: topPx, width: widthPx, height: heightPx };
    },
    [pageGeometry]
  );

  
  // ---- Placing new fields ----
  const addPlacementAt = (px, py) => {
    if (!activeSignature) {
      showToast("Add a signature first, then place it on the document", "error");
      return;
    }
    const sizePt = DEFAULT_SIZE[activeSignature.type] || DEFAULT_SIZE.SIGNATURE;
    const coords = pointToPlacement(px, py, sizePt);
    if (!coords) return;

    const newPlacement = {
      localId: `new-${Date.now()}`,
      documentId,
      signatureTemplateId: activeSignature.id,
      signatureName: activeSignature.signatureName,
      signatureType: activeSignature.type,
      pageNumber,
      width: sizePt.width,
      height: sizePt.height,
      rotation: 0,
      ...coords,
      saved: false,
    };
    setPlacements((prev) => [...prev, newPlacement]);
    setSelectedId(newPlacement.localId);
  };

  const handleStageClick = (e) => {
    if (draggingExisting) return;
    const rect = canvasRef.current.getBoundingClientRect();
    addPlacementAt(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const rect = stageRef.current.getBoundingClientRect();
    addPlacementAt(e.clientX - rect.left, e.clientY - rect.top);
  };

  const removePlacement = (localId, e) => {
    e?.stopPropagation();
    setPlacements((prev) => prev.filter((p) => p.localId !== localId));
    if (selectedId === localId) setSelectedId(null);
  };

  const rotatePlacement = (localId, e) => {
    e?.stopPropagation();
    setPlacements((prev) =>
      prev.map((p) =>
        p.localId === localId
          ? { ...p, rotation: (p.rotation + 90) % 360, saved: false }
          : p
      )
    );
  };

  // ---- Dragging existing boxes to reposition ----
  const startDragExisting = (placement, e) => {
    e.stopPropagation();
    setSelectedId(placement.localId);
    setDraggingExisting({ localId: placement.localId });
  };

  useEffect(() => {
    if (!draggingExisting || !pageGeometry) return;

    const onMove = (e) => {
      const rect = stageRef.current.getBoundingClientRect();
      const px =
        (e.clientX - rect.left) *
        (canvasRef.current.width / rect.width);

      const py =
        (e.clientY - rect.top) *
        (canvasRef.current.height / rect.height);
      const placement = placements.find((p) => p.localId === draggingExisting.localId);
      if (!placement) return;
      const sizePt = { width: placement.width, height: placement.height };
      const coords = pointToPlacement(px, py, sizePt);
      if (!coords) return;
      setPlacements((prev) =>
        prev.map((p) =>
          p.localId === draggingExisting.localId ? { ...p, ...coords, saved: false } : p
        )
      );
    };

    const onUp = () => setDraggingExisting(null);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draggingExisting, pageGeometry]);

  // ---- Save all placements, then optionally generate the signed PDF ----
  const handleSave = async () => {
    const pending = placements.filter((p) => !p.saved);
    if (pending.length === 0) {
      showToast("No new fields to save");
      return;
    }
    setSaving(true);
    try {
      for (const p of pending) {
        await createPlacement({
          documentId: p.documentId,
          signatureTemplateId: p.signatureTemplateId,
          pageNumber: p.pageNumber,
          xCoordinate: p.xCoordinate,
          yCoordinate: p.yCoordinate,
          width: p.width,
          height: p.height,
          rotation: p.rotation,
        });
      }
      showToast("Signature fields saved");
      setPlacements((prev) => prev.map((p) => ({ ...p, saved: true })));
    } catch {
      showToast("Could not save one or more fields", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleGenerate = async () => {
    setSaving(true);
    try {
      await generateSignedPdf(documentId);
      showToast("Signed PDF generated");
      navigate(`/documents/${documentId}`);
    } catch {
      showToast("Could not generate the signed PDF", "error");
    } finally {
      setSaving(false);
    }
  };

  const currentPagePlacements = placements.filter((p) => p.pageNumber === pageNumber);

  if (loading) {
    return <div className="px-6 py-16 text-center text-sm text-ink-400">Loading document...</div>;
  }

  return (
    <div className="flex h-[calc(100vh-60px)] flex-col bg-ink-50 lg:flex-row">
      {/* Left sidebar - signature palette */}
      <div className="flex w-full flex-col gap-5 overflow-y-auto border-b border-ink-100 bg-white p-4 lg:w-64 lg:border-b-0 lg:border-r">
        <div>
          <Link to={`/documents/${documentId}`} className="mb-3 flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-800">
            <i className="ti ti-arrow-left text-base" aria-hidden="true" />
            Back to document
          </Link>
          <p className="truncate text-sm font-bold text-ink-900">
            {doc?.fileName || doc?.name || `Document #${documentId}`}
          </p>
        </div>

        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-400">
            Your signatures
          </p>
          {signatures.length === 0 ? (
            <div className="rounded-lg border border-dashed border-ink-200 bg-ink-50 p-3 text-center text-xs text-ink-400">
              No saved signatures.{" "}
              <Link to="/signatures/create" className="font-semibold text-brand-500">
                Create one
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {signatures.map((sig) => (
                <div
                  key={sig.id}
                  draggable
                  onDragStart={() => setActiveSignature(sig)}
                  onClick={() => setActiveSignature(sig)}
                  className={`flex cursor-grab items-center gap-2.5 rounded-lg border p-2.5 transition active:cursor-grabbing ${activeSignature?.id === sig.id
                    ? "border-brand-500 bg-brand-50"
                    : "border-ink-200 hover:bg-ink-50"
                    }`}
                >
                  <div className="flex h-9 w-14 flex-shrink-0 items-center justify-center rounded bg-white">
                    {sig.imageBase64 ? (
                      <img
                        src={`data:image/png;base64,${sig.imageBase64}`}
                        alt={sig.signatureName}
                        className="max-h-20 max-w-full object-contain"
                      />
                    ) : (
                      <i className="ti-signature text-base text-ink-300" aria-hidden="true" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-ink-900">
                      {sig.signatureName || `Signature #${sig.id}`}
                    </p>
                    <p className="text-xs text-ink-400">{sig.type}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <p className="mt-2 text-xs text-ink-400">
            Drag a signature onto the page, or select it and click where it should go.
          </p>
        </div>

        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-400">
            Fields on page {pageNumber} ({currentPagePlacements.length})
          </p>
          {currentPagePlacements.length === 0 ? (
            <p className="text-xs text-ink-400">No fields placed on this page yet.</p>
          ) : (
            <div className="flex flex-col gap-1.5">
              {currentPagePlacements.map((p) => (
                <div
                  key={p.localId}
                  onClick={() => setSelectedId(p.localId)}
                  className={`flex items-center gap-2 rounded-lg p-2 text-xs ${selectedId === p.localId ? "bg-brand-50" : "bg-ink-50"
                    }`}
                >
                  <i className="ti ti-signature text-sm text-brand-500" aria-hidden="true" />
                  <span className="flex-1 truncate font-medium text-ink-800">
                    {p.signatureName || `Template #${p.signatureTemplateId}`}
                  </span>
                  {p.saved && <i className="ti ti-cloud-check text-sm text-emerald-500" aria-hidden="true" />}
                  <button onClick={(e) => rotatePlacement(p.localId, e)} className="text-ink-400 hover:text-ink-700">
                    <i className="ti ti-rotate text-sm" aria-hidden="true" />
                  </button>
                  <button onClick={(e) => removePlacement(p.localId, e)} className="text-ink-400 hover:text-red-500">
                    <i className="ti ti-trash text-sm" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Center - PDF canvas */}
      <div className="flex flex-1 flex-col items-center overflow-auto p-6">
        {error && (
          <div className="mb-4 w-full max-w-2xl rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {error}
          </div>
        )}

        {numPages > 1 && (
          <div className="mb-4 flex items-center gap-3 rounded-full bg-white px-4 py-1.5 shadow-card">
            <button
              onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
              disabled={pageNumber <= 1}
              className="text-ink-500 hover:text-ink-900 disabled:opacity-30"
            >
              <i className="ti ti-chevron-left text-lg" aria-hidden="true" />
            </button>
            <span className="text-sm font-semibold text-ink-700">
              Page {pageNumber} of {numPages}
            </span>
            <button
              onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
              disabled={pageNumber >= numPages}
              className="text-ink-500 hover:text-ink-900 disabled:opacity-30"
            >
              <i className="ti ti-chevron-right text-lg" aria-hidden="true" />
            </button>
          </div>
        )}

        <p className="mb-3 text-center text-xs text-ink-400">
          Click anywhere on the document to place{" "}
          <span className="font-semibold text-brand-500">
            {activeSignature?.signatureName || "a signature"}
          </span>
        </p>

        <div
          ref={stageRef}
          onClick={handleStageClick}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="relative cursor-crosshair rounded-sm bg-white shadow-floating"
          style={{ width: pageGeometry?.renderWidth || CANVAS_TARGET_WIDTH }}
        >
          <canvas ref={canvasRef} className="block" />

          {pageGeometry &&
            currentPagePlacements.map((p) => {
              const box = placementToBox(p);
              if (!box) return null;
              return (
                <div
                  key={p.localId}
                  onMouseDown={(e) => startDragExisting(p, e)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedId(p.localId);
                  }}
                  className={`absolute flex cursor-move items-center justify-center rounded border-2 text-xs font-semibold ${selectedId === p.localId
                    ? "border-brand-500 bg-brand-500/15 text-brand-700"
                    : "border-sky-400 bg-sky-400/10 text-sky-700"
                    }`}
                  style={{
                    left: box.left,
                    top: box.top,
                    width: box.width,
                    height: box.height,
                    transform: `rotate(${p.rotation}deg)`,
                  }}
                >
                  <span className="truncate px-1">
                    {p.signatureName || "Signature"}
                  </span>
                  <button
                    onClick={(e) => removePlacement(p.localId, e)}
                    className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-ink-500 shadow-card hover:text-red-500"
                  >
                    <i className="ti ti-x text-xs" aria-hidden="true" />
                  </button>
                </div>
              );
            })}
        </div>
      </div>

      {/* Right sidebar - actions */}
      <div className="flex w-full flex-col gap-3 border-t border-ink-100 bg-white p-4 lg:w-64 lg:border-l lg:border-t-0">
        <div className="rounded-lg bg-ink-50 p-3.5">
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-ink-400">Document</p>
          <p className="truncate text-sm font-semibold text-ink-900">
            {doc?.fileName || doc?.name || `Document #${documentId}`}
          </p>
          <p className="mt-1 text-xs text-ink-400">
            {numPages} page{numPages !== 1 ? "s" : ""} · {placements.length} field
            {placements.length !== 1 ? "s" : ""}
          </p>
        </div>

        <button onClick={handleSave} disabled={saving} className="btn-primary w-full">
          {saving ? "Saving..." : "Save field placements"}
        </button>
        <button onClick={handleGenerate} disabled={saving} className="btn-outline-brand w-full">
          Generate signed PDF
        </button>
        <Link to={`/documents/${documentId}`} className="btn-secondary w-full text-center">
          Done for now
        </Link>

        <div className="mt-2 border-t border-ink-100 pt-3 text-xs text-ink-400">
          <p className="mb-1.5 font-bold uppercase tracking-wide text-ink-400">Tip</p>
          Drag a signature from the left panel onto the page, or click it then
          click on the document. Drag a placed field to reposition it, and
          use the rotate icon to adjust its angle.
        </div>
      </div>
    </div>
  );
}
