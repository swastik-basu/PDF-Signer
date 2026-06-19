import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getDocumentById, downloadOriginalPdf } from "../api/documentsApi";
import { getPlacementsByDocument } from "../api/placementsApi";
import { generateSignedPdf, downloadSignedPdf } from "../api/pdfApi";
import { useToast } from "../context/ToastContext";
import StatusBadge from "../components/StatusBadge";

function downloadBlob(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export default function DocumentDetail() {
  const { id } = useParams();
  const documentId = Number(id);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [doc, setDoc] = useState(null);
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const fetchDoc = () => {
    setLoading(true);
    Promise.allSettled([
      getDocumentById(documentId),
      getPlacementsByDocument(documentId),
    ]).then(([docRes, placementsRes]) => {
      if (docRes.status === "fulfilled") setDoc(docRes.value.data);
      if (placementsRes.status === "fulfilled") setPlacements(placementsRes.value.data || []);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchDoc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentId]);

  const handleDownloadOriginal = async () => {
    setDownloading(true);
    try {
      const res = await downloadOriginalPdf(documentId);
      downloadBlob(
        new Blob([res.data], { type: "application/pdf" }),
        doc?.fileName || doc?.name || `document-${documentId}.pdf`
      );
    } catch {
      showToast("Could not download the original PDF", "error");
    } finally {
      setDownloading(false);
    }
  };

  const handleGenerateSigned = async () => {
    setGenerating(true);
    try {
      const res = await generateSignedPdf(documentId);
      showToast("Signed PDF generated successfully");
      const signedId = res.data?.id || res.data?.signedDocumentId || res.data?.signedId;
      if (signedId) {
        setDoc((prev) => ({ ...prev, signedDocumentId: signedId, status: "COMPLETED" }));
      }
      fetchDoc();
    } catch {
      showToast("Could not generate the signed PDF", "error");
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadSigned = async () => {
    const signedId = doc?.signedDocumentId || doc?.signedId;
    if (!signedId) {
      showToast("Generate the signed PDF first", "error");
      return;
    }
    setDownloading(true);
    try {
      const res = await downloadSignedPdf(signedId);
      downloadBlob(
        new Blob([res.data], { type: "application/pdf" }),
        `signed-${doc?.fileName || doc?.name || `document-${documentId}.pdf`}`
      );
    } catch {
      showToast("Could not download the signed PDF", "error");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return <div className="px-6 py-16 text-center text-sm text-ink-400">Loading document...</div>;
  }

  if (!doc) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <p className="text-sm font-semibold text-ink-700">Document not found</p>
        <Link to="/documents" className="mt-3 inline-block text-sm font-semibold text-brand-500">
          Back to documents
        </Link>
      </div>
    );
  }

  const signedId = doc?.signedDocumentId || doc?.signedId;

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <button
        onClick={() => navigate("/documents")}
        className="mb-6 flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-800"
      >
        <i className="ti ti-arrow-left text-base" aria-hidden="true" />
        Back to documents
      </button>

      <div className="card p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50">
              <i className="ti ti-file-text text-2xl text-brand-500" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-ink-900">
                {doc.fileName || doc.name || `Document #${documentId}`}
              </h1>
              <p className="text-xs text-ink-400">
                Uploaded{" "}
                {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleString() : "—"}
              </p>
            </div>
          </div>
          <StatusBadge status={doc.status} />
        </div>

        <div className="grid grid-cols-2 gap-4 rounded-xl bg-ink-50 p-4 sm:grid-cols-4">
          {[
            ["Document ID", documentId],
            ["Pages", doc.pageCount || doc.pages || "—"],
            ["Fields placed", placements.length],
            ["Owner", doc.ownerName || doc.ownerEmail || "You"],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-xs font-semibold text-ink-400">{label}</p>
              <p className="mt-0.5 text-sm font-bold text-ink-900">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Link to={`/documents/${documentId}/place`} className="btn-outline-brand flex items-center justify-center gap-2">
            <i className="ti ti-pointer text-base" aria-hidden="true" />
            Place signature fields
          </Link>
          <button
            onClick={handleDownloadOriginal}
            disabled={downloading}
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <i className="ti ti-download text-base" aria-hidden="true" />
            Download original
          </button>
          <button
            onClick={handleGenerateSigned}
            disabled={generating}
            className="btn-primary flex items-center justify-center gap-2"
          >
            <i className="ti ti-file-check text-base" aria-hidden="true" />
            {generating ? "Generating..." : "Generate signed PDF"}
          </button>
          <button
            onClick={handleDownloadSigned}
            disabled={downloading || !signedId}
            className="btn-primary flex items-center justify-center gap-2 bg-ink-900 hover:bg-ink-800"
          >
            <i className="ti ti-download text-base" aria-hidden="true" />
            Download signed PDF
          </button>
        </div>

        <div className="mt-6 flex items-center justify-between rounded-xl border border-ink-100 p-4">
          <div>
            <p className="text-sm font-bold text-ink-900">Send for signing</p>
            <p className="text-xs text-ink-400">
              Email this document to a signer to complete the workflow
            </p>
          </div>
          <Link
            to="/signing-requests"
            state={{ documentId }}
            className="btn-primary whitespace-nowrap"
          >
            Send →
          </Link>
        </div>

        {/* Placed fields list */}
        <div className="mt-6">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-400">
            Placed signature fields
          </p>
          {placements.length === 0 ? (
            <p className="text-sm text-ink-400">
              No fields placed yet.{" "}
              <Link to={`/documents/${documentId}/place`} className="font-semibold text-brand-500">
                Place fields
              </Link>
            </p>
          ) : (
            <div className="overflow-hidden rounded-xl border border-ink-100">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-ink-50 text-xs font-bold uppercase text-ink-400">
                    <th className="px-4 py-2">Page</th>
                    <th className="px-4 py-2">Signature template</th>
                    <th className="px-4 py-2">Position (x, y)</th>
                    <th className="px-4 py-2">Size</th>
                  </tr>
                </thead>
                <tbody>
                  {placements.map((p) => (
                    <tr key={p.id} className="border-t border-ink-50">
                      <td className="px-4 py-2">{p.pageNumber}</td>
                      <td className="px-4 py-2">#{p.signatureTemplateId}</td>
                      <td className="px-4 py-2">
                        {p.xCoordinate}, {p.yCoordinate}
                      </td>
                      <td className="px-4 py-2">
                        {p.width} × {p.height}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
