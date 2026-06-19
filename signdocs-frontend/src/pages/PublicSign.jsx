import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { validateSigningToken, completeSigningRequest } from "../api/signingRequestsApi";

export default function PublicSign() {
  const { token } = useParams();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [agree, setAgree] = useState(false);

  useEffect(() => {
    let cancelled = false;
    validateSigningToken(token)
      .then((res) => {
        if (!cancelled) setRequest(res.data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err.response?.status === 404
              ? "This signing link is invalid or has expired."
              : "Could not verify this signing link. Please try again later."
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [request]);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const point = e.touches ? e.touches[0] : e;
    return {
      x: (point.clientX - rect.left) * (canvasRef.current.width / rect.width),
      y: (point.clientY - rect.top) * (canvasRef.current.height / rect.height),
    };
  };

  const startDraw = (e) => {
    e.preventDefault();
    setDrawing(true);
    setHasSignature(true);
    const ctx = canvasRef.current.getContext("2d");
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const moveDraw = (e) => {
    if (!drawing) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext("2d");
    const { x, y } = getPos(e);
    ctx.strokeStyle = "#1a1a2e";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const endDraw = () => setDrawing(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleComplete = async () => {
    setError(null);
    if (!hasSignature) {
      setError("Please sign in the box before completing.");
      return;
    }
    if (!agree) {
      setError("Please confirm you agree to sign this document electronically.");
      return;
    }
    setSubmitting(true);
    try {
      // The signature is sent as a base64 PNG data URL. Adjust this payload
      // shape to match your backend's expected request body for
      // POST /api/signing-requests/complete/{token}.
      const signatureDataUrl = canvasRef.current.toDataURL("image/png");
      await completeSigningRequest(token, { signatureImage: signatureDataUrl });
      setCompleted(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not complete signing. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-ink-50">
      <header className="border-b border-ink-100 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white">
            <i className="ti ti-file-signature text-base" aria-hidden="true" />
          </div>
          <span className="text-lg font-extrabold tracking-tight text-ink-900">SignDocs</span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
        {loading ? (
          <div className="py-16 text-center text-sm text-ink-400">Verifying signing link...</div>
        ) : error && !request ? (
          <div className="card flex flex-col items-center px-6 py-14 text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <i className="ti ti-link-off text-2xl text-red-400" aria-hidden="true" />
            </div>
            <p className="text-sm font-semibold text-ink-700">{error}</p>
          </div>
        ) : completed ? (
          <div className="card flex flex-col items-center px-6 py-14 text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
              <i className="ti ti-circle-check text-2xl text-emerald-500" aria-hidden="true" />
            </div>
            <h2 className="text-lg font-extrabold text-ink-900">You're all signed</h2>
            <p className="mt-1 text-sm text-ink-500">
              Thanks — the document owner will be notified. You can close this page.
            </p>
          </div>
        ) : (
          <>
            <div className="card mb-6 p-6">
              <h1 className="text-xl font-extrabold text-ink-900">
                {request?.documentName || `Document #${request?.documentId}`}
              </h1>
              <p className="mt-1 text-sm text-ink-500">
                You've been asked to sign this document
                {request?.signerEmail ? ` as ${request.signerEmail}` : ""}.
              </p>
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-ink-50 px-3.5 py-2.5 text-xs text-ink-500">
                <i className="ti ti-info-circle text-base" aria-hidden="true" />
                Review the document with the owner before signing. This page only
                collects your signature for the request.
              </div>
            </div>

            <div className="card p-6">
              <h3 className="mb-1 text-base font-bold text-ink-900">Your signature</h3>
              <p className="mb-4 text-sm text-ink-500">
                Draw your signature in the box below
              </p>

              {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
                  {error}
                </div>
              )}

              <canvas
                ref={canvasRef}
                width={600}
                height={180}
                className="w-full cursor-crosshair touch-none rounded-lg border-2 border-dashed border-ink-200 bg-white"
                onMouseDown={startDraw}
                onMouseMove={moveDraw}
                onMouseUp={endDraw}
                onMouseLeave={endDraw}
                onTouchStart={startDraw}
                onTouchMove={moveDraw}
                onTouchEnd={endDraw}
              />
              <div className="mt-2 flex justify-end">
                <button onClick={clearCanvas} className="text-sm font-semibold text-ink-500 hover:text-ink-800">
                  Clear
                </button>
              </div>

              <label className="mt-4 flex items-start gap-2.5 text-sm text-ink-600">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 rounded border-ink-300 text-brand-500 focus:ring-brand-200"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                />
                I agree that this electronic signature is legally binding,
                equivalent to my handwritten signature.
              </label>

              <button
                onClick={handleComplete}
                disabled={submitting}
                className="btn-primary mt-5 w-full py-3"
              >
                {submitting ? "Submitting..." : "Complete signing"}
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
