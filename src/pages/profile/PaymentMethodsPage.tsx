
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { 
  CreditCard, Landmark, Plus, Trash2, Edit, Phone, Shield, CheckCircle 
} from "lucide-react";
import { useState } from "react";

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'mobile';
  name: string;
  details: string;
  isDefault: boolean;
  expiryDate?: string;
  icon: React.ElementType;
}

const PaymentMethodsPage = () => {
  const { toast } = useToast();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      name: 'Visa se termine par 4582',
      details: 'Ekpire 09/2025',
      isDefault: true,
      expiryDate: '09/2025',
      icon: CreditCard
    },
    {
      id: '2',
      type: 'bank',
      name: 'Sogebank',
      details: '****6789',
      isDefault: false,
      icon: Landmark
    },
    {
      id: '3',
      type: 'mobile',
      name: 'Mon Cash',
      details: '+509 34****90',
      isDefault: false,
      icon: Phone
    }
  ]);

  const handleSetDefault = (id: string) => {
    setPaymentMethods(methods => 
      methods.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    );
    
    toast({
      title: "Metòd Peman Default",
      description: "Metòd peman default chanje avèk siksè",
    });
  };

  const handleDeletePaymentMethod = (id: string) => {
    setPaymentMethods(methods => methods.filter(method => method.id !== id));
    
    toast({
      title: "Metòd Peman Efase",
      description: "Metòd peman efase avèk siksè",
    });
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would process the card details securely
    // Here we'll just simulate adding a new card
    const newCard: PaymentMethod = {
      id: Date.now().toString(),
      type: 'card',
      name: 'Mastercard se termine par 0000',
      details: 'Ekpire 12/2028',
      isDefault: false,
      expiryDate: '12/2028',
      icon: CreditCard
    };
    
    setPaymentMethods(methods => [...methods, newCard]);
    
    toast({
      title: "Kat Ajoute",
      description: "Nouvo kat ajoute avèk siksè",
    });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Metòd Peman</h1>
        
        <div className="space-y-6">
          {/* Payment Methods List */}
          <div className="finance-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Metòd Peman Ou Yo</h2>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="flex items-center">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajoute Nouvo
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Ajoute Nouvo Kat</DialogTitle>
                    <DialogDescription>
                      Antre enfòmasyon kat ou pou ajoute li nan kont ou.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleAddCard} className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="card-number">Nimewo Kat</Label>
                      <Input id="card-number" placeholder="0000 0000 0000 0000" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Dat Ekspirasyon</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="000" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="card-name">Non sou Kat la</Label>
                      <Input id="card-name" placeholder="John Doe" />
                    </div>
                    
                    <DialogFooter>
                      <Button type="submit" className="w-full mt-2">Ajoute Kat</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div 
                  key={method.id}
                  className="p-4 border border-finance-midGray/30 dark:border-white/10 rounded-lg flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      method.type === 'card' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                      method.type === 'bank' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                      'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                    }`}>
                      <method.icon className="h-5 w-5" />
                    </div>
                    
                    <div>
                      <div className="flex items-center">
                        <p className="font-medium">{method.name}</p>
                        {method.isDefault && (
                          <span className="ml-2 text-xs bg-finance-blue/10 text-finance-blue dark:bg-finance-blue/20 dark:text-finance-lightBlue px-2 py-0.5 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-finance-charcoal/70 dark:text-white/70">{method.details}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {!method.isDefault && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleSetDefault(method.id)}
                      >
                        Mete kòm Default
                      </Button>
                    )}
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Modifye {method.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label>Non</Label>
                            <Input defaultValue={method.name.split(' se termine par ')[0]} />
                          </div>
                          {method.expiryDate && (
                            <div className="space-y-2">
                              <Label>Dat Ekspirasyon</Label>
                              <Input defaultValue={method.expiryDate} />
                            </div>
                          )}
                        </div>
                        <DialogFooter>
                          <Button className="w-full">Sove Chanjman yo</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                      onClick={() => handleDeletePaymentMethod(method.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Payment Security */}
          <div className="finance-card p-6">
            <div className="flex items-start mb-6">
              <Shield className="h-6 w-6 mr-3 text-finance-blue" />
              <div>
                <h2 className="text-xl font-bold">Sekirite Peman</h2>
                <p className="text-sm text-finance-charcoal/70 dark:text-white/70">Pwoteje enfòmasyon peman ou</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Ankriptaj PCI DSS</p>
                  <p className="text-sm text-finance-charcoal/70 dark:text-white/70">
                    Tout enfòmasyon kat kredi ou ankripte avèk estanda PCI DSS.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Otantifikasyon 3D Secure</p>
                  <p className="text-sm text-finance-charcoal/70 dark:text-white/70">
                    Tranzaksyon ou yo pwoteje ak otantifikasyon siplemantè.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Notifikasyon an Tan Reyèl</p>
                  <p className="text-sm text-finance-charcoal/70 dark:text-white/70">
                    Resevwa alèt imedyatman pou chak tranzaksyon.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Billing Address */}
          <div className="finance-card p-6">
            <h2 className="text-xl font-bold mb-6">Adrès Faktiration</h2>
            
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="street-address">Adrès</Label>
                  <Input id="street-address" defaultValue="123 Ri Capois" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="city">Vil</Label>
                  <Input id="city" defaultValue="Port-au-Prince" />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="state">Depatman</Label>
                  <Input id="state" defaultValue="Ouest" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="zip">Kòd Postal</Label>
                  <Input id="zip" defaultValue="HT6110" />
                </div>
              </div>
            </div>
            
            <Button className="mt-6">Mete Ajou Adrès</Button>
          </div>
          
          {/* Recent Transactions */}
          <div className="finance-card p-6">
            <h2 className="text-xl font-bold mb-6">Dènye Tranzaksyon</h2>
            
            <div className="space-y-4">
              <div className="border border-finance-midGray/30 dark:border-white/10 rounded-lg">
                <div className="p-4 border-b border-finance-midGray/30 dark:border-white/10">
                  <div className="flex justify-between mb-2">
                    <p className="font-medium">Presto Market</p>
                    <p className="font-semibold">1,250 HTG</p>
                  </div>
                  <div className="flex justify-between text-sm text-finance-charcoal/70 dark:text-white/70">
                    <p>26 Out 2023</p>
                    <p>Visa **** 4582</p>
                  </div>
                </div>
                
                <div className="p-4 border-b border-finance-midGray/30 dark:border-white/10">
                  <div className="flex justify-between mb-2">
                    <p className="font-medium">Netflix</p>
                    <p className="font-semibold">650 HTG</p>
                  </div>
                  <div className="flex justify-between text-sm text-finance-charcoal/70 dark:text-white/70">
                    <p>20 Out 2023</p>
                    <p>Visa **** 4582</p>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between mb-2">
                    <p className="font-medium">Digicel</p>
                    <p className="font-semibold">500 HTG</p>
                  </div>
                  <div className="flex justify-between text-sm text-finance-charcoal/70 dark:text-white/70">
                    <p>15 Out 2023</p>
                    <p>Mon Cash</p>
                  </div>
                </div>
              </div>
              
              <Button variant="outline" className="w-full">Wè Tout Tranzaksyon</Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentMethodsPage;
