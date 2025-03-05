
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from "@/components/ui/badge";
import { BanknoteIcon, Smartphone, QrCode } from 'lucide-react';

const BankConnection = () => {
  const { toast } = useToast();

  // Link bank via Plaid
  const handleLinkBank = () => {
    toast({
      title: "Fonksyon pako disponib",
      description: "Entegrasyon ak lòt bank ap disponib byento.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Konekte ak Bank Ou</CardTitle>
        <CardDescription>Ajoute lòt kont bank ou yo pou transfè pi fasil</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="border rounded-lg p-6 text-center space-y-4">
          <BanknoteIcon className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="font-medium text-lg">Konekte ak Lòt Bank</h3>
          <p className="text-sm text-muted-foreground">
            Konekte ak kont bank ou yo nan lòt enstitisyon finansye pou w ka wè tout finansman ou yo nan yon sèl kote.
          </p>
          <Button onClick={handleLinkBank}>Konekte Kont Bank</Button>
        </div>
        
        <div className="border rounded-lg p-6">
          <h3 className="font-medium mb-2">Metòd Transfè</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 border rounded">
              <div className="flex items-center">
                <Smartphone className="h-5 w-5 mr-2 text-primary" />
                <span>Transfè Mobil</span>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                Aktif
              </Badge>
            </div>
            <div className="flex items-center justify-between p-2 border rounded">
              <div className="flex items-center">
                <QrCode className="h-5 w-5 mr-2 text-muted-foreground" />
                <span>Transfè pa QR</span>
              </div>
              <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
                Byento
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BankConnection;
