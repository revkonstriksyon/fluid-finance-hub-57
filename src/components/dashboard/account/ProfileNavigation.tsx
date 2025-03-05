
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { accountNavItems } from "./accountNavItems";
import { toast } from "@/components/ui/use-toast";

interface ProfileNavigationProps {
  handleLogout: (e: React.MouseEvent<HTMLAnchorElement>) => Promise<void>;
}

const ProfileNavigation = ({ handleLogout }: ProfileNavigationProps) => {
  return (
    <div className="space-y-2">
      {accountNavItems.map((item, index) => (
        <Link
          key={index}
          to={item.path}
          onClick={item.label === "Dekonekte" ? handleLogout : undefined}
          className="flex items-center w-full space-x-3 px-4 py-3 rounded-lg font-medium transition-colors hover:bg-finance-lightGray/50 dark:hover:bg-white/5 text-finance-charcoal dark:text-white/80"
        >
          <item.icon className="h-5 w-5" />
          <span>{item.label}</span>
        </Link>
      ))}
    </div>
  );
};

export default ProfileNavigation;
