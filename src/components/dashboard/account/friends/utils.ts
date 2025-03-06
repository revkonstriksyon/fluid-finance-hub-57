
import { Friend, FriendProfile } from "@/types/messaging";
import { supabase } from "@/lib/supabase";

// Helper function to get friend profile data safely
export const getFriendProfile = (friend: Friend): FriendProfile => {
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

// Function to programmatically switch tabs
export const switchToTab = (tabValue: string) => {
  const tabTrigger = document.querySelector(`[data-value="${tabValue}"]`) as HTMLButtonElement | null;
  if (tabTrigger) {
    tabTrigger.click();
  }
};

