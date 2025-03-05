
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, LockKeyhole, Smartphone, AlertTriangle, Check, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/auth";

const SecuritySettings = () => {
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState("+509 38XX-XXXX");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [loginNotificationsEnabled, setLoginNotificationsEnabled] = useState(true);
  const [transactionNotificationsEnabled, setTransactionNotificationsEnabled] = useState(true);
  const [isChangingPhone, setIsChangingPhone] = useState(false);
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const { user, getActiveSessions, getAuthActivity, activeSessions, authActivities } = useAuth();
  
  useEffect(() => {
    // Load sessions and activity data when component mounts
    if (user) {
      getActiveSessions?.();
      // Convert the number 10 to a string for the limit parameter
      getAuthActivity?.(user.id, "10");
    }
  }, [user, getActiveSessions, getAuthActivity]);
  
  const handleSavePhone = () => {
    if (!newPhoneNumber) {
      toast({
        title: "Erè",
        description: "Tanpri antre yon nimewo telefòn ki valid",
        variant: "destructive"
      });
      return;
    }
    
    setPhoneNumber(newPhoneNumber);
    setIsChangingPhone(false);
    setNewPhoneNumber("");
    
    toast({
      title: "Siksè",
      description: "Nimewo telefòn ou a mizajou",
      variant: "default"
    });
  };
  
  const handleToggleTwoFactor = () => {
    const newState = !twoFactorEnabled;
    setTwoFactorEnabled(newState);
    
    toast({
      title: newState ? "2FA Aktive" : "2FA Dezaktive",
      description: newState ? 
        "Otantifikasyon de-faktè aktive avèk siksè." : 
        "Otantifikasyon de-faktè dezaktive. Kont ou mwens sekirize kounye a.",
      variant: newState ? "default" : "destructive"
    });
  };
  
  const handleResetSecurity = () => {
    toast({
      title: "Demand Reyinisyalizasyon Sekirite",
      description: "Nou voye yon imel ba ou ak enstriksyon pou reyinisyalize paramèt sekirite ou yo.",
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Paramèt Sekirite</h2>
        <p className="text-muted-foreground">Jere paramèt sekirite kont ou an</p>
      </div>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="general">Jeneral</TabsTrigger>
          <TabsTrigger value="authentication">Otantifikasyon</TabsTrigger>
          <TabsTrigger value="sessions">Sesyon</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-finance-blue" />
                Sekirite Debaz
              </CardTitle>
              <CardDescription>
                Paramèt sekirite jeneral pou kont ou
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Notifikasyon pou koneksyon</h4>
                  <p className="text-sm text-muted-foreground">Resevwa notifikasyon lè yon moun konekte nan kont ou</p>
                </div>
                <Switch 
                  checked={loginNotificationsEnabled} 
                  onCheckedChange={setLoginNotificationsEnabled} 
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Notifikasyon pou tranzaksyon</h4>
                  <p className="text-sm text-muted-foreground">Resevwa notifikasyon pou tout tranzaksyon ki depase 100$</p>
                </div>
                <Switch 
                  checked={transactionNotificationsEnabled} 
                  onCheckedChange={setTransactionNotificationsEnabled} 
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Otantifikasyon biyometrik</h4>
                  <p className="text-sm text-muted-foreground">Aktive koneksyon ak anprent oswa rekonesans figi (sèlman aplikasyon mobil)</p>
                </div>
                <Switch 
                  checked={biometricsEnabled} 
                  onCheckedChange={setBiometricsEnabled} 
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleResetSecurity}>
                <AlertTriangle className="mr-2 h-4 w-4" />
                Reyinisyalize Paramèt
              </Button>
              <Button>
                <Check className="mr-2 h-4 w-4" />
                Anrejistre Chanjman
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Smartphone className="mr-2 h-5 w-5 text-finance-blue" />
                Nimewo Telefòn
              </CardTitle>
              <CardDescription>
                Nimewo telefòn pou koneksyon ak otantifikasyon de-faktè
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isChangingPhone ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Nouvo nimewo telefòn</Label>
                    <Input 
                      id="phoneNumber" 
                      value={newPhoneNumber} 
                      onChange={(e) => setNewPhoneNumber(e.target.value)} 
                      placeholder="+509 XXXX-XXXX" 
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Smartphone className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{phoneNumber}</p>
                      <p className="text-sm text-muted-foreground">Itilize pou otantifikasyon de-faktè</p>
                    </div>
                  </div>
                  <Badge>Verifye</Badge>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end">
              {isChangingPhone ? (
                <div className="space-x-2">
                  <Button variant="outline" onClick={() => setIsChangingPhone(false)}>
                    <X className="mr-2 h-4 w-4" />
                    Anile
                  </Button>
                  <Button onClick={handleSavePhone}>
                    <Check className="mr-2 h-4 w-4" />
                    Anrejistre
                  </Button>
                </div>
              ) : (
                <Button variant="outline" onClick={() => setIsChangingPhone(true)}>
                  Chanje
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="authentication" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LockKeyhole className="mr-2 h-5 w-5 text-finance-blue" />
                Otantifikasyon de-faktè (2FA)
              </CardTitle>
              <CardDescription>
                Ajoute yon kouch sekirite siplemantè pou kont ou
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="font-medium">Estati 2FA</h4>
                  <p className="text-sm text-muted-foreground">
                    {twoFactorEnabled 
                      ? "Otantifikasyon de-faktè aktif. Nou voye kòd verifikasyon nan telefòn ou chak fwa ou konekte." 
                      : "Otantifikasyon de-faktè pa aktif. Kont ou pi vilnerab a atak."}
                  </p>
                </div>
                <Badge 
                  className={twoFactorEnabled ? "bg-green-500" : "bg-red-500"}
                >
                  {twoFactorEnabled ? "Aktif" : "Pa aktif"}
                </Badge>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant={twoFactorEnabled ? "outline" : "default"}
                onClick={handleToggleTwoFactor}
              >
                {twoFactorEnabled ? "Dezaktive 2FA" : "Aktive 2FA"}
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Modpas & Sekirite</CardTitle>
              <CardDescription>
                Jere modpas ou ak paramèt sekirite kont ou
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Dènye chanjman modpas</h4>
                  <span className="text-sm text-muted-foreground">3 mwa pase</span>
                </div>
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Fòs modpas</h4>
                  <Badge className="bg-yellow-500">Mwayen</Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                Chanje Modpas
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="sessions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Aparèy & Sesyon</CardTitle>
              <CardDescription>
                Jere aparèy ki konekte nan kont ou
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b dark:border-gray-800">
                  <div className="flex items-center space-x-4">
                    <div className="bg-finance-blue/10 p-2 rounded-full">
                      <Smartphone className="h-6 w-6 text-finance-blue" />
                    </div>
                    <div>
                      <h4 className="font-medium">iPhone 13 Pro</h4>
                      <p className="text-sm text-muted-foreground">Port-au-Prince, Haiti • Kounye a</p>
                    </div>
                  </div>
                  <Badge>Aktyèl</Badge>
                </div>
                
                <div className="flex items-center justify-between pb-4 border-b dark:border-gray-800">
                  <div className="flex items-center space-x-4">
                    <div className="bg-finance-blue/10 p-2 rounded-full">
                      <LockKeyhole className="h-6 w-6 text-finance-blue" />
                    </div>
                    <div>
                      <h4 className="font-medium">MacBook Pro</h4>
                      <p className="text-sm text-muted-foreground">Port-au-Prince, Haiti • 2 jou pase</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">Dekonekte</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="destructive" className="w-full">
                Dekonekte Tout Aparèy
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecuritySettings;
