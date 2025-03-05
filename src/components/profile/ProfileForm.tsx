
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

interface ProfileFormProps {
  initialData: {
    full_name: string;
    username: string;
    location: string;
    bio: string;
    phone: string;
  };
}

const ProfileForm = ({ initialData }: ProfileFormProps) => {
  const { toast } = useToast();
  const { user, refreshProfile } = useAuth();
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Erè",
        description: error.message || "Yon erè pase pandan mizajou pwofil ou",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="finance-card p-6">
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Non Konplè</Label>
            <Input 
              id="full_name" 
              name="full_name" 
              value={formData.full_name} 
              onChange={handleChange} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Non Itilizatè</Label>
            <div className="flex">
              <span className="inline-flex items-center px-3 bg-finance-lightGray/80 dark:bg-white/10 border border-r-0 border-input rounded-l-md">@</span>
              <Input 
                id="username" 
                name="username" 
                className="rounded-l-none" 
                value={formData.username} 
                onChange={handleChange} 
              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Imèl</Label>
            <Input 
              id="email" 
              type="email" 
              value={user?.email || ""}
              disabled
              className="bg-gray-100"
            />
            <p className="text-xs text-finance-charcoal/70 dark:text-white/70">Imèl pa ka chanje</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefòn</Label>
            <Input 
              id="phone" 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange} 
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Lokasyon</Label>
          <Input 
            id="location" 
            name="location" 
            value={formData.location} 
            onChange={handleChange} 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Byografi</Label>
          <Textarea 
            id="bio" 
            name="bio" 
            rows={4} 
            value={formData.bio} 
            onChange={handleChange} 
          />
          <p className="text-xs text-finance-charcoal/70 dark:text-white/70">Byografi w ap parèt sou pwofil piblik ou.</p>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" type="button" onClick={() => {
            setFormData(initialData);
          }}>Anile</Button>
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? 'Chajman...' : 'Sove Chanjman yo'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ProfileForm;
