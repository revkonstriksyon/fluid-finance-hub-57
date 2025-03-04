
import Layout from "@/components/Layout";
import { userData } from "@/components/dashboard/account/accountData";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const ProfilePage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: userData.name,
    username: userData.username.replace('@', ''),
    location: userData.location,
    bio: userData.bio,
    email: "jean.baptiste@example.com",
    phone: "+509 3456-7890",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Pwofil Mete Ajou",
      description: "Chanjman yo anrejistre avèk siksè",
    });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Pwofil Mwen</h1>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="finance-card p-6 mb-6">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-finance-blue rounded-full mb-4 flex items-center justify-center text-white text-2xl">
                  {userData.name.split(' ').map(n => n[0]).join('')}
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
                  <span className="font-semibold">{userData.joinedDate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Dènye koneksyon</span>
                  <span className="font-semibold">Jodi a</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tranzaksyon konplete</span>
                  <span className="font-semibold">43</span>
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
                    <Label htmlFor="name">Non Konplè</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={formData.name} 
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
                      name="email" 
                      type="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                    />
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
                  <Button variant="outline" type="button">Anile</Button>
                  <Button type="submit">Sove Chanjman yo</Button>
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
