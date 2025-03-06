
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Profile } from "@/types/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search, CalendarDays, MapPin, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

const UsersDirectoryPage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<Profile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeView, setActiveView] = useState<"grid" | "list">("grid");
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name', { ascending: true });
      
      if (error) throw error;
      
      setUsers(data as Profile[]);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast({
        title: "Erè",
        description: "Nou pa kapab chaje itilizatè yo",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Filter users based on search query
  const filteredUsers = users.filter(user => {
    if (!searchQuery.trim()) return true;
    
    const searchLower = searchQuery.toLowerCase();
    const fullNameMatch = user.full_name?.toLowerCase().includes(searchLower);
    const userNameMatch = user.username?.toLowerCase().includes(searchLower);
    const locationMatch = user.location?.toLowerCase().includes(searchLower);
    
    return fullNameMatch || userNameMatch || locationMatch;
  });
  
  // Render loading skeletons
  const renderSkeletons = () => {
    return Array.from({ length: 8 }).map((_, index) => (
      <div key={index} className="finance-card p-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
        </div>
      </div>
    ));
  };
  
  // Render user grid item
  const renderUserGrid = (user: Profile) => {
    const initials = user.full_name 
      ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
      : '?';
    
    const joinedDate = user.joined_date 
      ? formatDistanceToNow(new Date(user.joined_date), { addSuffix: true })
      : 'Pa gen enfòmasyon';
    
    return (
      <div key={user.id} className="finance-card p-6 flex flex-col items-center text-center">
        <Avatar className="h-20 w-20 mb-4">
          <AvatarImage src={user.avatar_url || ""} />
          <AvatarFallback className="bg-finance-blue text-white text-lg">
            {initials}
          </AvatarFallback>
        </Avatar>
        
        <h3 className="text-lg font-semibold">{user.full_name || "Itilizatè"}</h3>
        <p className="text-sm text-finance-charcoal/70 dark:text-white/70">
          @{user.username || "username"}
        </p>
        
        {user.location && (
          <div className="flex items-center mt-2 text-sm text-finance-charcoal/70 dark:text-white/70">
            <MapPin className="h-4 w-4 mr-1" />
            {user.location}
          </div>
        )}
        
        <div className="flex items-center mt-2 text-sm text-finance-charcoal/70 dark:text-white/70">
          <CalendarDays className="h-4 w-4 mr-1" />
          Enskri {joinedDate}
        </div>
        
        {user.bio && (
          <p className="mt-4 text-sm border-t pt-4 text-finance-charcoal/80 dark:text-white/80">
            {user.bio.length > 100 ? `${user.bio.substring(0, 100)}...` : user.bio}
          </p>
        )}
      </div>
    );
  };
  
  // Render user list item
  const renderUserList = (user: Profile) => {
    const initials = user.full_name 
      ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
      : '?';
    
    const joinedDate = user.joined_date 
      ? formatDistanceToNow(new Date(user.joined_date), { addSuffix: true })
      : 'Pa gen enfòmasyon';
    
    return (
      <div key={user.id} className="finance-card p-4 flex items-start">
        <Avatar className="h-12 w-12 mr-4">
          <AvatarImage src={user.avatar_url || ""} />
          <AvatarFallback className="bg-finance-blue text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex justify-between">
            <div>
              <h3 className="font-semibold">{user.full_name || "Itilizatè"}</h3>
              <p className="text-sm text-finance-charcoal/70 dark:text-white/70">
                @{user.username || "username"}
              </p>
            </div>
            
            <div className="text-sm text-finance-charcoal/70 dark:text-white/70 flex items-center">
              <CalendarDays className="h-4 w-4 mr-1" />
              Enskri {joinedDate}
            </div>
          </div>
          
          {user.location && (
            <div className="flex items-center mt-1 text-sm text-finance-charcoal/70 dark:text-white/70">
              <MapPin className="h-4 w-4 mr-1" />
              {user.location}
            </div>
          )}
          
          {user.bio && (
            <p className="mt-2 text-sm text-finance-charcoal/80 dark:text-white/80">
              {user.bio.length > 150 ? `${user.bio.substring(0, 150)}...` : user.bio}
            </p>
          )}
          
          {user.phone && (
            <div className="mt-2 text-sm text-finance-charcoal/70 dark:text-white/70">
              📞 {user.phone}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Direktori Itilizatè yo</h1>
        
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-finance-charcoal/50 dark:text-white/50 h-4 w-4" />
            <Input 
              placeholder="Chèche itilizatè yo..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Tabs value={activeView} className="w-full md:w-auto" onValueChange={(v) => setActiveView(v as "grid" | "list")}>
            <TabsList className="w-full md:w-auto">
              <TabsTrigger value="grid" className="flex-1 md:flex-none">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Gri
                </div>
              </TabsTrigger>
              <TabsTrigger value="list" className="flex-1 md:flex-none">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  Lis
                </div>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="mb-4">
          <p className="text-finance-charcoal/70 dark:text-white/70">
            {filteredUsers.length} itilizatè {filteredUsers.length === 1 ? 'yo jwenn' : 'yo jwenn'}
          </p>
        </div>
        
        <TabsContent value="grid" className="mt-0">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {renderSkeletons()}
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredUsers.map(user => renderUserGrid(user))}
            </div>
          ) : (
            <div className="finance-card p-8 text-center">
              <div className="flex flex-col items-center gap-2">
                <User className="h-10 w-10 text-finance-charcoal/50 dark:text-white/50" />
                <p className="text-finance-charcoal/70 dark:text-white/70">
                  Pa gen okenn itilizatè ki koresponn ak rechèch ou a.
                </p>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="list" className="mt-0 space-y-4">
          {loading ? (
            <>{renderSkeletons()}</>
          ) : filteredUsers.length > 0 ? (
            <>{filteredUsers.map(user => renderUserList(user))}</>
          ) : (
            <div className="finance-card p-8 text-center">
              <div className="flex flex-col items-center gap-2">
                <User className="h-10 w-10 text-finance-charcoal/50 dark:text-white/50" />
                <p className="text-finance-charcoal/70 dark:text-white/70">
                  Pa gen okenn itilizatè ki koresponn ak rechèch ou a.
                </p>
              </div>
            </div>
          )}
        </TabsContent>
      </div>
    </Layout>
  );
};

export default UsersDirectoryPage;
