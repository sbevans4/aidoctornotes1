
import React from "react";
import { BlogAuthor } from "@/types/blog";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AuthorCardProps {
  author: BlogAuthor;
  showBio?: boolean;
}

export const AuthorCard: React.FC<AuthorCardProps> = ({ author, showBio = false }) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={author.avatar} alt={author.name} />
            <AvatarFallback>{getInitials(author.name)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{author.name}</h3>
            {author.title && <p className="text-sm text-gray-500">{author.title}</p>}
          </div>
        </div>
        
        {showBio && author.bio && (
          <div className="mt-4">
            <p className="text-gray-600 text-sm">{author.bio}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
