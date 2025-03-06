
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, AlertCircle, CheckCircle2 } from "lucide-react";

export const AdminGamingMonitoring = () => {
  // Mock data for demonstration
  const activeGames = [
    { id: 'G1234', type: 'Lotri', players: 145, startTime: '14:30', status: 'active', suspiciousActivity: false },
    { id: 'G2345', type: 'Pòkè', players: 32, startTime: '13:15', status: 'active', suspiciousActivity: true },
    { id: 'G3456', type: 'Kazino', players: 78, startTime: '12:00', status: 'ending', suspiciousActivity: false },
    { id: 'G4567', type: 'Kous Cheval', players: 203, startTime: '15:45', status: 'upcoming', suspiciousActivity: false },
  ];

  const suspiciousUsers = [
    { id: 'U7890', name: 'Jean M.', pattern: 'Multiple large bets in short time', games: 5, totalAmount: 2500 },
    { id: 'U6789', name: 'Marie L.', pattern: 'Unusual win pattern', games: 3, totalAmount: 1800 },
    { id: 'U5678', name: 'Pierre D.', pattern: 'Suspicious IP changes', games: 7, totalAmount: 950 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Jeu Aktif</CardTitle>
            <CardDescription>Kantite jeu k ap jwe kounye a</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">27</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Jouwè Aktif</CardTitle>
            <CardDescription>Moun k ap jwe kounye a</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">458</div>
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
            <div className="text-3xl font-bold text-amber-600">12</div>
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
                    <TableRow key={game.id} className={game.suspiciousActivity ? "bg-amber-50 dark:bg-amber-950/20" : ""}>
                      <TableCell>{game.id}</TableCell>
                      <TableCell>{game.type}</TableCell>
                      <TableCell>{game.players}</TableCell>
                      <TableCell>{game.startTime}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            game.status === 'active' ? "default" : 
                            game.status === 'ending' ? "secondary" : 
                            "outline"
                          }
                        >
                          {game.status === 'active' ? "Aktif" : 
                           game.status === 'ending' ? "Ap Fini" : 
                           "Pral Kòmanse"}
                        </Badge>
                        {game.suspiciousActivity && (
                          <Badge variant="outline" className="ml-2 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                            Sispèk
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Detay</Button>
                          <Button variant="destructive" size="sm">Kanpe</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Itilizatè</TableHead>
                    <TableHead>Non</TableHead>
                    <TableHead>Modèl Sispèk</TableHead>
                    <TableHead>Kantite Jeu</TableHead>
                    <TableHead>Total Lajan</TableHead>
                    <TableHead>Aksyon</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suspiciousUsers.map(user => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.pattern}</TableCell>
                      <TableCell>{user.games}</TableCell>
                      <TableCell>${user.totalAmount}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Envestige</Button>
                          <Button variant="destructive" size="sm">Bloke</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
                    Tout sistèm jeu yo ap fonksyone nòmalman. Pa gen okenn ensidan ki rapòte nan dènye 24 èdtan.
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
