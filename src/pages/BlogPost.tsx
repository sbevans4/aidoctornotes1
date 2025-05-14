
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { getBlogPostBySlug, getRelatedBlogPosts } from "@/services/blogService";
import { BlogPost as BlogPostType } from "@/types/blog";
import { AuthorCard } from "@/components/blog/AuthorCard";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Tag, ArrowLeft, Share2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      const blogPost = getBlogPostBySlug(slug);
      if (blogPost) {
        setPost(blogPost);
        setRelatedPosts(getRelatedBlogPosts(blogPost, 3));
      }
      setIsLoading(false);
      // Scroll to top when post changes
      window.scrollTo(0, 0);
    }
  }, [slug]);

  const handleSharePost = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.excerpt,
        url: window.location.href,
      }).catch(error => console.log('Sharing failed', error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "The article link has been copied to your clipboard",
      });
    }
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-16">Loading...</div>;
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Article not found</h1>
        <p className="text-gray-500 mb-8">The article you're looking for doesn't exist or has been moved.</p>
        <Button onClick={() => navigate("/blog")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to blog
        </Button>
      </div>
    );
  }

  const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <Helmet>
        <title>{post.title} | ConvoNotes Genius Blog</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={`${post.title} | ConvoNotes Genius Blog`} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.featuredImage} />
        <meta property="og:type" content="article" />
      </Helmet>

      {/* Article Header */}
      <div className="bg-gradient-to-b from-medical-primary/10 to-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/blog")}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to all articles
          </Button>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">{post.title}</h1>
          
          <div className="flex flex-wrap items-center text-sm text-gray-600 gap-x-6 gap-y-2 mb-8">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              {formattedDate}
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              {post.readingTime} min read
            </div>
            <div className="flex items-center">
              <Tag className="h-4 w-4 mr-2" />
              {post.category.name}
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleSharePost}
            className="hidden sm:flex"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share article
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-8 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-6">
            {/* Featured Image */}
            <div className="mb-8 rounded-lg overflow-hidden">
              <img 
                src={post.featuredImage} 
                alt={post.title}
                className="w-full h-auto object-cover" 
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg";
                }}
              />
            </div>
            
            {/* Article Content */}
            <article 
              className="prose prose-lg max-w-none mb-12"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <span 
                  key={tag}
                  className="inline-block bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700 cursor-pointer hover:bg-gray-200"
                  onClick={() => {
                    navigate("/blog");
                    // We'll need to handle this in the Blog component
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
            
            {/* Share Button (Mobile) */}
            <div className="mb-8 sm:hidden">
              <Button
                onClick={handleSharePost}
                className="w-full"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share article
              </Button>
            </div>
            
            {/* Author Info */}
            <div className="mb-12">
              <h2 className="text-xl font-bold mb-4">About the author</h2>
              <AuthorCard author={post.author} showBio={true} />
            </div>
            
            {/* Related Posts */}
            {relatedPosts.length > 0 && <RelatedPosts posts={relatedPosts} />}
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-2">
            {/* Sidebar content - can add things like newsletter signup, most popular posts, etc. */}
            <div className="sticky top-24">
              {/* This will be filled in later if needed */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogPost;
