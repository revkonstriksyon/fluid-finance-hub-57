
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, ArrowUpDown, Eye, CreditCard, CheckCircle, XCircle, AlertTriangle, BarChart, Percent, Calendar, Clock } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

// Mock data for loan applications
const mockLoanApplications = [
  {
    id: "LOAN-3421",
    userId: "USR-8721",
    userName: "Jean Baptiste",
    amount: "$2,500.00",
    term: "90 days",
    interest: "12%",
    purpose: "Business expansion",
    status: "pending",
    creditScore: 720,
    applicationDate: "05 Apr 2025"
  },
  {
    id: "LOAN-3420",
    userId: "USR-5432",
    userName: "Marie Claire",
    amount: "$1,000.00",
    term: "30 days",
    interest: "8%",
    purpose: "Medical expenses",
    status: "approved",
    creditScore: 780,
    applicationDate: "04 Apr 2025"
  },
  {
    id: "LOAN-3419",
    userId: "USR-6543",
    userName: "Michel Thomas",
    amount: "$5,000.00",
    term: "180 days",
    interest: "15%",
    purpose: "Home renovation",
    status: "rejected",
    creditScore: 580,
    applicationDate: "03 Apr 2025"
  },
  {
    id: "LOAN-3418",
    userId: "USR-9876",
    userName: "Sophie Blanc",
    amount: "$3,500.00",
    term: "120 days",
    interest: "14%",
    purpose: "Vehicle purchase",
    status: "approved",
    creditScore: 750,
    applicationDate: "02 Apr 2025"
  },
  {
    id: "LOAN-3417",
    userId: "USR-4321",
    userName: "Claudine Moreau",
    amount: "$800.00",
    term: "60 days",
    interest: "10%",
    purpose: "Education fees",
    status: "approved",
    creditScore: 710,
    applicationDate: "01 Apr 2025"
  },
  {
    id: "LOAN-3416",
    userId: "USR-2109",
    userName: "Laura Pierre",
    amount: "$1,500.00",
    term: "90 days",
    interest: "12%",
    purpose: "Debt consolidation",
    status: "rejected",
    creditScore: 620,
    applicationDate: "31 Mar 2025"
  }
];

// Mock data for active loans
const mockActiveLoans = [
  {
    id: "LOAN-3420",
    userId: "USR-5432",
    userName: "Marie Claire",
    amount: "$1,000.00",
    term: "30 days",
    interest: "8%",
    totalDue: "$1,080.00",
    startDate: "04 Apr 2025",
    dueDate: "04 May 2025",
    progress: 15,
    status: "current"
  },
  {
    id: "LOAN-3418",
    userId: "USR-9876",
    userName: "Sophie Blanc",
    amount: "$3,500.00",
    term: "120 days",
    interest: "14%",
    totalDue: "$3,990.00",
    startDate: "02 Apr 2025",
    dueDate: "31 Jul 2025",
    progress: 5,
    status: "current"
  },
  {
    id: "LOAN-3417",
    userId: "USR-4321",
    userName: "Claudine Moreau",
    amount: "$800.00",
    term: "60 days",
    interest: "10%",
    totalDue: "$880.00",
    startDate: "01 Apr 2025",
    dueDate: "31 May 2025",
    progress: 10,
    status: "current"
  },
  {
    id: "LOAN-3410",
    userId: "USR-8765",
    userName: "Robert Jean",
    amount: "$1,200.00",
    term: "30 days",
    interest: "8%",
    totalDue: "$1,296.00",
    startDate: "15 Mar 2025",
    dueDate: "14 Apr 2025",
    progress: 80,
    status: "late"
  }
];

// Mock credit score data
const mockCreditScores = [
  {
    userId: "USR-8721",
    userName: "Jean Baptiste",
    score: 720,
    status: "good",
    history: [
      { month: "Jan", score: 690 },
      { month: "Feb", score: 700 },
      { month: "Mar", score: 710 },
      { month: "Apr", score: 720 }
    ],
    factors: ["Consistent payment history", "Low credit utilization", "Long credit history"]
  },
  {
    userId: "USR-5432",
    userName: "Marie Claire",
    score: 780,
    status: "excellent",
    history: [
      { month: "Jan", score: 760 },
      { month: "Feb", score: 770 },
      { month: "Mar", score: 780 },
      { month: "Apr", score: 780 }
    ],
    factors: ["Perfect payment history", "Multiple credit types", "Low debt-to-income ratio"]
  },
  {
    userId: "USR-6543",
    userName: "Michel Thomas",
    score: 580,
    status: "poor",
    history: [
      { month: "Jan", score: 620 },
      { month: "Feb", score: 600 },
      { month: "Mar", score: 590 },
      { month: "Apr", score: 580 }
    ],
    factors: ["Missed payments", "High credit utilization", "Recent credit applications"]
  },
  {
    userId: "USR-9876",
    userName: "Sophie Blanc",
    score: 750,
    status: "good",
    history: [
      { month: "Jan", score: 730 },
      { month: "Feb", score: 740 },
      { month: "Mar", score: 745 },
      { month: "Apr", score: 750 }
    ],
    factors: ["Consistent payment history", "Diverse credit mix", "Low outstanding debt"]
  },
  {
    userId: "USR-4321",
    userName: "Claudine Moreau",
    score: 710,
    status: "good",
    history: [
      { month: "Jan", score: 690 },
      { month: "Feb", score: 695 },
      { month: "Mar", score: 700 },
      { month: "Apr", score: 710 }
    ],
    factors: ["Improving payment history", "Moderate credit utilization", "Few recent inquiries"]
  },
  {
    userId: "USR-2109",
    userName: "Laura Pierre",
    score: 620,
    status: "fair",
    history: [
      { month: "Jan", score: 600 },
      { month: "Feb", score: 610 },
      { month: "Mar", score: 615 },
      { month: "Apr", score: 620 }
    ],
    factors: ["Recent late payments", "High balances", "Limited credit history"]
  },
];

export const AdminCreditLoans = () => {
  const [activeTab, setActiveTab] = useState("applications");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Filter logic for loan applications
  const filteredLoanApplications = mockLoanApplications.filter(loan => {
    const matchesSearch = loan.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loan.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loan.userId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || loan.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Filter logic for active loans
  const filteredActiveLoans = mockActiveLoans.filter(loan => {
    const matchesSearch = loan.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loan.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loan.userId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || loan.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Filter logic for credit scores
  const filteredCreditScores = mockCreditScores.filter(score => {
    return score.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           score.userId.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  // Loan status badge display
  const getLoanStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: "bg-yellow-500", icon: <Clock className="h-3 w-3" /> },
      approved: { color: "bg-green-500", icon: <CheckCircle className="h-3 w-3" /> },
      rejected: { color: "bg-red-500", icon: <XCircle className="h-3 w-3" /> },
      current: { color: "bg-blue-500", icon: <CheckCircle className="h-3 w-3" /> },
      late: { color: "bg-orange-500", icon: <AlertTriangle className="h-3 w-3" /> },
      completed: { color: "bg-green-700", icon: <CheckCircle className="h-3 w-3" /> }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <Badge className={`${config.color} text-white flex items-center gap-1`}>
        {config.icon}
        <span className="capitalize">{status}</span>
      </Badge>
    );
  };
  
  // Credit score status color
  const getCreditScoreColor = (score) => {
    if (score >= 750) return "text-green-500";
    if (score >= 700) return "text-blue-500";
    if (score >= 650) return "text-yellow-500";
    if (score >= 600) return "text-orange-500";
    return "text-red-500";
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-finance-charcoal dark:text-white">
        Kontwòl Kredi & Prè
      </h2>
      
      {/* Tabs to switch between loan applications, active loans, and credit scores */}
      <Tabs 
        defaultValue="applications" 
        value={activeTab} 
        onValueChange={setActiveTab}
      >
        <TabsList className="grid grid-cols-1 md:grid-cols-3 mb-4">
          <TabsTrigger value="applications">Aplikasyon Prè</TabsTrigger>
          <TabsTrigger value="active">Prè Aktif</TabsTrigger>
          <TabsTrigger value="credit">Eskò Kredi</TabsTrigger>
        </TabsList>
        
        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Chèche pa ID, non, oswa ID itilizatè..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <span>Statu</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tout Statu</SelectItem>
                    {activeTab === "applications" ? (
                      <>
                        <SelectItem value="pending">Annatant</SelectItem>
                        <SelectItem value="approved">Apwouve</SelectItem>
                        <SelectItem value="rejected">Rejte</SelectItem>
                      </>
                    ) : activeTab === "active" ? (
                      <>
                        <SelectItem value="current">Aktyèl</SelectItem>
                        <SelectItem value="late">An Reta</SelectItem>
                        <SelectItem value="completed">Konplete</SelectItem>
                      </>
                    ) : null}
                  </SelectContent>
                </Select>
                
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4" />
                  Triye
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Loan Applications Tab */}
        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Aplikasyon Prè ({filteredLoanApplications.length})
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Itilizatè</TableHead>
                    <TableHead>Kantite</TableHead>
                    <TableHead>Peryòd</TableHead>
                    <TableHead>Eskò Kredi</TableHead>
                    <TableHead>Statu</TableHead>
                    <TableHead>Aksyon</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLoanApplications.map((loan) => (
                    <TableRow key={loan.id}>
                      <TableCell className="font-medium">{loan.id}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{loan.userName}</span>
                          <span className="text-xs text-muted-foreground">{loan.userId}</span>
                        </div>
                      </TableCell>
                      <TableCell>{loan.amount}</TableCell>
                      <TableCell>{loan.term}</TableCell>
                      <TableCell className={getCreditScoreColor(loan.creditScore)}>
                        {loan.creditScore}
                      </TableCell>
                      <TableCell>{getLoanStatusBadge(loan.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <CreditCard className="h-5 w-5" />
                                  Detay Aplikasyon
                                </DialogTitle>
                              </DialogHeader>
                              
                              <div className="mt-4 space-y-4">
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="font-medium">ID Aplikasyon:</div>
                                  <div>{loan.id}</div>
                                  
                                  <div className="font-medium">Itilizatè:</div>
                                  <div>{loan.userName} ({loan.userId})</div>
                                  
                                  <div className="font-medium">Kantite:</div>
                                  <div>{loan.amount}</div>
                                  
                                  <div className="font-medium">To Enterè:</div>
                                  <div className="flex items-center gap-1">
                                    <Percent className="h-3 w-3" />
                                    {loan.interest}
                                  </div>
                                  
                                  <div className="font-medium">Peryòd:</div>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {loan.term}
                                  </div>
                                  
                                  <div className="font-medium">Rezon:</div>
                                  <div>{loan.purpose}</div>
                                  
                                  <div className="font-medium">Dat Aplikasyon:</div>
                                  <div>{loan.applicationDate}</div>
                                  
                                  <div className="font-medium">Eskò Kredi:</div>
                                  <div className={getCreditScoreColor(loan.creditScore)}>
                                    {loan.creditScore}
                                  </div>
                                  
                                  <div className="font-medium">Statu:</div>
                                  <div>{getLoanStatusBadge(loan.status)}</div>
                                </div>
                                
                                {loan.status === 'pending' && (
                                  <div className="pt-4 flex flex-wrap gap-2">
                                    <Button size="sm" variant="default" className="flex items-center gap-1">
                                      <CheckCircle className="h-4 w-4" />
                                      Apwouve
                                    </Button>
                                    <Button size="sm" variant="destructive" className="flex items-center gap-1">
                                      <XCircle className="h-4 w-4" />
                                      Rejte
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                          
                          {loan.status === 'pending' && (
                            <>
                              <Button size="sm" variant="outline" className="h-8 w-8 p-0 bg-green-50 hover:bg-green-100">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              </Button>
                              <Button size="sm" variant="outline" className="h-8 w-8 p-0 bg-red-50 hover:bg-red-100">
                                <XCircle className="h-4 w-4 text-red-500" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Active Loans Tab */}
        <TabsContent value="active">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Prè Aktif ({filteredActiveLoans.length})
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Itilizatè</TableHead>
                    <TableHead>Kantite</TableHead>
                    <TableHead>Peryòd</TableHead>
                    <TableHead>Pwogresyon</TableHead>
                    <TableHead>Statu</TableHead>
                    <TableHead>Aksyon</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActiveLoans.map((loan) => (
                    <TableRow key={loan.id}>
                      <TableCell className="font-medium">{loan.id}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{loan.userName}</span>
                          <span className="text-xs text-muted-foreground">{loan.userId}</span>
                        </div>
                      </TableCell>
                      <TableCell>{loan.amount}</TableCell>
                      <TableCell>{loan.term}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Progress value={loan.progress} className="h-2 w-full" />
                          <span className="text-xs text-muted-foreground">{loan.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{getLoanStatusBadge(loan.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <CreditCard className="h-5 w-5" />
                                  Detay Prè
                                </DialogTitle>
                              </DialogHeader>
                              
                              <div className="mt-4 space-y-4">
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="font-medium">ID Prè:</div>
                                  <div>{loan.id}</div>
                                  
                                  <div className="font-medium">Itilizatè:</div>
                                  <div>{loan.userName} ({loan.userId})</div>
                                  
                                  <div className="font-medium">Kantite:</div>
                                  <div>{loan.amount}</div>
                                  
                                  <div className="font-medium">Total pou Peye:</div>
                                  <div>{loan.totalDue}</div>
                                  
                                  <div className="font-medium">To Enterè:</div>
                                  <div className="flex items-center gap-1">
                                    <Percent className="h-3 w-3" />
                                    {loan.interest}
                                  </div>
                                  
                                  <div className="font-medium">Peryòd:</div>
                                  <div>{loan.term}</div>
                                  
                                  <div className="font-medium">Dat Kòmansman:</div>
                                  <div>{loan.startDate}</div>
                                  
                                  <div className="font-medium">Dat Pou Peye:</div>
                                  <div>{loan.dueDate}</div>
                                  
                                  <div className="font-medium">Pwogresyon:</div>
                                  <div className="flex flex-col gap-1">
                                    <Progress value={loan.progress} className="h-2 w-full" />
                                    <span>{loan.progress}%</span>
                                  </div>
                                  
                                  <div className="font-medium">Statu:</div>
                                  <div>{getLoanStatusBadge(loan.status)}</div>
                                </div>
                                
                                <div className="pt-4 flex flex-wrap gap-2">
                                  <Button size="sm" variant="outline" className="flex items-center gap-1">
                                    <Percent className="h-4 w-4" />
                                    Chanje To Enterè
                                  </Button>
                                  <Button size="sm" variant="outline" className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    Modifye Dat Peman
                                  </Button>
                                  <Button size="sm" variant="destructive" className="flex items-center gap-1">
                                    <XCircle className="h-4 w-4" />
                                    Fòse Remèt Lajan
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Credit Scores Tab */}
        <TabsContent value="credit">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <BarChart className="h-5 w-5" />
                  Eskò Kredi ({filteredCreditScores.length})
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Itilizatè</TableHead>
                    <TableHead>Eskò Kredi</TableHead>
                    <TableHead>Statu</TableHead>
                    <TableHead>Aksyon</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCreditScores.map((scoreData) => (
                    <TableRow key={scoreData.userId}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{scoreData.userName}</span>
                          <span className="text-xs text-muted-foreground">{scoreData.userId}</span>
                        </div>
                      </TableCell>
                      <TableCell className={getCreditScoreColor(scoreData.score)}>
                        <div className="font-bold text-lg">{scoreData.score}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`
                          ${scoreData.status === 'excellent' ? 'bg-green-500' : ''}
                          ${scoreData.status === 'good' ? 'bg-blue-500' : ''}
                          ${scoreData.status === 'fair' ? 'bg-yellow-500' : ''}
                          ${scoreData.status === 'poor' ? 'bg-red-500' : ''}
                          text-white
                        `}>
                          {scoreData.status.charAt(0).toUpperCase() + scoreData.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <BarChart className="h-5 w-5" />
                                  Detay Eskò Kredi
                                </DialogTitle>
                              </DialogHeader>
                              
                              <div className="mt-4 space-y-4">
                                <div className="flex flex-col items-center pb-4">
                                  <div className={`text-4xl font-bold ${getCreditScoreColor(scoreData.score)}`}>
                                    {scoreData.score}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {scoreData.userName} ({scoreData.userId})
                                  </div>
                                </div>
                                
                                <div className="space-y-2">
                                  <h4 className="font-medium">Faktè</h4>
                                  <ul className="space-y-1">
                                    {scoreData.factors.map((factor, idx) => (
                                      <li key={idx} className="text-sm flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-finance-blue"></div>
                                        {factor}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                
                                <div className="space-y-2">
                                  <h4 className="font-medium">Istwa</h4>
                                  <div className="flex items-end justify-between h-32 border-b pt-4">
                                    {scoreData.history.map((item, idx) => (
                                      <div key={idx} className="flex flex-col items-center">
                                        <div 
                                          className={`w-8 ${getCreditScoreColor(item.score)}`} 
                                          style={{ 
                                            height: `${Math.min(100, item.score / 8)}%`,
                                            minHeight: '10%'
                                          }}
                                        ></div>
                                        <div className="text-xs mt-2">{item.month}</div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                
                                <div className="pt-4 flex flex-wrap gap-2">
                                  <Button size="sm" variant="outline" className="flex items-center gap-1">
                                    <BarChart className="h-4 w-4" />
                                    Ajiste Eskò
                                  </Button>
                                  {scoreData.score < 650 && (
                                    <Button size="sm" variant="destructive" className="flex items-center gap-1">
                                      <XCircle className="h-4 w-4" />
                                      Bloke Aksè Kredi
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <BarChart className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
