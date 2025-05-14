
import React from "react";
import { BlogPost } from "@/types/blog";
import { useNavigate } from "react-router-dom";

interface RelatedPostsProps {
  posts: BlogPost[];
}

export const RelatedPosts: React.FC<RelatedPostsProps> = ({ posts }) => {
  const navigate = useNavigate();

  if (posts.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div 
            key={post.id} 
            className="cursor-pointer"
            onClick={() => navigate(`/blog/${post.slug}`)}
          >
            <div className="mb-3 rounded overflow-hidden h-40">
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
            <h3 className="font-bold mb-2 line-clamp-2 hover:text-medical-primary">
              {post.title}
            </h3>
            <p className="text-sm text-gray-500">
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
