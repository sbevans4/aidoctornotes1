
import React from "react";
import { BlogCategory, BlogPost } from "@/types/blog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";

interface BlogSidebarProps {
  categories: BlogCategory[];
  recentPosts: BlogPost[];
  popularTags: string[];
  onSelectCategory: (categoryId: string) => void;
  onSelectTag: (tag: string) => void;
  isLoading?: boolean;
}

export const BlogSidebar: React.FC<BlogSidebarProps> = ({
  categories,
  recentPosts,
  popularTags,
  onSelectCategory,
  onSelectTag,
  isLoading = false
}) => {
  const handleCategoryClick = (categoryId: string) => {
    onSelectCategory(categoryId);
  };
  
  const handleTagClick = (tag: string) => {
    onSelectTag(tag);
  };
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-2/3 animate-pulse"></div>
          </CardHeader>
          <CardContent className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            ))}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-2/3 animate-pulse"></div>
          </CardHeader>
          <CardContent className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="h-16 w-16 bg-gray-200 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-2/3 animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 animate-pulse">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-8 bg-gray-200 rounded-full w-16"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1">
            {categories.map((category) => (
              <li key={category.id}>
                <button 
                  onClick={() => handleCategoryClick(category.id)}
                  className="flex items-center justify-between w-full py-2 text-left text-gray-700 hover:text-medical-primary transition-colors"
                >
                  <span>{category.name}</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      {/* Recent Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <div key={post.id} className="flex gap-3">
                <div 
                  className="h-16 w-16 bg-gray-100 rounded overflow-hidden flex-shrink-0 cursor-pointer"
                  onClick={() => window.location.href = `/blog/${post.slug}`}
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
                <div>
                  <h4 
                    className="font-medium text-sm line-clamp-2 hover:text-medical-primary cursor-pointer"
                    onClick={() => window.location.href = `/blog/${post.slug}`}
                  >
                    {post.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Popular Tags */}
      <Card>
        <CardHeader>
          <CardTitle>Popular Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => handleTagClick(tag)}
              >
                #{tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Newsletter Signup */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle>Stay Updated</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Subscribe to our newsletter for the latest articles and insights.
          </p>
          <div className="space-y-2">
            <input 
              type="email" 
              placeholder="Your email address"
              className="w-full px-3 py-2 border rounded-md text-sm"
            />
            <button className="w-full bg-medical-primary text-white py-2 rounded-md text-sm hover:bg-medical-primary/90 transition-colors">
              Subscribe
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
