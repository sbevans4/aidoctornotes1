
import React from "react";
import { useNavigate } from "react-router-dom";
import { getRecentBlogPosts } from "@/services/blogService";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlogPostCard } from "@/components/blog/BlogPostCard";

export const FeaturedBlogPosts = () => {
  const navigate = useNavigate();
  const featuredPosts = getRecentBlogPosts(3);
  
  return (
    <section className="py-12 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest Healthcare Insights</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Expert perspectives on AI in healthcare documentation and clinical efficiency
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {featuredPosts.map((post, index) => (
            <BlogPostCard 
              key={post.id} 
              post={post} 
              featured={index === 0}
            />
          ))}
        </div>
        
        <div className="text-center">
          <Button 
            onClick={() => navigate("/blog")}
            className="px-8"
          >
            Browse all articles
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};
