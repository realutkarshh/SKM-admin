import "./index.css";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import AdmissionPage from "./pages/Admission";
import Messages from "./pages/Messages";
import NewsAndNotifications from "./pages/NewsAndNotifications";
import BankDetails from "./pages/BankDetails";
import Login from "./pages/Login";
import ProtectedRoute from "./utils/ProtectedRoute";

// Layout component that handles authenticated routes
const AuthenticatedLayout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6 ml-64 bg-gray-100 min-h-screen">
        {children}
      </main>
    </div>
  );
};

// Main App component
const AppContent = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="min-h-screen">
      <Routes>
        {/* Public login route */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected routes with authenticated layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <Dashboard />
              </AuthenticatedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admissions"
          element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <AdmissionPage />
              </AuthenticatedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <Messages />
              </AuthenticatedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/news"
          element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <NewsAndNotifications />
              </AuthenticatedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/bank"
          element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <BankDetails />
              </AuthenticatedLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;