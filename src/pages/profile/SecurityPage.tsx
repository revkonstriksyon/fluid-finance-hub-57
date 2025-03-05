
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle, DialogTrigger, DialogClose
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Shield, Smartphone, Key, Fingerprint, Lock, AlertCircle, Clock, User, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Tabs, TabsContent, TabsList, TabsTrigger
} from "@/components/ui/tabs";

const SecurityPage = () => {
  const { toast } = useToast();
  const { 
    user, 
    profile, 
    setup2FA, 
    disable2FA, 
    verify2FA, 
    is2FAEnabled,
    getActiveSessions, 
    getAuthActivity, 
    terminateSession, 
    terminateAllSessions,
    activeSessions,
    authActivities
  } = useAuth();
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load 2FA status from profile
    if (profile) {
      setTwoFactorEnabled(profile.two_factor_enabled || false);
    }
    
    // Load sessions and activities
    const loadData = async () => {
      if (user) {
        if (getActiveSessions) await getActiveSessions();
        if (getAuthActivity) await getAuthActivity(10);
      }
    };
    
    loadData();
  }, [user, profile]);

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Modpas Chanje",
      description: "Modpas ou te chanje avèk siksè",
    });
  };

  const handleToggle2FA = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      if (!twoFactorEnabled) {
        // Activer 2FA
        if (setup2FA) {
          const { enabled, error } = await setup2FA(user.id);
          if (error) throw error;
          if (enabled) {
            setTwoFactorEnabled(true);
            setShowOtpDialog(true);
          }
        }
      } else {
        // Désactiver 2FA
        if (disable2FA) {
          const { disabled, error } = await disable2FA(user.id);
          if (error) throw error;
          if (disabled) {
            setTwoFactorEnabled(false);
          }
        }
      }
    } catch (error: any) {
      toast({
        title: "Erè",
        description: error.message || "Pa kapab chanje paramèt 2FA. Tanpri eseye ankò.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify2FA = async () => {
    if (!user || !verify2FA) return;
    
    setIsLoading(true);
    try {
      const { verified, error } = await verify2FA(otpCode, user.id);
      if (error) throw error;
      
      if (verified) {
        setShowOtpDialog(false);
        setOtpCode("");
        toast({
          title: "2FA Verifye",
          description: "Otantifikasyon de-faktè verifye avèk siksè."
        });
      }
    } catch (error: any) {
      toast({
        title: "Erè Verifikasyon",
        description: error.message || "Pa kapab verifye kòd OTP. Tanpri eseye ankò.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTerminateSession = async (sessionId: string) => {
    if (!terminateSession) return;
    
    setIsLoading(true);
    try {
      await terminateSession(sessionId);
    } catch (error: any) {
      toast({
        title: "Erè",
        description: error.message || "Pa kapab fèmen sesyon. Tanpri eseye ankò.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTerminateAllSessions = async () => {
    if (!terminateAllSessions) return;
    
    setIsLoading(true);
    try {
      await terminateAllSessions();
    } catch (error: any) {
      toast({
        title: "Erè",
        description: error.message || "Pa kapab fèmen tout sesyon. Tanpri eseye ankò.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'login':
        return <User className="h-4 w-4 text-green-500" />;
      case 'logout':
        return <LogOut className="h-4 w-4 text-yellow-500" />;
      case 'password_change':
        return <Key className="h-4 w-4 text-blue-500" />;
      case 'session_terminated':
        return <Shield className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Sekirite</h1>
        
        <div className="space-y-6">
          {/* Password Section */}
          <div className="finance-card p-6">
            <div className="flex items-start mb-4">
              <Key className="h-6 w-6 mr-3 text-finance-blue" />
              <div>
                <h2 className="text-xl font-bold">Modpas</h2>
                <p className="text-sm text-finance-charcoal/70 dark:text-white/70">Jere modpas ou epi chanje li regilyèman pou plis sekirite</p>
              </div>
            </div>
            
            <form onSubmit={handleChangePassword} className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Modpas Aktyèl</Label>
                <div className="relative">
                  <Input 
                    id="current-password" 
                    type={showCurrentPassword ? "text" : "password"} 
                    placeholder="Antre modpas aktyèl ou" 
                  />
                  <button 
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-finance-charcoal/70 dark:text-white/70 text-sm"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? "Kache" : "Montre"}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-password">Nouvo Modpas</Label>
                <div className="relative">
                  <Input 
                    id="new-password" 
                    type={showNewPassword ? "text" : "password"} 
                    placeholder="Antre nouvo modpas" 
                  />
                  <button 
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-finance-charcoal/70 dark:text-white/70 text-sm"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? "Kache" : "Montre"}
                  </button>
                </div>
                <p className="text-xs text-finance-charcoal/70 dark:text-white/70">
                  Modpas la dwe gen omwen 8 karaktè, ki gen ladan lèt miniskil, lèt majiskil, chif ak karaktè espesyal.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Konfime Nouvo Modpas</Label>
                <div className="relative">
                  <Input 
                    id="confirm-password" 
                    type={showConfirmPassword ? "text" : "password"} 
                    placeholder="Konfime nouvo modpas" 
                  />
                  <button 
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-finance-charcoal/70 dark:text-white/70 text-sm"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? "Kache" : "Montre"}
                  </button>
                </div>
              </div>
              
              <Button type="submit" className="w-full mt-4">Chanje Modpas</Button>
            </form>
          </div>
          
          {/* 2FA Section */}
          <div className="finance-card p-6">
            <div className="flex items-start mb-4">
              <Smartphone className="h-6 w-6 mr-3 text-finance-blue" />
              <div>
                <h2 className="text-xl font-bold">Otantifikasyon De-Faktè (2FA)</h2>
                <p className="text-sm text-finance-charcoal/70 dark:text-white/70">Ajoute yon kouch sekirite anplis pou kont ou</p>
              </div>
            </div>
            
            <div className="space-y-6 mt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Estati 2FA</p>
                  <p className="text-sm text-finance-charcoal/70 dark:text-white/70">
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
              
              <Button 
                className="w-full" 
                variant={twoFactorEnabled ? "outline" : "default"}
                onClick={handleToggle2FA}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="animate-spin mr-2">◌</span>
                ) : null}
                {twoFactorEnabled ? "Dezaktive 2FA" : "Aktive 2FA"}
              </Button>
            </div>
          </div>
          
          {/* Biometric Authentication */}
          <div className="finance-card p-6">
            <div className="flex items-start mb-4">
              <Fingerprint className="h-6 w-6 mr-3 text-finance-blue" />
              <div>
                <h2 className="text-xl font-bold">Otantifikasyon Byometrik</h2>
                <p className="text-sm text-finance-charcoal/70 dark:text-white/70">Itilize anprent oswa rekonesans fasyal pou konekte</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-6">
              <div>
                <p className="font-medium">Aktive Otantifikasyon Byometrik</p>
                <p className="text-sm text-finance-charcoal/70 dark:text-white/70">Sa ap travay sèlman sou aparèy ki sipòte li</p>
              </div>
              <Switch 
                id="biometric-auth" 
                checked={biometricsEnabled}
                onCheckedChange={setBiometricsEnabled}
              />
            </div>
          </div>
          
          {/* Security Tabs for Sessions and Activities */}
          <div className="finance-card p-6">
            <div className="flex items-start mb-4">
              <Lock className="h-6 w-6 mr-3 text-finance-blue" />
              <div>
                <h2 className="text-xl font-bold">Aktivite Kont & Sesyon</h2>
                <p className="text-sm text-finance-charcoal/70 dark:text-white/70">Jere sesyon aktif yo epi verifye aktivite kont ou</p>
              </div>
            </div>
            
            <Tabs defaultValue="sessions" className="mt-6">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="sessions">Sesyon Aktif</TabsTrigger>
                <TabsTrigger value="activities">Istwa Aktivite</TabsTrigger>
              </TabsList>
              
              <TabsContent value="sessions" className="space-y-4">
                {activeSessions && activeSessions.length > 0 ? (
                  <>
                    <div className="space-y-4">
                      {activeSessions.map((session) => (
                        <div key={session.id} className="p-4 border border-finance-midGray/30 dark:border-white/10 rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{session.device_name}</p>
                              <p className="text-sm text-finance-charcoal/70 dark:text-white/70">
                                {session.location} • {formatDate(session.last_active)}
                              </p>
                            </div>
                            <div className="flex items-center">
                              {session.is_current ? (
                                <div className="flex items-center">
                                  <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                                  <span className="text-sm">Aktyèl</span>
                                </div>
                              ) : (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleTerminateSession(session.id)}
                                  disabled={isLoading}
                                >
                                  {isLoading ? (
                                    <span className="animate-spin mr-2">◌</span>
                                  ) : null}
                                  Fèmen Sesyon
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full mt-4" 
                      onClick={handleTerminateAllSessions}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="animate-spin mr-2">◌</span>
                      ) : null}
                      Fèmen Tout Lòt Sesyon
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-8 text-finance-charcoal/70 dark:text-white/70">
                    <p>Pa gen okenn sesyon aktif pou afiche.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="activities" className="space-y-4">
                {authActivities && authActivities.length > 0 ? (
                  <div className="space-y-4">
                    {authActivities.map((activity) => (
                      <div key={activity.id} className="p-4 border border-finance-midGray/30 dark:border-white/10 rounded-lg">
                        <div className="flex items-start">
                          <div className="mr-3 mt-1">
                            {getActivityIcon(activity.activity_type)}
                          </div>
                          <div>
                            <p className="font-medium">{activity.details}</p>
                            <div className="flex text-sm text-finance-charcoal/70 dark:text-white/70 space-x-4">
                              <span>{formatDate(activity.created_at)}</span>
                              {activity.device_info && <span>• {activity.device_info}</span>}
                              {activity.ip_address && <span>• {activity.ip_address}</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-finance-charcoal/70 dark:text-white/70">
                    <p>Pa gen okenn aktivite pou afiche.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      {/* Dialog de vérification OTP pour 2FA */}
      <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verifye 2FA</DialogTitle>
            <DialogDescription>
              Antre kòd OTP yo voye ba ou pou konfime aktivasyon 2FA.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="otp-code">Kòd OTP</Label>
              <Input 
                id="otp-code" 
                value={otpCode} 
                onChange={(e) => setOtpCode(e.target.value)} 
                placeholder="Antre kòd 6 chif" 
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Anile</Button>
            </DialogClose>
            <Button 
              onClick={handleVerify2FA} 
              disabled={!otpCode || otpCode.length !== 6 || isLoading}
            >
              {isLoading ? (
                <span className="animate-spin mr-2">◌</span>
              ) : null}
              Verifye
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default SecurityPage;
