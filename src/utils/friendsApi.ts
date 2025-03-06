
import { supabase } from "@/lib/supabase";
import { Friend, UserSearchResult } from "@/types/messaging";
import { toast as showToast } from "@/hooks/use-toast";

/**
 * Fetches all users from the database except the current user
 */
export const fetchAllUsersApi = async (userId: string) => {
  try {
    // Fetch all users except the current user, directly from profiles table
    const { data: usersData, error: usersError } = await supabase
      .from('profiles')
      .select('id, full_name, username, avatar_url')
      .neq('id', userId)
      .order('full_name', { ascending: true });
    
    if (usersError) throw usersError;
    
    // Get existing friend connections for these users
    const { data: friendsData, error: friendsError } = await supabase
      .from('friends')
      .select('id, user_id, friend_id, status')
      .or(
        `user_id.eq.${userId},friend_id.eq.${userId}`
      );
    
    if (friendsError) throw friendsError;
    
    // Map all users with friend status, directly using the profile data
    const usersWithFriendStatus = usersData.map(userData => {
      const friendConnection = friendsData?.find(f => 
        (f.user_id === userData.id && f.friend_id === userId) || 
        (f.friend_id === userData.id && f.user_id === userId)
      );
      
      return {
        ...userData,
        isFriend: friendConnection?.status === 'accepted',
        friendStatus: friendConnection?.status as "pending" | "accepted" | "rejected" | undefined
      };
    });
    
    return usersWithFriendStatus;
  } catch (error) {
    console.error('Error fetching all users:', error);
    showToast({
      title: "Erè",
      description: "Nou pa kapab chaje tout itilizatè yo",
      variant: "destructive"
    });
    throw error;
  }
};

/**
 * Fetches friends and friend requests for the current user
 */
export const fetchFriendsApi = async (userId: string) => {
  try {
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
      .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
      .eq('status', 'accepted');
    
    if (friendsError) throw friendsError;
    
    // Process friends data to ensure the friend property has the other user's info
    const processedFriends = friendsData.map(friend => {
      // Get friend profile data safely
      const friendProfile = Array.isArray(friend.friend) ? friend.friend[0] : friend.friend;
      
      // If the current user is the friend_id, swap the friend property to show the user info
      if (friend.friend_id === userId) {
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
      if (friend.friend_id === userId) {
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
      .eq('friend_id', userId)
      .eq('status', 'pending');
    
    if (requestsError) throw requestsError;
    
    // Handle case where friend could be an array
    const processedRequests = requestsData.map(request => ({
      ...request,
      friend: Array.isArray(request.friend) ? request.friend[0] : request.friend
    }));
    
    return {
      friendsData: friendsWithProfiles as Friend[],
      requestsData: processedRequests as Friend[]
    };
  } catch (error) {
    console.error('Error fetching friends:', error);
    showToast({
      title: "Erè",
      description: "Nou pa kapab chaje zanmi ou yo",
      variant: "destructive"
    });
    throw error;
  }
};
