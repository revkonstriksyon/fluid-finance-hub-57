
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import VerificationBadge from "./VerificationBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  PhoneIcon, 
  MapPinIcon, 
  CalendarIcon, 
  ClockIcon,
  ImageIcon,
} from "lucide-react";

const ProfileInfo = ({ onEdit }: { onEdit?: () => void }) => {
  const { profile, user, bankAccounts } = useAuth();
  
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
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-[#2A4D8F]">Enfòmasyon Pèsonèl</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
