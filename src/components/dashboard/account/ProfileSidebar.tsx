
import { User, MessageSquare, Bell, Settings, Shield, Lock, CreditCard, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

interface ProfileSidebarProps {
  userData?: {
    name: string;
    username: string;
    profilePic: string;
    joinedDate: string;
    location: string;
    bio: string;
  };
}

const accountNavItems = [
  { icon: User, label: "Pwofil", path: "/profile" },
  { icon: MessageSquare, label: "Mesaj", path: "/messages" },
  { icon: Bell, label: "Notifikasyon", path: "/" },
  { icon: Settings, label: "Paramèt", path: "/settings" },
  { icon: Shield, label: "Sekirite", path: "/security" },
  { icon: Lock, label: "Konfidansyalite", path: "/privacy" },
  { icon: CreditCard, label: "Metòd Peman", path: "/payment-methods" },
  { icon: LogOut, label: "Dekonekte", path: "/" },
];

const ProfileSidebar = ({ userData }: ProfileSidebarProps) => {
  const { profile, userLoading, signOut } = useAuth();

  const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    await signOut();
  };

  // Use profile data if available, otherwise fallback to userData prop
  const name = profile?.full_name || userData?.name || 'Utilisateur';
  const username = profile?.username || userData?.username || 'username';
  const location = profile?.location || userData?.location || 'Pa espesifye';
  const bio = profile?.bio || userData?.bio || 'Pa gen byografi';
  const joinedDate = profile?.joined_date 
    ? new Date(profile.joined_date).toLocaleDateString('fr-FR')
    : userData?.joinedDate || 'Pa espesifye';
  
  // Generate initials for avatar fallback
  const initials = name.split(' ').map(n => n[0]).join('');

  if (userLoading) {
    return (
      <div className="finance-card">
        <div className="flex flex-col items-center text-center mb-6 p-4">
          <Skeleton className="h-24 w-24 rounded-full mb-4" />
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-4 w-24 mb-4" />
          
          <div className="mt-4 w-full">
            <div className="flex justify-between text-sm mb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex justify-between text-sm">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>
        
        <Skeleton className="h-20 w-full mb-6" />
        
        <div className="space-y-2 p-4">
          {[1,2,3,4].map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="finance-card">
      <div className="flex flex-col items-center text-center mb-6">
        <Avatar className="h-24 w-24 mb-4">
          <AvatarImage src={profile?.avatar_url || ""} alt={name} />
          <AvatarFallback className="bg-finance-blue text-white text-xl">{initials}</AvatarFallback>
        </Avatar>
        
        <h3 className="text-xl font-bold">{name}</h3>
        <p className="text-finance-charcoal/70 dark:text-white/70">@{username}</p>
        
        <div className="mt-4 w-full">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-finance-charcoal/70 dark:text-white/70">Lokasyon:</span>
            <span>{location}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-finance-charcoal/70 dark:text-white/70">Manm depi:</span>
            <span>{joinedDate}</span>
          </div>
        </div>
      </div>
      
      <p className="text-sm bg-finance-lightGray/50 dark:bg-white/5 p-3 rounded-lg mb-6">
        {bio}
      </p>
      
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
    </div>
  );
};

export default ProfileSidebar;
