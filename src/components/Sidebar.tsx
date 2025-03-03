
import { Home, CreditCard, Banknote, BarChart3, User, DollarSign, GamepadIcon, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const menuItems = [
    { icon: Banknote, label: 'My Bank', active: true },
    { icon: CreditCard, label: 'Kredi' },
    { icon: GamepadIcon, label: 'Jeu & Pari' },
    { icon: BarChart3, label: 'Trading & Bous' },
    { icon: User, label: 'Mon Compte' },
  ];

  return (
    <div 
      className={cn(
        "fixed inset-y-0 left-0 z-20 w-64 bg-white dark:bg-finance-navy/90 border-r border-finance-midGray/30 dark:border-white/10 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-finance-midGray/30 dark:border-white/10">
        <div className="flex items-center space-x-2">
          <DollarSign className="h-6 w-6 text-finance-gold" />
          <span className="font-bold text-finance-charcoal dark:text-white">Fluid Finance</span>
        </div>
        <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <nav className="p-4 space-y-2">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={cn(
              "flex items-center w-full space-x-3 px-4 py-3 rounded-lg font-medium transition-colors",
              item.active 
                ? "bg-finance-blue/10 text-finance-blue dark:bg-finance-blue/20 dark:text-finance-lightBlue" 
                : "text-finance-charcoal dark:text-white/80 hover:bg-finance-midGray/20 dark:hover:bg-white/10"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
