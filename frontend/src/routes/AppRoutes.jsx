import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import Dashboard from "../components/Dashboard";
import ExpensePage from "../pages/ExpensePage";
import Layout from "../layouts/ Layout";
import Category from "../pages/CategoryPage";
import ForgotPassword from "../pages/auth/ForgotPassword";
import PasswordResetConfirmation from "../pages/auth/EmailConfirmation";
import ResetPassword from "../pages/auth/ResetPassword";
import Profile from "../pages/ProfileInfo";


const isAuthenticated = () => !!localStorage.getItem("accessToken");

// const isAuthenticated = () => true;

function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Public Routes (NO Sidebar / Header) */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
                   <Route path="/forgot-password" element={<ForgotPassword />} />


        {/* Protected Routes (WITH Sidebar & Header) */}
        <Route
          element={isAuthenticated() ? <Layout /> : <Navigate to="/login" />}
        >
        <Route path="/email-confirmation" element={<PasswordResetConfirmation />} />
        <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/expenses" element={<ExpensePage />} />
          <Route path="/category" element={<Category />} />
          <Route path="/profile" element={<Profile />} />

        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
