import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext"

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./routes/ProtectedRoutes";

function App() {
  const { isAuthenticated } = useAuth();

  return(
    <Routes>
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>} />
        
      <Route path="/" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
      } />

      <Route path="/register" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />
      } />
        
    </Routes>
  );
};

export default App;