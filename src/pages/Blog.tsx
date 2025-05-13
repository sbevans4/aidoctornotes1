
import React from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, User, Tag, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BlogPostPreview {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  date: string;
  author: string;
  category: string;
  image?: string;
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
      date: "2025-05-10",
      author: "Dr. James Wilson, MD",
      category: "AI in Healthcare",
      image: "/blog/physician-burnout.jpg"
    },
    {
      id: "2",
      title: "Top 5 HIPAA-Compliant AI Tools for Medical Notes",
      excerpt: "With the rise of AI in healthcare, choosing HIPAA-compliant solutions is crucial. Here are the top tools that maintain security while boosting efficiency.",
      slug: "top-5-hipaa-compliant-ai-tools-for-medical-notes",
      date: "2025-05-08",
      author: "Sarah Johnson, Healthcare IT Specialist",
      category: "HIPAA Compliance",
      image: "/blog/hipaa-compliant.jpg"
    },
    {
      id: "3",
      title: "The Future of Medical Documentation: AI and Beyond",
      excerpt: "AI is transforming medical documentation, but what's next? We explore emerging trends and technologies that will shape healthcare documentation.",
      slug: "future-medical-documentation-ai-beyond",
      date: "2025-05-05",
      author: "Michael Chen, Health Tech Analyst",
      category: "Industry Trends",
      image: "/blog/future-medical-documentation.jpg"
    },
  ];

  return (
    <>
      <Helmet>
        <title>Healthcare AI Blog | ConvoNotes Genius</title>
        <meta name="description" content="Insights, tips and updates about AI in medical documentation, HIPAA compliance, and improving clinical workflow efficiency." />
        <meta property="og:title" content="Healthcare AI Blog | ConvoNotes Genius" />
        <meta property="og:description" content="Insights, tips and updates about AI in medical documentation, HIPAA compliance, and improving clinical workflow efficiency." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aidoctornotes.com/blog" />
        <meta property="og:image" content="https://aidoctornotes.com/og-image.png" />
      </Helmet>

      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          {/* Blog Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Healthcare AI Insights</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Expert articles on medical documentation, AI technology, and practice efficiency
            </p>
          </div>

          {/* Featured Post */}
          <div className="mb-12">
            <Card className="overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="h-64 md:h-auto bg-gray-200">
                  <img 
                    src={blogPosts[0].image || "/placeholder.svg"} 
                    alt={blogPosts[0].title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 md:p-8 flex flex-col">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-medical-light text-medical-primary px-3 py-1 rounded-full text-sm font-medium">
                        {blogPosts[0].category}
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">
                      {blogPosts[0].title}
                    </h2>
                    <p className="text-gray-600 mb-4">
                      {blogPosts[0].excerpt}
                    </p>
                  </div>
                  <div className="mt-auto">
                    <div className="flex items-center mb-4 text-gray-500 text-sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{blogPosts[0].date}</span>
                      <span className="mx-2">•</span>
                      <User className="h-4 w-4 mr-1" />
                      <span>{blogPosts[0].author}</span>
                    </div>
                    <Button 
                      onClick={() => navigate(`/blog/${blogPosts[0].slug}`)}
                      className="bg-medical-primary hover:bg-medical-primary/90"
                    >
                      Read Article <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.slice(1).map((post) => (
              <Card key={post.id} className="overflow-hidden flex flex-col h-full">
                <div className="h-48 bg-gray-200">
                  <img 
                    src={post.image || "/placeholder.svg"} 
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="pt-6 flex-grow">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                  <p className="text-gray-600">{post.excerpt}</p>
                </CardContent>
                <CardFooter className="pt-0 pb-6 flex flex-col items-start">
                  <div className="flex items-center mb-4 text-gray-500 text-sm">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{post.date}</span>
                    <span className="mx-2">•</span>
                    <User className="h-4 w-4 mr-1" />
                    <span>{post.author.split(',')[0]}</span>
                  </div>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto font-medium text-medical-primary"
                    onClick={() => navigate(`/blog/${post.slug}`)}
                  >
                    Read Article <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Newsletter Subscribe */}
          <div className="mt-16 bg-gray-50 rounded-lg p-8">
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h3>
              <p className="text-gray-600 mb-6">
                Get the latest insights on AI medical documentation and HIPAA compliance directly to your inbox
              </p>
              <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="px-4 py-2 border rounded-md flex-grow"
                />
                <Button>Subscribe</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Blog;
