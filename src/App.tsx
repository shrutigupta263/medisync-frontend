import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Application Routes - All inside AppShell */}
          <Route element={<AppShell />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/reports/upload" element={<ReportStepper />} />
            <Route path="/reports/:id" element={<ReportById />} />
            <Route path="/reports/summary" element={<ReportSummary />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/manage-family" element={<ManageProfiles />} />
            <Route path="/family" element={<FamilyHealthDashboard />} />
            <Route
              path="/medications"
              element={
                <div className="p-4">
                  <h1 className="text-2xl font-bold">Medications</h1>
                </div>
              }
            />
            <Route
              path="/vitals"
              element={
                <div className="p-4">
                  <h1 className="text-2xl font-bold">Vitals & Trends</h1>
                </div>
              }
            />
            <Route
              path="/insights"
              element={
                <div className="p-4">
                  <h1 className="text-2xl font-bold">Smart Insights</h1>
                </div>
              }
            />
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;