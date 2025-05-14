
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface BlogSearchProps {
  onSearch: (query: string) => void;
}

export const BlogSearch: React.FC<BlogSearchProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };
  
  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <input
          type="text"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-4 pr-16 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-transparent"
        />
        <Button 
          type="submit"
          className="absolute right-1 top-1 bottom-1 px-3"
          disabled={!searchQuery.trim()}
        >
          <Search className="h-4 w-4 mr-1" />
          <span>Search</span>
        </Button>
      </div>
    </form>
  );
};
