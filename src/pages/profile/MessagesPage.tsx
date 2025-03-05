
import { useState, useRef, useEffect } from "react";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Search, Send, Loader2, Users, Plus, X } from "lucide-react";
import { useMessaging } from "@/hooks/useMessaging";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { UserSearchResult } from "@/types/messaging";
import { useToast } from "@/hooks/use-toast";

const MessagesPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const {
    conversations, 
    activeConversation, 
    messages,
    loading,
    sendingMessage,
    setActiveConversation,
    sendMessage,
    createConversation
  } = useMessaging();
  const [searchTerm, setSearchTerm] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [searchingUsers, setSearchingUsers] = useState(false);
  const [userSearchResults, setUserSearchResults] = useState<UserSearchResult[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Filter conversations based on search term
  const filteredConversations = conversations.filter(convo => 
    convo.otherUser?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    convo.otherUser?.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Search for users to message
  const searchUsers = async (query: string) => {
    if (!query.trim() || !user) return;
    
    try {
      setSearchingUsers(true);
      
      // Search for users by full_name or username
      const { data: usersData, error: usersError } = await supabase
        .from("profiles")
        .select("id, full_name, username, avatar_url")
        .or(`full_name.ilike.%${query}%,username.ilike.%${query}%`)
        .neq("id", user.id) // Exclude current user
        .limit(10);
      
      if (usersError) throw usersError;
      
      // Get current user's friend list to check friendship status
      const { data: friendsData, error: friendsError } = await supabase
        .from("friends")
        .select("*")
        .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`);
      
      if (friendsError) throw friendsError;
      
      // Map user results with friendship status
      const resultsWithFriendStatus = usersData.map(userData => {
        const friend = friendsData?.find(
          f => (f.user_id === user.id && f.friend_id === userData.id) || 
               (f.friend_id === user.id && f.user_id === userData.id)
        );
        
        return {
          ...userData,
          isFriend: !!friend && friend.status === "accepted",
          friendStatus: friend?.status as "pending" | "accepted" | "rejected" | undefined
        };
      });
      
      setUserSearchResults(resultsWithFriendStatus);
    } catch (error) {
      console.error("Error searching users:", error);
      toast({
        title: "Erè",
        description: "Nou pa kapab chèche itilizatè yo",
        variant: "destructive"
      });
    } finally {
      setSearchingUsers(false);
    }
  };

  // Function to start a new conversation
  const startNewConversation = async () => {
    if (!selectedUser) return;
    
    try {
      const newConversation = await createConversation(selectedUser.id);
      
      if (newConversation) {
        setShowNewMessageModal(false);
        setUserSearchTerm("");
        setUserSearchResults([]);
        setSelectedUser(null);
      }
    } catch (error) {
      console.error("Error creating conversation:", error);
      toast({
        title: "Erè",
        description: "Nou pa kapab kreye yon nouvo konvèsasyon",
        variant: "destructive"
      });
    }
  };

  // Function to get status color
  const getStatusColor = (status?: string) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "away": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  // Function to format time
  const formatTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), {
        addSuffix: false,
        locale: fr
      });
    } catch (e) {
      return "jodi a";
    }
  };

  // Function to handle sending a message
  const handleSendMessage = async () => {
    if (newMessage.trim() === "" || !activeConversation) return;
    
    await sendMessage(newMessage);
    setNewMessage("");
  };

  // Search for users when userSearchTerm changes
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (userSearchTerm) {
        searchUsers(userSearchTerm);
      } else {
        setUserSearchResults([]);
      }
    }, 300);
    
    return () => clearTimeout(delayDebounce);
  }, [userSearchTerm]);

  // Scroll to bottom of messages when new ones arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Function to view a user's profile
  const navigateToUserProfile = (userId: string) => {
    // For now, we're just navigating to the profile page
    // In the future, this could be a modal or a separate page with the user's profile
    window.location.href = `/profile/${userId}`;
  };

  // New Message Modal Component
  const NewMessageModal = () => {
    if (!showNewMessageModal) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-finance-navy rounded-lg max-w-md w-full p-4 m-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Nouvo Mesaj</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => {
                setShowNewMessageModal(false);
                setUserSearchTerm("");
                setUserSearchResults([]);
                setSelectedUser(null);
              }}
            >
              <X size={18} />
            </Button>
          </div>
          
          <div className="mb-4">
            {selectedUser ? (
              <div className="flex items-center justify-between bg-finance-lightGray/70 dark:bg-white/10 p-2 rounded">
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src={selectedUser.avatar_url || ""} />
                    <AvatarFallback className="bg-finance-blue text-white">
                      {selectedUser.full_name 
                        ? selectedUser.full_name.split(' ').map(n => n[0]).join('')
                        : selectedUser.username?.substring(0, 2) || "??"}
                    </AvatarFallback>
                  </Avatar>
                  <span>{selectedUser.full_name || selectedUser.username}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedUser(null)}
                >
                  <X size={16} />
                </Button>
              </div>
            ) : (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-finance-charcoal/50 dark:text-white/50 h-4 w-4" />
                <Input 
                  placeholder="Chèche itilizatè..." 
                  className="pl-10"
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                />
              </div>
            )}
          </div>
          
          {!selectedUser && userSearchResults.length > 0 && (
            <div className="max-h-60 overflow-y-auto mb-4">
              {userSearchResults.map(user => (
                <div 
                  key={user.id}
                  className="flex items-center space-x-3 p-2 hover:bg-finance-lightGray/50 dark:hover:bg-white/5 cursor-pointer rounded"
                  onClick={() => setSelectedUser(user)}
                >
                  <Avatar>
                    <AvatarImage src={user.avatar_url || ""} />
                    <AvatarFallback className="bg-finance-blue text-white">
                      {user.full_name 
                        ? user.full_name.split(' ').map(n => n[0]).join('')
                        : user.username?.substring(0, 2) || "??"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.full_name || "Itilizatè"}</p>
                    <p className="text-sm text-finance-charcoal/70 dark:text-white/70">
                      @{user.username || "username"}
                    </p>
                  </div>
                  {user.isFriend && (
                    <span className="ml-auto text-xs bg-finance-blue/10 text-finance-blue dark:bg-finance-blue/20 py-1 px-2 rounded-full">
                      Zanmi
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {!selectedUser && userSearchTerm && userSearchResults.length === 0 && !searchingUsers && (
            <div className="text-center py-4 text-finance-charcoal/70 dark:text-white/70">
              Pa gen rezilta pou "{userSearchTerm}"
            </div>
          )}
          
          {searchingUsers && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-finance-blue" />
            </div>
          )}
          
          <div className="flex justify-end">
            <Button
              onClick={startNewConversation}
              disabled={!selectedUser}
            >
              Kòmanse Konvèsasyon
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="h-[calc(100vh-5rem)] overflow-hidden">
        <div className="grid md:grid-cols-3 h-full gap-4">
          {/* Left sidebar - conversation list */}
          <div className="md:col-span-1 finance-card overflow-hidden flex flex-col">
            <div className="p-4 border-b border-finance-midGray/30 dark:border-white/10">
              <div className="flex justify-between items-center mb-3">
                <h1 className="text-xl font-bold">Mesaj</h1>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowNewMessageModal(true)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Nouvo
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-finance-charcoal/50 dark:text-white/50 h-4 w-4" />
                <Input 
                  placeholder="Chèche konvèsasyon..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="overflow-y-auto flex-grow">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-6 w-6 animate-spin text-finance-blue" />
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-4 text-center text-finance-charcoal/70 dark:text-white/70">
                  <p className="mb-2">Pa gen konvèsasyon pou montre</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowNewMessageModal(true)}
                    className="mx-auto"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Kòmanse yon konvèsasyon
                  </Button>
                </div>
              ) : (
                filteredConversations.map(conversation => {
                  const unreadCount = messages.filter(
                    msg => msg.receiver_id === user?.id && !msg.read
                  ).length;
                  
                  return (
                    <div 
                      key={conversation.id}
                      className={`p-3 border-b border-finance-midGray/10 dark:border-white/5 cursor-pointer hover:bg-finance-lightGray/50 dark:hover:bg-white/5 transition-colors ${activeConversation?.id === conversation.id ? 'bg-finance-lightGray/70 dark:bg-white/10' : ''}`}
                      onClick={() => setActiveConversation(conversation)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar>
                            <AvatarImage src={conversation.otherUser?.avatar_url || ""} />
                            <AvatarFallback className="bg-finance-blue text-white">
                              {conversation.otherUser?.full_name 
                                ? conversation.otherUser.full_name.split(' ').map(n => n[0]).join('')
                                : "??"}
                            </AvatarFallback>
                          </Avatar>
                          <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-finance-navy ${getStatusColor(conversation.otherUser?.status)}`}></span>
                        </div>
                        
                        <div className="flex-grow min-w-0">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium truncate">
                              {conversation.otherUser?.full_name || "Itilizatè"}
                            </h3>
                            <span className="text-xs text-finance-charcoal/70 dark:text-white/70 whitespace-nowrap">
                              {conversation.lastMessage 
                                ? formatTime(conversation.lastMessage.created_at)
                                : formatTime(conversation.created_at)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-finance-charcoal/70 dark:text-white/70 truncate">
                              {conversation.lastMessage?.content || "Pa gen mesaj"}
                            </p>
                            {unreadCount > 0 && (
                              <span className="bg-finance-blue text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
          
          {/* Right side - active conversation */}
          <div className="md:col-span-2 finance-card overflow-hidden flex flex-col">
            {activeConversation ? (
              <>
                {/* Conversation header */}
                <div className="p-4 border-b border-finance-midGray/30 dark:border-white/10 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={activeConversation.otherUser?.avatar_url || ""} />
                      <AvatarFallback className="bg-finance-blue text-white">
                        {activeConversation.otherUser?.full_name
                          ? activeConversation.otherUser.full_name.split(' ').map(n => n[0]).join('')
                          : "??"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="font-bold">{activeConversation.otherUser?.full_name || "Itilizatè"}</h2>
                      <div className="flex items-center space-x-1">
                        <span className={`h-2 w-2 rounded-full ${getStatusColor(activeConversation.otherUser?.status)}`}></span>
                        <span className="text-xs text-finance-charcoal/70 dark:text-white/70">
                          {activeConversation.otherUser?.status === "online" ? "Anliy" : 
                          activeConversation.otherUser?.status === "away" ? "Absán" : "Òfliy"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigateToUserProfile(activeConversation.otherUser?.id || "")}
                    >
                      Wè Pwofil
                    </Button>
                  </div>
                </div>
                
                {/* Messages area */}
                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                  {loading ? (
                    <div className="flex items-center justify-center h-32">
                      <Loader2 className="h-6 w-6 animate-spin text-finance-blue" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-center text-finance-charcoal/70 dark:text-white/70">
                      <p>Pa gen mesaj yo. Kòmanse yon konvèsasyon!</p>
                    </div>
                  ) : (
                    messages.map(message => (
                      <div key={message.id} className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] ${message.sender_id === user?.id ? 
                          'bg-finance-blue text-white rounded-t-lg rounded-bl-lg' : 
                          'bg-finance-lightGray/70 dark:bg-white/10 text-finance-charcoal dark:text-white rounded-t-lg rounded-br-lg'
                        } p-3`}>
                          <p>{message.content}</p>
                          <p className={`text-xs mt-1 ${message.sender_id === user?.id ? 'text-white/70' : 'text-finance-charcoal/70 dark:text-white/70'}`}>
                            {formatTime(message.created_at)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Message input */}
                <div className="p-4 border-t border-finance-midGray/30 dark:border-white/10">
                  <div className="flex space-x-2">
                    <Textarea 
                      placeholder="Tape mesaj ou a..." 
                      className="min-h-[60px] resize-none"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      disabled={sendingMessage}
                    />
                    <Button 
                      className="self-end" 
                      onClick={handleSendMessage}
                      disabled={sendingMessage || newMessage.trim() === ""}
                    >
                      {sendingMessage ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4 mr-2" />
                      )}
                      Voye
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">Pa gen konvèsasyon ki seleksyone</h3>
                  <p className="text-finance-charcoal/70 dark:text-white/70 mb-4">
                    Chwazi yon konvèsasyon oswa kòmanse yon nouvo konvèsasyon
                  </p>
                  <Button 
                    onClick={() => setShowNewMessageModal(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvo Mesaj
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* New Message Modal */}
      <NewMessageModal />
    </Layout>
  );
};

export default MessagesPage;
