
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Pencil, Save, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProfileFormProps {
  initialData: {
    full_name: string;
    username: string;
    location: string;
    bio: string;
    phone: string;
  };
  onSaveSuccess?: () => void;
}

const ProfileForm = ({ initialData, onSaveSuccess }: ProfileFormProps) => {
  const { toast } = useToast();
  const { user, refreshProfile } = useAuth();
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState(initialData);
  const [isEditing, setIsEditing] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Erè",
        description: "Ou dwe konekte pou mete ajou pwofil ou",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsUpdating(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          username: formData.username,
          location: formData.location,
          bio: formData.bio,
          phone: formData.phone,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Refresh profile data
      await refreshProfile();
      
      toast({
        title: "Pwofil Mete Ajou",
        description: "Chanjman yo anrejistre avèk siksè",
      });
      
      // Call the onSaveSuccess callback if provided
      if (onSaveSuccess) {
        onSaveSuccess();
      }
      
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Erè",
        description: error.message || "Yon erè pase pandan mizajou pwofil ou",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
      setIsEditing(false); // Exit edit mode
    }
  };

  const handleCancel = () => {
    setFormData(initialData);
    setIsEditing(false);
    if (onSaveSuccess) {
      onSaveSuccess();
    }
  };

  return (
    <Card className="finance-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Enfòmasyon Pwofil</CardTitle>
        {!isEditing ? (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleEdit} 
            className="h-8 px-3"
            type="button"
          >
            <Pencil className="h-4 w-4 mr-2" />
            Modifye
          </Button>
        ) : null}
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="full_name">Non Konplè</Label>
              {isEditing ? (
                <Input 
                  id="full_name" 
                  name="full_name" 
                  value={formData.full_name} 
                  onChange={handleChange} 
                />
              ) : (
                <div className="p-2 border rounded-md bg-muted/30 h-10 flex items-center">
                  {formData.full_name || <span className="text-muted-foreground italic">Pa ranpli</span>}
                </div>
              )}
            </div>
            
            {/* Username Field */}
            <div className="space-y-2">
              <Label htmlFor="username">Non Itilizatè</Label>
              {isEditing ? (
                <Input 
                  id="username" 
                  name="username" 
                  value={formData.username} 
                  onChange={handleChange} 
                />
              ) : (
                <div className="p-2 border rounded-md bg-muted/30 h-10 flex items-center">
                  {formData.username || <span className="text-muted-foreground italic">Pa ranpli</span>}
                </div>
              )}
            </div>
            
            {/* Email Field - Always Read Only */}
            <div className="space-y-2">
              <Label htmlFor="email">Imèl</Label>
              <div className="p-2 border rounded-md bg-muted/30 h-10 flex items-center">
                {user?.email || <span className="text-muted-foreground italic">Pa ranpli</span>}
              </div>
              <p className="text-xs text-muted-foreground">Imèl pa ka chanje</p>
            </div>
            
            {/* Phone Field */}
            <div className="space-y-2">
              <Label htmlFor="phone">Telefòn</Label>
              {isEditing ? (
                <Input 
                  id="phone" 
                  name="phone" 
                  value={formData.phone || ''} 
                  onChange={handleChange} 
                />
              ) : (
                <div className="p-2 border rounded-md bg-muted/30 h-10 flex items-center">
                  {formData.phone || <span className="text-muted-foreground italic">Pa ranpli</span>}
                </div>
              )}
            </div>
            
            {/* Location Field */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="location">Lokasyon</Label>
              {isEditing ? (
                <Input 
                  id="location" 
                  name="location" 
                  value={formData.location || ''} 
                  onChange={handleChange} 
                />
              ) : (
                <div className="p-2 border rounded-md bg-muted/30 h-10 flex items-center">
                  {formData.location || <span className="text-muted-foreground italic">Pa ranpli</span>}
                </div>
              )}
            </div>
          </div>
          
          {/* Bio Field */}
          <div className="space-y-2">
            <Label htmlFor="bio">Byografi</Label>
            {isEditing ? (
              <Textarea 
                id="bio" 
                name="bio" 
                rows={4} 
                value={formData.bio || ''} 
                onChange={handleChange} 
              />
            ) : (
              <div className="p-2 border rounded-md bg-muted/30 min-h-[100px]">
                {formData.bio || <span className="text-muted-foreground italic">Pa gen byografi</span>}
              </div>
            )}
            {!isEditing && (
              <p className="text-xs text-muted-foreground">
                Byografi w ap parèt sou pwofil piblik ou.
              </p>
            )}
          </div>

          {isEditing && (
            <div className="flex justify-end space-x-3 pt-4">
              <Button 
                variant="outline" 
                type="button" 
                onClick={handleCancel}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Anile
              </Button>
              <Button 
                type="submit" 
                disabled={isUpdating}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                {isUpdating ? 'Chajman...' : 'Sovegade'}
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
