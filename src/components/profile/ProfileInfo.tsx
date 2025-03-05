
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import VerificationBadge from "./VerificationBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  PencilIcon, 
  PhoneIcon, 
  MapPinIcon, 
  CalendarIcon, 
  ClockIcon,
  ImageIcon,
  InfoIcon
} from "lucide-react";

const ProfileInfo = ({ onEdit }: { onEdit?: () => void }) => {
  const { profile, user, bankAccounts } = useAuth();
  const [showBiographyPrompt, setShowBiographyPrompt] = useState(false);
  
  // Check if user email is verified
  const isEmailVerified = user?.email_confirmed_at ? true : false;

  // Format joined date
  const joinedDate = profile?.joined_date 
    ? new Date(profile.joined_date).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : '5 mas 2025'; // Default date for demonstration

  // Credit score values
  const creditScore = 720;
  const maxCreditScore = 850;
  const creditScorePercentage = (creditScore / maxCreditScore) * 100;

  return (
    <div className="grid md:grid-cols-5 gap-6">
      {/* Left Column - Profile Photo, Credit Score, Activity */}
      <div className="md:col-span-2 space-y-6">
        {/* Profile Photo Card */}
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col items-center">
              <div className="w-[100px] h-[100px] relative group mb-4">
                <Avatar className="w-full h-full border-2 border-finance-blue">
                  {profile?.avatar_url ? (
                    <AvatarImage 
                      src={profile.avatar_url} 
                      alt={profile?.full_name || 'Profile'} 
                      className="object-cover" 
                    />
                  ) : (
                    <AvatarFallback className="bg-[#2A4D8F] text-white text-2xl">
                      {profile?.full_name ? profile.full_name.split(' ').map(n => n[0]).join('') : 'U'}
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>
              
              <h3 className="text-xl font-bold mb-1">
                {profile?.full_name || 'Agaby Panier'}
              </h3>
              
              <p className="text-sm text-muted-foreground mb-3">
                @{profile?.username || 'tioby1'}
              </p>
              
              <Button 
                onClick={onEdit} 
                variant="outline" 
                className="w-full flex items-center justify-center"
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                🖼️ Chanje Foto
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Credit Score Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-[#2A4D8F]">Kredi Eskò</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-2">
              <span className="text-3xl font-bold text-[#FFD700]">{creditScore}</span>
              <span className="text-sm text-muted-foreground">{maxCreditScore}</span>
            </div>
            <Progress value={creditScorePercentage} className="h-2 mb-3" />
            <Button variant="outline" size="sm" className="w-full mt-2">
              Detay
            </Button>
          </CardContent>
        </Card>

        {/* Last Activity Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-[#2A4D8F]">Dènye Koneksyon</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <ClockIcon className="h-4 w-4" />
              <span>Jodi a, 3:15 PM</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Personal Information and Profile Information */}
      <div className="md:col-span-3 space-y-6">
        {/* Personal Information Card */}
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-medium text-[#2A4D8F]">Enfòmasyon Pèsonèl</CardTitle>
            {onEdit && (
              <Button variant="ghost" size="sm" onClick={onEdit} className="h-8 px-2">
                <PencilIcon className="h-4 w-4" />
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Full Name */}
            <div className="flex justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Non Konplè</p>
                <p>{profile?.full_name || 'Agaby Panier'}</p>
              </div>
            </div>

            {/* Email with verification badge */}
            <div className="flex justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Imèl</p>
                <div className="flex items-center">
                  <span>{user?.email || 'agaby@example.com'}</span>
                  {isEmailVerified && <VerificationBadge isVerified={true} verifiedType="email" />}
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="flex justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Telefòn</p>
                <div className="flex items-center">
                  <PhoneIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{profile?.phone || <span className="text-muted-foreground italic">Pa ranpli</span>}</span>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="flex justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Lokasyon</p>
                <div className="flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{profile?.location || <span className="text-muted-foreground italic">Pa ranpli</span>}</span>
                </div>
              </div>
            </div>

            {/* Member Since */}
            <div className="flex justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Manm Depi</p>
                <div className="flex items-center text-muted-foreground">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  <span>{joinedDate}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Information Card */}
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-medium text-[#2A4D8F]">Enfòmasyon Pwofil (Piblik)</CardTitle>
            {onEdit && (
              <Button variant="ghost" size="sm" onClick={onEdit} className="h-8 px-2">
                <PencilIcon className="h-4 w-4" />
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Username */}
            <div className="flex justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Non Itilizatè</p>
                <p>@{profile?.username || 'tioby1'}</p>
              </div>
            </div>

            {/* Biography */}
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Byografi</p>
              {profile?.bio ? (
                <p>{profile.bio}</p>
              ) : (
                <p className="text-muted-foreground text-sm italic">
                  Byografi w ap parèt sou pwofil piblik ou. Ajoute yon kounye a.
                </p>
              )}
            </div>

            {/* Account Activity */}
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Tranzaksyon konplete</span>
                <span className="font-semibold">{bankAccounts?.length || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileInfo;
