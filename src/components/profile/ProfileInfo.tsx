
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import VerificationBadge from "./VerificationBadge";
import { Card, CardContent } from "@/components/ui/card";
import { PencilIcon, PhoneIcon, MapPinIcon, CalendarIcon } from "lucide-react";

const ProfileInfo = ({ onEdit }: { onEdit?: () => void }) => {
  const { profile, user } = useAuth();
  
  // Check if user email is verified
  const isEmailVerified = user?.email_confirmed_at ? true : false;

  const joinedDate = profile?.joined_date 
    ? new Date(profile.joined_date).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : '';

  return (
    <>
      <div className="finance-card p-6 mb-6">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-finance-blue rounded-full mb-4 flex items-center justify-center text-white text-2xl relative group">
            {profile?.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt={profile?.full_name || 'Profile'} 
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              profile?.full_name ? profile.full_name.split(' ').map(n => n[0]).join('') : 'U'
            )}
            
            {onEdit && (
              <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <PencilIcon className="h-8 w-8 text-white cursor-pointer" onClick={onEdit} />
              </div>
            )}
          </div>
          
          {onEdit ? (
            <Button variant="outline" className="w-full mb-2" onClick={onEdit}>Chanje Foto</Button>
          ) : (
            <h3 className="text-xl font-bold mb-2">{profile?.full_name || 'Itilizatè'}</h3>
          )}
          
          <p className="text-xs text-finance-charcoal/70 dark:text-white/70">
            {onEdit ? 'JPG, PNG oswa GIF (max 2MB)' : '@' + (profile?.username || 'username')}
          </p>
        </div>
      </div>

      <div className="finance-card p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Enfòmasyon Pèsonèl</h3>
          {isEmailVerified && <VerificationBadge isVerified={true} verifiedType="email" />}
        </div>
        
        <div className="space-y-4">
          {profile?.full_name && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-medium">Non Konplè:</span>
                <span>{profile.full_name}</span>
              </div>
              {onEdit && <PencilIcon className="h-4 w-4 cursor-pointer" onClick={onEdit} />}
            </div>
          )}
          
          {user?.email && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-medium">Imèl:</span>
                <span>{user.email}</span>
              </div>
            </div>
          )}
          
          {profile?.phone && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <PhoneIcon className="h-4 w-4" />
                <span className="font-medium">Telefòn:</span>
                <span>{profile.phone}</span>
              </div>
              {onEdit && <PencilIcon className="h-4 w-4 cursor-pointer" onClick={onEdit} />}
            </div>
          )}
          
          {profile?.location && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPinIcon className="h-4 w-4" />
                <span className="font-medium">Lokasyon:</span>
                <span>{profile.location}</span>
              </div>
              {onEdit && <PencilIcon className="h-4 w-4 cursor-pointer" onClick={onEdit} />}
            </div>
          )}
          
          {profile?.joined_date && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-4 w-4" />
                <span className="font-medium">Manm depi:</span>
                <span>{joinedDate}</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="font-medium mb-3">Aktivite Pwofil</h4>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Dènye koneksyon</span>
              <span className="font-semibold">Jodi a</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tranzaksyon konplete</span>
              <span className="font-semibold">0</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Kredi eskò</span>
              <span className="font-semibold">720</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileInfo;
