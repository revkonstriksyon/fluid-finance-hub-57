
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Users, Globe, Lock, Download, Trash2 } from "lucide-react";

const PrivacyPage = () => {
  const { toast } = useToast();

  const handleSaveChanges = () => {
    toast({
      title: "Paramèt Konfidansyalite Mete Ajou",
      description: "Chanjman yo anrejistre avèk siksè",
    });
  };

  const handleDataRequest = () => {
    toast({
      title: "Demann Done Soumèt",
      description: "Nou pral voye yon imèl bay ou ak done ou yo nan 24 èdtan.",
    });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Konfidansyalite</h1>
        
        <div className="space-y-6">
          {/* Profile Privacy */}
          <div className="finance-card p-6">
            <div className="flex items-start mb-6">
              <Eye className="h-6 w-6 mr-3 text-finance-blue" />
              <div>
                <h2 className="text-xl font-bold">Konfidansyalite Pwofil</h2>
                <p className="text-sm text-finance-charcoal/70 dark:text-white/70">Kontwole ki moun ki ka wè enfòmasyon ou</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Pwofil Piblik</p>
                  <p className="text-sm text-finance-charcoal/70 dark:text-white/70">Lè li aktive, nenpòt moun ka wè pwofil ou</p>
                </div>
                <Switch id="public-profile" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Montre Kote Ou Ye</p>
                  <p className="text-sm text-finance-charcoal/70 dark:text-white/70">Montre vil ou an sou pwofil ou</p>
                </div>
                <Switch id="show-location" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Montre Aktivite Finansye</p>
                  <p className="text-sm text-finance-charcoal/70 dark:text-white/70">Montre tranzaksyon piblik yo nan fil aktivite</p>
                </div>
                <Switch id="show-activity" />
              </div>
              
              <div className="space-y-2">
                <p className="font-medium">Ki moun ki ka wè pwofil ou?</p>
                <div className="flex items-center space-x-4">
                  <Button variant="outline" className="flex items-center space-x-2 flex-1 justify-start">
                    <Globe className="h-4 w-4" />
                    <span>Piblik</span>
                  </Button>
                  <Button variant="outline" className="flex items-center space-x-2 flex-1 justify-start bg-finance-blue/10 text-finance-blue dark:bg-finance-blue/20 dark:text-finance-lightBlue border-finance-blue/20">
                    <Users className="h-4 w-4" />
                    <span>Zanmi Sèlman</span>
                  </Button>
                  <Button variant="outline" className="flex items-center space-x-2 flex-1 justify-start">
                    <Lock className="h-4 w-4" />
                    <span>Prive</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Social Sharing */}
          <div className="finance-card p-6">
            <div className="flex items-start mb-6">
              <Users className="h-6 w-6 mr-3 text-finance-blue" />
              <div>
                <h2 className="text-xl font-bold">Pataj Sosyal</h2>
                <p className="text-sm text-finance-charcoal/70 dark:text-white/70">Kontwole kijan enfòmasyon ou pataje nan rezo sosyal</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Pataje Reyalizasyon</p>
                  <p className="text-sm text-finance-charcoal/70 dark:text-white/70">Pataje lè ou rive nan objektif finansye</p>
                </div>
                <Switch id="share-achievements" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Pataje Aktivite Jwèt</p>
                  <p className="text-sm text-finance-charcoal/70 dark:text-white/70">Pataje rezilta jwèt ak parye</p>
                </div>
                <Switch id="share-gaming" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Pataje Envèstisman</p>
                  <p className="text-sm text-finance-charcoal/70 dark:text-white/70">Pataje aktivite trading ak envèstisman</p>
                </div>
                <Switch id="share-investments" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Montre Non nan Pataj</p>
                  <p className="text-sm text-finance-charcoal/70 dark:text-white/70">Montre non ou lè ou pataje enfòmasyon</p>
                </div>
                <Switch id="show-name-in-sharing" defaultChecked />
              </div>
            </div>
          </div>
          
          {/* Blocked Accounts */}
          <div className="finance-card p-6">
            <div className="flex items-start mb-6">
              <EyeOff className="h-6 w-6 mr-3 text-finance-blue" />
              <div>
                <h2 className="text-xl font-bold">Kont Bloke</h2>
                <p className="text-sm text-finance-charcoal/70 dark:text-white/70">Jere itilizatè ou te bloke yo</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-finance-charcoal/70 dark:text-white/70">
                Itilizatè ou bloke yo pa kapab wè pwofil ou, voye w mesaj, oswa ajoute w kòm zanmi.
              </p>
              
              <div className="border border-finance-midGray/30 dark:border-white/10 rounded-lg">
                <div className="p-4 flex justify-between items-center border-b border-finance-midGray/30 dark:border-white/10">
                  <div className="font-medium">Marc Antoine</div>
                  <Button variant="outline" size="sm">Debloke</Button>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <div className="font-medium">Sophie Paul</div>
                  <Button variant="outline" size="sm">Debloke</Button>
                </div>
              </div>
              
              <p className="text-sm text-center text-finance-charcoal/70 dark:text-white/70">
                Ou gen 2 kont bloke
              </p>
            </div>
          </div>
          
          {/* Data Privacy */}
          <div className="finance-card p-6">
            <div className="flex items-start mb-6">
              <Lock className="h-6 w-6 mr-3 text-finance-blue" />
              <div>
                <h2 className="text-xl font-bold">Konfidansyalite Done</h2>
                <p className="text-sm text-finance-charcoal/70 dark:text-white/70">Jere done pèsonèl ou</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enskripsyon Analitik</p>
                  <p className="text-sm text-finance-charcoal/70 dark:text-white/70">Pèmèt nou amelyore eksperyans ou ak analitik</p>
                </div>
                <Switch id="analytics-tracking" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Koleksyon Done Pou Pèsonalizasyon</p>
                  <p className="text-sm text-finance-charcoal/70 dark:text-white/70">Pèmèt nou pèsonalize sijesyon yo pou ou</p>
                </div>
                <Switch id="personalization-data" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Pèmèt Cookies Tyès</p>
                  <p className="text-sm text-finance-charcoal/70 dark:text-white/70">Pèmèt cookies pati tyès pou fonksyonalite siplemantè</p>
                </div>
                <Switch id="third-party-cookies" />
              </div>
              
              <div className="pt-4 space-y-4 border-t border-finance-midGray/30 dark:border-white/10">
                <Button variant="outline" className="w-full flex justify-between" onClick={handleDataRequest}>
                  <span className="flex items-center">
                    <Download className="h-4 w-4 mr-2" />
                    Telechaje Done Mwen
                  </span>
                  <span className="text-xs bg-finance-lightGray/70 dark:bg-white/10 px-2 py-1 rounded">
                    24 èdtan
                  </span>
                </Button>
                
                <Button variant="outline" className="w-full flex items-center text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 border-red-200 dark:border-red-500/20">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Mande Sipresyon Kont
                </Button>
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

export default PrivacyPage;
