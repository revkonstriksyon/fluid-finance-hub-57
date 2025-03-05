
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import ProfileForm from "@/components/profile/ProfileForm";
import ProfileInfo from "@/components/profile/ProfileInfo";
import ProfileSkeleton from "@/components/profile/ProfileSkeleton";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import ProfileImageUploader from "@/components/profile/ProfileImageUploader";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { profile, userLoading } = useAuth();
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();
  
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

  const handleSaveSuccess = () => {
    setIsEditMode(false);
  };

  // Loading state
  if (userLoading) {
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
        
        {isEditMode ? (
          <ProfileForm 
            initialData={formData} 
            onSaveSuccess={handleSaveSuccess}
          />
        ) : (
          <ProfileInfo onEdit={() => setIsImageDialogOpen(true)} />
        )}
        
        <div className="mt-6 flex justify-end">
          {!isEditMode && (
            <button 
              onClick={() => setIsEditMode(true)}
              className="px-4 py-2 bg-[#2A4D8F] text-white rounded-md hover:bg-[#2A4D8F]/90 transition-colors"
            >
              ✏️ Modifye Pwofil
            </button>
          )}
        </div>
      </div>
      
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mete ajou foto pwofil</DialogTitle>
            <DialogDescription>
              Chwazi yon nouvo foto pou pwofil ou.
            </DialogDescription>
          </DialogHeader>
          <ProfileImageUploader onClose={() => setIsImageDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default ProfilePage;
