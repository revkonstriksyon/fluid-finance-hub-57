
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, QrCode, Smartphone } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Auth2FADialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const Auth2FADialog = ({ isOpen, onOpenChange, onSuccess }: Auth2FADialogProps) => {
  const [verificationMethod, setVerificationMethod] = useState<'app' | 'sms'>('app');
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  // In a real application, we would verify against a real 2FA implementation
  // For demo purposes, we'll simulate verification with code "123456"
  const handleVerify = () => {
    setIsVerifying(true);
    
    // Simulate API call
    setTimeout(() => {
      if (code === '123456') {
        onSuccess();
        setCode('');
        setIsVerifying(false);
      } else {
        toast({
          title: "Verifikasyon Echwe",
          description: "Kòd OTP ou antre a pa bon. Tanpri eseye ankò.",
          variant: "destructive"
        });
        setIsVerifying(false);
      }
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      // Prevent closing if not verified
      if (!open) {
        toast({
          title: "Verifikasyon Obligatwa",
          description: "Ou dwe konplete verifikasyon 2FA pou kontinye.",
          variant: "destructive"
        });
      } else {
        onOpenChange(open);
      }
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Otantifikasyon 2FA</DialogTitle>
          <DialogDescription>
            Pou rezon sekirite, administratè dwe konplete verifikasyon 2FA anvan yo ka aksede sistèm nan.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="app" value={verificationMethod} onValueChange={(v) => setVerificationMethod(v as 'app' | 'sms')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="app">Google Authenticator</TabsTrigger>
            <TabsTrigger value="sms">SMS</TabsTrigger>
          </TabsList>
          
          <TabsContent value="app" className="space-y-4 mt-4">
            <div className="flex flex-col items-center justify-center space-y-4">
              <QrCode className="h-32 w-32 text-finance-blue p-2 border rounded-lg" />
              <p className="text-sm text-center text-muted-foreground">
                Eskane kòd QR sa avèk aplikasyon Google Authenticator epi antre kòd 6 chif la.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="sms" className="space-y-4 mt-4">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Smartphone className="h-16 w-16 text-finance-blue" />
              <p className="text-sm text-center text-muted-foreground">
                Yon kòd 6 chif te voye nan nimewo telefòn administratè a. Tanpri antre li anba a.
              </p>
            </div>
          </TabsContent>
          
          <div className="space-y-4 mt-4">
            <Input
              type="text"
              placeholder="Antre kòd 6 chif la"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={6}
              className="text-center text-lg"
            />
            
            <Button 
              onClick={handleVerify} 
              disabled={code.length !== 6 || isVerifying} 
              className="w-full"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifikasyon...
                </>
              ) : (
                'Verifye Kòd'
              )}
            </Button>
            
            <p className="text-xs text-center text-muted-foreground">
              Pou demonstrasyon, itilize kòd "123456"
            </p>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
