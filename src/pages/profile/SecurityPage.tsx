
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Shield, Smartphone, Key, Fingerprint, Lock } from "lucide-react";

const SecurityPage = () => {
  const { toast } = useToast();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Modpas Chanje",
      description: "Modpas ou te chanje avèk siksè",
    });
  };

  const handleEnable2FA = () => {
    toast({
      title: "2FA Aktive",
      description: "Otantifikasyon de-faktè aktive avèk siksè",
    });
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
                  <p className="font-medium">SMS 2FA</p>
                  <p className="text-sm text-finance-charcoal/70 dark:text-white/70">Resevwa kòd otantifikasyon nan telefòn ou</p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Aktive</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Aktive 2FA pa SMS</DialogTitle>
                      <DialogDescription>
                        Antre nimewo telefòn ou pou resevwa kòd otantifikasyon.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone-number">Nimewo Telefòn</Label>
                        <Input id="phone-number" placeholder="+509 ..." />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleEnable2FA}>Konfime</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Aplikasyon Otantifikatè</p>
                  <p className="text-sm text-finance-charcoal/70 dark:text-white/70">Itilize yon aplikasyon tankou Google Authenticator</p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Aktive</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Aktive Aplikasyon Otantifikatè</DialogTitle>
                      <DialogDescription>
                        Eskane kòd QR la avèk aplikasyon otantifikatè ou a.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-center py-4">
                      <div className="bg-white p-2 rounded-lg">
                        <div className="h-48 w-48 bg-gray-200 flex items-center justify-center">
                          <p className="text-gray-400 text-center">QR Code ta parèt la</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="verification-code">Antre Kòd Verifikasyon</Label>
                      <Input id="verification-code" placeholder="000000" />
                    </div>
                    <DialogFooter>
                      <Button onClick={handleEnable2FA}>Verifye epi Aktive</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
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
              <Switch id="biometric-auth" />
            </div>
          </div>
          
          {/* Security Alerts */}
          <div className="finance-card p-6">
            <div className="flex items-start mb-4">
              <Shield className="h-6 w-6 mr-3 text-finance-blue" />
              <div>
                <h2 className="text-xl font-bold">Alèt Sekirite</h2>
                <p className="text-sm text-finance-charcoal/70 dark:text-white/70">Jere notifikasyon pou aktivite sispèk yo</p>
              </div>
            </div>
            
            <div className="space-y-6 mt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Alèt pou Koneksyon Nouvo Aparèy</p>
                  <p className="text-sm text-finance-charcoal/70 dark:text-white/70">Resevwa notifikasyon lè ou konekte sou yon nouvo aparèy</p>
                </div>
                <Switch id="new-device-alerts" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Alèt pou Chanjman Modpas</p>
                  <p className="text-sm text-finance-charcoal/70 dark:text-white/70">Resevwa notifikasyon lè modpas ou chanje</p>
                </div>
                <Switch id="password-change-alerts" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Alèt pou Gwo Tranzaksyon</p>
                  <p className="text-sm text-finance-charcoal/70 dark:text-white/70">Resevwa notifikasyon pou tranzaksyon ki pi gwo pase limit ou</p>
                </div>
                <Switch id="large-transaction-alerts" defaultChecked />
              </div>
            </div>
          </div>
          
          {/* Active Sessions */}
          <div className="finance-card p-6">
            <div className="flex items-start mb-4">
              <Lock className="h-6 w-6 mr-3 text-finance-blue" />
              <div>
                <h2 className="text-xl font-bold">Sesyon Aktif</h2>
                <p className="text-sm text-finance-charcoal/70 dark:text-white/70">Wè epi jere aparèy ki konekte nan kont ou</p>
              </div>
            </div>
            
            <div className="space-y-4 mt-6">
              <div className="p-4 border border-finance-midGray/30 dark:border-white/10 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">iPhone 12 - Port-au-Prince</p>
                    <p className="text-sm text-finance-charcoal/70 dark:text-white/70">Dènye aktivite: Jodi a, 10:25 AM</p>
                  </div>
                  <div className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                    <span className="text-sm">Aktyèl</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border border-finance-midGray/30 dark:border-white/10 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">MacBook Pro - Port-au-Prince</p>
                    <p className="text-sm text-finance-charcoal/70 dark:text-white/70">Dènye aktivite: Yè, 6:30 PM</p>
                  </div>
                  <Button variant="outline" size="sm">Fèmen Sesyon</Button>
                </div>
              </div>
              
              <div className="p-4 border border-finance-midGray/30 dark:border-white/10 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Windows PC - Jacmel</p>
                    <p className="text-sm text-finance-charcoal/70 dark:text-white/70">Dènye aktivite: 3 jou pase</p>
                  </div>
                  <Button variant="outline" size="sm">Fèmen Sesyon</Button>
                </div>
              </div>
            </div>
            
            <Button variant="outline" className="w-full mt-4">Fèmen Tout Lòt Sesyon</Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SecurityPage;
