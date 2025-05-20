
import React, { useState } from "react";
import { Search, X } from "lucide-react";

interface BlogSearchProps {
  onSearch: (query: string) => void;
}

export const BlogSearch: React.FC<BlogSearchProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };
  
  const clearSearch = () => {
    setSearchQuery("");
    onSearch("");
  };
  
  return (
    <form 
      onSubmit={handleSubmit} 
      className="relative flex items-center mb-6"
    >
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
          <Search className="h-4 w-4" />
        </div>
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search articles by keyword, topic, or author..."
          className="py-3 px-10 w-full bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary/20 focus:border-medical-primary"
        />
        {searchQuery && (
          <button 
            type="button"
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            <span className="sr-only">Clear search</span>
          </button>
        )}
      </div>
      <button
        type="submit"
        className="ml-2 px-4 py-3 bg-medical-primary text-white font-medium rounded-md hover:bg-medical-primary/90 transition-colors"
      >
        Search
      </button>
    </form>
  );
};
