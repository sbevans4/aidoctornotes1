
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { getBlogPostBySlug, getRelatedBlogPosts } from "@/services/blogService";
import { BlogPost as BlogPostType } from "@/types/blog";
import { AuthorCard } from "@/components/blog/AuthorCard";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Tag, ArrowLeft, Share2, Twitter, Facebook, Linkedin } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

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

  const getStructuredDataJSON = () => {
    if (!post) return null;
    
    const articleData = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": post.title,
      "description": post.excerpt,
      "image": post.featuredImage,
      "datePublished": post.publishedAt,
      "dateModified": post.publishedAt,
      "author": {
        "@type": "Person",
        "name": post.author.name
      },
      "publisher": {
        "@type": "Organization",
        "name": "ConvoNotes Genius",
        "logo": {
          "@type": "ImageObject",
          "url": "/logo.png"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": window.location.href
      }
    };
    
    return JSON.stringify(articleData);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 animate-pulse">
        <div className="h-8 w-3/4 bg-gray-200 rounded mb-6"></div>
        <div className="h-6 w-1/2 bg-gray-200 rounded mb-12"></div>
        <div className="h-64 bg-gray-200 rounded mb-8"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>
    );
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
        
        {/* Open Graph Tags */}
        <meta property="og:title" content={`${post.title} | ConvoNotes Genius Blog`} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.featuredImage} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={window.location.href} />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:image" content={post.featuredImage} />
        
        {/* Article Specific Tags */}
        <meta property="article:published_time" content={post.publishedAt} />
        <meta property="article:section" content={post.category.name} />
        {post.tags.map((tag, index) => (
          <meta key={index} property="article:tag" content={tag} />
        ))}
        
        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">{getStructuredDataJSON()}</script>
      </Helmet>

      {/* Article Header */}
      <div className="bg-gradient-to-b from-medical-primary/10 to-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/blog")}
              className="hover:bg-white/50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to all articles
            </Button>
            
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm text-gray-500">Share:</span>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 rounded-full"
                onClick={() => {
                  window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`, '_blank');
                }}
              >
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Share on Twitter</span>
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 rounded-full"
                onClick={() => {
                  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
                }}
              >
                <Facebook className="h-4 w-4" />
                <span className="sr-only">Share on Facebook</span>
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 rounded-full"
                onClick={() => {
                  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
                }}
              >
                <Linkedin className="h-4 w-4" />
                <span className="sr-only">Share on LinkedIn</span>
              </Button>
            </div>
          </div>

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
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-8 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-6">
            {/* Featured Image */}
            <div className="mb-8 rounded-lg overflow-hidden shadow-md">
              <figure>
                <img 
                  src={post.featuredImage} 
                  alt={post.title}
                  className="w-full h-auto object-cover" 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                  }}
                />
                <figcaption className="text-sm text-gray-500 italic text-center mt-2">
                  {post.title} - Featured Image
                </figcaption>
              </figure>
            </div>
            
            {/* Article Content */}
            <article 
              className={cn(
                "prose prose-lg max-w-none mb-12",
                "prose-headings:text-gray-900 prose-headings:font-bold prose-headings:scroll-m-20",
                "prose-p:text-gray-700 prose-a:text-medical-primary prose-a:no-underline hover:prose-a:underline",
                "prose-img:rounded-lg prose-img:shadow-md",
                "prose-blockquote:border-l-4 prose-blockquote:border-medical-primary/50 prose-blockquote:pl-6 prose-blockquote:italic"
              )}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <span 
                  key={tag}
                  className="inline-block bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700 cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => navigate(`/blog?tag=${encodeURIComponent(tag)}`)}
                >
                  #{tag}
                </span>
              ))}
            </div>
            
            {/* Share Buttons (Mobile) */}
            <div className="sm:hidden mb-8">
              <p className="text-sm text-gray-500 mb-3">Share this article:</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`, '_blank');
                  }}
                >
                  <Twitter className="mr-2 h-4 w-4" />
                  Twitter
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
                  }}
                >
                  <Facebook className="mr-2 h-4 w-4" />
                  Facebook
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleSharePost}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Copy
                </Button>
              </div>
            </div>
            
            {/* Author Info */}
            <div className="mb-12 bg-gray-50 p-6 rounded-lg border border-gray-100">
              <h2 className="text-xl font-bold mb-4">About the author</h2>
              <AuthorCard author={post.author} showBio={true} />
            </div>
            
            {/* Related Posts */}
            {relatedPosts.length > 0 && <RelatedPosts posts={relatedPosts} />}
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-2">
            <div className="sticky top-20">
              <div className="bg-gray-50 rounded-lg p-5 mb-6 border border-gray-100">
                <h3 className="font-bold text-lg mb-4">Table of Contents</h3>
                <nav className="toc text-sm">
                  {/* This would ideally be generated from the content */}
                  <ul className="space-y-2 text-gray-600">
                    <li>
                      <a href="#introduction" className="hover:text-medical-primary">Introduction</a>
                    </li>
                    <li>
                      <a href="#main-points" className="hover:text-medical-primary">Main Points</a>
                    </li>
                    <li>
                      <a href="#conclusion" className="hover:text-medical-primary">Conclusion</a>
                    </li>
                  </ul>
                </nav>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
                <h3 className="font-bold text-lg mb-4">Subscribe to our Newsletter</h3>
                <p className="text-sm text-gray-600 mb-4">Get the latest insights on healthcare documentation delivered to your inbox</p>
                <div className="space-y-2">
                  <input 
                    type="email" 
                    placeholder="Your email address" 
                    className="w-full px-3 py-2 border rounded text-sm"
                  />
                  <Button className="w-full">Subscribe</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogPost;
