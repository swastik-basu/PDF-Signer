import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMySignatures } from "../api/signaturesApi";

export default function Signatures() {
  const [signatures, setSignatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getMySignatures()
      .then((res) => {
        if (!cancelled) setSignatures(res.data || []);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load signatures from the server.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-extrabold text-ink-900">Signatures</h1>
          <p className="mt-1 text-sm text-ink-500">
            Saved signature and initials templates for reuse across documents
          </p>
        </div>
        <Link to="/signatures/create" className="btn-primary flex items-center gap-1.5">
          <i className="ti ti-plus text-base" aria-hidden="true" />
          New signature
        </Link>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {error}
        </div>
      )}

      {loading ? (
        <div className="card px-6 py-10 text-center text-sm text-ink-400">Loading...</div>
      ) : signatures.length === 0 ? (
        <div className="card flex flex-col items-center px-6 py-14 text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-ink-50">
            <i className="ti ti-signature text-2xl text-ink-300" aria-hidden="true" />
          </div>
          <p className="text-sm font-semibold text-ink-700">No signatures yet</p>
          <p className="mt-1 text-sm text-ink-400">
            Create a signature so you can place it on documents
          </p>
          <Link to="/signatures/create" className="btn-primary mt-4">
            Create signature
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {signatures.map((sig) => (
            <div key={sig.id} className="card p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-600">
                  {sig.type || "SIGNATURE"}
                </span>
                <span className="text-xs text-ink-400">ID: {sig.id}</span>
              </div>
              <div className="mb-3 flex h-24 items-center justify-center rounded-lg border border-dashed border-ink-200 bg-ink-50">
                {sig.imageBase64 ? (
                  <img
                    src={`data:image/png;base64,${sig.imageBase64}`}
                    alt={sig.signatureName || "Signature"}
                    className="max-h-20 max-w-full object-contain"
                  />
                ) : (
                  <i className="ti ti-signature text-3xl text-ink-300" aria-hidden="true" />
                )}
              </div>
              <p className="truncate text-sm font-semibold text-ink-900">
                {sig.signatureName || `Signature #${sig.id}`}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
