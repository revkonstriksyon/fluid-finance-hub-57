
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, Users, CreditCard, FileText } from "lucide-react";
import { AdminUserManagement } from "@/components/admin/AdminUserManagement";
import { AdminTransactions } from "@/components/admin/AdminTransactions";
import { AdminVirtualCards } from "@/components/admin/AdminVirtualCards";
import { AdminBills } from "@/components/admin/AdminBills";
import { AdminSystemConfig } from "@/components/admin/AdminSystemConfig";
import { Skeleton } from "@/components/ui/skeleton";

export interface AdminDashboardProps {
  adminData: {
    users: any[];
    transactions: any[];
    virtualCards: any[];
    bills: any[];
    adminLogs: any[];
  };
  loading: boolean;
}

export const AdminDashboard = ({ adminData, loading }: AdminDashboardProps) => {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Itilizatè</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-6 w-20" /> : adminData.users.length}
            </div>
            <p className="text-xs text-gray-500">+20% konpare ak dènye mwa</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tranzaksyon</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-6 w-20" /> : adminData.transactions.length}
            </div>
            <p className="text-xs text-gray-500">+10% konpare ak dènye mwa</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kat Virtual Kreye</CardTitle>
            <CreditCard className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-6 w-20" /> : adminData.virtualCards.length}
            </div>
            <p className="text-xs text-gray-500">+5% konpare ak dènye mwa</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Peman Fakti</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-6 w-20" /> : adminData.bills.length}
            </div>
            <p className="text-xs text-gray-500">+3% konpare ak dènye mwa</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Jesyon Itilizatè</CardTitle>
            <CardDescription>Administre itilizatè yo</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[400px] w-full" />
            ) : (
              <AdminUserManagement users={adminData.users} loading={loading} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dènye Tranzaksyon</CardTitle>
            <CardDescription>Tranzaksyon ki fèt resamman</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[400px] w-full" />
            ) : (
              <AdminTransactions transactions={adminData.transactions} loading={loading} />
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Aktivite Sistèm</CardTitle>
          <CardDescription>Dènye aktivite ak evènman sistèm yo</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-[400px] w-full" />
          ) : (
            <AdminSystemConfig logs={adminData.adminLogs} loading={loading} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
