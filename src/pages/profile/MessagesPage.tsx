import { useState, useRef, useEffect } from "react";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Search, Send, Loader2 } from "lucide-react";
import { useMessaging } from "@/hooks/useMessaging";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

const MessagesPage = () => {
  const { user } = useAuth();
  const {
    conversations, 
    activeConversation, 
    messages,
    loading,
    sendingMessage,
    setActiveConversation,
    sendMessage
  } = useMessaging();
  const [searchTerm, setSearchTerm] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Filter conversations based on search term
  const filteredConversations = conversations.filter(convo => 
    convo.otherUser?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    convo.otherUser?.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <Layout>
      <div className="h-[calc(100vh-5rem)] overflow-hidden">
        <div className="grid md:grid-cols-3 h-full gap-4">
          {/* Left sidebar - conversation list */}
          <div className="md:col-span-1 finance-card overflow-hidden flex flex-col">
            <div className="p-4 border-b border-finance-midGray/30 dark:border-white/10">
              <h1 className="text-xl font-bold mb-3">Mesaj</h1>
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
                  Pa gen konvèsasyon pou montre
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
                  <p className="text-finance-charcoal/70 dark:text-white/70">
                    Chwazi yon konvèsasyon oswa kòmanse yon nouvo konvèsasyon
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MessagesPage;
