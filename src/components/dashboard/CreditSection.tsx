
import { CreditCard, ShoppingBag, DollarSign, Clock, Percent } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const CreditSection = () => {
  // Sample credit data
  const availableCredit = 2500;
  const totalCredit = 5000;
  const utilizationRate = (availableCredit / totalCredit) * 100;
  
  const creditOptions = [
    { 
      id: 1, 
      title: "Prè Rapid", 
      description: "Jwenn lajan rapid ak enterè ki jis", 
      icon: Clock, 
      iconBg: "bg-finance-blue/20", 
      iconColor: "text-finance-blue",
      amount: "Jiska $2,000",
      term: "3-12 mwa"
    },
    { 
      id: 2, 
      title: "Acha an Tranch", 
      description: "Divize peman w pou pi bon kontwòl", 
      icon: ShoppingBag, 
      iconBg: "bg-finance-gold/20", 
      iconColor: "text-finance-gold",
      amount: "Jiska $3,500",
      term: "3-24 mwa"
    },
    { 
      id: 3, 
      title: "Prè Garanti", 
      description: "Itilize byen ou kòm garanti pou pi bon to", 
      icon: DollarSign, 
      iconBg: "bg-finance-success/20", 
      iconColor: "text-finance-success",
      amount: "Jiska $10,000",
      term: "12-60 mwa"
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="balance-card">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium text-white/90">Kredi Disponib</h3>
          <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium text-white">
            <Percent className="h-3 w-3 inline mr-1" />
            12.5% APR
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-3xl font-bold">${availableCredit}</h2>
          <p className="text-white/70 text-sm mt-1">Sou limit $5,000</p>
        </div>
        
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-white/80">Itilizasyon</span>
            <span className="text-white/80">{100 - Math.round(utilizationRate)}%</span>
          </div>
          <Progress value={utilizationRate} className="h-2 bg-white/20" />
        </div>
        
        <div className="flex space-x-2 mt-4">
          <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border-none">
            <CreditCard className="h-4 w-4 mr-2" />
            Fè Yon Acha
          </Button>
          <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border-none">
            <DollarSign className="h-4 w-4 mr-2" />
            Mande Prè
          </Button>
        </div>
      </div>
      
      <div className="finance-card">
        <h3 className="section-title mb-6">Opsyon Kredi Disponib</h3>
        
        <div className="grid md:grid-cols-3 gap-5">
          {creditOptions.map(option => (
            <div key={option.id} className="border border-finance-midGray/30 dark:border-white/10 rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className={`p-2 rounded-lg mr-3 ${option.iconBg}`}>
                  <option.icon className={`h-5 w-5 ${option.iconColor}`} />
                </div>
                <h4 className="font-medium">{option.title}</h4>
              </div>
              
              <p className="text-sm text-finance-charcoal/70 dark:text-white/70 mb-4">
                {option.description}
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-finance-charcoal/70 dark:text-white/70">Montan:</span>
                  <span className="text-sm font-medium">{option.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-finance-charcoal/70 dark:text-white/70">Tan:</span>
                  <span className="text-sm font-medium">{option.term}</span>
                </div>
              </div>
              
              <Button variant="outline" size="sm" className="w-full">
                Plis Detay
              </Button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="finance-card">
        <h3 className="section-title mb-0">Istwa Peman</h3>
        
        <div className="flex justify-between items-center py-3 border-b border-finance-midGray/30 dark:border-white/10">
          <div className="flex-1">
            <p className="font-medium text-sm">Deskripsyon</p>
          </div>
          <div className="flex-1 text-center">
            <p className="font-medium text-sm">Dat</p>
          </div>
          <div className="flex-1 text-right">
            <p className="font-medium text-sm">Montan</p>
          </div>
        </div>
        
        <div className="divide-y divide-finance-midGray/30 dark:divide-white/10">
          <div className="flex justify-between items-center py-4">
            <div className="flex-1">
              <p className="text-sm">Peman Mansyèl</p>
            </div>
            <div className="flex-1 text-center">
              <p className="text-sm">15 Jen, 2023</p>
            </div>
            <div className="flex-1 text-right">
              <p className="text-sm font-medium text-finance-success">$120.00</p>
            </div>
          </div>
          
          <div className="flex justify-between items-center py-4">
            <div className="flex-1">
              <p className="text-sm">Peman Mansyèl</p>
            </div>
            <div className="flex-1 text-center">
              <p className="text-sm">15 Me, 2023</p>
            </div>
            <div className="flex-1 text-right">
              <p className="text-sm font-medium text-finance-success">$120.00</p>
            </div>
          </div>
          
          <div className="flex justify-between items-center py-4">
            <div className="flex-1">
              <p className="text-sm">Peman Mansyèl</p>
            </div>
            <div className="flex-1 text-center">
              <p className="text-sm">15 Avril, 2023</p>
            </div>
            <div className="flex-1 text-right">
              <p className="text-sm font-medium text-finance-success">$120.00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditSection;
