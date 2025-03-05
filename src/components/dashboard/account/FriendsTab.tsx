import { useState, useEffect } from 'react';
import { MessageSquare, Plus, UserPlus, X, Search, Check, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useMessaging } from "@/hooks/useMessaging";
import { Friend, UserSearchResult, FriendProfile } from "@/types/messaging";
import { Loader2 } from "lucide-react";

const FriendsTab = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { createConversation } = useMessaging();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<Friend[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [userSearchResults, setUserSearchResults] = useState<UserSearchResult[]>([]);
  const [loadingUserSearch, setLoadingUserSearch] = useState(false);
  const [allUsers, setAllUsers] = useState<UserSearchResult[]>([]);
  const [loadingAllUsers, setLoadingAllUsers] = useState(false);

  // Helper function to get friend profile data safely
  const getFriendProfile = (friend: Friend): FriendProfile => {
    if (!friend.friend) {
      return {
        id: friend.friend_id,
        full_name: null,
        username: null,
        avatar_url: null
      };
    }
    
    // Handle case where friend is an array
    if (Array.isArray(friend.friend)) {
      return friend.friend[0];
    }
    
    // Handle case where friend is an object
    return friend.friend;
  };

  // Fetch friends and friend requests when component mounts
  useEffect(() => {
    if (user) {
      fetchFriends();
      fetchAllUsers(); // Load all users when component mounts
      
      // Set up real-time subscription for friend updates
      const friendsChannel = supabase
        .channel('public:friends')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'friends',
            filter: `user_id=eq.${user.id}`
          },
          () => fetchFriends()
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'friends',
            filter: `friend_id=eq.${user.id}`
          },
          () => fetchFriends()
        )
        .subscribe();
      
      return () => {
        supabase.removeChannel(friendsChannel);
      };
    }
  }, [user]);

  // Fetch all users in the database
  const fetchAllUsers = async () => {
    if (!user) return;
    
    try {
      setLoadingAllUsers(true);
      
      // Fetch all users except the current user, this now directly uses profile data
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('id, full_name, username, avatar_url')
        .neq('id', user.id)
        .order('full_name', { ascending: true });
      
      if (usersError) throw usersError;
      
      // Get existing friend connections for these users
      const { data: friendsData, error: friendsError } = await supabase
        .from('friends')
        .select('id, user_id, friend_id, status')
        .or(
          `user_id.eq.${user.id},friend_id.eq.${user.id}`
        );
      
      if (friendsError) throw friendsError;
      
      // Map all users with friend status, directly using the profile data
      const usersWithFriendStatus = usersData.map(userData => {
        const friendConnection = friendsData?.find(f => 
          (f.user_id === userData.id && f.friend_id === user.id) || 
          (f.friend_id === userData.id && f.user_id === user.id)
        );
        
        return {
          ...userData, // This ensures we use the exact profile data
          isFriend: friendConnection?.status === 'accepted',
          friendStatus: friendConnection?.status as "pending" | "accepted" | "rejected" | undefined
        };
      });
      
      setAllUsers(usersWithFriendStatus);
    } catch (error) {
      console.error('Error fetching all users:', error);
      toast({
        title: "Erè",
        description: "Nou pa kapab chaje tout itilizatè yo",
        variant: "destructive"
      });
    } finally {
      setLoadingAllUsers(false);
    }
  };

  // Fetch friends and friend requests
  const fetchFriends = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Fetch accepted friends
      const { data: friendsData, error: friendsError } = await supabase
        .from('friends')
        .select(`
          id,
          user_id,
          friend_id,
          status,
          created_at,
          updated_at,
          friend:profiles!friends_friend_id_fkey(id, full_name, username, avatar_url)
        `)
        .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
        .eq('status', 'accepted');
      
      if (friendsError) throw friendsError;
      
      // Process friends data to ensure the friend property has the other user's info
      const processedFriends = friendsData.map(friend => {
        // Get friend profile data safely
        const friendProfile = Array.isArray(friend.friend) ? friend.friend[0] : friend.friend;
        
        // If the current user is the friend_id, swap the friend property to show the user info
        if (friend.friend_id === user.id) {
          return {
            ...friend,
            friend: { 
              id: friend.user_id,
              // We need to fetch the user_id's profile separately
              full_name: null,
              username: null,
              avatar_url: null
            }
          };
        }
        
        return {
          ...friend,
          friend: friendProfile
        };
      });
      
      // For each friend where we need to fetch the additional profile info
      const friendsWithProfiles = await Promise.all(processedFriends.map(async (friend) => {
        if (friend.friend_id === user.id) {
          // Fetch the profile for user_id
          const { data: profileData } = await supabase
            .from('profiles')
            .select('id, full_name, username, avatar_url')
            .eq('id', friend.user_id)
            .single();
          
          return {
            ...friend,
            friend: profileData
          };
        }
        return friend;
      }));
      
      // Explicitly cast to Friend[] type
      setFriends(friendsWithProfiles as Friend[]);
      
      // Fetch pending friend requests (where the current user is the friend_id)
      const { data: requestsData, error: requestsError } = await supabase
        .from('friends')
        .select(`
          id,
          user_id,
          friend_id,
          status,
          created_at,
          updated_at,
          friend:profiles!friends_user_id_fkey(id, full_name, username, avatar_url)
        `)
        .eq('friend_id', user.id)
        .eq('status', 'pending');
      
      if (requestsError) throw requestsError;
      
      // Handle case where friend could be an array
      const processedRequests = requestsData.map(request => ({
        ...request,
        friend: Array.isArray(request.friend) ? request.friend[0] : request.friend
      }));
      
      setFriendRequests(processedRequests as Friend[]);
    } catch (error) {
      console.error('Error fetching friends:', error);
      toast({
        title: "Erè",
        description: "Nou pa kapab chaje zanmi ou yo",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter all users based on search term
  const filterUsers = () => {
    if (!userSearchTerm.trim()) {
      return allUsers;
    }
    
    return allUsers.filter(user => 
      user.full_name?.toLowerCase().includes(userSearchTerm.toLowerCase()) || 
      user.username?.toLowerCase().includes(userSearchTerm.toLowerCase())
    );
  };

  // Search users by name or username - updated to use profile data directly
  const handleSearch = async () => {
    if (!searchTerm.trim() || !user) return;
    
    try {
      setIsSearching(true);
      
      // Search directly from profiles table
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('id, full_name, username, avatar_url')
        .or(`full_name.ilike.%${searchTerm}%,username.ilike.%${searchTerm}%`)
        .neq('id', user.id)
        .limit(10);
      
      if (usersError) throw usersError;
      
      // Get existing friend connections for these users
      const { data: friendsData, error: friendsError } = await supabase
        .from('friends')
        .select('id, user_id, friend_id, status')
        .or(`user_id.eq.${user.id}.and.friend_id.in.(${usersData.map(u => `"${u.id}"`).join(',')}),
             friend_id.eq.${user.id}.and.user_id.in.(${usersData.map(u => `"${u.id}"`).join(',')})`)
        .is('status', 'accepted');
      
      if (friendsError && usersData.length > 0) throw friendsError;
      
      // Get pending friend requests
      const { data: pendingData, error: pendingError } = await supabase
        .from('friends')
        .select('id, user_id, friend_id, status')
        .or(`user_id.eq.${user.id}.and.friend_id.in.(${usersData.map(u => `"${u.id}"`).join(',')}),
             friend_id.eq.${user.id}.and.user_id.in.(${usersData.map(u => `"${u.id}"`).join(',')})`)
        .eq('status', 'pending');
      
      if (pendingError && usersData.length > 0) throw pendingError;
      
      // Map search results with friend status, using profile data directly
      const resultsWithFriendStatus = usersData.map(user => {
        // Check if this user is already a friend
        const friendConnection = friendsData?.find(f => 
          (f.user_id === user.id || f.friend_id === user.id) && f.status === 'accepted'
        );
        
        // Check if there's a pending request
        const pendingConnection = pendingData?.find(p => 
          (p.user_id === user.id || p.friend_id === user.id) && p.status === 'pending'
        );
        
        return {
          ...user, // This ensures we use the exact profile data
          isFriend: !!friendConnection,
          friendStatus: pendingConnection ? pendingConnection.status : undefined
        };
      });
      
      setSearchResults(resultsWithFriendStatus);
    } catch (error) {
      console.error('Error searching users:', error);
      toast({
        title: "Erè",
        description: "Nou pa kapab chèche itilizatè yo",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Search all users in the system - updated to use profile data directly
  const searchAllUsers = async () => {
    if (!userSearchTerm.trim() || !user) return;
    
    try {
      setLoadingUserSearch(true);
      
      // Search directly from profiles table
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('id, full_name, username, avatar_url')
        .or(`full_name.ilike.%${userSearchTerm}%,username.ilike.%${userSearchTerm}%`)
        .neq('id', user.id)  // Exclude current user
        .limit(10);
      
      if (usersError) throw usersError;
      
      // Get existing friend connections for these users
      const { data: friendsData, error: friendsError } = await supabase
        .from('friends')
        .select('id, user_id, friend_id, status')
        .or(
          `user_id.eq.${user.id}.and.friend_id.in.(${usersData.map(u => `"${u.id}"`).join(',')}),
           friend_id.eq.${user.id}.and.user_id.in.(${usersData.map(u => `"${u.id}"`).join(',')})`
        );
      
      if (friendsError && usersData.length > 0) throw friendsError;
      
      // Map search results with friend status, using profile data directly
      const resultsWithFriendStatus = usersData.map(user => {
        const friendConnection = friendsData?.find(f => 
          (f.user_id === user.id || f.friend_id === user.id)
        );
        
        return {
          ...user, // This ensures we use the exact profile data
          isFriend: friendConnection?.status === 'accepted',
          friendStatus: friendConnection?.status as "pending" | "accepted" | "rejected" | undefined
        };
      });
      
      setUserSearchResults(resultsWithFriendStatus);
    } catch (error) {
      console.error('Error searching users:', error);
      toast({
        title: "Erè",
        description: "Nou pa kapab chèche itilizatè yo",
        variant: "destructive"
      });
    } finally {
      setLoadingUserSearch(false);
    }
  };

  // Send a friend request
  const sendFriendRequest = async (friendId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('friends')
        .insert({
          user_id: user.id,
          friend_id: friendId,
          status: 'pending'
        });
      
      if (error) throw error;
      
      toast({
        title: "Siksè",
        description: "Demann zanmi a voye",
      });
      
      // Refresh search results, friends list, and all users
      fetchAllUsers();
      
      if (userSearchTerm) {
        searchAllUsers();
      } else {
        handleSearch();
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast({
        title: "Erè",
        description: "Nou pa kapab voye demann zanmi",
        variant: "destructive"
      });
    }
  };

  // Accept a friend request
  const acceptFriendRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('friends')
        .update({ status: 'accepted' })
        .eq('id', requestId);
      
      if (error) throw error;
      
      toast({
        title: "Siksè",
        description: "Demann zanmi aksepte",
      });
      
      fetchFriends();
      fetchAllUsers(); // Refresh all users list
    } catch (error) {
      console.error('Error accepting friend request:', error);
      toast({
        title: "Erè",
        description: "Nou pa kapab aksepte demann zanmi",
        variant: "destructive"
      });
    }
  };

  // Reject a friend request
  const rejectFriendRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('friends')
        .update({ status: 'rejected' })
        .eq('id', requestId);
      
      if (error) throw error;
      
      toast({
        title: "Siksè",
        description: "Demann zanmi rejte",
      });
      
      fetchFriends();
      fetchAllUsers(); // Refresh all users list
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      toast({
        title: "Erè",
        description: "Nou pa kapab rejte demann zanmi",
        variant: "destructive"
      });
    }
  };

  // Start a conversation with a friend
  const startConversation = async (friendId: string) => {
    if (!user) return;
    
    try {
      const conversation = await createConversation(friendId);
      if (conversation) {
        toast({
          title: "Siksè",
          description: "Konvèsasyon kreye",
        });
        
        // Redirect to messages page
        window.location.href = '/messages';
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: "Erè",
        description: "Nou pa kapab kreye konvèsasyon",
        variant: "destructive"
      });
    }
  };

  // Add a helper function to programmatically switch tabs
  const switchToTab = (tabValue: string) => {
    const tabTrigger = document.querySelector(`[data-value="${tabValue}"]`) as HTMLButtonElement | null;
    if (tabTrigger) {
      tabTrigger.click();
    }
  };

  // Effect to search when userSearchTerm changes
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (userSearchTerm.trim().length >= 2) {
        searchAllUsers();
      } else if (!userSearchTerm.trim()) {
        setUserSearchResults([]);
      }
    }, 500);
    
    return () => clearTimeout(delayDebounce);
  }, [userSearchTerm]);

  return (
    <div className="space-y-4">
      <div className="finance-card">
        <Tabs defaultValue="friends" className="w-full">
          <TabsList className="w-full mb-6 bg-finance-lightGray/50 dark:bg-white/5">
            <TabsTrigger value="friends" className="flex-1">Zanmi</TabsTrigger>
            <TabsTrigger value="requests" className="flex-1">
              Demann Zanmi
              {friendRequests.length > 0 && (
                <span className="ml-2 bg-finance-blue text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {friendRequests.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="add" className="flex-1">Ajoute Zanmi</TabsTrigger>
            <TabsTrigger value="search" className="flex-1">Chèche Itilizatè</TabsTrigger>
            <TabsTrigger value="all" className="flex-1">Tout Itilizatè</TabsTrigger>
          </TabsList>
          
          {/* Friends List */}
          <TabsContent value="friends">
            <h3 className="text-lg font-medium mb-4">Zanmi</h3>
            
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-finance-blue" />
              </div>
            ) : friends.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-finance-charcoal/70 dark:text-white/70">Ou pa gen okenn zanmi pou lemoman.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => switchToTab("add")}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Ajoute Zanmi
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {friends.map((friend) => {
                  const friendProfile = getFriendProfile(friend);
                  return (
                    <div key={friend.id} className="flex items-center p-3 border border-finance-midGray/30 dark:border-white/10 rounded-lg hover:bg-finance-lightGray/50 dark:hover:bg-white/5 transition-colors">
                      <Avatar className="h-12 w-12 mr-4">
                        <AvatarImage src={friendProfile?.avatar_url || ""} />
                        <AvatarFallback className="bg-finance-blue text-white">
                          {friendProfile?.full_name 
                            ? friendProfile.full_name.split(' ').map(n => n[0]).join('')
                            : "??"}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <p className="font-medium">{friendProfile?.full_name || "Zanmi"}</p>
                        <p className="text-sm text-finance-charcoal/70 dark:text-white/70">
                          @{friendProfile?.username || "username"}
                        </p>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => startConversation(friendProfile?.id || "")}
                      >
                        <MessageSquare className="h-5 w-5" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
          
          {/* Friend Requests */}
          <TabsContent value="requests">
            <h3 className="text-lg font-medium mb-4">Demann Zanmi</h3>
            
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-finance-blue" />
              </div>
            ) : friendRequests.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-finance-charcoal/70 dark:text-white/70">
                  Ou pa gen okenn demann zanmi pou lemoman.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {friendRequests.map((request) => {
                  const friendProfile = getFriendProfile(request);
                  return (
                    <div key={request.id} className="flex items-center p-3 border border-finance-midGray/30 dark:border-white/10 rounded-lg">
                      <Avatar className="h-12 w-12 mr-4">
                        <AvatarImage src={friendProfile?.avatar_url || ""} />
                        <AvatarFallback className="bg-finance-blue text-white">
                          {friendProfile?.full_name 
                            ? friendProfile.full_name.split(' ').map(n => n[0]).join('')
                            : "??"}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <p className="font-medium">{friendProfile?.full_name || "Itilizatè"}</p>
                        <p className="text-sm text-finance-charcoal/70 dark:text-white/70">
                          @{friendProfile?.username || "username"}
                        </p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => acceptFriendRequest(request.id)}
                          className="border-green-500 text-green-500 hover:bg-green-500/10"
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Aksepte
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => rejectFriendRequest(request.id)}
                          className="border-red-500 text-red-500 hover:bg-red-500/10"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Rejte
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
          
          {/* Add Friends */}
          <TabsContent value="add">
            <h3 className="text-lg font-medium mb-4">Ajoute Zanmi</h3>
            
            <div className="mb-6">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-finance-charcoal/50 dark:text-white/50 h-4 w-4" />
                <Input 
                  placeholder="Chèche itilizatè pa non oswa non itilizatè..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
              <Button 
                onClick={handleSearch}
                disabled={isSearching || !searchTerm.trim()}
              >
                {isSearching ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                Chèche
              </Button>
            </div>
            
            <div className="space-y-3">
              {searchResults.length === 0 ? (
                <p className="text-center py-4 text-finance-charcoal/70 dark:text-white/70">
                  {searchTerm ? "Nou pa jwenn okenn itilizatè. Eseye chanje tèm rechèch la." : "Chèche itilizatè pou ajoute kòm zanmi."}
                </p>
              ) : (
                searchResults.map((result) => (
                  <div key={result.id} className="flex items-center p-3 border border-finance-midGray/30 dark:border-white/10 rounded-lg">
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarImage src={result.avatar_url || ""} />
                      <AvatarFallback className="bg-finance-blue text-white">
                        {result.full_name 
                          ? result.full_name.split(' ').map(n => n[0]).join('')
                          : "??"}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <p className="font-medium">{result.full_name || "Itilizatè"}</p>
                      <p className="text-sm text-finance-charcoal/70 dark:text-white/70">
                        @{result.username || "username"}
                      </p>
                    </div>
                    
                    <div>
                      {result.isFriend ? (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => startConversation(result.id)}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Mesaj
                        </Button>
                      ) : result.friendStatus === 'pending' ? (
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled
                        >
                          <Clock className="h-4 w-4 mr-2" />
                          Annatant
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => sendFriendRequest(result.id)}
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          Ajoute
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
          
          {/* Search Users Tab */}
          <TabsContent value="search">
            <h3 className="text-lg font-medium mb-4">Chèche Nouvo Itilizatè</h3>
            
            <div className="mb-6">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-finance-charcoal/50 dark:text-white/50 h-4 w-4" />
                <Input 
                  placeholder="Chèche itilizatè pa non oswa non itilizatè..." 
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && searchAllUsers()}
                  className="pl-10"
                />
              </div>
              <Button 
                onClick={searchAllUsers}
                disabled={loadingUserSearch || userSearchTerm.length < 2}
              >
                {loadingUserSearch ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                Chèche
              </Button>
            </div>
            
            <div className="space-y-3">
              {userSearchResults.length === 0 ? (
                <p className="text-center py-4 text-finance-charcoal/70 dark:text-white/70">
                  {userSearchTerm ? "Nou pa jwenn okenn itilizatè. Eseye chanje tèm rechèch la." : "Chèche itilizatè pou ajoute kòm zanmi."}
                </p>
              ) : (
                userSearchResults.map((result) => (
                  <div key={result.id} className="flex items-center p-3 border border-finance-midGray/30 dark:border-white/10 rounded-lg">
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarImage src={result.avatar_url || ""} />
                      <AvatarFallback className="bg-finance-blue text-white">
                        {result.full_name 
                          ? result.full_name.split(' ').map(n => n[0]).join('')
                          : "??"}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <p className="font-medium">{result.full_name || "Itilizatè"}</p>
                      <p className="text-sm text-finance-charcoal/70 dark:text-white/70">
                        @{result.username || "username"}
                      </p>
                    </div>
                    
                    <div>
                      {result.isFriend ? (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => startConversation(result.id)}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Mesaj
                        </Button>
                      ) : result.friendStatus === 'pending' ? (
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled
                        >
                          <Clock className="h-4 w-4 mr-2" />
                          Annatant
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => sendFriendRequest(result.id)}
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          Ajoute
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
          
          {/* All Users Tab */}
          <TabsContent value="all">
            <h3 className="text-lg font-medium mb-4">Tout Itilizatè</h3>
            
            {loadingAllUsers ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-finance-blue" />
              </div>
            ) : (
              <div>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-finance-charcoal/50 dark:text-white/50 h-4 w-4" />
                  <Input 
                    placeholder="Filtè itilizatè yo..." 
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="space-y-3 mt-4 max-h-[400px] overflow-y-auto pr-2">
                  {filterUsers().length === 0 ? (
                    <p className="text-center py-4 text-finance-charcoal/70 dark:text-white/70">
                      {allUsers.length === 0 ? "Pa gen okenn itilizatè nan sistèm nan." : "Pa gen okenn itilizatè ki koresponn ak rechèch la."}
                    </p>
                  ) : (
                    filterUsers().map((user) => (
                      <div key={user.id} className="flex items-center p-3 border border-finance-midGray/30 dark:border-white/10 rounded-lg">
                        <Avatar className="h-12 w-12 mr-4">
                          <AvatarImage src={user.avatar_url || ""} />
                          <AvatarFallback className="
