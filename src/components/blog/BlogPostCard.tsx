
import React from "react";
import { useNavigate } from "react-router-dom";
import { BlogPost } from "@/types/blog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlogPostCardProps {
  post: BlogPost;
  featured?: boolean;
}

export const BlogPostCard: React.FC<BlogPostCardProps> = ({ post, featured = false }) => {
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
    <Card 
      className={cn(
        "h-full flex flex-col overflow-hidden hover:shadow-md transition-all border border-gray-200 group",
        featured && "md:col-span-2"
      )}
    >
      <div 
        className={cn(
          "relative cursor-pointer overflow-hidden",
          featured ? "h-64" : "h-48" 
        )}
        onClick={handleCardClick}
      >
        <img 
          src={post.featuredImage} 
          alt={post.title} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
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
          className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-medical-primary cursor-pointer transition-colors"
          onClick={handleCardClick}
        >
          {post.title}
        </h2>
        
        <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
          {post.excerpt}
        </p>
        
        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex flex-wrap items-center text-sm text-gray-500 gap-x-4 gap-y-2">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1.5" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1.5" />
                <span>{post.readingTime} min read</span>
              </div>
            </div>
            
            <button 
              onClick={handleCardClick}
              className="flex items-center text-sm text-medical-primary font-medium mt-2 sm:mt-0 group-hover:underline"
            >
              Read more
              <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
