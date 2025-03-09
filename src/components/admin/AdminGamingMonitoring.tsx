
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, AlertCircle, CheckCircle2, Loader2, DatabaseIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// Mock data for the admin panel (used for demo)
// In a real app, this would come from Supabase
const mockGames = [
  { 
    id: "G-12345", 
    type: "Poker", 
    players: 6, 
    start_time: "13:45", 
    status: "active",
    suspicious_activity: false 
  },
  { 
    id: "G-23456", 
    type: "Blackjack", 
    players: 3, 
    start_time: "14:30", 
    status: "active",
    suspicious_activity: true 
  },
  { 
    id: "G-34567", 
    type: "Roulette", 
    players: 8, 
    start_time: "15:00", 
    status: "ending",
    suspicious_activity: false 
  },
  { 
    id: "G-45678", 
    type: "Slot Machine", 
    players: 1, 
    start_time: "15:15", 
    status: "suspended",
    suspicious_activity: true 
  }
];

const mockSuspiciousUsers = [
  {
    id: "SU-1234",
    user_id: "U-56789",
    user_name: "Jean Louis",
    pattern: "Unusual bet patterns",
    games_count: 23,
    total_amount: 5600,
    status: "pending"
  },
  {
    id: "SU-2345",
    user_id: "U-67890",
    user_name: "Marie Dupont",
    pattern: "Multiple accounts",
    games_count: 15,
    total_amount: 3200,
    status: "investigating"
  },
  {
    id: "SU-3456",
    user_id: "U-78901",
    user_name: "Pierre Michel",
    pattern: "Collusion suspected",
    games_count: 42,
    total_amount: 12800,
    status: "blocked"
  }
];

// Mock system stats
const mockSystemStats = {
  active_games_count: 32,
  active_users_count: 187,
  fraud_alerts_24h_count: 8
};

interface Game {
  id: string;
  type: string;
  players: number;
  start_time: string;
  status: string;
  suspicious_activity: boolean;
}

interface SuspiciousActivity {
  id: string;
  user_id: string;
  user_name: string;
  pattern: string;
  games_count: number;
  total_amount: number;
  status: string;
}

interface SystemStats {
  active_games_count: number;
  active_users_count: number;
  fraud_alerts_24h_count: number;
}

export const AdminGamingMonitoring = () => {
  const [activeGames, setActiveGames] = useState<Game[]>([]);
  const [suspiciousUsers, setSuspiciousUsers] = useState<SuspiciousActivity[]>([]);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTabsLoading, setActiveTabsLoading] = useState<boolean>(false);
  const [suspiciousTabsLoading, setSuspiciousTabsLoading] = useState<boolean>(false);
  const [isDemoMode] = useState<boolean>(sessionStorage.getItem('admin_demo_access') === 'true');

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      
      try {
        // For demo mode, use mock data
        if (isDemoMode) {
          setTimeout(() => {
            setSystemStats(mockSystemStats);
            setActiveGames(mockGames);
            setSuspiciousUsers(mockSuspiciousUsers);
            setIsLoading(false);
          }, 1000); // Simulate loading
          return;
        }
        
        // In a real app, we would fetch real data from Supabase here
        // This code is commented out to prevent errors in demo mode
        /*
        // Fetch system statistics
        const { data: statsData, error: statsError } = await supabase
          .from('system_statistics')
          .select('active_games_count, active_users_count, fraud_alerts_24h_count')
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        
        if (statsError) {
          console.error('Error fetching system stats:', statsError);
          toast({
            title: "Erè",
            description: "Gen yon erè ki fèt pandan n ap chaje estatistik yo.",
            variant: "destructive"
          });
        } else {
          setSystemStats(statsData || {
            active_games_count: 0,
            active_users_count: 0,
            fraud_alerts_24h_count: 0
          });
        }
        
        // Fetch active games
        const { data: gamesData, error: gamesError } = await supabase
          .from('games')
          .select('*');
        
        if (gamesError) {
          console.error('Error fetching games:', gamesError);
          toast({
            title: "Erè",
            description: "Gen yon erè ki fèt pandan n ap chaje jeu aktif yo.",
            variant: "destructive"
          });
        } else {
          setActiveGames(gamesData || []);
        }
        
        // Fetch suspicious activities
        const { data: suspiciousData, error: suspiciousError } = await supabase
          .from('suspicious_activities')
          .select('id, user_id, user_name, pattern, games_count, total_amount, status');
        
        if (suspiciousError) {
          console.error('Error fetching suspicious activities:', suspiciousError);
          toast({
            title: "Erè",
            description: "Gen yon erè ki fèt pandan n ap chaje aktivite sispèk yo.",
            variant: "destructive"
          });
        } else {
          setSuspiciousUsers(suspiciousData || []);
        }
        */
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

    fetchAllData();
  }, [isDemoMode]);

  // Function to handle game suspension
  const handleSuspendGame = async (gameId: string) => {
    setActiveTabsLoading(true);
    try {
      // For demo mode, just update the local state
      if (isDemoMode) {
        setTimeout(() => {
          setActiveGames(prevGames => 
            prevGames.map(game => 
              game.id === gameId ? { ...game, status: 'suspended' } : game
            )
          );
          
          toast({
            title: "Siksè",
            description: `Jeu ${gameId} te kanpe avèk siksè.`,
            variant: "default"
          });
          
          setActiveTabsLoading(false);
        }, 800); // Simulate loading
        return;
      }
      
      // In a real app, we would update in Supabase
      /*
      const { error } = await supabase
        .from('games')
        .update({ status: 'suspended' })
        .eq('id', gameId);
      
      if (error) {
        console.error('Error suspending game:', error);
        toast({
          title: "Erè",
          description: "Nou pa kapab kanpe jeu sa a pou kounye a.",
          variant: "destructive"
        });
      } else {
        // Update local state
        setActiveGames(prevGames => 
          prevGames.map(game => 
            game.id === gameId ? { ...game, status: 'suspended' } : game
          )
        );
        
        toast({
          title: "Siksè",
          description: `Jeu ${gameId} te kanpe avèk siksè.`,
          variant: "default"
        });
      }
      */
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Erè",
        description: "Gen yon erè ki fèt pandan n ap kanpe jeu a.",
        variant: "destructive"
      });
    } finally {
      setActiveTabsLoading(false);
    }
  };

  // Function to handle suspicious user investigation
  const handleInvestigateUser = async (userId: string) => {
    setSuspiciousTabsLoading(true);
    try {
      // For demo mode, just update the local state
      if (isDemoMode) {
        setTimeout(() => {
          setSuspiciousUsers(prevUsers =>
            prevUsers.map(user =>
              user.id === userId ? { ...user, status: 'investigating' } : user
            )
          );
          
          toast({
            title: "Siksè",
            description: "Envestigasyon kòmanse sou itilizatè sa a.",
            variant: "default"
          });
          
          setSuspiciousTabsLoading(false);
        }, 800); // Simulate loading
        return;
      }
      
      // In a real app, we would update in Supabase
      /*
      const { error } = await supabase
        .from('suspicious_activities')
        .update({ status: 'investigating' })
        .eq('id', userId);
      
      if (error) {
        console.error('Error updating investigation status:', error);
        toast({
          title: "Erè",
          description: "Nou pa kapab kòmanse envestigasyon an pou kounye a.",
          variant: "destructive"
        });
      } else {
        // Update local state
        setSuspiciousUsers(prevUsers =>
          prevUsers.map(user =>
            user.id === userId ? { ...user, status: 'investigating' } : user
          )
        );
        
        toast({
          title: "Siksè",
          description: "Envestigasyon kòmanse sou itilizatè sa a.",
          variant: "default"
        });
      }
      */
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Erè",
        description: "Gen yon erè ki fèt pandan n ap kòmanse envestigasyon an.",
        variant: "destructive"
      });
    } finally {
      setSuspiciousTabsLoading(false);
    }
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
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Jeu Aktif</CardTitle>
            <CardDescription>Kantite jeu k ap jwe kounye a</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{systemStats?.active_games_count || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Jouwè Aktif</CardTitle>
            <CardDescription>Moun k ap jwe kounye a</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{systemStats?.active_users_count || 0}</div>
          </CardContent>
        </Card>
        
        <Card className="border-amber-500/20 bg-amber-50/50 dark:bg-amber-900/10">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <span>Alèt Fwod</span>
            </CardTitle>
            <CardDescription>Aktivite sispèk dènye 24è</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">{systemStats?.fraud_alerts_24h_count || 0}</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Jeu Aktif</TabsTrigger>
          <TabsTrigger value="suspicious">Aktivite Sispèk</TabsTrigger>
          <TabsTrigger value="reports">Rapò Sistèm</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Jeu Aktif yo</CardTitle>
              <CardDescription>Tout jeu k ap jwe oswa pral kòmanse byento</CardDescription>
            </CardHeader>
            <CardContent>
              {activeTabsLoading ? (
                <div className="flex items-center justify-center h-40">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Chajman done yo...</span>
                </div>
              ) : activeGames.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground flex flex-col items-center">
                  <DatabaseIcon className="h-12 w-12 mb-2 text-muted-foreground/50" />
                  <p>Pa gen okenn jeu aktif nan baz done a pou kounye a.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID Jeu</TableHead>
                      <TableHead>Tip</TableHead>
                      <TableHead>Kantite Jouwè</TableHead>
                      <TableHead>Lè Kòmanse</TableHead>
                      <TableHead>Statu</TableHead>
                      <TableHead>Aksyon</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeGames.map(game => (
                      <TableRow key={game.id} className={game.suspicious_activity ? "bg-amber-50 dark:bg-amber-950/20" : ""}>
                        <TableCell>{game.id}</TableCell>
                        <TableCell>{game.type}</TableCell>
                        <TableCell>{game.players}</TableCell>
                        <TableCell>{game.start_time}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              game.status === 'active' ? "default" : 
                              game.status === 'ending' ? "secondary" : 
                              game.status === 'suspended' ? "destructive" :
                              "outline"
                            }
                          >
                            {game.status === 'active' ? "Aktif" : 
                             game.status === 'ending' ? "Ap Fini" : 
                             game.status === 'suspended' ? "Kanpe" :
                             "Pral Kòmanse"}
                          </Badge>
                          {game.suspicious_activity && (
                            <Badge variant="outline" className="ml-2 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                              Sispèk
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Detay</Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              disabled={game.status === 'suspended'}
                              onClick={() => handleSuspendGame(game.id)}
                            >
                              Kanpe
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
        </TabsContent>
        
        <TabsContent value="suspicious" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Aktivite Sispèk</CardTitle>
              <CardDescription>Aktivite ki ka endike fwod oswa manipilasyon</CardDescription>
            </CardHeader>
            <CardContent>
              {suspiciousTabsLoading ? (
                <div className="flex items-center justify-center h-40">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Chajman done yo...</span>
                </div>
              ) : suspiciousUsers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground flex flex-col items-center">
                  <CheckCircle2 className="h-12 w-12 mb-2 text-green-500/50" />
                  <p>Pa gen okenn aktivite sispèk nan baz done a pou kounye a.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID Itilizatè</TableHead>
                      <TableHead>Non</TableHead>
                      <TableHead>Modèl Sispèk</TableHead>
                      <TableHead>Kantite Jeu</TableHead>
                      <TableHead>Total Lajan</TableHead>
                      <TableHead>Statu</TableHead>
                      <TableHead>Aksyon</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {suspiciousUsers.map(user => (
                      <TableRow key={user.id}>
                        <TableCell>{user.user_id.substring(0, 8)}</TableCell>
                        <TableCell>{user.user_name}</TableCell>
                        <TableCell>{user.pattern}</TableCell>
                        <TableCell>{user.games_count}</TableCell>
                        <TableCell>${user.total_amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              user.status === 'investigating' ? "secondary" : 
                              user.status === 'blocked' ? "destructive" : 
                              "outline"
                            }
                          >
                            {user.status === 'investigating' ? "Anba Envestigasyon" : 
                             user.status === 'blocked' ? "Bloke" : 
                             "Annatant"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              disabled={user.status === 'investigating'}
                              onClick={() => handleInvestigateUser(user.id)}
                            >
                              Envestige
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              disabled={user.status === 'blocked'}
                            >
                              Bloke
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
        </TabsContent>
        
        <TabsContent value="reports" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Rapò Sistèm</CardTitle>
              <CardDescription>Endikatè pèfòmans ak rapò game</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <h3 className="font-semibold">Pèfòmans Sistèm nan - Nòmal</h3>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Tout sistèm jeu yo ap fonksyone nòmalman. {suspiciousUsers.length > 0 ? `Gen ${suspiciousUsers.length} ensidan ki rapòte nan dènye 24 èdtan.` : 'Pa gen okenn ensidan ki rapòte nan dènye 24 èdtan.'}
                  </p>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <Button className="w-full">Jenere Rapò Konplè</Button>
                  <Button variant="outline" className="w-full">Definisyon Limit Jeu</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
