
import { User } from "@/contexts/AuthContext";

// Define user profile information
export interface PostUserProfile {
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
}

// Define post data structure
export interface PostData {
  id: string;
  content: string;
  created_at: string;
  likes: number;
  comments: number;
  user_liked: boolean;
  user_id: string;
  user: PostUserProfile;
}

// Define post with profile from database
export interface PostWithProfile {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: PostUserProfile | null;
}
