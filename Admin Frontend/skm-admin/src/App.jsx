import "./index.css";
// ✅ This will be your main entry point
// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import AdmissionPage from "./pages/Admission";
import Messages from "./pages/Messages";
import NewsAndNotifications from "./pages/NewsAndNotifications";
import BankDetails from "./pages/BankDetails";
import Login from "./pages/Login";
import ProtectedRoute from "./utils/ProtectedRoute";

function App() {
  return (
    <Router>
      <div className="flex">
        {window.location.pathname !== "/login" && <Sidebar />}
        <main className="flex-1 p-6 ml-64 bg-gray-100 min-h-screen">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admissions"
              element={
                <ProtectedRoute>
                  <AdmissionPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/news"
              element={
                <ProtectedRoute>
                  <NewsAndNotifications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bank"
              element={
                <ProtectedRoute>
                  <BankDetails />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
