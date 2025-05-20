
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRecentBlogPosts } from "@/services/blogService";
import { ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PageLoading } from "@/components/ui/page-loading";

export const FeaturedBlogPosts = () => {
  const navigate = useNavigate();
  const [featuredPosts, setFeaturedPosts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        // Simulate network delay to show loading state in development
        const posts = await new Promise((resolve) => {
          setTimeout(() => resolve(getRecentBlogPosts(3)), 400);
        });
        setFeaturedPosts(posts);
      } catch (err) {
        console.error("Failed to fetch featured posts:", err);
        setError("Unable to load blog posts. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPosts();
  }, []);
  
  if (isLoading) {
    return (
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest Healthcare Insights</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Expert perspectives on AI in healthcare documentation and clinical efficiency
            </p>
          </div>
          <PageLoading isLoading={true} message="Loading featured articles..." />
        </div>
      </section>
    );
  }
  
  if (error) {
    return (
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest Healthcare Insights</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Expert perspectives on AI in healthcare documentation and clinical efficiency
            </p>
          </div>
          
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          
          <div className="text-center">
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
              className="mr-4"
            >
              Retry Loading
            </Button>
            <Button 
              onClick={() => navigate("/blog")}
            >
              Browse All Articles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    );
  }
  
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
          {featuredPosts && featuredPosts.map((post, index) => (
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
            aria-label="Browse all blog articles"
          >
            Browse all articles
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};
