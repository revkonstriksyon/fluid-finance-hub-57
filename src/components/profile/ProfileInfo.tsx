
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const ProfileInfo = () => {
  const { profile } = useAuth();

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
          <div className="w-24 h-24 bg-finance-blue rounded-full mb-4 flex items-center justify-center text-white text-2xl">
            {profile?.full_name ? profile.full_name.split(' ').map(n => n[0]).join('') : 'U'}
          </div>
          <Button variant="outline" className="w-full mb-2">Chanje Foto</Button>
          <p className="text-xs text-finance-charcoal/70 dark:text-white/70">JPG, PNG oswa GIF (max 2MB)</p>
        </div>
      </div>

      <div className="finance-card p-6">
        <h3 className="font-medium mb-3">Aktivite Pwofil</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Manm depi</span>
            <span className="font-semibold">{joinedDate}</span>
          </div>
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
    </>
  );
};

export default ProfileInfo;
