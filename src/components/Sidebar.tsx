
import {
  LayoutDashboard,
  MessageSquare,
  Settings,
  TrendingUp,
  User,
  Users,
  CreditCard,
  HelpCircle,
  Wallet,
  Building2,
  Bell,
  Mail,
  File,
  LogOut,
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

export default function Sidebar() {
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      // Redirect to login if user is not authenticated
      navigate('/auth/login');
    }
  }, [user, navigate]);

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
    : '?';
  
  const sidebarLinks = [
    {
      title: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Profil",
      href: "/profile",
      icon: User,
    },
    {
      title: "Mesaj",
      href: "/messages",
      icon: MessageSquare,
    },
    {
      title: "Reglaj",
      href: "/settings",
      icon: Settings,
    },
    {
      title: "Kòmèsyal",
      href: "/trading",
      icon: TrendingUp,
    },
    {
      title: "Direktori Itilizatè",
      href: "/users-directory",
      icon: Users,
    },
  ];

  return (
    <div className="border-r flex h-full w-[280px] flex-col py-3">
      <div className="px-4 pb-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full rounded-md border bg-background p-4 text-sm font-medium shadow-sm transition-colors hover:bg-secondary/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={profile?.avatar_url || ""} />
                  <AvatarFallback className="bg-finance-blue text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="text-base font-semibold">{profile?.full_name || "Itilizatè"}</span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80" align="end" forceMount>
            <DropdownMenuLabel>Kont mwen</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigate('/profile')}>Profil</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')}>Reglaj</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Dekonekte</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex-1 space-y-1 px-2">
        {sidebarLinks.map((link) => (
          <NavLink
            key={link.href}
            to={link.href}
            className={({ isActive }) =>
              `group flex w-full items-center space-x-2 rounded-md p-2 text-sm font-medium hover:underline ${
                isActive
                  ? "font-bold text-finance-blue"
                  : "text-zinc-700 dark:text-zinc-400"
              }`
            }
          >
            <link.icon className="h-4 w-4" />
            <span>{link.title}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
