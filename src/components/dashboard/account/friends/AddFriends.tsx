
import { useUserSearch } from "@/hooks/useUserSearch";
import UserSearchForm from './UserSearchForm';
import UserSearchResults from './UserSearchResults';

interface AddFriendsProps {
  fetchAllUsers: () => Promise<void>;
}

const AddFriends = ({ fetchAllUsers }: AddFriendsProps) => {
  const {
    searchTerm,
    setSearchTerm,
    searchResults,
    isSearching,
    handleSearch,
    sendFriendRequest,
    startConversation
  } = useUserSearch(fetchAllUsers);

  return (
    <>
      <h3 className="text-lg font-medium mb-4">Ajoute Zanmi</h3>
      
      <UserSearchForm
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
        isSearching={isSearching}
        isDisabled={!searchTerm.trim()}
      />
      
      <UserSearchResults
        results={searchResults}
        isLoading={isSearching}
        searchTerm={searchTerm}
        sendFriendRequest={sendFriendRequest}
        startConversation={startConversation}
        emptyMessage="Chèche itilizatè pou ajoute kòm zanmi."
      />
    </>
  );
};

export default AddFriends;
