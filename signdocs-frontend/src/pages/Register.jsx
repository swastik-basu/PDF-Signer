import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const FIELDS = [
  { key: "name", label: "Full name", placeholder: "Jane Smith", type: "text" },
  { key: "email", label: "Work email", placeholder: "jane@company.com", type: "email" },
  { key: "password", label: "Password", placeholder: "At least 8 characters", type: "password" },
  { key: "confirm", label: "Confirm password", placeholder: "Repeat password", type: "password" },
];

export default function Register() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const update = (key) => (e) => {
    setForm((p) => ({ ...p, [key]: e.target.value }));
    setErrors((p) => ({ ...p, [key]: undefined, form: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.name) e.name = "Full name is required";
    if (!form.email) e.email = "Email is required";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 8) e.password = "Password must be at least 8 characters";
    if (form.password !== form.confirm) e.confirm = "Passwords do not match";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) {
      setErrors(v);
      return;
    }
    setSubmitting(true);
    try {
      const data = await register({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      showToast(`Welcome to SignDocs, ${data.name}!`);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Could not create your account. Please try again.";
      setErrors({ form: message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Brand panel */}
      <div className="hidden w-1/2 flex-col justify-center bg-gradient-to-br from-brand-500 to-brand-700 px-16 py-16 text-white lg:flex">
        <div className="mb-12 flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
            <i className="ti ti-file-signature text-2xl" aria-hidden="true" />
          </div>
          <span className="text-2xl font-extrabold">SignDocs</span>
        </div>
        <h1 className="mb-4 text-4xl font-extrabold leading-tight">
          Start signing for free.
        </h1>
        <p className="mb-10 max-w-md text-base leading-relaxed text-white/85">
          No credit card required. Get your documents signed faster with a
          guided, multi-signer workflow.
        </p>
        <div className="max-w-md rounded-xl bg-white/10 p-6">
          <ul className="space-y-2.5 text-sm text-white/90">
            {[
              "Unlimited signers per document",
              "Real-time status notifications",
              "Downloadable audit trail",
              "Mobile-friendly signing experience",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5">
                <i className="ti ti-check text-base" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex w-full flex-col justify-center px-6 py-16 sm:px-16 lg:w-1/2">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-10 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-white">
              <i className="ti ti-file-signature text-lg" aria-hidden="true" />
            </div>
            <span className="text-xl font-extrabold text-ink-900">SignDocs</span>
          </div>

          <h2 className="text-2xl font-extrabold text-ink-900">Create your account</h2>
          <p className="mb-8 mt-1 text-sm text-ink-500">Get started in seconds</p>

          {errors.form && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {FIELDS.map(({ key, label, placeholder, type }) => (
              <div key={key} className="mb-4">
                <label className="label" htmlFor={key}>
                  {label}
                </label>
                <input
                  id={key}
                  type={type}
                  placeholder={placeholder}
                  className={`input-field ${errors[key] ? "input-field-error" : ""}`}
                  value={form[key]}
                  onChange={update(key)}
                />
                {errors[key] && <p className="field-error">{errors[key]}</p>}
              </div>
            ))}

            <button type="submit" disabled={submitting} className="btn-primary mt-2 w-full py-2.5">
              {submitting ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-500">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-brand-500 hover:text-brand-600">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
