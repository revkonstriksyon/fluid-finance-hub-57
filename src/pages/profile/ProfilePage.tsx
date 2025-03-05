
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/auth";
import ProfileForm from "@/components/profile/ProfileForm";
import ProfileInfo from "@/components/profile/ProfileInfo";
import ProfileSkeleton from "@/components/profile/ProfileSkeleton";

const ProfilePage = () => {
  const { profile, userLoading, loading, refreshProfile, user } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    location: "",
    bio: "",
    phone: "",
  });

  // Initialize form with profile data once loaded
  useEffect(() => {
    if (profile && !userLoading && !loading) {
      setFormData({
        full_name: profile.full_name || "",
        username: profile.username || "",
        location: profile.location || "",
        bio: profile.bio || "",
        phone: profile.phone || "",
      });
      setIsInitialized(true);
    }
  }, [profile, userLoading, loading]);

  // Try to refresh profile if stuck in loading state for too long
  useEffect(() => {
    if ((userLoading || loading) && !isInitialized && retryCount < 3) {
      const timer = setTimeout(() => {
        console.log(`Profile page still loading, attempt ${retryCount + 1}/3 to refresh...`);
        if (user) {
          refreshProfile();
          setRetryCount(prev => prev + 1);
        }
      }, 3000); // Shorter timeout and retry up to 3 times
      
      return () => clearTimeout(timer);
    }
  }, [userLoading, loading, isInitialized, refreshProfile, retryCount, user]);

  // Loading state
  if ((userLoading || loading) && !profile) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Pwofil Mwen</h1>
          <ProfileSkeleton />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Pwofil Mwen</h1>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <ProfileInfo />
          </div>

          <div className="md:col-span-2">
            <ProfileForm initialData={formData} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
