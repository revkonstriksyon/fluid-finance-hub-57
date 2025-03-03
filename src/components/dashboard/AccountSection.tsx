import { User, MessageSquare, Bell, Settings, Shield, Lock, CreditCard, LogOut, Plus, BarChart2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from 'react';

const AccountSection = () => {
  const [tweet, setTweet] = useState('');
  
  // Sample user data
  const userData = {
    name: "Jean Baptiste",
    username: "@jeanbaptiste",
    profilePic: "",
    joinedDate: "Jen 2022",
    location: "Port-au-Prince, Haiti",
    bio: "Entrepreneur ak envestisè. Mwen renmen finans ak teknoloji."
  };
  
  // Sample tweets
  const sampleTweets = [
    {
      id: 1,
      user: {
        name: "Jean Baptiste",
        username: "@jeanbaptiste",
        profilePic: "",
      },
      content: "Jodi a mwen te fè yon gwo envestisman nan mache aksyon an. Espere li pote bon rezilta!",
      time: "2 minit pase",
      likes: 12,
      comments: 4
    },
    {
      id: 2,
      user: {
        name: "Marie Joseph",
        username: "@mariejoseph",
        profilePic: "",
      },
      content: "Ki moun ki gen konsèy sou kredi? Map chèche konnen kijan pou m amelyore skò kredi mwen.",
      time: "30 minit pase",
      likes: 8,
      comments: 7
    },
    {
      id: 3,
      user: {
        name: "Pierre Louis",
        username: "@pierrelouis",
        profilePic: "",
      },
      content: "Mwen fèk achte yon nouvo telefòn avèk opsyon peman an tranch. Sistèm nan vrèman fasil pou itilize!",
      time: "1 èdtan pase",
      likes: 14,
      comments: 2
    }
  ];
  
  // Sample account nav items
  const accountNavItems = [
    { icon: User, label: "Pwofil" },
    { icon: MessageSquare, label: "Mesaj" },
    { icon: Bell, label: "Notifikasyon" },
    { icon: Settings, label: "Paramèt" },
    { icon: Shield, label: "Sekirite" },
    { icon: Lock, label: "Konfidansyalite" },
    { icon: CreditCard, label: "Metòd Peman" },
    { icon: LogOut, label: "Dekonekte" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="finance-card">
          <div className="flex flex-col items-center text-center mb-6">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={userData.profilePic} alt={userData.name} />
              <AvatarFallback className="bg-finance-blue text-white text-xl">JB</AvatarFallback>
            </Avatar>
            
            <h3 className="text-xl font-bold">{userData.name}</h3>
            <p className="text-finance-charcoal/70 dark:text-white/70">{userData.username}</p>
            
            <div className="mt-4 w-full">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-finance-charcoal/70 dark:text-white/70">Lokasyon:</span>
                <span>{userData.location}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-finance-charcoal/70 dark:text-white/70">Manm depi:</span>
                <span>{userData.joinedDate}</span>
              </div>
            </div>
          </div>
          
          <p className="text-sm bg-finance-lightGray/50 dark:bg-white/5 p-3 rounded-lg mb-6">
            {userData.bio}
          </p>
          
          <div className="space-y-2">
            {accountNavItems.map((item, index) => (
              <button
                key={index}
                className="flex items-center w-full space-x-3 px-4 py-3 rounded-lg font-medium transition-colors hover:bg-finance-lightGray/50 dark:hover:bg-white/5 text-finance-charcoal dark:text-white/80"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="md:col-span-2">
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="w-full mb-4 bg-finance-lightGray/50 dark:bg-white/5">
              <TabsTrigger value="posts" className="flex-1">Pòs</TabsTrigger>
              <TabsTrigger value="portfolio" className="flex-1">Pòtfolyo</TabsTrigger>
              <TabsTrigger value="friends" className="flex-1">Zanmi</TabsTrigger>
            </TabsList>
            
            <TabsContent value="posts" className="space-y-6">
              <div className="finance-card">
                <div className="flex gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-finance-blue text-white">JB</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <Textarea 
                      placeholder="Ki sa kap pase nan lespri w?"
                      className="mb-3 resize-none"
                      value={tweet}
                      onChange={(e) => setTweet(e.target.value)}
                    />
                    
                    <div className="flex justify-end">
                      <Button disabled={!tweet.trim()}>
                        Pataje
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              {sampleTweets.map(tweet => (
                <div key={tweet.id} className="finance-card">
                  <div className="flex gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-finance-blue text-white">
                        {tweet.user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <span className="font-bold mr-2">{tweet.user.name}</span>
                          <span className="text-finance-charcoal/70 dark:text-white/70 text-sm">{tweet.user.username}</span>
                        </div>
                        <span className="text-finance-charcoal/70 dark:text-white/70 text-sm">{tweet.time}</span>
                      </div>
                      
                      <p className="my-3">{tweet.content}</p>
                      
                      <div className="flex gap-4 text-finance-charcoal/70 dark:text-white/70">
                        <button className="flex items-center gap-1 text-sm hover:text-finance-blue transition-colors">
                          <MessageSquare className="h-4 w-4" />
                          <span>{tweet.comments}</span>
                        </button>
                        <button className="flex items-center gap-1 text-sm hover:text-finance-danger transition-colors">
                          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                            <path d="M7.5 1.5C7.5 1.5 7 3.5 3.5 3.5V7.5C3.5 11 7.5 13.5 7.5 13.5C7.5 13.5 11.5 11 11.5 7.5V3.5C8 3.5 7.5 1.5 7.5 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span>{tweet.likes}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="portfolio" className="space-y-4">
              <div className="finance-card">
                <h3 className="section-title mb-6">Rezime Finansye</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-finance-lightGray/50 dark:bg-white/5 rounded-lg p-4">
                    <p className="text-sm text-finance-charcoal/70 dark:text-white/70 mb-1">Total Aktif</p>
                    <p className="text-xl font-bold">$7,246.38</p>
                  </div>
                  
                  <div className="bg-finance-lightGray/50 dark:bg-white/5 rounded-lg p-4">
                    <p className="text-sm text-finance-charcoal/70 dark:text-white/70 mb-1">Total Dèt</p>
                    <p className="text-xl font-bold">$1,240.00</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 border-b border-finance-midGray/30 dark:border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="bg-finance-blue/20 p-2 rounded-lg">
                        <CreditCard className="h-5 w-5 text-finance-blue" />
                      </div>
                      <div>
                        <p className="font-medium">Kont Labank</p>
                        <p className="text-sm text-finance-charcoal/70 dark:text-white/70">2 kont aktif</p>
                      </div>
                    </div>
                    <p className="font-bold">$1,985.40</p>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border-b border-finance-midGray/30 dark:border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="bg-finance-gold/20 p-2 rounded-lg">
                        <BarChart2 className="h-5 w-5 text-finance-gold" />
                      </div>
                      <div>
                        <p className="font-medium">Envestisman</p>
                        <p className="text-sm text-finance-charcoal/70 dark:text-white/70">Aksyon & ETF</p>
                      </div>
                    </div>
                    <p className="font-bold">$5,241.82</p>
                  </div>
                  
                  <div className="flex justify-between items-center p-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-finance-danger/20 p-2 rounded-lg">
                        <CreditCard className="h-5 w-5 text-finance-danger" />
                      </div>
                      <div>
                        <p className="font-medium">Kredi</p>
                        <p className="text-sm text-finance-charcoal/70 dark:text-white/70">1 prè aktif</p>
                      </div>
                    </div>
                    <p className="font-bold text-finance-danger">-$1,240.00</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="friends" className="space-y-4">
              <div className="finance-card">
                <h3 className="section-title mb-6">Zanmi ak Kontak</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="flex items-center p-3 border border-finance-midGray/30 dark:border-white/10 rounded-lg hover:bg-finance-lightGray/50 dark:hover:bg-white/5 transition-colors">
                      <Avatar className="h-12 w-12 mr-4">
                        <AvatarFallback className="bg-finance-blue text-white">
                          {String.fromCharCode(64 + item)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <p className="font-medium">Friend {item}</p>
                        <p className="text-sm text-finance-charcoal/70 dark:text-white/70">@username{item}</p>
                      </div>
                      
                      <Button variant="ghost" size="icon">
                        <MessageSquare className="h-5 w-5" />
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-center mt-6">
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajoute Kontak
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AccountSection;
