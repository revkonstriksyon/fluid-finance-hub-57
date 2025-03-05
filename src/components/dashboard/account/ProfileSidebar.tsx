
import { useAuth } from "@/contexts/AuthContext";
import ProfileSidebarSkeleton from "./ProfileSidebarSkeleton";
import ProfileHeader from "./ProfileHeader";
import ProfileNavigation from "./ProfileNavigation";

interface ProfileSidebarProps {
  userData?: {
    name: string;
    username: string;
    profilePic: string;
    joinedDate: string;
    location: string;
    bio: string;
  };
}

const ProfileSidebar = ({ userData }: ProfileSidebarProps) => {
  const { profile, userLoading, signOut } = useAuth();

  const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    await signOut();
  };

  // Use profile data if available, otherwise fallback to userData prop
  const name = profile?.full_name || userData?.name || 'Utilisateur';
  const username = profile?.username || userData?.username || 'username';
  const location = profile?.location || userData?.location || 'Pa espesifye';
  const bio = profile?.bio || userData?.bio || 'Pa gen byografi';
  const joinedDate = profile?.joined_date 
    ? new Date(profile.joined_date).toLocaleDateString('fr-FR')
    : userData?.joinedDate || 'Pa espesifye';
  
  // Generate initials for avatar fallback
  const initials = name.split(' ').map(n => n[0]).join('');

  if (userLoading) {
    return <ProfileSidebarSkeleton />;
  }

  return (
    <div className="finance-card">
      <ProfileHeader
        name={name}
        username={username}
        avatarUrl={profile?.avatar_url || ""}
        initials={initials}
        location={location}
        joinedDate={joinedDate}
        bio={bio}
      />
      
      <ProfileNavigation handleLogout={handleLogout} />
    </div>
  );
};

export default ProfileSidebar;
