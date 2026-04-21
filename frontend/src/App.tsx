import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DashboardLayout } from "@/components/DashboardLayout";
import DashboardPage from "@/pages/DashboardPage";
import PhishingPage from "@/pages/PhishingPage";
import IDSAlertsPage from "@/pages/IDSAlertsPage";
import NetworkScannerPage from "@/pages/NetworkScannerPage";
import PacketAnalyzerPage from "@/pages/PacketAnalyzerPage";
import PasswordCheckerPage from "@/pages/PasswordCheckerPage";
import LogsPage from "@/pages/LogsPage";
import SettingsPage from "@/pages/SettingsPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/phishing" element={<PhishingPage />} />
            <Route path="/ids-alerts" element={<IDSAlertsPage />} />
            <Route path="/network-scanner" element={<NetworkScannerPage />} />
            <Route path="/packet-analyzer" element={<PacketAnalyzerPage />} />
            <Route path="/password-checker" element={<PasswordCheckerPage />} />
            <Route path="/logs" element={<LogsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
