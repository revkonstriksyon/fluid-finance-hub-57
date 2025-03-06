
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import ProfilePage from './pages/profile/ProfilePage';
import MessagesPage from './pages/profile/MessagesPage';
import SettingsPage from './pages/profile/SettingsPage';
import SecurityPage from './pages/profile/SecurityPage';
import PrivacyPage from './pages/profile/PrivacyPage';
import PaymentMethodsPage from './pages/profile/PaymentMethodsPage';
import TradingPage from './pages/trading/TradingPage';
import UsersDirectoryPage from './pages/profile/UsersDirectoryPage';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './components/ui/theme-provider';
import { Toaster } from './components/ui/toaster';
import "./App.css";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="finance-app-theme">
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/settings/security" element={<SecurityPage />} />
          <Route path="/settings/privacy" element={<PrivacyPage />} />
          <Route path="/settings/payment-methods" element={<PaymentMethodsPage />} />
          <Route path="/trading" element={<TradingPage />} />
          <Route path="/users-directory" element={<UsersDirectoryPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
