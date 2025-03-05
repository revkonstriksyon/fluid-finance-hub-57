
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { Clock, Info } from "lucide-react";
import VerificationBadge from "./VerificationBadge";

const ProfileInfo = () => {
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

  // Credit score calculation
  const creditScore = 720;
  const maxScore = 850;
  const scorePercentage = (creditScore / maxScore) * 100;

  // Format initials for avatar
  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return user?.email ? user.email[0].toUpperCase() : 'U';
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="border-0 shadow-none">
        <CardContent className="p-0">
          <div className="flex flex-col items-center">
            <Avatar className="h-24 w-24 border-4 border-white shadow">
              <AvatarFallback className="bg-[#2A4D8F] text-white text-2xl font-bold">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            
            <div className="mt-4 text-center">
              <h2 className="text-2xl font-bold text-[#333]">{profile?.full_name || 'Utilisateur'}</h2>
              <div className="flex items-center justify-center mt-1">
                <span className="text-sm text-gray-500">@{profile?.username || user?.email?.split('@')[0]}</span>
                {isEmailVerified && <VerificationBadge isVerified={true} verifiedType="email" />}
              </div>
              <Button variant="outline" className="mt-3 text-sm h-8">🖼️ Chanje Foto</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Last Activity */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium text-[#2A4D8F]">Dènye Koneksyon</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 text-gray-500">
            <Clock className="h-4 w-4" />
            <span>Jodi a, 3:15 PM</span>
          </div>
        </CardContent>
      </Card>

      {/* Credit Score */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium text-[#2A4D8F]">Kredi Eskò</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-center">
            <span className="text-3xl font-bold text-[#FFD700]">{creditScore}</span>
            <span className="text-sm text-gray-500 ml-1">/ {maxScore}</span>
          </div>
          
          <Progress value={scorePercentage} className="h-2" />
          
          <div className="flex justify-between text-xs text-gray-500">
            <span>0</span>
            <span>{maxScore}</span>
          </div>
          
          <Button variant="outline" size="sm" className="w-full mt-2">
            <Info className="h-4 w-4 mr-1" />
            Detay
          </Button>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium text-[#2A4D8F]">Enfòmasyon Pèsonèl</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <span className="text-sm text-gray-500">Non Konplè:</span>
            <span className="text-sm font-medium">{profile?.full_name || ''}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <span className="text-sm text-gray-500">Imèl:</span>
            <div className="flex items-center">
              <span className="text-sm font-medium">{user?.email || ''}</span>
              {isEmailVerified && <VerificationBadge isVerified={true} verifiedType="email" />}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <span className="text-sm text-gray-500">Telefòn:</span>
            <span className="text-sm font-medium">
              {profile?.phone || ''}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <span className="text-sm text-gray-500">Lokasyon:</span>
            <span className="text-sm font-medium">
              {profile?.location || ''}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <span className="text-sm text-gray-500">Manm Depi:</span>
            <span className="text-sm text-gray-500">{joinedDate}</span>
          </div>
        </CardContent>
      </Card>

      {/* Profile Information */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium text-[#2A4D8F]">Enfòmasyon Pwofil (Piblik)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <span className="text-sm text-gray-500">Non Itilizatè:</span>
            <span className="text-sm font-medium">@{profile?.username || user?.email?.split('@')[0]}</span>
          </div>
          
          <div className="space-y-1">
            <span className="text-sm text-gray-500">Byografi:</span>
            {profile?.bio ? (
              <p className="text-sm">{profile.bio}</p>
            ) : (
              <p className="text-sm text-gray-400 italic">
                Byografi w ap parèt sou pwofil piblik ou. Ajoute yon kounye a.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileInfo;
