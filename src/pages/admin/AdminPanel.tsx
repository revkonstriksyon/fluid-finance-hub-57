
import { useState } from 'react';
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

const AdminPanel = () => {
  const { user, loading, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const { toast } = useToast();
  
  if (loading) {
    return <div className="h-screen flex items-center justify-center">Chajman...</div>;
  }
  
  if (!user) {
    toast({
      title: "Aksè Refize",
      description: "Ou dwe konekte pou w ka aksede paj sa.",
      variant: "destructive"
    });
    return <Navigate to="/auth/login" replace />;
  }
  
  // Check if the user is an admin
  if (!isAdmin) {
    toast({
      title: "Aksè Refize",
      description: "Ou pa gen pèmisyon pou w aksede paj sa.",
      variant: "destructive"
    });
    return <Navigate to="/" replace />;
  }

  return (
    <Layout>
      <div className="w-full max-w-7xl mx-auto animate-fade-in p-4">
        <div className="flex items-center mb-6 gap-2">
          <Shield className="h-6 w-6 text-finance-gold" />
          <h1 className="text-2xl font-bold text-finance-charcoal dark:text-white">
            Admin Panel
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
    </Layout>
  );
};

export default AdminPanel;
