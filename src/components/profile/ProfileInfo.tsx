
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import VerificationBadge from "./VerificationBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PencilIcon, PhoneIcon, MapPinIcon, CalendarIcon, MailIcon, UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ProfileInfo = ({ onEdit }: { onEdit?: () => void }) => {
  const { profile, user, bankAccounts } = useAuth();
  
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
    value
  }: { 
    icon: React.ComponentType<any>; 
    label: string; 
    value?: string;
  }) => (
    <div className="flex items-center space-x-3 py-2.5">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-finance-blue/10 text-finance-blue">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="font-medium">{value || <span className="text-muted-foreground italic">Pa ranpli</span>}</span>
      </div>
    </div>
  );

  return (
    <Card className="finance-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Pwofil Mwen</CardTitle>
        {isEmailVerified && <VerificationBadge isVerified={true} verifiedType="email" />}
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Image Section */}
          <div className="flex flex-col items-center md:w-1/3">
            <Avatar className="h-24 w-24 mb-3 ring-2 ring-finance-blue/20 ring-offset-2">
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
            
            <h3 className="text-lg font-bold">{profile?.full_name || 'Itilizatè'}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              @{profile?.username || 'username'}
            </p>
            
            {onEdit && (
              <Button variant="outline" size="sm" className="w-full" onClick={onEdit}>
                <PencilIcon className="h-4 w-4 mr-2" />
                Chanje Foto
              </Button>
            )}
            
            <div className="mt-4 pt-4 border-t w-full space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Dènye koneksyon</span>
                <span className="font-medium">Jodi a</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Kredi eskò</span>
                <span className="font-medium">720</span>
              </div>
            </div>
          </div>
          
          {/* Personal Information Section */}
          <div className="md:w-2/3 md:border-l md:pl-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-semibold">Enfòmasyon Pèsonèl</h3>
              {onEdit && (
                <Button variant="ghost" size="sm" onClick={onEdit} className="h-8">
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Modifye
                </Button>
              )}
            </div>
            
            <div className="space-y-1 divide-y divide-gray-100">
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
            
            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-base font-semibold">Aktivite</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-finance-blue/5">
                  <div className="text-xs text-muted-foreground mb-1">Tranzaksyon</div>
                  <div className="text-xl font-bold text-finance-blue">0</div>
                </div>
                <div className="p-3 rounded-lg bg-finance-blue/5">
                  <div className="text-xs text-muted-foreground mb-1">Kont Bankè</div>
                  <div className="text-xl font-bold text-finance-blue">{bankAccounts?.length || 0}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileInfo;
