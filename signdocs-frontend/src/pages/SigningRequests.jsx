import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { createSigningRequest, getMySigningRequests } from "../api/signingRequestsApi";
import { getMyDocuments } from "../api/documentsApi";
import { useToast } from "../context/ToastContext";
import StatusBadge from "../components/StatusBadge";

export default function SigningRequests() {
  const location = useLocation();
  const { showToast } = useToast();

  const [documents, setDocuments] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [documentId, setDocumentId] = useState(location.state?.documentId || "");
  const [signerEmail, setSignerEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const refresh = () => {
    Promise.allSettled([getMyDocuments(), getMySigningRequests()]).then(
      ([docsRes, reqsRes]) => {
        if (docsRes.status === "fulfilled") setDocuments(docsRes.value.data || []);
        if (reqsRes.status === "fulfilled") setRequests(reqsRes.value.data || []);
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!documentId) {
      setError("Choose a document to send.");
      return;
    }
    if (!signerEmail) {
      setError("Enter the signer's email address.");
      return;
    }
    setSubmitting(true);
    try {
      await createSigningRequest({ documentId: Number(documentId), signerEmail });
      showToast(`Signing request sent to ${signerEmail}`);
      setSignerEmail("");
      refresh();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Could not create the signing request. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-extrabold text-ink-900">Signing requests</h1>
      <p className="mt-1 mb-8 text-sm text-ink-500">
        Send documents to signers and track their status
      </p>

      <div className="card mb-8 p-6">
        <h3 className="mb-4 text-base font-bold text-ink-900">New signing request</h3>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="label">Document</label>
            <select
              className="input-field"
              value={documentId}
              onChange={(e) => setDocumentId(e.target.value)}
            >
              <option value="">Select a document...</option>
              {documents.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.fileName || d.name || `Document #${d.id}`}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="label">Signer email</label>
            <input
              type="email"
              className="input-field"
              placeholder="signer@example.com"
              value={signerEmail}
              onChange={(e) => setSignerEmail(e.target.value)}
            />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary whitespace-nowrap">
            {submitting ? "Sending..." : "Send for signing"}
          </button>
        </form>
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-ink-100 px-6 py-4">
          <h3 className="text-base font-bold text-ink-900">Sent requests</h3>
        </div>
        {loading ? (
          <div className="px-6 py-10 text-center text-sm text-ink-400">Loading...</div>
        ) : requests.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-ink-400">
            No signing requests yet
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-ink-50/60 text-xs font-bold uppercase tracking-wide text-ink-400">
                <th className="px-6 py-3">Document</th>
                <th className="px-6 py-3">Signer</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Sent</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id} className="border-t border-ink-50">
                  <td className="px-6 py-4 text-sm font-semibold text-ink-900">
                    {r.documentName || `Document #${r.documentId}`}
                  </td>
                  <td className="px-6 py-4 text-sm text-ink-600">{r.signerEmail}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={r.status || "PENDING"} />
                  </td>
                  <td className="px-6 py-4 text-sm text-ink-500">
                    {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "—"}
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
