
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { UserSearchResult } from "@/types/messaging";

/**
 * Searches users by name or username
 */
export const searchUsersApi = async (searchTerm: string, userId: string) => {
  try {
    // Search directly from profiles table
    const { data: usersData, error: usersError } = await supabase
      .from('profiles')
      .select('id, full_name, username, avatar_url')
      .or(`full_name.ilike.%${searchTerm}%,username.ilike.%${searchTerm}%`)
      .neq('id', userId)
      .limit(10);
    
    if (usersError) throw usersError;
    
    // Get existing friend connections for these users
    const { data: friendsData, error: friendsError } = await supabase
      .from('friends')
      .select('id, user_id, friend_id, status')
      .or(`user_id.eq.${userId}.and.friend_id.in.(${usersData.map(u => `"${u.id}"`).join(',')}),
           friend_id.eq.${userId}.and.user_id.in.(${usersData.map(u => `"${u.id}"`).join(',')})`)
      .is('status', 'accepted');
    
    if (friendsError && usersData.length > 0) throw friendsError;
    
    // Get pending friend requests
    const { data: pendingData, error: pendingError } = await supabase
      .from('friends')
      .select('id, user_id, friend_id, status')
      .or(`user_id.eq.${userId}.and.friend_id.in.(${usersData.map(u => `"${u.id}"`).join(',')}),
           friend_id.eq.${userId}.and.user_id.in.(${usersData.map(u => `"${u.id}"`).join(',')})`)
      .eq('status', 'pending');
    
    if (pendingError && usersData.length > 0) throw pendingError;
    
    // Map search results with friend status
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
        ...user,
        isFriend: !!friendConnection,
        friendStatus: pendingConnection ? pendingConnection.status : undefined
      };
    });
    
    return resultsWithFriendStatus;
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
};

/**
 * Sends a friend request to another user
 */
export const sendFriendRequestApi = async (userId: string, friendId: string) => {
  try {
    const { error } = await supabase
      .from('friends')
      .insert({
        user_id: userId,
        friend_id: friendId,
        status: 'pending'
      });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error sending friend request:', error);
    throw error;
  }
};
