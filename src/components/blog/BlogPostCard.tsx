
import React from "react";
import { useNavigate } from "react-router-dom";
import { BlogPost } from "@/types/blog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";

interface BlogPostCardProps {
  post: BlogPost;
}

export const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  const navigate = useNavigate();
  
  const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  
  const handleCardClick = () => {
    navigate(`/blog/${post.slug}`);
  };
  
  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-all border border-gray-200">
      <div 
        className="h-48 relative cursor-pointer" 
        onClick={handleCardClick}
      >
        <img 
          src={post.featuredImage} 
          alt={post.title} 
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
          }}
        />
        <div className="absolute top-3 left-3">
          <Badge className="bg-medical-primary/90 hover:bg-medical-primary text-white">
            {post.category.name}
          </Badge>
        </div>
      </div>
      
      <CardContent className="flex flex-col flex-grow p-5">
        <h2 
          className="text-xl font-bold mb-2 line-clamp-2 hover:text-medical-primary cursor-pointer"
          onClick={handleCardClick}
        >
          {post.title}
        </h2>
        
        <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
          {post.excerpt}
        </p>
        
        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center text-sm text-gray-500 justify-between">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span>{post.readingTime} min read</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
