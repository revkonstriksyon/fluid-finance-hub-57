
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Pencil } from "lucide-react";

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
  const [editField, setEditField] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const toggleEdit = (fieldName: string) => {
    setEditField(editField === fieldName ? null : fieldName);
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
      setEditField(null); // Reset edit mode
    }
  };

  const renderEditableField = (
    label: string, 
    name: string, 
    value: string, 
    type: string = "text",
    disabled: boolean = false,
    description?: string
  ) => {
    const isEditing = editField === name;
    const canEdit = !disabled;
    
    return (
      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center">
          <Label htmlFor={name}>{label}</Label>
          {canEdit && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => toggleEdit(name)} 
              className="h-8 px-2"
              type="button" // Add this to prevent form submission when clicking edit
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {isEditing ? (
          <Input 
            id={name} 
            name={name} 
            value={value} 
            onChange={handleChange} 
            type={type}
            disabled={disabled}
          />
        ) : (
          <div className="p-2 border rounded-md bg-muted/30">
            {value || <span className="text-muted-foreground italic">Pa ranpli</span>}
          </div>
        )}
        
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="finance-card p-6">
      <div className="space-y-2">
        {renderEditableField("Non Konplè", "full_name", formData.full_name)}
        
        {renderEditableField("Non Itilizatè", "username", formData.username)}
        
        {renderEditableField(
          "Imèl", 
          "email", 
          user?.email || "", 
          "email", 
          true, 
          "Imèl pa ka chanje"
        )}
        
        {renderEditableField("Telefòn", "phone", formData.phone)}
        
        {renderEditableField("Lokasyon", "location", formData.location)}
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center">
            <Label htmlFor="bio">Byografi</Label>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => toggleEdit("bio")} 
              className="h-8 px-2"
              type="button" // Add this to prevent form submission
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
          
          {editField === "bio" ? (
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
          
          <p className="text-xs text-muted-foreground">
            Byografi w ap parèt sou pwofil piblik ou.
          </p>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t mt-6">
          <Button 
            variant="outline" 
            type="button" 
            onClick={() => {
              setFormData(initialData);
              setEditField(null);
              if (onSaveSuccess) {
                onSaveSuccess();
              }
            }}
          >
            Anile
          </Button>
          <Button 
            type="submit" 
            disabled={isUpdating || !editField}
          >
            {isUpdating ? 'Chajman...' : 'Sovegade'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ProfileForm;
