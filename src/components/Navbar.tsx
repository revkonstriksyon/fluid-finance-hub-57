
import { useState } from 'react';
import { Menu, X, Moon, Sun, User, Bell } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Navbar = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const [darkMode, setDarkMode] = useState(false);
  const { toast } = useToast();
  
  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
    setDarkMode(!darkMode);
  };
  
  const showNotification = () => {
    toast({
      title: "Notifikasyon yo",
      description: "Ou pa gen okenn notifikasyon nouvo pou kounye a.",
    });
  };

  return (
    <nav className="glass-card z-10 sticky top-4 mx-4 px-4 py-3 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-finance-blue font-bold">Fluid</span>
          <span className="text-finance-gold font-bold">Finance</span>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        <Button variant="ghost" size="icon" onClick={showNotification}>
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
