
import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UserSearchFormProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSearch: () => void;
  isSearching: boolean;
  isDisabled?: boolean;
  placeholder?: string;
  autoSearch?: boolean;
}

const UserSearchForm = ({
  searchTerm,
  setSearchTerm,
  handleSearch,
  isSearching,
  isDisabled = false,
  placeholder = "Chèche itilizatè pa non oswa non itilizatè...",
  autoSearch = false,
}: UserSearchFormProps) => {
  return (
    <div className="mb-6">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-finance-charcoal/50 dark:text-white/50 h-4 w-4" />
        <Input 
          placeholder={placeholder} 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="pl-10"
        />
      </div>
      {!autoSearch && (
        <Button 
          onClick={handleSearch}
          disabled={isSearching || isDisabled || searchTerm.length < 2}
        >
          {isSearching ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Search className="h-4 w-4 mr-2" />
          )}
          Chèche
        </Button>
      )}
    </div>
  );
};

export default UserSearchForm;
