
import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { 
  AlertTriangle, 
  Smartphone, 
  Mail, 
  Bell, 
  Lock, 
  Shield, 
  Eye, 
  EyeOff 
} from 'lucide-react';

interface SecuritySettingsProps {
  user: User | null;
}

const SecuritySettings = ({ user }: SecuritySettingsProps) => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loginNotificationEnabled, setLoginNotificationEnabled] = useState(true);
  const [paymentNotificationEnabled, setPaymentNotificationEnabled] = useState(true);
  const [transferNotificationEnabled, setTransferNotificationEnabled] = useState(true);
  const [verificationCode, setVerificationCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || '');
  const [showingTotpSetup, setShowingTotpSetup] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  
  const { toast } = useToast();

  // Enable 2FA with TOTP
  const handleEnable2FA = () => {
    // In a real app, this would generate a TOTP secret
    // For the demo, we'll just show a simulated setup
    setShowingTotpSetup(true);
    
    toast({
      title: "Fonksyon pako disponib",
      description: "Sekirite 2FA ap disponib byento.",
    });
  };

  // Verify 2FA setup
  const handleVerify2FA = () => {
    if (!verificationCode.trim()) {
      toast({
        title: "Erè verifikasyon",
        description: "Tanpri antre kòd verifikasyon an.",
        variant: "destructive"
      });
      return;
    }
    
    // Simulate verification
    setTimeout(() => {
      setTwoFactorEnabled(true);
      setShowingTotpSetup(false);
      setVerificationCode('');
      
      toast({
        title: "2FA Aktive",
        description: "Verifikasyon de-faktè aktive avèk siksè.",
      });
    }, 1000);
  };

  // Update phone number
  const handleUpdatePhone = async () => {
    if (!phoneNumber.trim()) {
      toast({
        title: "Erè mizajou",
        description: "Tanpri antre yon nimewo telefòn valid.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // In a real app, you would update the user's phone with verification
      // For the demo, we'll just show a success message
      
      setTimeout(() => {
        toast({
          title: "Nimewo telefòn aktyalize",
          description: "Nimewo telefòn ou aktyalize avèk siksè.",
        });
      }, 1000);
    } catch (error: any) {
      toast({
        title: "Erè mizajou",
        description: error.message || "Pa kapab mete ajou nimewo telefòn. Tanpri eseye ankò.",
        variant: "destructive"
      });
    }
  };

  // Update password
  const handleUpdatePassword = async () => {
    if (!currentPassword.trim()) {
      toast({
        title: "Erè mizajou",
        description: "Tanpri antre modpas aktyèl ou.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // In a real app, you would update the user's password with verification
      // For the demo, we'll just show a success message
      
      setTimeout(() => {
        setCurrentPassword('');
        toast({
          title: "Fonksyon pako disponib",
          description: "Chanjman modpas ap disponib byento.",
        });
      }, 1000);
    } catch (error: any) {
      toast({
        title: "Erè mizajou",
        description: error.message || "Pa kapab mete ajou modpas. Tanpri eseye ankò.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="mr-2 h-5 w-5" />
              Verifikasyon De-Faktè (2FA)
            </CardTitle>
            <CardDescription>
              Ajoute yon kouch sekirite siplemantè pou kont ou
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!twoFactorEnabled && !showingTotpSetup ? (
              <div className="space-y-4">
                <div className="p-4 bg-amber-50 rounded-md flex items-start">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-800">2FA Pa Aktive</h4>
                    <p className="text-sm text-amber-700">
                      Kont ou pa pwoteje ak verifikasyon de-faktè. Nou rekòmande w aktive fonksyon sa a pou sekirite maksimal.
                    </p>
                  </div>
                </div>
                <Button onClick={handleEnable2FA} className="w-full">
                  Aktive 2FA
                </Button>
              </div>
            ) : showingTotpSetup ? (
              <div className="space-y-4">
                <div className="border rounded-md p-4 text-center space-y-4">
                  <img 
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKQAAACkCAYAAAAZtYVBAAAAAklEQVR4AewaftIAAAOqSURBVO3BQY7cQAwEwSxC//9yeo88NSBIs1trecQfWOM0rLEK1lgFa6yCNVbBGqtgjVWwxipYYxWssQrWWAVrrII1VsEaq2CNVbDGKvjwkMlvqnJCMqlypnKHyYnKCclvqvLEGqtgjVWwxir48DKVt5i8QeWE5C0qJyqTKr9J5S0mb1hjFayxCtZYBR++TOSNKm9QuUPkhGRSpVHp6pw58z9YYxWssQrWWAUf/jMqJ1VORCZVTlROVE7+JWusgjVWwRqr4MPfTOWkyonICcmkyonIC1T+JWusgjVWwRqr4MPLVLahckLyhiolkyonKtsk31hjFayxCtZYBR8eUvkbqZyQ3KFyQvIOlf+TNVbBGqtgjVXw4SV/M5VO5aTKCUmj0pLcofKEyidrrII1VsEaq+DDQypvUTkhOVGZVCaVRuVE5S0iJypvUXlijVWwxipYYxX4g4dEOrq7RE5UTlS6u0Q6lUnlhOSE5Ik1VsEaq2CNVfDhIZU7VE5UzkSaKlNL5w6TO9791++sErDGKlhjFayx8AcPiLxBZVKZVBqRO1QakZMqk8gJyaTyRJWOdoE1VsEaq2CNVfDhIZETlTtUGpVJpSPSqEwqjcoJSaNyh0qj0qjcoTKpPLHGKlhjFayxCvzBF4m8QeWTKt1dPdmk8oTIHVWmluyCNVbBGqtgjVXw4StMTlQalROVRqWrMnV3j1RZvMYaq2CNVbDGKvCDh0ROVBqVE5VJpVFpqkwdnTOVT0g6lTtE3qDyxBqrYI1VsMYq+PBllW5U6aqdidyhcqLSqTQqJySTSqNyQvJNa6yCNVbBGqvAH3yRyB0qJySTyidVJpVO5USk6+7u6p5UeWKNVbDGKlhjFXz4ZSpvEelUGpVJpaPT3TUincoJySTSqDQiJ1WeWGMVrLEK1lgFHx5S+U0iJyonIo1Ko9KoNCrNXe9Q+aTKE2usgjVWwRqrwB88IHKH5C0qjcgdKo1Io9KoNCqdyiTyjSpPrLEK1lgFa6yCDy9TeYvJicoJySdVmruaKo3IJHJSZVLpVJ5YYxWssQrWWAUfvkzkjSp3qDQqT0galadUJpVO5YTkE9ZYBWusgjVWwYf/jEqj0og0Ko3KicgdKo1Ko9JVmVTuUHlijVWwxipYYxV8+JupNCqdSqPSqHQqk0qj0ql0Ko1KI9KonKh0VZ5YYxWssQrWWAUfXqbym0QalUbkhMqJyDdUOZFs1lgFa6yCNVbBh4dMflOVE5IOTqo0Ko1KI9KITCqTyhtVnlhjFayxCtZYBf5gjdOwxipYYxWssQrWWAVrrII1VsEaq2CNVbDGKlhjFayxCtZYBWusgjVWwRqr4F/VUi6M1LET8QAAAABJRU5ErkJggg=="
                    alt="QR Code for 2FA setup"
                    className="mx-auto h-32 w-32"
                  />
                  <p className="text-sm text-muted-foreground">
                    Skane kòd QR sa a ak aplikasyon otantifikasyon ou 
                    (Google Authenticator, Authy, etc.) epi antre kòd verifikasyon an anba a.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="verification-code">Kòd Verifikasyon</Label>
                  <Input
                    id="verification-code"
                    placeholder="Antre kòd 6-chif la"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={handleVerify2FA} className="flex-1">
                    Verifye ak Aktive
                  </Button>
                  <Button onClick={() => setShowingTotpSetup(false)} variant="outline" className="flex-1">
                    Anile
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-md flex items-start">
                  <Shield className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-800">2FA Aktif</h4>
                    <p className="text-sm text-green-700">
                      Kont ou pwoteje ak verifikasyon de-faktè. Tout koneksyon ak transfè yo ap egzije yon kòd verifikasyon.
                    </p>
                  </div>
                </div>
                <Button onClick={() => setTwoFactorEnabled(false)} variant="outline" className="w-full">
                  Dezaktive 2FA
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Notifikasyon Sekirite
            </CardTitle>
            <CardDescription>
              Kontrole kijan ou resevwa notifikasyon sekirite yo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Notifikasyon Koneksyon</Label>
                <p className="text-sm text-muted-foreground">
                  Resevwa yon notifikasyon chak fwa gen koneksyon nan kont ou
                </p>
              </div>
              <Switch
                checked={loginNotificationEnabled}
                onCheckedChange={setLoginNotificationEnabled}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Notifikasyon Peman</Label>
                <p className="text-sm text-muted-foreground">
                  Resevwa yon notifikasyon chak fwa gen yon peman nan kont ou
                </p>
              </div>
              <Switch
                checked={paymentNotificationEnabled}
                onCheckedChange={setPaymentNotificationEnabled}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Notifikasyon Transfè</Label>
                <p className="text-sm text-muted-foreground">
                  Resevwa yon notifikasyon chak fwa gen yon transfè lajan
                </p>
              </div>
              <Switch
                checked={transferNotificationEnabled}
                onCheckedChange={setTransferNotificationEnabled}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Smartphone className="mr-2 h-5 w-5" />
              Nimewo Telefòn
            </CardTitle>
            <CardDescription>
              Mete ajou nimewo telefòn ki asosye ak kont ou
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone-number">Nimewo Telefòn</Label>
              <Input
                id="phone-number"
                placeholder="+509 XXXX XXXX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <Button onClick={handleUpdatePhone} className="w-full">
              Mete Ajou Nimewo Telefòn
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="mr-2 h-5 w-5" />
              Modpas
            </CardTitle>
            <CardDescription>
              Chanje modpas kont ou
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Modpas Aktyèl</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button onClick={handleUpdatePassword} className="w-full">
              Chanje Modpas
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SecuritySettings;
