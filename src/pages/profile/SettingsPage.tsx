
import Layout from "@/components/Layout";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const SettingsPage = () => {
  const { toast } = useToast();

  const handleSaveChanges = () => {
    toast({
      title: "Paramèt yo mete ajou",
      description: "Chanjman yo anrejistre avèk siksè",
    });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Paramèt</h1>
        
        <div className="space-y-6">
          {/* General Settings */}
          <div className="finance-card p-6">
            <h2 className="text-xl font-bold mb-4">Paramèt Jeneral</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="language" className="text-base">Lang</Label>
                  <p className="text-sm text-finance-charcoal/70 dark:text-white/70">Chwazi lang ou vle itilize nan aplikasyon an</p>
                </div>
                <Select defaultValue="kreyol">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Chwazi lang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kreyol">Kreyòl Ayisyen</SelectItem>
                    <SelectItem value="francais">Français</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="theme" className="text-base">Tèm</Label>
                  <p className="text-sm text-finance-charcoal/70 dark:text-white/70">Chwazi ant tèm klè ak tèm sonm</p>
                </div>
                <Select defaultValue="auto">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Chwazi tèm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Klè</SelectItem>
                    <SelectItem value="dark">Sonm</SelectItem>
                    <SelectItem value="auto">Otomatik</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="currency" className="text-base">Lajan</Label>
                  <p className="text-sm text-finance-charcoal/70 dark:text-white/70">Lajan ou vle itilize kòm default</p>
                </div>
                <Select defaultValue="htg">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Chwazi lajan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="htg">Gourde (HTG)</SelectItem>
                    <SelectItem value="usd">Dollar (USD)</SelectItem>
                    <SelectItem value="eur">Euro (EUR)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {/* Notification Settings */}
          <div className="finance-card p-6">
            <h2 className="text-xl font-bold mb-4">Notifikasyon</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications" className="text-base">Notifikasyon Imèl</Label>
                  <p className="text-sm text-finance-charcoal/70 dark:text-white/70">Resevwa notifikasyon atravè imèl</p>
                </div>
                <Switch id="email-notifications" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sms-notifications" className="text-base">Notifikasyon SMS</Label>
                  <p className="text-sm text-finance-charcoal/70 dark:text-white/70">Resevwa notifikasyon atravè mesaj tèks</p>
                </div>
                <Switch id="sms-notifications" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-notifications" className="text-base">Notifikasyon Push</Label>
                  <p className="text-sm text-finance-charcoal/70 dark:text-white/70">Resevwa notifikasyon push sou aparèy ou</p>
                </div>
                <Switch id="push-notifications" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="transaction-notifications" className="text-base">Notifikasyon Tranzaksyon</Label>
                  <p className="text-sm text-finance-charcoal/70 dark:text-white/70">Resevwa notifikasyon pou chak tranzaksyon</p>
                </div>
                <Switch id="transaction-notifications" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="marketing-notifications" className="text-base">Notifikasyon Maketing</Label>
                  <p className="text-sm text-finance-charcoal/70 dark:text-white/70">Resevwa dènye nouvèl ak pwomosyon</p>
                </div>
                <Switch id="marketing-notifications" />
              </div>
            </div>
          </div>
          
          {/* Advanced Settings */}
          <div className="finance-card p-6">
            <h2 className="text-xl font-bold mb-4">Paramèt Avanse</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-logout" className="text-base">Dekoneksyon Otomatik</Label>
                  <p className="text-sm text-finance-charcoal/70 dark:text-white/70">Dekonekte w otomatikman apre inaktivite</p>
                </div>
                <Switch id="auto-logout" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="timeout" className="text-base">Tan Inaktivite</Label>
                  <p className="text-sm text-finance-charcoal/70 dark:text-white/70">Tan inaktivite anvan dekoneksyon otomatik</p>
                </div>
                <Select defaultValue="15">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Chwazi tan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 minit</SelectItem>
                    <SelectItem value="15">15 minit</SelectItem>
                    <SelectItem value="30">30 minit</SelectItem>
                    <SelectItem value="60">60 minit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="data-sync" className="text-base">Senkronizasyon Done</Label>
                  <p className="text-sm text-finance-charcoal/70 dark:text-white/70">Pèmèt senkronizasyon done ant aparèy yo</p>
                </div>
                <Switch id="data-sync" defaultChecked />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button variant="outline">Anile</Button>
            <Button onClick={handleSaveChanges}>Sove Chanjman yo</Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
