
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { AdminUserManagement } from '@/components/admin/AdminUserManagement';
import { AdminTransactions } from '@/components/admin/AdminTransactions';
import { AdminCreditLoans } from '@/components/admin/AdminCreditLoans';
import { AdminGamingMonitoring } from '@/components/admin/AdminGamingMonitoring';
import { AdminSecurity } from '@/components/admin/AdminSecurity';
import { AdminReports } from '@/components/admin/AdminReports';
import { AdminSystemConfig } from '@/components/admin/AdminSystemConfig';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Shield, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Auth2FADialog } from '@/components/admin/Auth2FADialog';

const AdminPanel = () => {
  const { user, loading, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showMFADialog, setShowMFADialog] = useState(false);
  const { toast } = useToast();
  
  // Check for 2FA verification on admin login - moved to useEffect to avoid re-renders
  useEffect(() => {
    if (user && isAdmin) {
      // In a real app, we would check if the admin has already completed 2FA for this session
      const has2FAVerified = sessionStorage.getItem('admin_2fa_verified');
      if (!has2FAVerified) {
        setShowMFADialog(true);
      }
    }
  }, [user, isAdmin]);
  
  // Handle 2FA verification
  const handle2FASuccess = () => {
    sessionStorage.setItem('admin_2fa_verified', 'true');
    setShowMFADialog(false);
    toast({
      title: "Otantifikasyon 2FA Reyisi",
      description: "Ou gen aksè konplè nan Panèl Administratè a.",
      variant: "default"
    });
  };
  
  // This is for demo access, so we can bypass authentication checks
  const isDemoAccess = sessionStorage.getItem('admin_demo_access') === 'true';
  
  if (loading) {
    return <div className="h-screen flex items-center justify-center">Chajman...</div>;
  }
  
  // For demo access, we skip auth check
  if (!user && !isDemoAccess) {
    // Use useEffect for side effects like toast and navigation
    // Instead of calling toast directly which causes re-renders
    useEffect(() => {
      toast({
        title: "Aksè Refize",
        description: "Ou dwe konekte pou w ka aksede paj sa.",
        variant: "destructive"
      });
    }, []);
    return <Navigate to="/auth/login" replace />;
  }
  
  // Check if the user is an admin - skip for demo
  if (!isAdmin && !isDemoAccess && user) {
    // Use useEffect for side effects like toast
    useEffect(() => {
      toast({
        title: "Aksè Refize",
        description: "Ou pa gen pèmisyon pou w aksede paj sa.",
        variant: "destructive"
      });
    }, []);
    return <Navigate to="/" replace />;
  }

  // Set demo access in session storage for future reference
  useEffect(() => {
    if (!user && !isAdmin) {
      sessionStorage.setItem('admin_demo_access', 'true');
    }
  }, [user, isAdmin]);

  return (
    <Layout>
      <div className="w-full max-w-7xl mx-auto animate-fade-in p-4">
        <div className="flex items-center mb-6 gap-2">
          <Shield className="h-6 w-6 text-finance-gold" />
          <h1 className="text-2xl font-bold text-finance-charcoal dark:text-white">
            Admin Panel {isDemoAccess && <span className="text-sm text-amber-500 ml-2">(Demo Mode)</span>}
          </h1>
        </div>
        
        <Tabs 
          defaultValue="dashboard" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 md:grid-cols-8 mb-4">
            <TabsTrigger value="dashboard">Dashbòd</TabsTrigger>
            <TabsTrigger value="users">Itilizatè</TabsTrigger>
            <TabsTrigger value="transactions">Tranzaksyon</TabsTrigger>
            <TabsTrigger value="credits">Kredi & Prè</TabsTrigger>
            <TabsTrigger value="gaming">Jeu & Pari</TabsTrigger>
            <TabsTrigger value="security">Sekirite</TabsTrigger>
            <TabsTrigger value="reports">Rapò</TabsTrigger>
            <TabsTrigger value="config">Konfigirasyon</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <AdminDashboard />
          </TabsContent>
          
          <TabsContent value="users">
            <AdminUserManagement />
          </TabsContent>
          
          <TabsContent value="transactions">
            <AdminTransactions />
          </TabsContent>
          
          <TabsContent value="credits">
            <AdminCreditLoans />
          </TabsContent>
          
          <TabsContent value="gaming">
            <AdminGamingMonitoring />
          </TabsContent>
          
          <TabsContent value="security">
            <AdminSecurity />
          </TabsContent>
          
          <TabsContent value="reports">
            <AdminReports />
          </TabsContent>
          
          <TabsContent value="config">
            <AdminSystemConfig />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* 2FA Authentication Dialog - only show for actual users, not demo */}
      {!isDemoAccess && (
        <Auth2FADialog 
          isOpen={showMFADialog} 
          onSuccess={handle2FASuccess} 
          onOpenChange={setShowMFADialog}
        />
      )}
    </Layout>
  );
};

export default AdminPanel;
