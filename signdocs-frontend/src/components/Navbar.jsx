import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItem =
  "text-sm font-medium text-ink-500 hover:text-ink-900 transition px-1 py-1.5 border-b-2 border-transparent";
const navItemActive = "text-ink-900 border-brand-500";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) return null;

  const initials = (user?.name || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-40 flex h-15 items-center justify-between border-b border-ink-100 bg-white px-6">
      <div className="flex items-center gap-8">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white">
            <i className="ti ti-file-signature text-base" aria-hidden="true" />
          </div>
          <span className="text-lg font-extrabold tracking-tight text-ink-900">
            SignDocs
          </span>
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `${navItem} ${isActive ? navItemActive : ""}`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/documents"
            className={({ isActive }) =>
              `${navItem} ${isActive ? navItemActive : ""}`
            }
          >
            Documents
          </NavLink>
          <NavLink
            to="/signatures"
            className={({ isActive }) =>
              `${navItem} ${isActive ? navItemActive : ""}`
            }
          >
            Signatures
          </NavLink>
          <NavLink
            to="/signing-requests"
            className={({ isActive }) =>
              `${navItem} ${isActive ? navItemActive : ""}`
            }
          >
            Signing requests
          </NavLink>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link
          to="/documents/upload"
          className="hidden items-center gap-1.5 rounded-lg bg-brand-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-600 sm:flex"
        >
          <i className="ti ti-plus text-base" aria-hidden="true" />
          New document
        </Link>
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
            {initials}
          </div>
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-ink-400 hover:text-ink-700"
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}
