
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

const ProfileImageUploader = ({ onClose }: { onClose: () => void }) => {
  const { user, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erè",
        description: "Tanpri chwazi yon imaj (JPG, PNG oswa GIF).",
        variant: "destructive",
      });
      return;
    }
    
    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Erè",
        description: "Imaj la twò gwo. Limit la se 2MB.",
        variant: "destructive",
      });
      return;
    }
    
    // Create a preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async () => {
    if (!fileInputRef.current?.files?.length || !user) return;
    
    const file = fileInputRef.current.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;
    
    try {
      setUploading(true);
      
      // Upload the file to Supabase storage
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          upsert: true,
          cacheControl: '3600'
        });
        
      if (uploadError) {
        console.error("Error uploading:", uploadError);
        throw uploadError;
      }
      
      // Get the public URL
      const { data: publicURLData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      if (!publicURLData) throw new Error("Erè pandan jwenn URL piblik imaj la");
      
      console.log("Image uploaded successfully, public URL:", publicURLData.publicUrl);
      
      // Update the user's profile with the new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: publicURLData.publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
        
      if (updateError) {
        console.error("Error updating profile:", updateError);
        throw updateError;
      }
      
      console.log("Profile updated successfully with new avatar URL");
      
      // Refresh profile data
      await refreshProfile();
      
      toast({
        title: "Foto Pwofil Mete Ajou",
        description: "Foto pwofil ou mete ajou avèk siksè.",
      });
      
      onClose();
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast({
        title: "Erè",
        description: error.message || "Yon erè pase pandan telechaje imaj la.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold">Chanje Foto Pwofil</h3>
        <p className="text-sm text-muted-foreground">Chwazi yon nouvo foto pou pwofil ou.</p>
      </div>
      
      <div className="mb-4 flex justify-center">
        {imagePreview ? (
          <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-primary">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-muted-foreground">
            <span className="text-muted-foreground">Chwazi imaj</span>
          </div>
        )}
      </div>
      
      <div className="flex justify-center">
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id="profile-image-input"
        />
        <Button 
          variant="outline" 
          type="button" 
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          Chwazi Fichye
        </Button>
      </div>
      
      <p className="text-xs text-center text-muted-foreground">
        JPG, PNG oswa GIF (max 2MB)
      </p>
      
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button variant="outline" onClick={onClose} disabled={uploading}>
          Anile
        </Button>
        <Button onClick={uploadImage} disabled={!imagePreview || uploading}>
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Chajman...
            </>
          ) : (
            'Mete Ajou'
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProfileImageUploader;
