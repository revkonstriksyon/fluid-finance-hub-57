
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/auth";
import ProfileForm from "@/components/profile/ProfileForm";
import ProfileInfo from "@/components/profile/ProfileInfo";
import ProfileSkeleton from "@/components/profile/ProfileSkeleton";

const ProfilePage = () => {
  const { profile, userLoading, loading, refreshProfile } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);
  
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
    if ((userLoading || loading) && !isInitialized) {
      const timer = setTimeout(() => {
        console.log("Profile page still loading, attempting to refresh...");
        refreshProfile();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [userLoading, loading, isInitialized, refreshProfile]);

  // Loading state
  if (userLoading || loading) {
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
