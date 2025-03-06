
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { Conversation } from "@/types/messaging";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Trash2 } from "lucide-react";

interface ConversationHeaderProps {
  activeConversation: Conversation;
  navigateToUserProfile: (userId: string) => void;
  openDeleteDialog: () => void;
}

export const ConversationHeader = ({
  activeConversation,
  navigateToUserProfile,
  openDeleteDialog,
}: ConversationHeaderProps) => {
  // Function to get status color
  const getStatusColor = (status?: string) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "away": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  return (
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
            <DropdownMenuItem onClick={openDeleteDialog} className="text-red-500">
              <Trash2 className="h-4 w-4 mr-2" />
              Siprime Konvèsasyon
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
