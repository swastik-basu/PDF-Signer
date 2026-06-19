import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";
import DocumentUpload from "./pages/DocumentUpload";
import DocumentDetail from "./pages/DocumentDetail";
import PlacementEditor from "./pages/PlacementEditor";
import Signatures from "./pages/Signatures";
import SignatureCreate from "./pages/SignatureCreate";
import SigningRequests from "./pages/SigningRequests";
import PublicSign from "./pages/PublicSign";

function RootRedirect() {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/sign/:token" element={<PublicSign />} />

            {/* Authenticated routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/documents" element={<Documents />} />
                <Route path="/documents/upload" element={<DocumentUpload />} />
                <Route path="/documents/:id" element={<DocumentDetail />} />
                <Route path="/documents/:id/place" element={<PlacementEditor />} />
                <Route path="/signatures" element={<Signatures />} />
                <Route path="/signatures/create" element={<SignatureCreate />} />
                <Route path="/signing-requests" element={<SigningRequests />} />
              </Route>
            </Route>

            <Route path="/" element={<RootRedirect />} />
            <Route path="*" element={<RootRedirect />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
