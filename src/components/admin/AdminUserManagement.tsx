
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Search, Filter, UserX, UserCheck, RefreshCw, UserCog, Users, 
  ArrowUpDown, Eye, Lock, Calendar, Mail, Phone, MapPin
} from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for users
const mockUsers = [
  {
    id: "USR-8721",
    name: "Jean Baptiste",
    email: "jeanbaptiste@example.com",
    phone: "+509 3456-7890",
    location: "Port-au-Prince",
    joined: "15 Feb 2025",
    verified: true,
    status: "active",
    balance: "$1,450.00"
  },
  {
    id: "USR-5432",
    name: "Marie Claire",
    email: "marieclaire@example.com",
    phone: "+509 2345-6789",
    location: "Cap-Haïtien",
    joined: "10 Jan 2025",
    verified: true,
    status: "active",
    balance: "$2,750.00"
  },
  {
    id: "USR-3241",
    name: "Paul Durand",
    email: "pauldurand@example.com",
    phone: "+509 4567-8901",
    location: "Jacmel",
    joined: "23 Mar 2025",
    verified: false,
    status: "suspended",
    balance: "$0.00"
  },
  {
    id: "USR-9876",
    name: "Sophie Blanc",
    email: "sophieblanc@example.com",
    phone: "+509 5678-9012",
    location: "Jérémie",
    joined: "5 Feb 2025",
    verified: true,
    status: "active",
    balance: "$825.50"
  },
  {
    id: "USR-6543",
    name: "Michel Thomas",
    email: "michelthomas@example.com",
    phone: "+509 6789-0123",
    location: "Gonaïves",
    joined: "17 Jan 2025",
    verified: true,
    status: "active",
    balance: "$3,100.75"
  },
  {
    id: "USR-2109",
    name: "Laura Pierre",
    email: "laurapierre@example.com",
    phone: "+509 7890-1234",
    location: "Les Cayes",
    joined: "28 Mar 2025",
    verified: false,
    status: "blocked",
    balance: "$175.25"
  },
  {
    id: "USR-8765",
    name: "Robert Jean",
    email: "robertjean@example.com",
    phone: "+509 8901-2345",
    location: "Port-au-Prince",
    joined: "9 Feb 2025",
    verified: true,
    status: "inactive",
    balance: "$520.00"
  },
  {
    id: "USR-4321",
    name: "Claudine Moreau",
    email: "claudinemoreau@example.com",
    phone: "+509 9012-3456",
    location: "Léogâne",
    joined: "20 Jan 2025",
    verified: true,
    status: "active",
    balance: "$1,875.25"
  }
];

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

export const AdminUserManagement = () => {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetailTab, setUserDetailTab] = useState("info");
  
  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getUserStatusBadge = (status) => {
    const statusClasses = {
      active: "bg-green-500",
      inactive: "bg-yellow-500",
      suspended: "bg-orange-500",
      blocked: "bg-red-500"
    };
    
    return (
      <Badge className={`${statusClasses[status]} text-white`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Non</TableHead>
                <TableHead>Imèl</TableHead>
                <TableHead>Dat Enskripsyon</TableHead>
                <TableHead>Statu</TableHead>
                <TableHead>Balans</TableHead>
                <TableHead>Aksyon</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {user.name}
                      {user.verified ? 
                        <UserCheck className="h-4 w-4 text-green-500" /> : 
                        <UserX className="h-4 w-4 text-red-500" />
                      }
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.joined}</TableCell>
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
                              Detay Itilizatè: {user.name}
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
                                          <span className="font-medium">Imèl:</span>
                                          <span>{selectedUser.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Phone className="h-4 w-4 text-muted-foreground" />
                                          <span className="font-medium">Telefòn:</span>
                                          <span>{selectedUser.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <MapPin className="h-4 w-4 text-muted-foreground" />
                                          <span className="font-medium">Lokalizasyon:</span>
                                          <span>{selectedUser.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Calendar className="h-4 w-4 text-muted-foreground" />
                                          <span className="font-medium">Dat Enskripsyon:</span>
                                          <span>{selectedUser.joined}</span>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TabsContent>
                                
                                <TabsContent value="transactions">
                                  <Card>
                                    <CardContent className="pt-6">
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
        </CardContent>
      </Card>
    </div>
  );
};
