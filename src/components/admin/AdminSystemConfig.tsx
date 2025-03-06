
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Settings, Globe, Bell, Database, Key, Server, RotateCw, CheckCircle2, AlertCircle } from "lucide-react";

export const AdminSystemConfig = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Konfigirasyon Sistèm</h2>
          <p className="text-finance-charcoal/70 dark:text-white/70">
            Jere paramèt sistèm ak entegrasyon
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <RotateCw className="h-4 w-4" />
            <span>Restart Sistèm</span>
          </Button>
          <Button className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Anrejistre Chanjman</span>
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">Paramèt Jeneral</TabsTrigger>
          <TabsTrigger value="api">API & Entegrasyon</TabsTrigger>
          <TabsTrigger value="notifications">Notifikasyon</TabsTrigger>
          <TabsTrigger value="database">Jesyon Done</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Paramèt Jeneral Sistèm</CardTitle>
              <CardDescription>Konfigire paramèt de baz sistèm nan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Enfòmasyon Sistèm</h3>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="system-name">Non Sistèm nan</Label>
                      <Input id="system-name" value="Fluid Finance Platform" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="system-version">Vèsyon Sistèm</Label>
                      <Input id="system-version" value="2.5.7" readOnly />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="admin-email">Imèl Administratè</Label>
                      <Input id="admin-email" value="admin@fluidfinance.com" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="support-email">Imèl Sipò</Label>
                      <Input id="support-email" value="support@fluidfinance.com" />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Aksè ak Sekirite</h3>
                  
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="maintenance-mode">Mòd Antretyen</Label>
                        <p className="text-sm text-finance-charcoal/70 dark:text-white/70">
                          Aktive mòd antretyen pou fèmen aksè itilizatè
                        </p>
                      </div>
                      <Switch id="maintenance-mode" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="new-registrations">Nouvo Enskripsyon</Label>
                        <p className="text-sm text-finance-charcoal/70 dark:text-white/70">
                          Pèmèt nouvo itilizatè enskri
                        </p>
                      </div>
                      <Switch id="new-registrations" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="force-2fa">Otantifikasyon 2FA Obligatwa</Label>
                        <p className="text-sm text-finance-charcoal/70 dark:text-white/70">
                          Egzije 2FA pou tout itilizatè
                        </p>
                      </div>
                      <Switch id="force-2fa" defaultChecked />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="session-timeout">Limit Sesyon (minit)</Label>
                      <Input id="session-timeout" type="number" defaultValue={60} />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Lokalizasyon & Lang</h3>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="default-language">Lang Prensipal</Label>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-finance-charcoal/70 dark:text-white/70" />
                        <Input id="default-language" value="Kreyòl Ayisyen" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Fizo Orè</Label>
                      <Input id="timezone" value="America/Port-au-Prince" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="date-format">Fòma Dat</Label>
                      <Input id="date-format" value="DD/MM/YYYY" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="currency">Deviz Prensipal</Label>
                      <Input id="currency" value="HTG" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>API & Entegrasyon</CardTitle>
              <CardDescription>Jere kle API ak koneksyon ak sèvis twazyèm pati</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Kle API Sistèm</h3>
                  
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Key className="h-5 w-5 text-amber-500" />
                          <span className="font-semibold">Kle API Prensipal</span>
                        </div>
                        <Badge variant="outline" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          Aktif
                        </Badge>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <Input value="ff_api_****************************************" type="password" readOnly />
                        <Button variant="outline" size="sm">
                          Montre
                        </Button>
                        <Button variant="outline" size="sm">
                          Kopye
                        </Button>
                      </div>
                      <div className="mt-2 flex justify-end">
                        <Button variant="destructive" size="sm">
                          Rejenere
                        </Button>
                      </div>
                    </div>
                    
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Key className="h-5 w-5 text-blue-500" />
                          <span className="font-semibold">Kle API Devlopè</span>
                        </div>
                        <Badge variant="outline" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                          Tès
                        </Badge>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <Input value="ff_dev_****************************************" type="password" readOnly />
                        <Button variant="outline" size="sm">
                          Montre
                        </Button>
                        <Button variant="outline" size="sm">
                          Kopye
                        </Button>
                      </div>
                      <div className="mt-2 flex justify-end">
                        <Button variant="destructive" size="sm">
                          Rejenere
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Entegrasyon Sèvis</h3>
                  
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <Server className="h-5 w-5 text-green-500" />
                            <span className="font-semibold">Bank XYZ API</span>
                            <Badge className="ml-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                              Konekte
                            </Badge>
                          </div>
                          <p className="mt-1 text-sm text-finance-charcoal/70 dark:text-white/70">
                            Entegrasyon ak sistèm bank pou verifikasyon kont ak transfè
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Konfigire
                          </Button>
                          <Button variant="outline" size="sm">
                            Teste
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="rounded-lg border p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <Server className="h-5 w-5 text-red-500" />
                            <span className="font-semibold">SMS Gateway</span>
                            <Badge variant="outline" className="ml-2 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                              Dekonekte
                            </Badge>
                          </div>
                          <p className="mt-1 text-sm text-finance-charcoal/70 dark:text-white/70">
                            Sèvis pou voye SMS pou kod 2FA ak notifikasyon
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Konfigire
                          </Button>
                          <Button size="sm">
                            Konekte
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="rounded-lg border p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <Server className="h-5 w-5 text-green-500" />
                            <span className="font-semibold">Credit Bureau API</span>
                            <Badge className="ml-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                              Konekte
                            </Badge>
                          </div>
                          <p className="mt-1 text-sm text-finance-charcoal/70 dark:text-white/70">
                            Verifikasyon eskò kredi pou aplikasyon prè
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Konfigire
                          </Button>
                          <Button variant="outline" size="sm">
                            Teste
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Paramèt Notifikasyon</CardTitle>
              <CardDescription>Jere notifikasyon itilizatè ak mesaj sistèm</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Notifikasyon Itilizatè</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Notifikasyon Imèl</Label>
                        <p className="text-sm text-finance-charcoal/70 dark:text-white/70">
                          Voye notifikasyon pa imèl
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Notifikasyon SMS</Label>
                        <p className="text-sm text-finance-charcoal/70 dark:text-white/70">
                          Voye notifikasyon pa SMS
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Notifikasyon Push</Label>
                        <p className="text-sm text-finance-charcoal/70 dark:text-white/70">
                          Voye notifikasyon push nan aplikasyon mobil
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Notifikasyon Kout Tan</Label>
                        <p className="text-sm text-finance-charcoal/70 dark:text-white/70">
                          Kantite minit anvan evenman pou voye notifikasyon
                        </p>
                      </div>
                      <Input type="number" defaultValue={30} className="w-24" />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Mesaj Sistèm</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-amber-500" />
                        <div>
                          <h4 className="font-medium">Mesaj Global</h4>
                          <p className="text-sm text-finance-charcoal/70 dark:text-white/70">
                            Mesaj ki afiche pou tout itilizatè
                          </p>
                        </div>
                      </div>
                      <Switch />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="global-message">Tèks Mesaj Global</Label>
                      <Input id="global-message" placeholder="Antre mesaj ki pral afiche pou tout itilizatè..." />
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="message-start">Dat Kòmansman</Label>
                        <Input id="message-start" type="date" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="message-end">Dat Finisman</Label>
                        <Input id="message-end" type="date" />
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-4">
                      <h4 className="font-medium">Kalite Mesaj</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center gap-2 border rounded-lg p-3">
                          <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                          <span>Enfòmasyon</span>
                        </div>
                        
                        <div className="flex items-center gap-2 border rounded-lg p-3">
                          <div className="h-4 w-4 rounded-full bg-green-500"></div>
                          <span>Siksè</span>
                        </div>
                        
                        <div className="flex items-center gap-2 border rounded-lg p-3">
                          <div className="h-4 w-4 rounded-full bg-amber-500"></div>
                          <span>Avètisman</span>
                        </div>
                        
                        <div className="flex items-center gap-2 border rounded-lg p-3">
                          <div className="h-4 w-4 rounded-full bg-red-500"></div>
                          <span>Erè</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="database" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Jesyon Done</CardTitle>
              <CardDescription>Konfigire paramèt baz done ak bakopaj</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Bakupi</CardTitle>
                      <CardDescription>Dènye bakupi konplè</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <div>
                          <div className="font-semibold">Yè, 21:30</div>
                          <div className="text-xs text-finance-charcoal/70 dark:text-white/70">
                            Gwosè: 4.2 GB
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Sistèm Done</CardTitle>
                      <CardDescription>Pèfòmans baz done</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <div>
                          <div className="font-semibold">Optimum</div>
                          <div className="text-xs text-finance-charcoal/70 dark:text-white/70">
                            Repons: 24ms
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Espas Depo</CardTitle>
                      <CardDescription>Espas ki itilize</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-amber-500" />
                        <div>
                          <div className="font-semibold">76% itilize</div>
                          <div className="text-xs text-finance-charcoal/70 dark:text-white/70">
                            234 GB / 300 GB
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Bakupi Otomatik</h3>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="backup-frequency">Frekans Bakupi</Label>
                      <select id="backup-frequency" className="w-full p-2 rounded-md border">
                        <option>Chak jou</option>
                        <option>Chak 12 èdtan</option>
                        <option>Chak semèn</option>
                        <option>Chak mwa</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="backup-time">Lè Bakupi</Label>
                      <Input id="backup-time" type="time" defaultValue="21:30" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="retention-period">Peryòd Retansyon (jou)</Label>
                      <Input id="retention-period" type="number" defaultValue={30} />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="backup-location">Lokasyon Bakupi</Label>
                    <Input id="backup-location" value="/var/backups/fluidfinance" />
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline">Teste Bakupi</Button>
                    <Button>Fè Bakupi Manyèlman</Button>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Antretyen Baz Done</h3>
                    <div></div> {/* Spacer */}
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Optimize Endèks</Label>
                        <p className="text-sm text-finance-charcoal/70 dark:text-white/70">
                          Optimize endèks pou pèfòmans rechèch
                        </p>
                      </div>
                      <Button variant="outline">Kòmanse</Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Netwaye Done Tanporè</Label>
                        <p className="text-sm text-finance-charcoal/70 dark:text-white/70">
                          Efase done tanporè ak jounalizasyon
                        </p>
                      </div>
                      <Button variant="outline">Kòmanse</Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Vakum Baz Done</Label>
                        <p className="text-sm text-finance-charcoal/70 dark:text-white/70">
                          Rekipere espas nan baz done
                        </p>
                      </div>
                      <Button variant="outline">Kòmanse</Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Analize Prensipal</Label>
                        <p className="text-sm text-finance-charcoal/70 dark:text-white/70">
                          Analize estrikti baz done
                        </p>
                      </div>
                      <Button variant="outline">Kòmanse</Button>
                    </div>
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
