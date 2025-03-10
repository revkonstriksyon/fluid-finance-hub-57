
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabase';

export const useAdminData = () => {
  const { toast } = useToast();
  const [adminData, setAdminData] = useState({
    users: [],
    transactions: [],
    virtualCards: [],
    bills: [],
    adminLogs: []
  });
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    setLoading(true);
    
    try {
      const isDemoAccess = sessionStorage.getItem('admin_demo_access') === 'true';
      
      let userData, transactionsData, virtualCardsData, billsData, adminLogsData;
      
      if (isDemoAccess) {
        // In demo mode, use sample data
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
          account_id: `demo-account-${Math.floor(Math.random() * 5)}`,
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
          target_id: `demo-id-${Math.floor(Math.random() * 100)}`,
          details: { message: `Demo action ${i}` },
          created_at: new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000).toISOString()
        }));
      } else {
        // Actual API calls
        const [
          { data: users, error: usersError },
          { data: transactions, error: transactionsError },
          { data: virtualCards, error: virtualCardsError },
          { data: bills, error: billsError },
          { data: adminLogs, error: adminLogsError }
        ] = await Promise.all([
          supabase.from('users').select('*').order('created_at', { ascending: false }),
          supabase.from('transactions').select('*').order('created_at', { ascending: false }).limit(50),
          supabase.from('virtual_cards').select('*').order('created_at', { ascending: false }),
          supabase.from('bills').select('*').order('created_at', { ascending: false }),
          supabase.from('admin_logs').select('*').order('created_at', { ascending: false }).limit(30)
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
        title: "Error fetching data",
        description: "An error occurred while trying to fetch admin data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  return {
    adminData,
    loading,
    fetchAdminData
  };
};
