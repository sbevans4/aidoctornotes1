
import React, { useState, useEffect, useRef } from "react";
import { Search, X, Loader2 } from "lucide-react";

interface BlogSearchProps {
  onSearch: (query: string) => void;
  isSearching?: boolean;
  initialQuery?: string;
}

export const BlogSearch: React.FC<BlogSearchProps> = ({ 
  onSearch, 
  isSearching = false, 
  initialQuery = "" 
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isDebouncing, setIsDebouncing] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Focus search input on mount
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);
  
  // Set up debounced search
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    if (searchQuery !== initialQuery) {
      setIsDebouncing(true);
      debounceTimerRef.current = setTimeout(() => {
        onSearch(searchQuery);
        setIsDebouncing(false);
      }, 500); // 500ms debounce
    }
    
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery, onSearch, initialQuery]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      setIsDebouncing(false);
    }
    onSearch(searchQuery);
  };
  
  const clearSearch = () => {
    setSearchQuery("");
    onSearch("");
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };
  
  return (
    <form 
      onSubmit={handleSubmit} 
      className="relative flex items-center mb-6"
      role="search"
    >
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
          <Search className="h-4 w-4" aria-hidden="true" />
        </div>
        <input
          type="search"
          ref={searchInputRef}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search articles by keyword, topic, or author..."
          className="py-3 px-10 w-full bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary/20 focus:border-medical-primary"
          aria-label="Search articles"
          disabled={isSearching}
        />
        {searchQuery && (
          <button 
            type="button"
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            aria-label="Clear search"
          >
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>
      <button
        type="submit"
        className="ml-2 px-4 py-3 bg-medical-primary text-white font-medium rounded-md hover:bg-medical-primary/90 transition-colors disabled:opacity-70"
        disabled={isSearching || isDebouncing}
        aria-label="Search articles"
      >
        {isSearching || isDebouncing ? (
          <div className="flex items-center">
            <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
            <span>{isSearching ? "Searching..." : "Typing..."}</span>
          </div>
        ) : (
          "Search"
        )}
      </button>
    </form>
  );
};
