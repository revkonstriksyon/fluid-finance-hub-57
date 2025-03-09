
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User, CreditCard, Banknote, DollarSign, Users, BarChart3, Activity, UserCheck, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from '@/lib/supabase';

// Admin data interface
interface AdminDataProps {
  users?: any[];
  transactions?: any[];
  virtualCards?: any[];
  bills?: any[];
  adminLogs?: any[];
}

export const AdminDashboard = ({ adminData }: { adminData: AdminDataProps }) => {
  const { users = [], transactions = [], virtualCards = [], bills = [], adminLogs = [] } = adminData;

  // Calculate summary statistics
  const activeUsers = users.filter(user => user.verified).length;
  const totalTransactions = transactions.length;
  const totalAmount = transactions.reduce((sum, tx) => sum + (parseFloat(tx.amount) || 0), 0);
  const completedTransactions = transactions.filter(tx => tx.status === 'completed').length;
  const pendingTransactions = transactions.filter(tx => tx.status === 'pending').length;
  const activeCards = virtualCards.filter(card => card.is_active).length;
  const paidBills = bills.filter(bill => bill.paid_at).length;
  
  // Get recent admin activities
  const recentAdminActivities = adminLogs.slice(0, 10).map(log => {
    const actionText = (() => {
      if (log.action === 'INSERT') {
        return `Kreye nouvo ${log.target_table.slice(0, -1)}`;
      } else if (log.action === 'UPDATE') {
        return `Modifye ${log.target_table.slice(0, -1)} #${log.target_id?.substring(0, 4)}`;
      } else if (log.action === 'DELETE') {
        return `Efase ${log.target_table.slice(0, -1)} #${log.target_id?.substring(0, 4)}`;
      }
      return `${log.action} ${log.target_table}`;
    })();
    
    // Calculate time ago
    const createdAt = new Date(log.created_at);
    const now = new Date();
    const diffMs = now.getTime() - createdAt.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMins / 60);
    const diffDays = Math.round(diffHours / 24);
    
    let timeAgo;
    if (diffMins < 60) {
      timeAgo = `${diffMins} minit pase`;
    } else if (diffHours < 24) {
      timeAgo = `${diffHours} èdtan pase`;
    } else {
      timeAgo = `${diffDays} jou pase`;
    }
    
    return {
      id: log.id,
      admin: log.admin_id?.substring(0, 8) || "Admin",
      action: actionText,
      timestamp: timeAgo
    };
  });

  // Stats cards data
  const statCards = [
    { 
      title: "Total Itilizatè Aktif", 
      value: activeUsers.toString(), 
      change: `${users.length} total`, 
      icon: <Users className="h-5 w-5 text-finance-blue" /> 
    },
    { 
      title: "Total Tranzaksyon (24h)", 
      value: totalTransactions.toString(), 
      change: `$${totalAmount.toFixed(2)} total`, 
      icon: <Banknote className="h-5 w-5 text-finance-green" /> 
    },
    { 
      title: "Kat Vityèl Aktif", 
      value: activeCards.toString(), 
      change: `${virtualCards.length} total`, 
      icon: <CreditCard className="h-5 w-5 text-finance-gold" /> 
    },
    { 
      title: "Fakti Peye", 
      value: paidBills.toString(), 
      change: `${bills.length} total`, 
      icon: <DollarSign className="h-5 w-5 text-finance-purple" /> 
    },
  ];

  // Chart data for daily activity - this would be calculated from real data in a full implementation
  const transactionsByDay = Array(7).fill(0);
  const usersByDay = Array(7).fill(0);
  
  // Calculate transactions and users by day
  const now = new Date();
  const dayNames = ["Dimanch", "Lendi", "Madi", "Mèkredi", "Jedi", "Vandredi", "Samdi"];
  const today = now.getDay(); // 0 = Sunday, 6 = Saturday
  
  // Get the transactions for the last 7 days, grouped by day
  transactions.forEach(tx => {
    const txDate = new Date(tx.created_at);
    const diffDays = Math.floor((now.getTime() - txDate.getTime()) / (1000 * 3600 * 24));
    if (diffDays < 7) {
      const dayIndex = (today - diffDays + 7) % 7;
      transactionsByDay[dayIndex]++;
    }
  });
  
  // Calculate new users by day over the last 7 days
  users.forEach(user => {
    const userCreatedAt = new Date(user.created_at);
    const diffDays = Math.floor((now.getTime() - userCreatedAt.getTime()) / (1000 * 3600 * 24));
    if (diffDays < 7) {
      const dayIndex = (today - diffDays + 7) % 7;
      usersByDay[dayIndex]++;
    }
  });
  
  // Reorder days to start from the earliest
  const startDay = (today + 1) % 7; // Start from tomorrow
  const orderedDays = Array(7).fill(0).map((_, i) => dayNames[(startDay + i) % 7]);
  
  // Reorder transaction and user counts to match
  const orderedTransactions = Array(7).fill(0);
  const orderedUsers = Array(7).fill(0);
  
  for (let i = 0; i < 7; i++) {
    const sourceIndex = (startDay + i) % 7;
    orderedTransactions[i] = transactionsByDay[sourceIndex];
    orderedUsers[i] = usersByDay[sourceIndex];
  }
  
  const chartData = {
    labels: orderedDays,
    datasets: {
      transactions: orderedTransactions,
      users: orderedUsers
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-finance-charcoal dark:text-white">
        Dashbòd Administratè
      </h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-finance-charcoal/70 dark:text-white/70">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Transaction Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Estatistik Tranzaksyon</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-green-800 dark:text-green-300">Konplete</h3>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{completedTransactions}</p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300">An Atant</h3>
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{pendingTransactions}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Dènye 7 Jou</h3>
                <div className="h-[200px] relative">
                  <div className="absolute inset-0 flex items-end">
                    {chartData.datasets.transactions.map((count, idx) => (
                      <div 
                        key={idx} 
                        className="flex-1 flex flex-col items-center"
                      >
                        <div 
                          className="w-4/5 bg-finance-blue rounded-t"
                          style={{ height: `${Math.max(5, (count / Math.max(...chartData.datasets.transactions)) * 100)}%` }}
                        ></div>
                        <span className="text-xs mt-1">{chartData.labels[idx].substring(0, 3)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Nouvo Itilizatè</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Verifye</h3>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{activeUsers}</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-purple-800 dark:text-purple-300">Non Verifye</h3>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{users.length - activeUsers}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Nouvo Itilizatè Pa Jou</h3>
                <div className="h-[200px] relative">
                  <div className="absolute inset-0 flex items-end">
                    {chartData.datasets.users.map((count, idx) => (
                      <div 
                        key={idx} 
                        className="flex-1 flex flex-col items-center"
                      >
                        <div 
                          className="w-4/5 bg-finance-purple rounded-t"
                          style={{ height: `${Math.max(5, (count / Math.max(...chartData.datasets.users, 1)) * 100)}%` }}
                        ></div>
                        <span className="text-xs mt-1">{chartData.labels[idx].substring(0, 3)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Admin Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Aktivite Resan Administratè</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Administratè</TableHead>
                <TableHead>Aksyon</TableHead>
                <TableHead>Lè</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentAdminActivities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <Shield className="h-4 w-4 text-finance-blue" />
                    {activity.admin}
                  </TableCell>
                  <TableCell>{activity.action}</TableCell>
                  <TableCell className="text-muted-foreground">{activity.timestamp}</TableCell>
                </TableRow>
              ))}
              {recentAdminActivities.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                    Pa gen aktivite administratè resan
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
