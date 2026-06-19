import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { uploadDocument } from "../api/documentsApi";
import { useToast } from "../context/ToastContext";

export default function DocumentUpload() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const pickFile = (selected) => {
    if (!selected) return;
    if (selected.type !== "application/pdf") {
      setError("Only PDF files are supported.");
      return;
    }
    if (selected.size > 50 * 1024 * 1024) {
      setError("File is too large. Maximum size is 50MB.");
      return;
    }
    setError(null);
    setFile(selected);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    pickFile(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setProgress(0);
    try {
      const res = await uploadDocument(file, (evt) => {
        if (evt.total) {
          setProgress(Math.round((evt.loaded / evt.total) * 100));
        }
      });
      showToast("Document uploaded successfully");
      const docId = res.data?.id || res.data?.documentId;
      if (docId) {
        navigate(`/documents/${docId}`);
      } else {
        navigate("/documents");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Upload failed. Please check the backend connection and try again."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <button
        onClick={() => navigate("/documents")}
        className="mb-6 flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-800"
      >
        <i className="ti ti-arrow-left text-base" aria-hidden="true" />
        Back to documents
      </button>

      <h1 className="text-2xl font-extrabold text-ink-900">Upload document</h1>
      <p className="mt-1 mb-8 text-sm text-ink-500">
        Upload a PDF to start the signing workflow
      </p>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => fileInputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed px-10 py-16 text-center transition ${
          dragOver ? "border-brand-500 bg-brand-50" : "border-ink-200 bg-white hover:border-ink-300"
        }`}
      >
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50">
          <i className="ti ti-file-upload text-3xl text-brand-500" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-bold text-ink-900">Drop your PDF here</h3>
        <p className="mt-1 mb-5 text-sm text-ink-500">or click to browse files</p>
        <span className="btn-primary inline-block">Choose file</span>
        <p className="mt-4 text-xs text-ink-400">Supports PDF · Max 50MB</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => pickFile(e.target.files[0])}
        />
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {file && (
        <div className="mt-6 flex items-center justify-between rounded-xl border border-emerald-200 bg-white px-5 py-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50">
              <i className="ti ti-file-text text-2xl text-brand-500" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-bold text-ink-900">{file.name}</p>
              <p className="text-xs text-ink-400">{(file.size / 1024).toFixed(0)} KB</p>
            </div>
          </div>
          {!uploading && <i className="ti ti-circle-check text-xl text-emerald-500" aria-hidden="true" />}
        </div>
      )}

      {uploading && (
        <div className="mt-4">
          <div className="h-2 w-full overflow-hidden rounded-full bg-ink-100">
            <div
              className="h-full rounded-full bg-brand-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-1.5 text-center text-xs text-ink-400">Uploading... {progress}%</p>
        </div>
      )}

      <div className="mt-8 flex justify-end gap-3">
        <button onClick={() => navigate("/documents")} className="btn-secondary">
          Cancel
        </button>
        <button onClick={handleUpload} disabled={!file || uploading} className="btn-primary px-8">
          {uploading ? "Uploading..." : "Upload document"}
        </button>
      </div>
    </div>
  );
}
