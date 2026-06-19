import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyDocuments, downloadOriginalPdf } from "../api/documentsApi";
import { useToast } from "../context/ToastContext";
import StatusBadge from "../components/StatusBadge";

export default function Documents() {
  const { showToast } = useToast();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getMyDocuments()
      .then((res) => {
        if (!cancelled) setDocuments(res.data || []);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load documents from the server.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleDownload = async (doc) => {
    try {
      const res = await downloadOriginalPdf(doc.id);
      const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = doc.fileName || doc.name || `document-${doc.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      showToast("Could not download this document", "error");
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-extrabold text-ink-900">Documents</h1>
          <p className="mt-1 text-sm text-ink-500">
            All documents uploaded to your account
          </p>
        </div>
        <Link to="/documents/upload" className="btn-primary flex items-center gap-1.5">
          <i className="ti ti-plus text-base" aria-hidden="true" />
          New document
        </Link>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {error}
        </div>
      )}

      <div className="card overflow-hidden">
        {loading ? (
          <div className="px-6 py-10 text-center text-sm text-ink-400">Loading...</div>
        ) : documents.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-14 text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-ink-50">
              <i className="ti ti-file-upload text-2xl text-ink-300" aria-hidden="true" />
            </div>
            <p className="text-sm font-semibold text-ink-700">No documents yet</p>
            <p className="mt-1 text-sm text-ink-400">Upload a PDF to get started</p>
            <Link to="/documents/upload" className="btn-primary mt-4">
              Upload document
            </Link>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-ink-50/60 text-xs font-bold uppercase tracking-wide text-ink-400">
                <th className="px-6 py-3">Document</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Uploaded</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id} className="border-t border-ink-50 hover:bg-ink-50/40">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50">
                        <i className="ti ti-file-text text-lg text-brand-500" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-ink-900">
                          {doc.fileName || doc.name || `Document #${doc.id}`}
                        </p>
                        <p className="text-xs text-ink-400">ID: {doc.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={doc.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-ink-500">
                    {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-4">
                      <button
                        onClick={() => handleDownload(doc)}
                        className="text-sm font-semibold text-ink-500 hover:text-brand-500"
                      >
                        <i className="ti ti-download text-base" aria-hidden="true" />
                      </button>
                      <Link
                        to={`/documents/${doc.id}`}
                        className="text-sm font-semibold text-ink-600 hover:text-brand-500"
                      >
                        Open →
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
