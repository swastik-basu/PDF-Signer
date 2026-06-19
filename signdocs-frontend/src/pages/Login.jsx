import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Login() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const update = (key) => (e) => {
    setForm((p) => ({ ...p, [key]: e.target.value }));
    setErrors((p) => ({ ...p, [key]: undefined, form: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.email) e.email = "Email is required";
    if (!form.password) e.password = "Password is required";
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
      const data = await login(form);
      showToast(`Welcome back, ${data.name}`);
      const redirectTo = location.state?.from?.pathname || "/dashboard";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Invalid email or password. Please try again.";
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
          Sign documents anywhere, anytime.
        </h1>
        <p className="mb-10 max-w-md text-base leading-relaxed text-white/85">
          Collect legally binding signatures, manage multi-signer workflows,
          and track every step from upload to completion.
        </p>
        <ul className="space-y-3.5">
          {[
            ["ti-shield-lock", "256-bit encryption on all documents"],
            ["ti-bolt", "Send for signatures in under 60 seconds"],
            ["ti-chart-bar", "Real-time audit trail and status tracking"],
          ].map(([icon, text]) => (
            <li key={text} className="flex items-center gap-3 text-sm text-white/90">
              <i className={`ti ${icon} text-lg`} aria-hidden="true" />
              {text}
            </li>
          ))}
        </ul>
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

          <h2 className="text-2xl font-extrabold text-ink-900">Welcome back</h2>
          <p className="mb-8 mt-1 text-sm text-ink-500">
            Sign in to your account to continue
          </p>

          {errors.form && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
              <label className="label" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@company.com"
                className={`input-field ${errors.email ? "input-field-error" : ""}`}
                value={form.email}
                onChange={update("email")}
              />
              {errors.email && <p className="field-error">{errors.email}</p>}
            </div>

            <div className="mb-6">
              <label className="label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className={`input-field ${errors.password ? "input-field-error" : ""}`}
                value={form.password}
                onChange={update("password")}
              />
              {errors.password && <p className="field-error">{errors.password}</p>}
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full py-2.5">
              {submitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-500">
            Don't have an account?{" "}
            <Link to="/register" className="font-bold text-brand-500 hover:text-brand-600">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
