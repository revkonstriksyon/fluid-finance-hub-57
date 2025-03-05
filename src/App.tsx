
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Suspense, lazy, useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";

// Lazy loaded components for better performance
const ProfilePage = lazy(() => import("./pages/profile/ProfilePage"));
const MessagesPage = lazy(() => import("./pages/profile/MessagesPage"));
const SettingsPage = lazy(() => import("./pages/profile/SettingsPage"));
const SecurityPage = lazy(() => import("./pages/profile/SecurityPage"));
const PrivacyPage = lazy(() => import("./pages/profile/PrivacyPage"));
const PaymentMethodsPage = lazy(() => import("./pages/profile/PaymentMethodsPage"));
const TradingPage = lazy(() => import("./pages/trading/TradingPage"));

const queryClient = new QueryClient();

// Loading spinner component
const LoadingSpinner = () => (
  <div className="h-screen flex flex-col items-center justify-center">
    <div className="relative w-20 h-20">
      <div className="absolute top-0 left-0 right-0 bottom-0 animate-spin">
        <div className="h-10 w-10 rounded-full border-4 border-t-finance-blue border-r-transparent border-b-finance-gold border-l-transparent"></div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <DollarSign className="h-8 w-8 text-finance-blue" />
      </div>
    </div>
    <p className="mt-4 text-lg text-center text-finance-charcoal dark:text-white animate-pulse">
      Chajman...
    </p>
  </div>
);

// Import the icon to use in the loading spinner
import { DollarSign } from "lucide-react";

// Protected route wrapper with enhanced auth checking and better loading states
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    if (!loading && !user) {
      console.log("User not authenticated, redirecting to login");
    }
  }, [loading, user]);
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!user) {
    return (
      <Navigate 
        to="/auth/login" 
        replace 
        state={{ from: location }} 
      />
    );
  }
  
  return (
    <Suspense fallback={<LoadingSpinner />}>
      {children}
    </Suspense>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Auth Routes */}
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />
            <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
            
            {/* Protected Routes */}
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            <Route path="/security" element={<ProtectedRoute><SecurityPage /></ProtectedRoute>} />
            <Route path="/privacy" element={<ProtectedRoute><PrivacyPage /></ProtectedRoute>} />
            <Route path="/payment-methods" element={<ProtectedRoute><PaymentMethodsPage /></ProtectedRoute>} />
            <Route path="/trading" element={<ProtectedRoute><TradingPage /></ProtectedRoute>} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
