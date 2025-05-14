
import React from "react";
import { BlogCategory, BlogPost } from "@/types/blog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface BlogSidebarProps {
  categories: BlogCategory[];
  recentPosts: BlogPost[];
  popularTags: string[];
  onSelectCategory: (categoryId: string) => void;
  onSelectTag: (tag: string) => void;
}

export const BlogSidebar: React.FC<BlogSidebarProps> = ({
  categories,
  recentPosts,
  popularTags,
  onSelectCategory,
  onSelectTag,
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 sticky top-24">
      {/* Categories */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1.5">
            {categories.map((category) => (
              <div 
                key={category.id}
                onClick={() => onSelectCategory(category.id)}
                className="flex items-center justify-between text-sm py-2 px-1 hover:bg-gray-50 rounded cursor-pointer"
              >
                <span>{category.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Posts */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Recent Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <div 
                key={post.id}
                className="flex items-start gap-3 cursor-pointer"
                onClick={() => navigate(`/blog/${post.slug}`)}
              >
                <div className="w-16 h-16 flex-shrink-0 rounded overflow-hidden">
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
                  <h4 className="font-medium line-clamp-2 text-sm">{post.title}</h4>
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
        <CardHeader className="pb-3">
          <CardTitle>Popular Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <Badge 
                key={tag}
                variant="secondary" 
                className="cursor-pointer hover:bg-gray-200"
                onClick={() => onSelectTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
