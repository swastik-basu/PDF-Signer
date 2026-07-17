import { useRef, useState, useEffect } from "react";

const TABS = [
  { key: "draw", label: "Draw", icon: "ti-signature" },
  { key: "type", label: "Type", icon: "ti-keyboard" },
];

export default function SignatureCanvasModal({ onClose, onSave }) {
  const canvasRef = useRef(null);
  const [hasDrawing, setHasDrawing] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [tab, setTab] = useState("draw");
  const [typedName, setTypedName] = useState("");
  const [font, setFont] = useState("'Brush Script MT', cursive");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

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
    setHasDrawing(true);
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
    setHasDrawing(false);
  };

  const renderTypedSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#1a1a2e";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `48px ${font}`;
    ctx.fillText(typedName || "Your name", canvas.width / 2, canvas.height / 2);
  };

  const canSave =
    tab === "draw"
      ? hasDrawing
      : typedName.trim().length > 0;

  useEffect(() => {
    if (tab === "type") renderTypedSignature();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typedName, font]);

  const handleSave = () => {
    const canvas = canvasRef.current;
    canvas.toBlob((blob) => {
      if (blob) onSave(blob);
    }, "image/png");
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-floating">
        <div className="mb-1 flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-ink-900">
            Create a signature
          </h3>
          <button
            onClick={onClose}
            className="text-ink-400 hover:text-ink-700"
            aria-label="Close"
          >
            <i className="ti ti-x text-xl" aria-hidden="true" />
          </button>
        </div>
        <p className="mb-4 text-sm text-ink-500">
          Draw your signature or type your name to generate one
        </p>

        <div className="mb-4 flex gap-1 rounded-lg bg-ink-50 p-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-sm font-semibold transition ${tab === t.key
                ? "bg-white text-brand-600 shadow-card"
                : "text-ink-500 hover:text-ink-700"
                }`}
            >
              <i className={`ti ${t.icon} text-base`} aria-hidden="true" />
              {t.label}
            </button>
          ))}
        </div>

        {tab === "type" && (
          <div className="mb-3 flex flex-col gap-2 sm:flex-row">
            <input
              className="input-field flex-1"
              placeholder="Type your full name"
              value={typedName}
              onChange={(e) => setTypedName(e.target.value)}
            />
            <select
              className="input-field sm:w-44"
              value={font}
              onChange={(e) => setFont(e.target.value)}
            >
              <option value="'Brush Script MT', cursive">Script</option>
              <option value="Georgia, serif">Elegant</option>
              <option value="'Comic Sans MS', cursive">Casual</option>
            </select>
          </div>
        )}

        <canvas
          ref={canvasRef}
          width={460}
          height={160}
          className="w-full cursor-crosshair touch-none rounded-lg border-2 border-dashed border-ink-200 bg-white"
          onMouseDown={tab === "draw" ? startDraw : undefined}
          onMouseMove={tab === "draw" ? moveDraw : undefined}
          onMouseUp={tab === "draw" ? endDraw : undefined}
          onMouseLeave={tab === "draw" ? endDraw : undefined}
          onTouchStart={tab === "draw" ? startDraw : undefined}
          onTouchMove={tab === "draw" ? moveDraw : undefined}
          onTouchEnd={tab === "draw" ? endDraw : undefined}
        />
        <p className="mt-1.5 text-center text-xs text-ink-400">
          {tab === "draw" ? "Sign using your mouse or trackpad" : "Preview of your typed signature"}
        </p>

        <div className="mt-5 flex gap-2.5">
          {tab === "draw" && (
            <button onClick={clearCanvas} className="btn-secondary flex-1">
              Clear
            </button>
          )}
          <button onClick={onClose} className="btn-secondary flex-1">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="btn-primary flex-[2]"
          >
            Save signature
          </button>
        </div>
      </div>
    </div>
  );
}
