
import { User, MessageSquare, Bell, Settings, Shield, Lock, CreditCard, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileSidebarProps {
  userData: {
    name: string;
    username: string;
    profilePic: string;
    joinedDate: string;
    location: string;
    bio: string;
  };
}

const accountNavItems = [
  { icon: User, label: "Pwofil" },
  { icon: MessageSquare, label: "Mesaj" },
  { icon: Bell, label: "Notifikasyon" },
  { icon: Settings, label: "Paramèt" },
  { icon: Shield, label: "Sekirite" },
  { icon: Lock, label: "Konfidansyalite" },
  { icon: CreditCard, label: "Metòd Peman" },
  { icon: LogOut, label: "Dekonekte" },
];

const ProfileSidebar = ({ userData }: ProfileSidebarProps) => {
  return (
    <div className="finance-card">
      <div className="flex flex-col items-center text-center mb-6">
        <Avatar className="h-24 w-24 mb-4">
          <AvatarImage src={userData.profilePic} alt={userData.name} />
          <AvatarFallback className="bg-finance-blue text-white text-xl">JB</AvatarFallback>
        </Avatar>
        
        <h3 className="text-xl font-bold">{userData.name}</h3>
        <p className="text-finance-charcoal/70 dark:text-white/70">{userData.username}</p>
        
        <div className="mt-4 w-full">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-finance-charcoal/70 dark:text-white/70">Lokasyon:</span>
            <span>{userData.location}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-finance-charcoal/70 dark:text-white/70">Manm depi:</span>
            <span>{userData.joinedDate}</span>
          </div>
        </div>
      </div>
      
      <p className="text-sm bg-finance-lightGray/50 dark:bg-white/5 p-3 rounded-lg mb-6">
        {userData.bio}
      </p>
      
      <div className="space-y-2">
        {accountNavItems.map((item, index) => (
          <button
            key={index}
            className="flex items-center w-full space-x-3 px-4 py-3 rounded-lg font-medium transition-colors hover:bg-finance-lightGray/50 dark:hover:bg-white/5 text-finance-charcoal dark:text-white/80"
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfileSidebar;
