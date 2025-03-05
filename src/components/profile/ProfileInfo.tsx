
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import VerificationBadge from "./VerificationBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PencilIcon, PhoneIcon, MapPinIcon, CalendarIcon, MailIcon, UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

  // Helper to display profile info item
  const InfoItem = ({ 
    icon: Icon, 
    label, 
    value, 
    showEditButton = false 
  }: { 
    icon: React.ComponentType<any>; 
    label: string; 
    value?: string; 
    showEditButton?: boolean;
  }) => (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center space-x-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">{label}:</span>
        <span className="text-sm">{value || <span className="text-muted-foreground italic">Pa ranpli</span>}</span>
      </div>
      {showEditButton && onEdit && (
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onEdit}>
          <PencilIcon className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <Card className="finance-card">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center">
            <Avatar className="h-24 w-24 mb-4">
              {profile?.avatar_url ? (
                <AvatarImage 
                  src={profile.avatar_url} 
                  alt={profile?.full_name || 'Profile'} 
                />
              ) : (
                <AvatarFallback className="bg-finance-blue text-white text-2xl">
                  {profile?.full_name ? profile.full_name.split(' ').map(n => n[0]).join('') : 'U'}
                </AvatarFallback>
              )}
            </Avatar>
            
            <h3 className="text-xl font-bold mb-1">{profile?.full_name || 'Itilizatè'}</h3>
            <p className="text-sm text-finance-charcoal/70 dark:text-white/70 mb-3">
              @{profile?.username || 'username'}
            </p>
            
            {onEdit && (
              <Button variant="outline" className="w-full" onClick={onEdit}>
                <PencilIcon className="h-4 w-4 mr-2" />
                Chanje Foto
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="finance-card">
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <CardTitle className="text-lg">Enfòmasyon Pèsonèl</CardTitle>
          {isEmailVerified && <VerificationBadge isVerified={true} verifiedType="email" />}
        </CardHeader>
        
        <CardContent className="py-2">
          <div className="divide-y">
            <InfoItem 
              icon={UserIcon} 
              label="Non Konplè" 
              value={profile?.full_name}
            />
            
            <InfoItem 
              icon={MailIcon} 
              label="Imèl" 
              value={user?.email}
            />
            
            <InfoItem 
              icon={PhoneIcon} 
              label="Telefòn" 
              value={profile?.phone}
            />
            
            <InfoItem 
              icon={MapPinIcon} 
              label="Lokasyon" 
              value={profile?.location}
            />
            
            <InfoItem 
              icon={CalendarIcon} 
              label="Manm depi" 
              value={joinedDate}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="finance-card">
        <CardHeader className="py-4">
          <CardTitle className="text-lg">Aktivite Pwofil</CardTitle>
        </CardHeader>
        
        <CardContent className="py-2">
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
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileInfo;
