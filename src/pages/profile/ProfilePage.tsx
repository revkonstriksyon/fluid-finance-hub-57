
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";

const ProfilePage = () => {
  const { toast } = useToast();
  const { user, profile, userLoading, refreshProfile } = useAuth();
  
  const [isUpdating, setIsUpdating] = useState(false);
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

  // Loading state
  if (userLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Pwofil Mwen</h1>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="finance-card p-6 mb-6">
                <div className="flex flex-col items-center">
                  <Skeleton className="w-24 h-24 rounded-full mb-4" />
                  <Skeleton className="w-full h-10 mb-2" />
                  <Skeleton className="w-2/3 h-4" />
                </div>
              </div>

              <div className="finance-card p-6">
                <Skeleton className="w-3/4 h-5 mb-3" />
                <div className="space-y-3">
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-full h-4" />
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="finance-card p-6">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Skeleton className="w-full h-6 mb-2" />
                    <Skeleton className="w-full h-10" />
                  </div>
                  <div className="space-y-4">
                    <Skeleton className="w-full h-6 mb-2" />
                    <Skeleton className="w-full h-10" />
                  </div>
                  <Skeleton className="w-full h-32" />
                  <div className="flex justify-end">
                    <Skeleton className="w-32 h-10" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const joinedDate = profile?.joined_date 
    ? new Date(profile.joined_date).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : '';

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Pwofil Mwen</h1>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
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
          </div>

          <div className="md:col-span-2">
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
                    if (profile) {
                      setFormData({
                        full_name: profile.full_name || "",
                        username: profile.username || "",
                        location: profile.location || "",
                        bio: profile.bio || "",
                        phone: profile.phone || "",
                      });
                    }
                  }}>Anile</Button>
                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating ? 'Chajman...' : 'Sove Chanjman yo'}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
