
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileHeaderProps {
  name: string;
  username: string;
  avatarUrl?: string;
  initials: string;
  location: string;
  joinedDate: string;
  bio: string;
}

const ProfileHeader = ({ 
  name, 
  username, 
  avatarUrl, 
  initials, 
  location, 
  joinedDate, 
  bio 
}: ProfileHeaderProps) => {
  return (
    <>
      <div className="flex flex-col items-center text-center mb-6">
        <Avatar className="h-24 w-24 mb-4">
          <AvatarImage src={avatarUrl || ""} alt={name} />
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
    </>
  );
};

export default ProfileHeader;
