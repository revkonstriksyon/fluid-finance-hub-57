
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProfilePage from "./pages/profile/ProfilePage";
import MessagesPage from "./pages/profile/MessagesPage";
import SettingsPage from "./pages/profile/SettingsPage";
import SecurityPage from "./pages/profile/SecurityPage";
import PrivacyPage from "./pages/profile/PrivacyPage";
import PaymentMethodsPage from "./pages/profile/PaymentMethodsPage";
import TradingPage from "./pages/trading/TradingPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/security" element={<SecurityPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/payment-methods" element={<PaymentMethodsPage />} />
          <Route path="/trading" element={<TradingPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
