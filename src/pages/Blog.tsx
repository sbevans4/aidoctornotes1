
import React from "react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, User, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BlogPostPreview {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  date: string;
  author: string;
  category: string;
  image: string;
}

const Blog = () => {
  const navigate = useNavigate();
  
  // Sample blog posts for demonstration
  const blogPosts: BlogPostPreview[] = [
    {
      id: "1",
      title: "How AI Doctor Notes Reduce Physician Burnout",
      excerpt: "Recent studies show that AI-assisted documentation can save physicians up to 2 hours per day, significantly reducing burnout and improving work-life balance.",
      slug: "how-ai-doctor-notes-reduce-physician-burnout",
      date: "2023-05-15",
      author: "Dr. James Wilson, MD",
      category: "AI in Healthcare",
      image: "/blog/physician-burnout.jpg"
    },
    {
      id: "2",
      title: "Top 5 HIPAA-Compliant AI Tools for Medical Notes",
      excerpt: "With the rise of AI in healthcare, choosing HIPAA-compliant solutions is crucial. Here are the top tools that maintain security while boosting efficiency.",
      slug: "top-5-hipaa-compliant-ai-tools-for-medical-notes",
      date: "2023-06-02",
      author: "Sarah Johnson, Healthcare IT Specialist",
      category: "HIPAA Compliance",
      image: "/blog/hipaa-compliant.jpg"
    },
    {
      id: "3",
      title: "The Future of Medical Documentation: AI and Beyond",
      excerpt: "AI is transforming medical documentation today, but what's coming next? Explore emerging technologies that will shape healthcare documentation in the next decade.",
      slug: "future-of-medical-documentation-ai-and-beyond",
      date: "2023-06-15",
      author: "Dr. Emily Chen, Digital Health Researcher",
      category: "Future of Healthcare",
      image: "/blog/future-documentation.jpg"
    },
  ];
  
  return (
    <>
      <Helmet>
        <title>Healthcare Documentation Blog | ConvoNotes Genius</title>
        <meta name="description" content="Explore insights on AI in healthcare documentation, HIPAA compliance, and strategies to reduce physician burnout through better documentation workflows." />
        <meta property="og:title" content="Healthcare Documentation Blog | ConvoNotes Genius" />
        <meta property="og:description" content="Insights on AI in healthcare documentation, HIPAA compliance, and reducing physician burnout." />
      </Helmet>

      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Healthcare Documentation Insights</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Expert perspectives on AI documentation, regulatory compliance, and improving clinical workflows
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-300 relative">
                  {post.image && (
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder.svg";
                      }}
                    />
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <Calendar className="h-4 w-4" />
                    <span>{post.date}</span>
                    <Tag className="h-4 w-4 ml-2" />
                    <span>{post.category}</span>
                  </div>
                  
                  <h2 className="text-xl font-bold mb-3 hover:text-blue-600 cursor-pointer" onClick={() => navigate(`/blog/${post.slug}`)}>
                    {post.title}
                  </h2>
                  
                  <p className="text-gray-600 mb-4">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between mt-6">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">{post.author}</span>
                    </div>
                    
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-blue-600 flex items-center gap-1"
                      onClick={() => navigate(`/blog/${post.slug}`)}
                    >
                      Read more <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Button className="bg-blue-600 hover:bg-blue-700">
              View All Articles
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Blog;
