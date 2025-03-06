
import { useRef, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, Plus, Trash2, MoreVertical, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Conversation, Message } from "@/types/messaging";
import { User } from "@supabase/supabase-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConversationViewProps {
  activeConversation: Conversation | null;
  messages: Message[];
  loading: boolean;
  user: User | null;
  newMessage: string;
  setNewMessage: (value: string) => void;
  handleSendMessage: () => void;
  sendingMessage: boolean;
  navigateToUserProfile: (userId: string) => void;
  onNewConversation: () => void;
  deleteMessage?: (messageId: string) => Promise<void>;
  deleteConversation?: (conversationId: string) => Promise<void>;
}

export const ConversationView = ({
  activeConversation,
  messages,
  loading,
  user,
  newMessage,
  setNewMessage,
  handleSendMessage,
  sendingMessage,
  navigateToUserProfile,
  onNewConversation,
  deleteMessage,
  deleteConversation
}: ConversationViewProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const [showDeleteConversationDialog, setShowDeleteConversationDialog] = useState(false);

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

  // Scroll to bottom of messages when new ones arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleDeleteMessage = async () => {
    if (messageToDelete && deleteMessage) {
      await deleteMessage(messageToDelete);
      setMessageToDelete(null);
    }
  };

  const handleDeleteConversation = async () => {
    if (activeConversation && deleteConversation) {
      await deleteConversation(activeConversation.id);
      setShowDeleteConversationDialog(false);
    }
  };

  if (!activeConversation) {
    return (
      <div className="md:col-span-2 finance-card overflow-hidden flex flex-col">
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">Pa gen konvèsasyon ki seleksyone</h3>
            <p className="text-finance-charcoal/70 dark:text-white/70 mb-4">
              Chwazi yon konvèsasyon oswa kòmanse yon nouvo konvèsasyon
            </p>
            <Button 
              onClick={onNewConversation}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouvo Mesaj
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="md:col-span-2 finance-card overflow-hidden flex flex-col">
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
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigateToUserProfile(activeConversation.otherUser?.id || "")}
          >
            Wè Pwofil
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowDeleteConversationDialog(true)} className="text-red-500">
                <Trash2 className="h-4 w-4 mr-2" />
                Siprime Konvèsasyon
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
              <div className={`max-w-[75%] relative group ${message.sender_id === user?.id ? 
                'bg-finance-blue text-white rounded-t-lg rounded-bl-lg' : 
                'bg-finance-lightGray/70 dark:bg-white/10 text-finance-charcoal dark:text-white rounded-t-lg rounded-br-lg'
              } p-3`}>
                <p>{message.content}</p>
                <p className={`text-xs mt-1 ${message.sender_id === user?.id ? 'text-white/70' : 'text-finance-charcoal/70 dark:text-white/70'}`}>
                  {formatTime(message.created_at)}
                </p>
                
                {message.sender_id === user?.id && deleteMessage && (
                  <button 
                    onClick={() => setMessageToDelete(message.id)}
                    className="absolute opacity-0 group-hover:opacity-100 -right-3 -top-3 bg-white dark:bg-gray-800 rounded-full p-1 text-red-500 hover:text-red-700 transition-opacity"
                    aria-label="Delete message"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
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

      {/* Delete Message Dialog */}
      <AlertDialog open={!!messageToDelete} onOpenChange={(open) => !open && setMessageToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Siprime Mesaj</AlertDialogTitle>
            <AlertDialogDescription>
              Èske ou sèten ou vle siprime mesaj sa a? Aksyon sa a pa kapab anile.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anile</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMessage} className="bg-red-500 hover:bg-red-600">
              Siprime
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Conversation Dialog */}
      <AlertDialog open={showDeleteConversationDialog} onOpenChange={setShowDeleteConversationDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Siprime Konvèsasyon</AlertDialogTitle>
            <AlertDialogDescription>
              Èske ou sèten ou vle siprime konvèsasyon sa a? Tout mesaj yo ap efase epi aksyon sa a pa kapab anile.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anile</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConversation} className="bg-red-500 hover:bg-red-600">
              Siprime
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
