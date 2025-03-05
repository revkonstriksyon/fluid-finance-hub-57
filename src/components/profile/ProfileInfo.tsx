
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import VerificationBadge from "./VerificationBadge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  PencilIcon, 
  PhoneIcon, 
  MapPinIcon, 
  CalendarIcon, 
  MailIcon, 
  UserIcon, 
  ClockIcon,
  InfoIcon,
  BadgeCheckIcon
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

const ProfileInfo = ({ onEdit }: { onEdit?: () => void }) => {
  const { profile, user, bankAccounts } = useAuth();
  const [showCreditDetails, setShowCreditDetails] = useState(false);
  
  // Check if user email is verified
  const isEmailVerified = user?.email_confirmed_at ? true : false;

  // Last connection time (placeholder for now)
  const lastConnection = "Jodi a, 3:15 PM";

  // Credit score (placeholder for now)
  const creditScore = 720;
  const maxCreditScore = 850;
  const creditScorePercentage = (creditScore / maxCreditScore) * 100;

  const joinedDate = profile?.joined_date 
    ? new Date(profile.joined_date).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : '5 mas 2023';

  // Helper to display profile info item
  const InfoItem = ({ 
    icon: Icon, 
    label, 
    value,
    isVerified = false
  }: { 
    icon: React.ComponentType<any>; 
    label: string; 
    value?: string;
    isVerified?: boolean;
  }) => (
    <div className="flex items-center space-x-3 py-2.5">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-finance-blue/10 text-finance-blue">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex flex-col flex-1">
        <span className="text-xs text-muted-foreground">{label}</span>
        <div className="flex items-center">
          <span className="font-medium">{value || <span className="text-muted-foreground italic">Pa ranpli</span>}</span>
          {isVerified && <VerificationBadge isVerified={true} verifiedType="email" />}
        </div>
      </div>
    </div>
  );

  // Section header with title and optional edit button
  const SectionHeader = ({ 
    title, 
    onEditClick 
  }: { 
    title: string; 
    onEditClick?: () => void;
  }) => (
    <div className="flex justify-between items-center mb-3 pb-2 border-b">
      <h3 className="text-base font-semibold text-finance-blue">{title}</h3>
      {onEditClick && (
        <Button variant="ghost" size="sm" onClick={onEditClick} className="h-8">
          <PencilIcon className="h-4 w-4 mr-2" />
          Modifye
        </Button>
      )}
    </div>
  );

  return (
    <Card className="finance-card">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Column: Profile Image, Credit Score, Activity */}
          <div className="flex flex-col items-center md:w-1/3">
            {/* Profile Image */}
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
            
            <h3 className="text-lg font-bold text-gray-800">{profile?.full_name || 'Itilizatè'}</h3>
            <p className="text-sm text-muted-foreground mb-2">
              @{profile?.username || 'username'}
            </p>

            {isEmailVerified && (
              <div className="mb-4">
                <VerificationBadge isVerified={true} verifiedType="email" />
              </div>
            )}
            
            {onEdit && (
              <Button variant="outline" size="sm" className="w-full mb-4" onClick={onEdit}>
                <PencilIcon className="h-4 w-4 mr-2" />
                Chanje Foto
              </Button>
            )}
            
            {/* Last Connection */}
            <div className="w-full border-t pt-4 mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Dènye koneksyon</span>
                <span className="text-sm text-muted-foreground flex items-center">
                  <ClockIcon className="h-3 w-3 mr-1" />
                  {lastConnection}
                </span>
              </div>
            </div>
            
            {/* Credit Score */}
            <div className="w-full bg-finance-blue/5 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Kredi Eskò</span>
                <span className="text-xl font-bold text-yellow-500">{creditScore}</span>
              </div>
              <div className="mb-2">
                <Progress value={creditScorePercentage} className="h-2" />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0</span>
                <span>{maxCreditScore}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full mt-2 text-xs" 
                onClick={() => setShowCreditDetails(!showCreditDetails)}
              >
                <InfoIcon className="h-3 w-3 mr-1" />
                Detay
              </Button>
              
              {showCreditDetails && (
                <div className="mt-2 p-2 bg-white/50 rounded text-xs">
                  <p>Eskò ou kalkile baze sou:</p>
                  <ul className="list-disc pl-4 mt-1 space-y-1">
                    <li>Istwa peman (35%)</li>
                    <li>Kantite dèt (30%)</li>
                    <li>Longè istwa (15%)</li>
                    <li>Nouvo kredi (10%)</li>
                    <li>Melanj kredi (10%)</li>
                  </ul>
                </div>
              )}
            </div>
            
            {/* Activity Summary */}
            <div className="w-full">
              <h4 className="text-sm font-medium mb-2">Aktivite</h4>
              <div className="grid grid-cols-2 gap-2">
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
          
          {/* Right Column: Personal & Profile Information */}
          <div className="md:w-2/3">
            {/* Personal Information Section */}
            <div className="mb-6">
              <SectionHeader 
                title="Enfòmasyon Pèsonèl" 
                onEditClick={onEdit}
              />
              
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
                  isVerified={isEmailVerified}
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
            </div>
            
            {/* Profile Information Section */}
            <div>
              <SectionHeader 
                title="Enfòmasyon Pwofil (Piblik)" 
                onEditClick={onEdit}
              />
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Non Itilizatè</label>
                  <div className="p-2 border rounded-md">
                    @{profile?.username || <span className="text-muted-foreground italic">Pa ranpli</span>}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Byografi</label>
                  <div className="p-3 border rounded-md min-h-[100px]">
                    {profile?.bio ? (
                      <p>{profile.bio}</p>
                    ) : (
                      <p className="text-muted-foreground italic">
                        Byografi w ap parèt sou pwofil piblik ou. Ajoute yon kounye a.
                      </p>
                    )}
                  </div>
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
