
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Search, Filter, UserX, UserCheck, RefreshCw, UserCog, Users, 
  ArrowUpDown, Eye, Lock, Calendar, Mail, Phone, MapPin, Loader2, DatabaseIcon
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Profile } from "@/types/auth";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";

// User detail tabs data
const userTransactions = [
  { id: "TRX-7651", type: "deposit", amount: "$250.00", date: "04 Apr 2025", status: "completed" },
  { id: "TRX-7652", type: "withdrawal", amount: "$100.00", date: "03 Apr 2025", status: "completed" },
  { id: "TRX-7653", type: "transfer", amount: "$75.00", date: "01 Apr 2025", status: "completed" },
  { id: "TRX-7654", type: "deposit", amount: "$300.00", date: "28 Mar 2025", status: "completed" }
];

const userLoans = [
  { id: "LOAN-3421", amount: "$500.00", interest: "8%", term: "30 days", start: "15 Mar 2025", status: "active" }
];

const userDevices = [
  { device: "iPhone 15", ip: "192.168.1.45", location: "Port-au-Prince", lastLogin: "Today, 10:23 AM" },
  { device: "Windows PC", ip: "192.168.1.72", location: "Port-au-Prince", lastLogin: "Yesterday, 5:17 PM" }
];

// Extended profile interface with additional properties for the admin panel
interface ExtendedProfile extends Profile {
  status: string;
  balance: string;
  verified: boolean;
}

export const AdminUserManagement = () => {
  const [users, setUsers] = useState<ExtendedProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<ExtendedProfile | null>(null);
  const [userDetailTab, setUserDetailTab] = useState("info");
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchProfiles = async () => {
      setIsLoading(true);
      try {
        // Fetch all profiles
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*');
        
        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          toast({
            title: "Erè",
            description: "Gen yon erè ki fèt pandan n ap chaje itilizatè yo.",
            variant: "destructive"
          });
          setUsers([]);
        } else {
          // Fetch bank accounts for balances
          const { data: accountsData, error: accountsError } = await supabase
            .from('bank_accounts')
            .select('user_id, balance');
          
          if (accountsError) {
            console.error('Error fetching bank accounts:', accountsError);
          }
          
          // Map profiles to extended profiles with additional properties
          const extendedProfiles: ExtendedProfile[] = (profilesData || []).map((profile: Profile) => {
            // Find user's account(s) and sum the balance
            const userAccounts = accountsData?.filter(acc => acc.user_id === profile.id) || [];
            const totalBalance = userAccounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
            
            // Generate a random status for demo purposes
            // In a real app, you would get this from a proper source
            const statuses = ['active', 'inactive', 'suspended', 'blocked'];
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
            
            return {
              ...profile,
              status: randomStatus,
              balance: `$${totalBalance.toFixed(2)}`,
              verified: Math.random() > 0.3, // 70% chance to be verified, for demo
            };
          });
          
          setUsers(extendedProfiles);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        toast({
          title: "Erè",
          description: "Gen yon erè ki fèt pandan n ap chaje done yo.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfiles();
  }, []);
  
  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    (user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
    (user.username?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
    (user.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.phone?.toLowerCase().includes(searchTerm.toLowerCase()) || '')
  );
  
  const getUserStatusBadge = (status: string) => {
    const statusClasses = {
      active: "bg-green-500",
      inactive: "bg-yellow-500",
      suspended: "bg-orange-500",
      blocked: "bg-red-500"
    };
    
    return (
      <Badge className={`${statusClasses[status as keyof typeof statusClasses] || "bg-gray-500"} text-white`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatJoinedDate = (date: string | null) => {
    if (!date) return "N/A";
    
    const joinedDate = new Date(date);
    const day = joinedDate.getDate();
    const month = new Intl.DateTimeFormat('en', { month: 'short' }).format(joinedDate);
    const year = joinedDate.getFullYear();
    
    return `${day} ${month} ${year}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Chajman done yo...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-finance-charcoal dark:text-white">
        Jesyon Itilizatè
      </h2>
      
      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Chèche pa non, ID, imèl, telefòn..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtre
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4" />
                Triye
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Users className="h-5 w-5" />
              Itilizatè yo ({filteredUsers.length})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground flex flex-col items-center">
              <DatabaseIcon className="h-12 w-12 mb-2 text-muted-foreground/50" />
              <p>Pa gen okenn itilizatè nan baz done a pou kounye a.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Non</TableHead>
                  <TableHead>Non Itilizatè</TableHead>
                  <TableHead>Dat Enskripsyon</TableHead>
                  <TableHead>Statu</TableHead>
                  <TableHead>Balans</TableHead>
                  <TableHead>Aksyon</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.id.substring(0, 8)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {user.full_name || "No name"}
                        {user.verified ? 
                          <UserCheck className="h-4 w-4 text-green-500" /> : 
                          <UserX className="h-4 w-4 text-red-500" />
                        }
                      </div>
                    </TableCell>
                    <TableCell>{user.username || "No username"}</TableCell>
                    <TableCell>{formatJoinedDate(user.joined_date)}</TableCell>
                    <TableCell>{getUserStatusBadge(user.status)}</TableCell>
                    <TableCell>{user.balance}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog onOpenChange={(open) => {
                          if (open) setSelectedUser(user);
                          else setSelectedUser(null);
                        }}>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <UserCog className="h-5 w-5" />
                                Detay Itilizatè: {user.full_name || user.username || "Itilizatè"}
                              </DialogTitle>
                            </DialogHeader>
                            
                            {selectedUser && (
                              <div className="mt-4">
                                <div className="flex flex-wrap gap-2 mb-4">
                                  <Button 
                                    size="sm" 
                                    variant={selectedUser.status === "blocked" ? "default" : "destructive"}
                                    className="flex items-center gap-1"
                                  >
                                    <Lock className="h-4 w-4" />
                                    {selectedUser.status === "blocked" ? "Debloke" : "Bloke"} Kont
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="flex items-center gap-1"
                                  >
                                    <UserCheck className="h-4 w-4" />
                                    {selectedUser.verified ? "Anile Verifye" : "Verifye"} Kont
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="flex items-center gap-1"
                                  >
                                    <RefreshCw className="h-4 w-4" />
                                    Reinisyalize Modpas
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="secondary"
                                    className="flex items-center gap-1"
                                  >
                                    <UserCog className="h-4 w-4" />
                                    Enpèsonifye 👥
                                  </Button>
                                </div>
                                
                                <Tabs 
                                  defaultValue="info" 
                                  value={userDetailTab} 
                                  onValueChange={setUserDetailTab}
                                >
                                  <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
                                    <TabsTrigger value="info">Enfòmasyon</TabsTrigger>
                                    <TabsTrigger value="transactions">Tranzaksyon</TabsTrigger>
                                    <TabsTrigger value="loans">Prè</TabsTrigger>
                                    <TabsTrigger value="devices">Aparèy</TabsTrigger>
                                  </TabsList>
                                  
                                  <TabsContent value="info">
                                    <Card>
                                      <CardContent className="pt-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-medium">Non Itilizatè:</span>
                                            <span>{selectedUser.username || "Pa defini"}</span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-medium">Telefòn:</span>
                                            <span>{selectedUser.phone || "Pa defini"}</span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-medium">Lokalizasyon:</span>
                                            <span>{selectedUser.location || "Pa defini"}</span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-medium">Dat Enskripsyon:</span>
                                            <span>{formatJoinedDate(selectedUser.joined_date)}</span>
                                          </div>
                                          {selectedUser.bio && (
                                            <div className="col-span-2 mt-4">
                                              <span className="font-medium">Byografi:</span>
                                              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                                                {selectedUser.bio}
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </TabsContent>
                                  
                                  <TabsContent value="transactions">
                                    <Card>
                                      <CardContent className="pt-6">
                                        {userTransactions.length > 0 ? (
                                          <Table>
                                            <TableHeader>
                                              <TableRow>
                                                <TableHead>ID</TableHead>
                                                <TableHead>Tip</TableHead>
                                                <TableHead>Kantite</TableHead>
                                                <TableHead>Dat</TableHead>
                                                <TableHead>Statu</TableHead>
                                              </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                              {userTransactions.map((tx) => (
                                                <TableRow key={tx.id}>
                                                  <TableCell>{tx.id}</TableCell>
                                                  <TableCell className="capitalize">{tx.type}</TableCell>
                                                  <TableCell>{tx.amount}</TableCell>
                                                  <TableCell>{tx.date}</TableCell>
                                                  <TableCell>
                                                    <Badge className="bg-green-500 text-white">
                                                      {tx.status}
                                                    </Badge>
                                                  </TableCell>
                                                </TableRow>
                                              ))}
                                            </TableBody>
                                          </Table>
                                        ) : (
                                          <div className="text-center py-4 text-muted-foreground">
                                            Itilizatè sa a pa gen okenn tranzaksyon.
                                          </div>
                                        )}
                                      </CardContent>
                                    </Card>
                                  </TabsContent>
                                  
                                  <TabsContent value="loans">
                                    <Card>
                                      <CardContent className="pt-6">
                                        {userLoans.length > 0 ? (
                                          <Table>
                                            <TableHeader>
                                              <TableRow>
                                                <TableHead>ID</TableHead>
                                                <TableHead>Kantite</TableHead>
                                                <TableHead>Enterè</TableHead>
                                                <TableHead>Peryòd</TableHead>
                                                <TableHead>Dat Kòmanse</TableHead>
                                                <TableHead>Statu</TableHead>
                                              </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                              {userLoans.map((loan) => (
                                                <TableRow key={loan.id}>
                                                  <TableCell>{loan.id}</TableCell>
                                                  <TableCell>{loan.amount}</TableCell>
                                                  <TableCell>{loan.interest}</TableCell>
                                                  <TableCell>{loan.term}</TableCell>
                                                  <TableCell>{loan.start}</TableCell>
                                                  <TableCell>
                                                    <Badge className="bg-blue-500 text-white">
                                                      {loan.status}
                                                    </Badge>
                                                  </TableCell>
                                                </TableRow>
                                              ))}
                                            </TableBody>
                                          </Table>
                                        ) : (
                                          <div className="text-center py-4 text-muted-foreground">
                                            Itilizatè sa a pa gen okenn prè aktif.
                                          </div>
                                        )}
                                      </CardContent>
                                    </Card>
                                  </TabsContent>
                                  
                                  <TabsContent value="devices">
                                    <Card>
                                      <CardContent className="pt-6">
                                        {userDevices.length > 0 ? (
                                          <Table>
                                            <TableHeader>
                                              <TableRow>
                                                <TableHead>Aparèy</TableHead>
                                                <TableHead>IP</TableHead>
                                                <TableHead>Lokalizasyon</TableHead>
                                                <TableHead>Dènye Koneksyon</TableHead>
                                              </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                              {userDevices.map((device, idx) => (
                                                <TableRow key={idx}>
                                                  <TableCell>{device.device}</TableCell>
                                                  <TableCell>{device.ip}</TableCell>
                                                  <TableCell>{device.location}</TableCell>
                                                  <TableCell>{device.lastLogin}</TableCell>
                                                </TableRow>
                                              ))}
                                            </TableBody>
                                          </Table>
                                        ) : (
                                          <div className="text-center py-4 text-muted-foreground">
                                            Pa gen okenn enfòmasyon sou aparèy pou itilizatè sa a.
                                          </div>
                                        )}
                                      </CardContent>
                                    </Card>
                                  </TabsContent>
                                </Tabs>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                          <UserX className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
