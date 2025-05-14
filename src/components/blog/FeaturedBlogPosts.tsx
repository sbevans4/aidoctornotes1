
import React from "react";
import { useNavigate } from "react-router-dom";
import { getRecentBlogPosts } from "@/services/blogService";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const FeaturedBlogPosts = () => {
  const navigate = useNavigate();
  const featuredPosts = getRecentBlogPosts(3);
  
  return (
    <section className="py-12 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest Insights</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Expert perspectives on AI in healthcare documentation
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {featuredPosts.map((post) => (
            <Card key={post.id} className="h-full flex flex-col overflow-hidden hover:shadow-md transition-all">
              <div 
                className="h-48 bg-gray-200 relative"
                onClick={() => navigate(`/blog/${post.slug}`)}
                style={{ cursor: "pointer" }}
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
              </div>
              <CardContent className="p-6 flex-grow flex flex-col">
                <div className="mb-2">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {post.category.name}
                  </span>
                </div>
                <h3 
                  className="text-xl font-bold mb-3 hover:text-blue-600 cursor-pointer line-clamp-2"
                  onClick={() => navigate(`/blog/${post.slug}`)}
                >
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
                  {post.excerpt}
                </p>
                <div className="mt-auto pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </span>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-blue-600"
                      onClick={() => navigate(`/blog/${post.slug}`)}
                    >
                      Read more
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Button 
            onClick={() => navigate("/blog")}
            className="px-8"
          >
            View all articles
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};
