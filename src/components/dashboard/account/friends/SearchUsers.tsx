
import { useEffect } from 'react';
import { Loader2 } from "lucide-react";
import { useUserSearch } from "@/hooks/useUserSearch";
import UserSearchForm from './UserSearchForm';
import UserSearchResults from './UserSearchResults';

interface SearchUsersProps {
  fetchAllUsers: () => Promise<void>;
}

const SearchUsers = ({ fetchAllUsers }: SearchUsersProps) => {
  const {
    searchTerm,
    setSearchTerm,
    searchResults,
    isSearching,
    handleSearch,
    sendFriendRequest,
    startConversation
  } = useUserSearch(fetchAllUsers);

  // Effect to search when userSearchTerm changes
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim().length >= 2) {
        handleSearch();
      }
    }, 500);
    
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  return (
    <>
      <h3 className="text-lg font-medium mb-4">Chèche Nouvo Itilizatè</h3>
      
      <UserSearchForm
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
        isSearching={isSearching}
        isDisabled={searchTerm.length < 2}
        autoSearch={true}
      />
      
      {isSearching ? (
        <div className="flex justify-center my-4">
          <Loader2 className="h-6 w-6 animate-spin text-finance-blue" />
        </div>
      ) : (
        <UserSearchResults
          results={searchResults}
          isLoading={isSearching}
          searchTerm={searchTerm}
          sendFriendRequest={sendFriendRequest}
          startConversation={startConversation}
          emptyMessage="Chèche itilizatè pou jwenn yo."
        />
      )}
    </>
  );
};

export default SearchUsers;
