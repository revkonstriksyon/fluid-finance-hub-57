
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User, CreditCard, Banknote, DollarSign, Users, BarChart3, Activity, UserCheck } from "lucide-react";
import { useEffect, useState } from "react";

// Mock data for the charts and statistics - in a real app these would come from your API
const adminActivities = [
  { id: 1, admin: "James L.", action: "Bloke kont #8735", timestamp: "2 minit pase" },
  { id: 2, admin: "Marie C.", action: "Apwouve prè #4532 ($1,200)", timestamp: "15 minit pase" },
  { id: 3, admin: "Teyo B.", action: "Modifye eskò kredi pou kliyan #7821", timestamp: "35 minit pase" },
  { id: 4, admin: "Agaby P.", action: "Verifye idantite pou itilizatè #4512", timestamp: "1 èdtan pase" },
  { id: 5, admin: "Samuel J.", action: "Annule pari sispèk #9823", timestamp: "2 èdtan pase" },
  { id: 6, admin: "Linda R.", action: "Modifye to enterè pou prè dijital", timestamp: "3 èdtan pase" },
  { id: 7, admin: "Pierre D.", action: "Remèt lajan pou tranzaksyon #9936", timestamp: "5 èdtan pase" },
  { id: 8, admin: "Vanessa M.", action: "Bloke aksè pou IP sispèk", timestamp: "8 èdtan pase" },
  { id: 9, admin: "Michel T.", action: "Ekspòte rapò aktivite mwa pase", timestamp: "12 èdtan pase" },
  { id: 10, admin: "Clara B.", action: "Mete ajou kondisyon itilizasyon", timestamp: "1 jou pase" },
];

// Stats cards data
const statCards = [
  { 
    title: "Total Itilizatè Aktif", 
    value: "4,583", 
    change: "+12%", 
    icon: <Users className="h-5 w-5 text-finance-blue" /> 
  },
  { 
    title: "Total Tranzaksyon (24h)", 
    value: "1,284", 
    change: "+7.5%", 
    icon: <Banknote className="h-5 w-5 text-finance-green" /> 
  },
  { 
    title: "Total Pari Aktif", 
    value: "872", 
    change: "+23%", 
    icon: <BarChart3 className="h-5 w-5 text-finance-gold" /> 
  },
  { 
    title: "Kredi Aktyèl", 
    value: "$325,000", 
    change: "+2.8%", 
    icon: <CreditCard className="h-5 w-5 text-finance-purple" /> 
  },
];

// Chart data for daily activity
const activityData = {
  labels: ["Lendi", "Madi", "Mèkredi", "Jedi", "Vandredi", "Samdi", "Dimanch"],
  datasets: {
    users: [125, 167, 182, 156, 172, 210, 190],
    transactions: [542, 621, 597, 678, 723, 851, 762],
    loans: [32, 41, 27, 39, 45, 52, 38]
  }
};

export const AdminDashboard = () => {
  const [chartData, setChartData] = useState(activityData);

  // In a real application, you would fetch this data from your backend
  useEffect(() => {
    // Simulating data fetch
    const fetchData = async () => {
      // Fetch data from API
      // const response = await fetch('/api/admin/dashboard');
      // const data = await response.json();
      // setChartData(data);
    };

    fetchData();
  }, []);

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
              <p className={`text-xs ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {stat.change} depi yè
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Aktivite Chak Jou</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-center p-6 rounded-md bg-finance-lightGray/30 dark:bg-finance-navy/30">
              <Activity className="h-8 w-8 mx-auto mb-2 text-finance-blue" />
              <p className="text-sm text-finance-charcoal/70 dark:text-white/70">
                Graf aktivite chak jou pral parèt isit.
                <br />
                (Pou yon vèsyon final, itilize Recharts oswa Chart.js)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
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
              {adminActivities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-finance-blue" />
                    {activity.admin}
                  </TableCell>
                  <TableCell>{activity.action}</TableCell>
                  <TableCell className="text-muted-foreground">{activity.timestamp}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
