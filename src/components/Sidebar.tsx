
import { Home, CreditCard, Banknote, BarChart3, User, DollarSign, GamepadIcon, X, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const { signOut } = useAuth();
  
  const menuItems = [
    { icon: Banknote, label: 'My Bank', path: '/', active: true },
    { icon: CreditCard, label: 'Kredi', path: '/' },
    { icon: GamepadIcon, label: 'Jeu & Pari', path: '/' },
    { icon: BarChart3, label: 'Trading & Bous', path: '/trading' },
    { icon: User, label: 'Mon Compte', path: '/profile' },
  ];

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div 
      className={cn(
        "fixed inset-y-0 left-0 z-20 w-64 bg-white dark:bg-[#34495e]/90 border-r border-finance-midGray/30 dark:border-white/10 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-finance-midGray/30 dark:border-white/10">
        <div className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/673f9295-ff75-48af-b8f9-f19af98b5360.png" 
            alt="EBOUS Logo" 
            className="h-8" 
          />
          <span className="font-bold text-[#E8AF35]">E</span>
          <span className="font-bold text-[#34495e] dark:text-white">BOUS</span>
        </div>
        <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <nav className="p-4 space-y-2">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={cn(
              "flex items-center w-full space-x-3 px-4 py-3 rounded-lg font-medium transition-colors",
              item.active 
                ? "bg-[#34495e]/10 text-[#34495e] dark:bg-[#34495e]/20 dark:text-[#a3c6dd]" 
                : "text-finance-charcoal dark:text-white/80 hover:bg-finance-midGray/20 dark:hover:bg-white/10"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        ))}

        <button
          onClick={handleLogout}
          className="flex items-center w-full space-x-3 px-4 py-3 rounded-lg font-medium transition-colors text-finance-charcoal dark:text-white/80 hover:bg-finance-midGray/20 dark:hover:bg-white/10"
        >
          <LogOut className="h-5 w-5" />
          <span>Dekonekte</span>
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
