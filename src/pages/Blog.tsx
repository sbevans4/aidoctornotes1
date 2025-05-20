
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, useSearchParams } from "react-router-dom";
import { 
  getAllBlogPosts, 
  getRecentBlogPosts,
  getAllCategories, 
  getBlogPostsByCategory,
  getBlogPostsByTag,
  searchBlogPosts
} from "@/services/blogService";
import { BlogPost, BlogCategory } from "@/types/blog";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { BlogSearch } from "@/components/blog/BlogSearch";
import { BlogSidebar } from "@/components/blog/BlogSidebar";
import { BlogPagination } from "@/components/blog/BlogPagination";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

const Blog = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [popularTags, setPopularTags] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [displayedPosts, setDisplayedPosts] = useState<BlogPost[]>([]);

  // Get structured data for blog listing
  const getStructuredDataJSON = () => {
    const blogData = {
      "@context": "https://schema.org",
      "@type": "Blog",
      "headline": "Healthcare Documentation Blog | ConvoNotes Genius",
      "description": "Explore insights on AI medical documentation, HIPAA compliance, and how AI is transforming healthcare documentation workflows.",
      "publisher": {
        "@type": "Organization",
        "name": "ConvoNotes Genius",
        "logo": {
          "@type": "ImageObject",
          "url": "/logo.png"
        }
      },
      "blogPost": displayedPosts.map(post => ({
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.excerpt,
        "datePublished": post.publishedAt,
        "image": post.featuredImage,
        "author": {
          "@type": "Person",
          "name": post.author.name
        }
      }))
    };
    
    return JSON.stringify(blogData);
  };
  
  // Initial data load
  useEffect(() => {
    setIsLoading(true);
    const allPosts = getAllBlogPosts();
    const categoriesData = getAllCategories();
    const recentPostsData = getRecentBlogPosts(4);
    
    // Extract and count tags from all posts
    const tagCount: Record<string, number> = {};
    allPosts.forEach(post => {
      post.tags.forEach(tag => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });
    
    // Get the top 10 most used tags
    const sortedTags = Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag]) => tag);
    
    // Check if we have query params to filter by
    const categoryParam = searchParams.get('category');
    const tagParam = searchParams.get('tag');
    const searchParam = searchParams.get('search');
    
    if (categoryParam) {
      const category = categoriesData.find(cat => cat.slug === categoryParam);
      if (category) {
        const filteredPosts = getBlogPostsByCategory(category.id);
        setPosts(filteredPosts);
        setActiveFilter(`Category: ${category.name}`);
      } else {
        setPosts(allPosts);
      }
    } else if (tagParam) {
      const filteredPosts = getBlogPostsByTag(tagParam);
      setPosts(filteredPosts);
      setActiveFilter(`Tag: ${tagParam}`);
    } else if (searchParam) {
      const results = searchBlogPosts(searchParam);
      setPosts(results);
      setActiveFilter(`Search: "${searchParam}"`);
    } else {
      setPosts(allPosts);
    }
    
    setCategories(categoriesData);
    setRecentPosts(recentPostsData);
    setPopularTags(sortedTags);
    setIsLoading(false);
  }, [searchParams]);
  
  // Update pagination whenever posts change
  useEffect(() => {
    setTotalPages(Math.ceil(posts.length / postsPerPage));
    // Reset to first page when posts change
    setCurrentPage(1);
  }, [posts, postsPerPage]);
  
  // Update displayed posts when current page changes
  useEffect(() => {
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    setDisplayedPosts(posts.slice(indexOfFirstPost, indexOfLastPost));
    
    // Scroll to top when page changes
    window.scrollTo(0, 0);
  }, [currentPage, posts, postsPerPage]);
  
  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setPosts(getAllBlogPosts());
      setActiveFilter("");
      navigate("/blog");
    } else {
      const results = searchBlogPosts(query);
      setPosts(results);
      setActiveFilter(`Search: "${query}"`);
      navigate(`/blog?search=${encodeURIComponent(query)}`);
    }
    setCurrentPage(1);
  };
  
  const handleSelectCategory = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (category) {
      const filteredPosts = getBlogPostsByCategory(categoryId);
      setPosts(filteredPosts);
      setActiveFilter(`Category: ${category.name}`);
      navigate(`/blog?category=${encodeURIComponent(category.slug)}`);
      setCurrentPage(1);
    }
  };
  
  const handleSelectTag = (tag: string) => {
    const filteredPosts = getBlogPostsByTag(tag);
    setPosts(filteredPosts);
    setActiveFilter(`Tag: ${tag}`);
    navigate(`/blog?tag=${encodeURIComponent(tag)}`);
    setCurrentPage(1);
  };
  
  const handleClearFilters = () => {
    setPosts(getAllBlogPosts());
    setActiveFilter("");
    navigate("/blog");
    setCurrentPage(1);
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  return (
    <>
      <Helmet>
        <title>Healthcare Documentation Blog | ConvoNotes Genius</title>
        <meta 
          name="description" 
          content="Explore insights on AI medical documentation, HIPAA compliance, and how AI is transforming healthcare documentation workflows."
        />
        <meta property="og:title" content="Healthcare Documentation Blog | ConvoNotes Genius" />
        <meta property="og:description" content="Insights on AI medical documentation and healthcare efficiency" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:image" content="/og-image.png" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Healthcare Documentation Blog | ConvoNotes Genius" />
        <meta name="twitter:description" content="Insights on AI medical documentation and healthcare efficiency" />
        <meta name="twitter:image" content="/og-image.png" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={window.location.origin + "/blog"} />
        
        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">{getStructuredDataJSON()}</script>
      </Helmet>
      
      <div className="bg-gradient-to-b from-medical-primary/10 to-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Healthcare Documentation Blog</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Expert insights on AI medical documentation, clinical efficiency, and the future of healthcare technology
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <BlogSearch onSearch={handleSearch} />
            </div>
            
            {activeFilter && (
              <div className="flex items-center gap-2 mb-6 bg-blue-50 p-3 rounded-md">
                <span className="text-sm font-medium">Filtered by: {activeFilter}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleClearFilters}
                  className="ml-auto text-xs h-8"
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Clear filter
                </Button>
              </div>
            )}
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {Array(6).fill(null).map((_, index) => (
                  <div key={index} className="animate-pulse bg-white rounded-lg shadow-sm border border-gray-200 h-80">
                    <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-100">
                <h2 className="text-2xl font-semibold mb-4">No articles found</h2>
                <p className="text-gray-500 mb-6">Try changing your search terms or clearing filters</p>
                <Button onClick={handleClearFilters}>View all articles</Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {displayedPosts.map((post) => (
                    <BlogPostCard key={post.id} post={post} />
                  ))}
                </div>
                
                <BlogPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <BlogSidebar
              categories={categories}
              recentPosts={recentPosts}
              popularTags={popularTags}
              onSelectCategory={handleSelectCategory}
              onSelectTag={handleSelectTag}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Blog;
