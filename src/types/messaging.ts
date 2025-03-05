
import { User } from "@supabase/supabase-js";

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  user1_id: string;
  user2_id: string;
  last_message_at: string;
  created_at: string;
  otherUser?: {
    id: string;
    full_name: string | null;
    username: string | null;
    avatar_url: string | null;
    status?: "online" | "offline" | "away";
  };
  lastMessage?: {
    content: string;
    created_at: string;
    read: boolean;
  };
}
