
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import ProfileForm from "@/components/profile/ProfileForm";
import ProfileInfo from "@/components/profile/ProfileInfo";
import ProfileSkeleton from "@/components/profile/ProfileSkeleton";

const ProfilePage = () => {
  const { profile, userLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    location: "",
    bio: "",
    phone: "",
  });

  // Initialize form with profile data once loaded
  useEffect(() => {
    if (profile && !userLoading) {
      setFormData({
        full_name: profile.full_name || "",
        username: profile.username || "",
        location: profile.location || "",
        bio: profile.bio || "",
        phone: profile.phone || "",
      });
    }
  }, [profile, userLoading]);

  // Loading state
  if (userLoading) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-[#2A4D8F]">Pwofil Mwen</h1>
          <ProfileSkeleton />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-[#2A4D8F]">Pwofil Mwen</h1>
        
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
