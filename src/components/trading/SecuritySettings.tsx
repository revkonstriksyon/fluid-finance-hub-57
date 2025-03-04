
import { useState } from "react";
import { Shield, Key, Smartphone, AlertCircle, Lock, ToggleLeft, Check, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const SecuritySettings = () => {
  const { toast } = useToast();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [tradingPINEnabled, setTradingPINEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [notifications, setNotifications] = useState(true);
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Erè",
        description: "Nouvo modpas la ak konfirmasyon an pa menm.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would call an API to change the password
    toast({
      title: "Siksè",
      description: "Modpas ou chanje avèk siksè.",
      variant: "default",
    });
    
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };
  
  const handleToggleTwoFactor = () => {
    const newValue = !twoFactorEnabled;
    setTwoFactorEnabled(newValue);
    
    toast({
      title: newValue ? "2FA Aktive" : "2FA Dezaktive",
      description: newValue 
        ? "Otantifikasyon de-faktè aktive sou kont ou." 
        : "Otantifikasyon de-faktè dezaktive sou kont ou. Nou rekòmande ou aktive li pou plis sekirite.",
      variant: newValue ? "default" : "destructive",
    });
  };
  
  const handleSetupTradingPIN = () => {
    setTradingPINEnabled(true);
    
    toast({
      title: "PIN Komès Aktive",
      description: "PIN sekirite pou tranzaksyon aktive sou kont ou.",
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sekirite Kont</CardTitle>
          <CardDescription>Jere paramèt sekirite pou kont Trading ou a</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Key className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Modpas ak PIN</CardTitle>
                    <CardDescription>Jere kredansyèl koneksyon ou yo</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="change-password">
                    <AccordionTrigger>Chanje Modpas</AccordionTrigger>
                    <AccordionContent>
                      <form onSubmit={handleChangePassword} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="current-password">Modpas Aktyèl</Label>
                          <Input 
                            id="current-password" 
                            type="password" 
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="new-password">Nouvo Modpas</Label>
                          <Input 
                            id="new-password" 
                            type="password" 
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Konfime Nouvo Modpas</Label>
                          <Input 
                            id="confirm-password" 
                            type="password" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                          />
                        </div>
                        
                        <Button type="submit">Mete Ajou Modpas</Button>
                      </form>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="trading-pin">
                    <AccordionTrigger>PIN Tranzaksyon</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">PIN Tranzaksyon</h4>
                            <p className="text-sm text-muted-foreground">Egzije yon PIN pou tout tranzaksyon trading</p>
                          </div>
                          <Switch 
                            checked={tradingPINEnabled}
                            onCheckedChange={setTradingPINEnabled}
                          />
                        </div>
                        
                        {!tradingPINEnabled && (
                          <Button onClick={handleSetupTradingPIN}>Konfigire PIN</Button>
                        )}
                        
                        {tradingPINEnabled && (
                          <div className="space-y-2">
                            <Label htmlFor="trading-limit">Limit Tranzaksyon San PIN</Label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                              <Input 
                                id="trading-limit" 
                                type="number" 
                                defaultValue="0"
                                className="pl-8"
                              />
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Mete $0 pou egzije PIN pou tout tranzaksyon
                            </p>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Smartphone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Otantifikasyon De-faktè</CardTitle>
                    <CardDescription>Sékirite siplemantè pou kont ou</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">2FA pou Koneksyon</h4>
                      <p className="text-sm text-muted-foreground">Egzije kòd 2FA chak fwa ou konekte</p>
                    </div>
                    <Switch 
                      checked={twoFactorEnabled}
                      onCheckedChange={handleToggleTwoFactor}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">2FA pou Tranzaksyon</h4>
                      <p className="text-sm text-muted-foreground">Egzije kòd 2FA pou tout acha/vant</p>
                    </div>
                    <Switch 
                      checked={twoFactorEnabled}
                      onCheckedChange={handleToggleTwoFactor}
                      disabled={!twoFactorEnabled}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Otantifikasyon Biyometrik</h4>
                      <p className="text-sm text-muted-foreground">Itilize Touch ID oswa Face ID sou aparèy ki pèmèt li</p>
                    </div>
                    <Switch 
                      checked={biometricEnabled}
                      onCheckedChange={setBiometricEnabled}
                    />
                  </div>
                  
                  {!twoFactorEnabled && (
                    <div className="bg-amber-50 border border-amber-200 rounded-md p-3 flex items-start">
                      <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-amber-800">
                        <p className="font-medium mb-1">Sekirite ba</p>
                        <p>Nou rekòmande anpil pou aktive otantifikasyon de-faktè pou ede pwoteje kont ou.</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Sekirite Avanse</CardTitle>
                  <CardDescription>Paramèt sekirite adisyonèl</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Notifikasyon Aktivite Sispèk</h4>
                    <p className="text-sm text-muted-foreground">Resevwa alèt pou aktivite ki sispèk sou kont ou</p>
                  </div>
                  <Switch 
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Konesans Aparèy</h4>
                    <p className="text-sm text-muted-foreground">Verifye nouvo aparèy lè yo konekte pou premye fwa</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Bloke Koneksyon Entènasyonal</h4>
                    <p className="text-sm text-muted-foreground">Bloke koneksyon ki soti nan peyi ki pa sa w te defini</p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Otorizasyon pou App Twazyèm Pati</h4>
                    <p className="text-sm text-muted-foreground">Egzije otorizasyon pou konekte ak app twazyèm pati</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Aparèy Konekte</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="bg-green-100 p-2 rounded-full">
                          <Smartphone className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">iPhone 13 Pro</div>
                          <div className="text-xs text-muted-foreground">Port-au-Prince, Haiti · Dènye koneksyon: Jodi a</div>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800 flex items-center">
                        <Check className="h-3 w-3 mr-1" />
                        Aktyèl
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="bg-slate-100 p-2 rounded-full">
                          <Lock className="h-4 w-4 text-slate-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">MacBook Pro</div>
                          <div className="text-xs text-muted-foreground">Port-au-Prince, Haiti · Dènye koneksyon: Yè</div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                        <X className="h-3 w-3 mr-1" />
                        Dekonekte
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <div className="flex items-start text-sm text-muted-foreground">
                <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <p>Sekirite kont ou se yon priyorite. Nou rekòmande pou aktive otantifikasyon de-faktè epi itilize yon modpas ki fò, inik pou pwoteje kont ou.</p>
              </div>
            </CardFooter>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecuritySettings;
