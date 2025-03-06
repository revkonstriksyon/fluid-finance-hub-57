
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, ShieldAlert, ShieldCheck, Globe, Users, Lock } from "lucide-react";

export const AdminSecurity = () => {
  // Mock data for demonstration
  const securityLogs = [
    { id: 'L1234', user: 'Admin001', action: 'Password Reset', target: 'User U5678', timestamp: '10:45 AM', ip: '192.168.1.45', successful: true },
    { id: 'L2345', user: 'Admin002', action: 'Account Lockout', target: 'User U6789', timestamp: '11:30 AM', ip: '192.168.1.46', successful: true },
    { id: 'L3456', user: 'Admin001', action: 'Permission Change', target: 'Admin003', timestamp: '12:15 PM', ip: '192.168.1.45', successful: true },
    { id: 'L4567', user: 'System', action: 'Failed Login Attempt', target: 'User U7890', timestamp: '01:20 PM', ip: '192.168.1.50', successful: false },
  ];

  const blockedIPs = [
    { ip: '187.45.23.10', reason: 'Multiple failed logins', blockedAt: '2023-10-15 09:45', attempts: 12 },
    { ip: '203.67.89.21', reason: 'Suspicious API calls', blockedAt: '2023-10-14 14:30', attempts: 8 },
    { ip: '115.78.92.33', reason: 'Attempted SQL injection', blockedAt: '2023-10-13 20:15', attempts: 3 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              <span>Nivo Sekirite</span>
            </CardTitle>
            <CardDescription>Statu aktyèl sekirite sistèm nan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-green-500" />
              <span className="text-xl font-semibold text-green-600">Wo</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-amber-500" />
              <span>Alèt Aktif</span>
            </CardTitle>
            <CardDescription>Pwoblèm sekirite ki bezwen atansyon</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">3</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-red-500" />
              <span>IP Bloke</span>
            </CardTitle>
            <CardDescription>Adrès IP ki bloKe pou aktivite sispèk</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">27</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="logs">
        <TabsList>
          <TabsTrigger value="logs">Jounal Sekirite</TabsTrigger>
          <TabsTrigger value="ips">IP Bloke</TabsTrigger>
          <TabsTrigger value="roles">Ròl & Pèmisyon</TabsTrigger>
        </TabsList>
        
        <TabsContent value="logs" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Jounal Sekirite</CardTitle>
              <CardDescription>Tout aksyon administratè ak ensidan sekirite</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Itilizatè</TableHead>
                    <TableHead>Aksyon</TableHead>
                    <TableHead>Sib</TableHead>
                    <TableHead>Lè</TableHead>
                    <TableHead>IP</TableHead>
                    <TableHead>Statu</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {securityLogs.map(log => (
                    <TableRow key={log.id}>
                      <TableCell>{log.id}</TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell>{log.target}</TableCell>
                      <TableCell>{log.timestamp}</TableCell>
                      <TableCell>{log.ip}</TableCell>
                      <TableCell>
                        {log.successful ? (
                          <Badge variant="outline" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            Siksè
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                            Echèk
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ips" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>IP Bloke</CardTitle>
              <CardDescription>Adrès IP ki bloke akòz aktivite sispèk</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Adrès IP</TableHead>
                    <TableHead>Rezon</TableHead>
                    <TableHead>Lè Bloke</TableHead>
                    <TableHead>Kantite Tantativ</TableHead>
                    <TableHead>Aksyon</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blockedIPs.map(ip => (
                    <TableRow key={ip.ip}>
                      <TableCell>{ip.ip}</TableCell>
                      <TableCell>{ip.reason}</TableCell>
                      <TableCell>{ip.blockedAt}</TableCell>
                      <TableCell>{ip.attempts}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">Debloke</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="roles" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Ròl & Pèmisyon</CardTitle>
              <CardDescription>Jere aksè administratè nan sistèm nan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    <span className="font-semibold">Administratè Aktif: 8</span>
                  </div>
                  <Button>Kreye Administratè</Button>
                </div>
                
                <div className="grid gap-4">
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Lock className="h-5 w-5 text-purple-500" />
                        <span className="font-semibold">Super Admin</span>
                      </div>
                      <Badge>2 itilizatè</Badge>
                    </div>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Aksè konplè nan tout fonksyonalite sistèm nan.
                    </p>
                  </div>
                  
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Lock className="h-5 w-5 text-blue-500" />
                        <span className="font-semibold">Admin Finansye</span>
                      </div>
                      <Badge>3 itilizatè</Badge>
                    </div>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Jere tranzaksyon, kont bankè, ak prè.
                    </p>
                  </div>
                  
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Lock className="h-5 w-5 text-green-500" />
                        <span className="font-semibold">Admin Suppò</span>
                      </div>
                      <Badge>3 itilizatè</Badge>
                    </div>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Jere demann kliyan ak pwoblèm itilizatè.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
