
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
import { useAuth } from "@/contexts/AuthContext";
import { Shield, Smartphone, Key, Fingerprint, Lock } from "lucide-react";
import PasswordGenerator from "@/components/auth/PasswordGenerator";
import { validatePasswordStrength } from "@/utils/passwordUtils";

const SecurityPage = () => {
  const { updatePassword, enable2FA, verify2FA, activeSessions, terminateSession, terminateAllSessions } = useAuth();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const passwordStrength = validatePasswordStrength(newPassword);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    
    if (newPassword !== confirmPassword) {
      setPasswordError("Modpas yo pa menm. Tanpri konfime modpas ou kòrèkteman.");
      return;
    }
    
    if (!passwordStrength.isValid) {
      setPasswordError(passwordStrength.feedback);
      return;
    }
    
    setIsLoading(true);
    try {
      const { error } = await updatePassword(currentPassword, newPassword);
      if (error) {
        setPasswordError(error.message || "Pa kapab chanje modpas. Tanpri eseye ankò.");
      } else {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error: any) {
      setPasswordError(error.message || "Pa kapab chanje modpas. Tanpri eseye ankò.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnable2FA = async (type: '2fa_sms' | '2fa_totp') => {
    try {
      await enable2FA(type);
    } catch (error) {
      console.error("Error enabling 2FA:", error);
    }
  };

  const handleVerify2FA = async (type: '2fa_sms' | '2fa_totp') => {
    try {
      await verify2FA(otpCode, type);
      setOtpCode("");
    } catch (error) {
      console.error("Error verifying 2FA:", error);
    }
  };

  const handleTerminateSession = async (sessionId: string) => {
    try {
      await terminateSession(sessionId);
    } catch (error) {
      console.error("Error terminating session:", error);
    }
  };

  const handleTerminateAllSessions = async () => {
    try {
      await terminateAllSessions();
    } catch (error) {
      console.error("Error terminating all sessions:", error);
    }
  };

  const handlePasswordGenerated = (password: string) => {
    setNewPassword(password);
    setConfirmPassword(password);
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
              {passwordError && (
                <div className="p-3 rounded bg-red-100 text-red-800 text-sm">
                  {passwordError}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="current-password">Modpas Aktyèl</Label>
                <div className="relative">
                  <Input 
                    id="current-password" 
                    type={showCurrentPassword ? "text" : "password"} 
                    placeholder="Antre modpas aktyèl ou"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
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
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex">
                    <PasswordGenerator 
                      onPasswordGenerated={handlePasswordGenerated} 
                      className="mr-2"
                    />
                    <button 
                      type="button"
                      className="text-finance-charcoal/70 dark:text-white/70 text-sm"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? "Kache" : "Montre"}
                    </button>
                  </div>
                </div>
                <div className="mt-1">
                  <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        passwordStrength.score === 0 ? 'bg-gray-200' :
                        passwordStrength.score === 1 ? 'bg-red-500' :
                        passwordStrength.score === 2 ? 'bg-orange-500' :
                        passwordStrength.score === 3 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${passwordStrength.score * 25}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-finance-charcoal/70 dark:text-white/70 mt-1">
                    {passwordStrength.feedback || "Modpas la dwe gen omwen 8 karaktè, ki gen ladan lèt miniskil, lèt majiskil, chif ak karaktè espesyal."}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Konfime Nouvo Modpas</Label>
                <div className="relative">
                  <Input 
                    id="confirm-password" 
                    type={showConfirmPassword ? "text" : "password"} 
                    placeholder="Konfime nouvo modpas"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
              
              <Button type="submit" className="w-full mt-4" disabled={isLoading}>
                {isLoading ? "Chanjman..." : "Chanje Modpas"}
              </Button>
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
                        <Input 
                          id="phone-number" 
                          placeholder="+509 ..." 
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={() => handleEnable2FA('2fa_sms')}>Konfime</Button>
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
                      <Input 
                        id="verification-code" 
                        placeholder="000000" 
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                      />
                    </div>
                    <DialogFooter>
                      <Button onClick={() => handleVerify2FA('2fa_totp')}>Verifye epi Aktive</Button>
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
              {activeSessions.map((session) => (
                <div key={session.id} className="p-4 border border-finance-midGray/30 dark:border-white/10 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{session.device_name} - {session.location}</p>
                      <p className="text-sm text-finance-charcoal/70 dark:text-white/70">
                        Dènye aktivite: {new Date(session.last_active).toLocaleString('fr-HT')}
                      </p>
                    </div>
                    {session.current ? (
                      <div className="flex items-center">
                        <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                        <span className="text-sm">Aktyèl</span>
                      </div>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleTerminateSession(session.id)}
                      >
                        Fèmen Sesyon
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={handleTerminateAllSessions}
            >
              Fèmen Tout Lòt Sesyon
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SecurityPage;
