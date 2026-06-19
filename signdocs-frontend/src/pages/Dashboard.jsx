import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getMyDocuments } from "../api/documentsApi";
import { getMySigningRequests } from "../api/signingRequestsApi";
import { useAuth } from "../context/AuthContext";
import StatusBadge from "../components/StatusBadge";

export default function Dashboard() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [signingRequests, setSigningRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.allSettled([getMyDocuments(), getMySigningRequests()]).then(
      ([docsRes, reqsRes]) => {
        if (cancelled) return;
        if (docsRes.status === "fulfilled") {
          setDocuments(docsRes.value.data || []);
        } else {
          setError("Could not load documents from the server.");
        }
        if (reqsRes.status === "fulfilled") {
          setSigningRequests(reqsRes.value.data || []);
        }
        setLoading(false);
      }
    );

    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => {
    const total = documents.length;
    const completed = documents.filter(
      (d) => (d.status || "").toUpperCase() === "COMPLETED" || (d.status || "").toUpperCase() === "SIGNED"
    ).length;
    const awaiting = signingRequests.filter(
      (r) => (r.status || "").toUpperCase() === "PENDING"
    ).length;
    const uniqueSigners = new Set(
      signingRequests.map((r) => r.signerEmail).filter(Boolean)
    ).size;
    return { total, completed, awaiting, signers: uniqueSigners };
  }, [documents, signingRequests]);

  const firstName = (user?.name || "there").split(" ")[0];

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-extrabold text-ink-900">
            Good to see you, {firstName}
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            Here's what's happening with your documents
          </p>
        </div>
        <Link to="/documents/upload" className="btn-primary flex items-center gap-1.5">
          <i className="ti ti-plus text-base" aria-hidden="true" />
          New document
        </Link>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {error} Make sure the Spring Boot backend is running at{" "}
          <code className="rounded bg-amber-100 px-1">
            {import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}
          </code>
          .
        </div>
      )}

      {/* Stats */}
      <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total documents", value: stats.total, icon: "ti-files", color: "text-brand-500" },
          { label: "Awaiting signature", value: stats.awaiting, icon: "ti-clock-hour-4", color: "text-amber-500" },
          { label: "Completed", value: stats.completed, icon: "ti-circle-check", color: "text-emerald-500" },
          { label: "Active signers", value: stats.signers, icon: "ti-users", color: "text-sky-500" },
        ].map((s) => (
          <div key={s.label} className="card p-5">
            <div className="mb-2.5 flex items-center justify-between">
              <i className={`ti ${s.icon} text-2xl text-ink-300`} aria-hidden="true" />
              <span className={`text-2xl font-extrabold ${s.color}`}>{s.value}</span>
            </div>
            <p className="text-sm font-medium text-ink-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent documents */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-ink-100 px-6 py-4">
          <h3 className="text-base font-bold text-ink-900">Recent documents</h3>
          <Link to="/documents" className="text-sm font-semibold text-brand-500 hover:text-brand-600">
            View all
          </Link>
        </div>

        {loading ? (
          <div className="px-6 py-10 text-center text-sm text-ink-400">
            Loading documents...
          </div>
        ) : documents.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-14 text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-ink-50">
              <i className="ti ti-file-upload text-2xl text-ink-300" aria-hidden="true" />
            </div>
            <p className="text-sm font-semibold text-ink-700">No documents yet</p>
            <p className="mt-1 text-sm text-ink-400">
              Upload a PDF to start your first signing workflow
            </p>
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
              {documents.slice(0, 5).map((doc) => (
                <tr key={doc.id} className="border-t border-ink-50 hover:bg-ink-50/40">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50">
                        <i className="ti ti-file-text text-lg text-brand-500" aria-hidden="true" />
                      </div>
                      <p className="text-sm font-semibold text-ink-900">
                        {doc.fileName || doc.name || `Document #${doc.id}`}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={doc.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-ink-500">
                    {doc.uploadedAt
                      ? new Date(doc.uploadedAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/documents/${doc.id}`}
                      className="text-sm font-semibold text-ink-600 hover:text-brand-500"
                    >
                      Open →
                    </Link>
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
