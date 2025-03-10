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
import { supabase } from '@/lib/supabase';

const AdminPanel = () => {
  const { user, loading, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showMFADialog, setShowMFADialog] = useState(false);
  const { toast } = useToast();
  const [adminData, setAdminData] = useState({
    users: [],
    transactions: [],
    virtualCards: [],
    bills: [],
    adminLogs: []
  });
  const [dataLoading, setDataLoading] = useState(false);
  
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
  
  // Fetch admin data from Supabase when tab changes
  useEffect(() => {
    const fetchAdminData = async () => {
      // Only fetch data if we're in the admin panel with valid credentials or demo mode
      const isDemoAccess = sessionStorage.getItem('admin_demo_access') === 'true';
      
      if (!isDemoAccess && (!user || !isAdmin)) {
        return;
      }
      
      setDataLoading(true);
      
      try {
        let userData, transactionsData, virtualCardsData, billsData, adminLogsData;
        
        if (isDemoAccess) {
          // In demo mode, use limited sample data
          userData = Array.from({ length: 10 }, (_, i) => ({
            id: `demo-user-${i}`,
            email: `user${i}@example.com`,
            phone: `+509${Math.floor(10000000 + Math.random() * 90000000)}`,
            balance: Math.floor(1000 + Math.random() * 9000),
            verified: Math.random() > 0.3,
            created_at: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString()
          }));
          
          transactionsData = Array.from({ length: 20 }, (_, i) => ({
            id: `demo-tx-${i}`,
            user_id: userData[Math.floor(Math.random() * userData.length)].id,
            transaction_type: ['deposit', 'withdrawal', 'transfer_sent', 'transfer_received', 'payment'][Math.floor(Math.random() * 5)],
            amount: Math.floor(10 + Math.random() * 990),
            status: ['completed', 'pending', 'failed'][Math.floor(Math.random() * 3)],
            created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
          }));
          
          virtualCardsData = Array.from({ length: 5 }, (_, i) => ({
            id: `demo-card-${i}`,
            user_id: userData[Math.floor(Math.random() * userData.length)].id,
            card_number: `4242 **** **** ${Math.floor(1000 + Math.random() * 9000)}`,
            balance: Math.floor(100 + Math.random() * 900),
            is_active: Math.random() > 0.2,
            created_at: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString()
          }));
          
          billsData = Array.from({ length: 15 }, (_, i) => ({
            id: `demo-bill-${i}`,
            user_id: userData[Math.floor(Math.random() * userData.length)].id,
            type: ['electricity', 'water', 'internet', 'rent'][Math.floor(Math.random() * 4)],
            amount: Math.floor(20 + Math.random() * 480),
            bill_number: `BILL-${Math.floor(10000 + Math.random() * 90000)}`,
            paid_at: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : null,
            created_at: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString()
          }));
          
          adminLogsData = Array.from({ length: 8 }, (_, i) => ({
            id: `demo-log-${i}`,
            admin_id: 'demo-admin',
            action: ['UPDATE', 'INSERT', 'DELETE'][Math.floor(Math.random() * 3)],
            target_table: ['users', 'transactions', 'virtual_cards', 'bills'][Math.floor(Math.random() * 4)],
            created_at: new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000).toISOString()
          }));
        } else {
          // Actual API calls if we have a logged-in admin
          const fetchUsers = supabase.from('users').select('*').order('created_at', { ascending: false });
          const fetchTransactions = supabase.from('transactions').select('*').order('created_at', { ascending: false }).limit(50);
          const fetchVirtualCards = supabase.from('virtual_cards').select('*').order('created_at', { ascending: false });
          const fetchBills = supabase.from('bills').select('*').order('created_at', { ascending: false });
          const fetchAdminLogs = supabase.from('admin_logs').select('*').order('created_at', { ascending: false }).limit(30);
          
          // Run queries in parallel
          const [
            { data: users, error: usersError },
            { data: transactions, error: transactionsError },
            { data: virtualCards, error: virtualCardsError },
            { data: bills, error: billsError },
            { data: adminLogs, error: adminLogsError }
          ] = await Promise.all([
            fetchUsers,
            fetchTransactions,
            fetchVirtualCards,
            fetchBills,
            fetchAdminLogs
          ]);
          
          if (usersError) console.error('Error fetching users:', usersError);
          if (transactionsError) console.error('Error fetching transactions:', transactionsError);
          if (virtualCardsError) console.error('Error fetching virtual cards:', virtualCardsError);
          if (billsError) console.error('Error fetching bills:', billsError);
          if (adminLogsError) console.error('Error fetching admin logs:', adminLogsError);
          
          userData = users || [];
          transactionsData = transactions || [];
          virtualCardsData = virtualCards || [];
          billsData = bills || [];
          adminLogsData = adminLogs || [];
        }
        
        setAdminData({
          users: userData,
          transactions: transactionsData,
          virtualCards: virtualCardsData,
          bills: billsData,
          adminLogs: adminLogsData
        });
      } catch (error) {
        console.error('Error fetching admin data:', error);
        toast({
          title: "Erè nan jwenn done yo",
          description: "Gen yon erè ki pase pandan n ap eseye jwenn done administratè yo.",
          variant: "destructive"
        });
      } finally {
        setDataLoading(false);
      }
    };
    
    fetchAdminData();
    
    // Set up realtime subscriptions for admin data
    const setupRealtimeSubscriptions = () => {
      const isDemoAccess = sessionStorage.getItem('admin_demo_access') === 'true';
      if (isDemoAccess) return null; // No realtime for demo mode
      
      const usersChannel = supabase.channel('admin-users-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, (payload) => {
          setAdminData(prev => {
            const updatedUsers = [...prev.users];
            
            if (payload.eventType === 'INSERT') {
              updatedUsers.unshift(payload.new);
            } else if (payload.eventType === 'UPDATE') {
              const index = updatedUsers.findIndex(user => user.id === payload.new.id);
              if (index !== -1) updatedUsers[index] = payload.new;
            } else if (payload.eventType === 'DELETE') {
              const index = updatedUsers.findIndex(user => user.id === payload.old.id);
              if (index !== -1) updatedUsers.splice(index, 1);
            }
            
            return { ...prev, users: updatedUsers };
          });
        })
        .subscribe();
      
      const transactionsChannel = supabase.channel('admin-transactions-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, (payload) => {
          setAdminData(prev => {
            const updatedTransactions = [...prev.transactions];
            
            if (payload.eventType === 'INSERT') {
              updatedTransactions.unshift(payload.new);
              if (updatedTransactions.length > 50) updatedTransactions.pop();
            } else if (payload.eventType === 'UPDATE') {
              const index = updatedTransactions.findIndex(tx => tx.id === payload.new.id);
              if (index !== -1) updatedTransactions[index] = payload.new;
            }
            
            return { ...prev, transactions: updatedTransactions };
          });
        })
        .subscribe();
      
      // Create similar channels for other tables
      
      return () => {
        supabase.removeChannel(usersChannel);
        supabase.removeChannel(transactionsChannel);
      };
    };
    
    const cleanup = setupRealtimeSubscriptions();
    return cleanup;
  }, [activeTab, user, isAdmin, toast]);
  
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
          {dataLoading && (
            <span className="ml-2 text-sm text-finance-charcoal/70 dark:text-white/70">
              Chajman done...
            </span>
          )}
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
            <AdminDashboard adminData={adminData} loading={dataLoading} />
          </TabsContent>
          
          <TabsContent value="users">
            <AdminUserManagement users={adminData.users} loading={dataLoading} />
          </TabsContent>
          
          <TabsContent value="transactions">
            <AdminTransactions transactions={adminData.transactions} loading={dataLoading} />
          </TabsContent>
          
          <TabsContent value="credits">
            <AdminCreditLoans />
          </TabsContent>
          
          <TabsContent value="gaming">
            <AdminGamingMonitoring />
          </TabsContent>
          
          <TabsContent value="security">
            <AdminSecurity logs={adminData.adminLogs} loading={dataLoading} />
          </TabsContent>
          
          <TabsContent value="reports">
            <AdminReports adminData={adminData} loading={dataLoading} />
          </TabsContent>
          
          <TabsContent value="config">
            <AdminSystemConfig logs={adminData.adminLogs} loading={dataLoading} />
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
