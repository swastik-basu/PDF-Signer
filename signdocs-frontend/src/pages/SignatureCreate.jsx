import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadSignature } from "../api/signaturesApi";
import { useToast } from "../context/ToastContext";
import SignatureCanvasModal from "../components/SignatureCanvasModal";

const TYPES = [
  { value: "SIGNATURE", label: "Signature" },
  { value: "TYPED", label: "Typed" }
];

export default function SignatureCreate() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [signatureName, setSignatureName] = useState("");
  const [type, setType] = useState("SIGNATURE");
  const [showCanvas, setShowCanvas] = useState(false);
  const [imageBlob, setImageBlob] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleCanvasSave = (blob) => {
    setImageBlob(blob);
    setPreviewUrl(URL.createObjectURL(blob));
    setShowCanvas(false);
  };

  const handleSave = async () => {
    setError(null);
    if (!signatureName.trim()) {
      setError("Give your signature a name, e.g. \"My signature\".");
      return;
    }
    if (!imageBlob) {
      setError("Draw or type your signature before saving.");
      return;
    }
    setSaving(true);
    try {
      await uploadSignature({ signatureName, type, image: imageBlob });
      showToast("Signature saved");
      navigate("/signatures");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Could not save the signature. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <button
        onClick={() => navigate("/signatures")}
        className="mb-6 flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-800"
      >
        <i className="ti ti-arrow-left text-base" aria-hidden="true" />
        Back to signatures
      </button>

      <h1 className="text-2xl font-extrabold text-ink-900">New signature</h1>
      <p className="mt-1 mb-8 text-sm text-ink-500">
        Create a reusable signature or initials template
      </p>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="card p-6">
        <div className="mb-5">
          <label className="label">Name</label>
          <input
            className="input-field"
            placeholder="e.g. My signature"
            value={signatureName}
            onChange={(e) => setSignatureName(e.target.value)}
          />
        </div>

        <div className="mb-5">
          <label className="label">Type</label>
          <div className="flex gap-2">
            {TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => setType(t.value)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition ${type === t.value
                    ? "border-brand-500 bg-brand-50 text-brand-600"
                    : "border-ink-200 text-ink-600 hover:bg-ink-50"
                  }`}
              >
                <i className={`ti ${t.icon} text-base`} aria-hidden="true" />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-2">
          <label className="label">Signature image</label>
          {previewUrl ? (
            <div className="flex h-28 items-center justify-center rounded-lg border border-ink-200 bg-white">
              <img src={previewUrl} alt="Signature preview" className="max-h-24 max-w-full object-contain" />
            </div>
          ) : (
            <div className="flex h-28 items-center justify-center rounded-lg border border-dashed border-ink-200 bg-ink-50 text-sm text-ink-400">
              No signature yet
            </div>
          )}
        </div>
        <button onClick={() => setShowCanvas(true)} className="btn-outline-brand mt-3 w-full">
          {previewUrl ? "Redo signature" : "Draw / type signature"}
        </button>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button onClick={() => navigate("/signatures")} className="btn-secondary">
          Cancel
        </button>
        <button onClick={handleSave} disabled={saving} className="btn-primary px-8">
          {saving ? "Saving..." : "Save signature"}
        </button>
      </div>

      {showCanvas && (
        <SignatureCanvasModal onClose={() => setShowCanvas(false)} onSave={handleCanvasSave} />
      )}
    </div>
  );
}
