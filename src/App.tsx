import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";
import AppShell from "./layout/AppShell";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import ReportStepper from "./pages/ReportStepper";
import ReportById from "./pages/ReportById";
import ReportSummary from "./pages/ReportSummary";
import Settings from "./pages/Settings";
import ManageProfiles from "./pages/ManageProfiles";
import FamilyHealthDashboard from "./pages/FamilyHealthDashboard";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { SupabaseConfigNotice } from "./components/SupabaseConfigNotice";

const queryClient = new QueryClient();

// Create router with future flags enabled
const router = createBrowserRouter([
  // Public Routes
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/signup", 
    element: <Signup />
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />
  },
  // Protected Application Routes - All inside AppShell
  {
    path: "/",
    element: <ProtectedRoute><AppShell /></ProtectedRoute>,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "reports", element: <Reports /> },
      { path: "reports/upload", element: <ReportStepper /> },
      { path: "reports/:id", element: <ReportById /> },
      { path: "reports/summary", element: <ReportSummary /> },
      { path: "settings", element: <Settings /> },
      { path: "manage-family", element: <ManageProfiles /> },
      { path: "family", element: <FamilyHealthDashboard /> }
    ]
  },
  // Catch-all route
  {
    path: "*",
    element: <NotFound />
  }
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true
  }
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <SupabaseConfigNotice />
        <Toaster />
        <Sonner />
        <RouterProvider router={router} />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;