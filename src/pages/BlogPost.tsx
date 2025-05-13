
import React from "react";
import { Helmet } from "react-helmet";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowLeft, Twitter, Linkedin, Facebook, Mail } from "lucide-react";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  // In a real application, you would fetch the blog post data based on the slug
  // For demonstration, we'll use a mock post
  const post = {
    title: "How AI Doctor Notes Reduce Physician Burnout",
    excerpt: "Recent studies show that AI-assisted documentation can save physicians up to 2 hours per day, significantly reducing burnout and improving work-life balance.",
    content: `
      <p>Physician burnout has reached crisis levels, with more than 40% of doctors reporting symptoms of burnout, according to a recent Mayo Clinic study. One of the primary contributors to this epidemic is the administrative burden, particularly documentation requirements that can consume up to 6 hours of a physician's day.</p>
      
      <p>Artificial intelligence is emerging as a powerful solution to this problem. AI-powered medical documentation tools like ConvoNotes Genius are helping physicians reclaim their time and focus on what matters most: patient care.</p>
      
      <h2>The Documentation Burden</h2>
      <p>Electronic Health Records (EHRs) were intended to improve healthcare delivery, but they've inadvertently created a significant administrative burden. Physicians now spend nearly twice as much time on EHR tasks as they do with patients. This imbalance contributes directly to decreased job satisfaction and increased burnout rates.</p>
      
      <p>A 2023 study published in the Journal of the American Medical Association (JAMA) found that primary care physicians spend an average of 6 hours daily on documentation, with only 3.5 hours in direct patient care. This "pajama time" - work that extends beyond clinical hours - disrupts work-life balance and contributes to emotional exhaustion.</p>
      
      <h2>AI as the Solution</h2>
      <p>AI-powered medical documentation tools address this problem by automating the note-taking process. Using sophisticated natural language processing, these systems can:</p>
      
      <ul>
        <li>Transcribe patient-physician conversations in real-time</li>
        <li>Extract relevant clinical information</li>
        <li>Organize data into structured SOAP notes</li>
        <li>Integrate directly with EHR systems</li>
      </ul>
      
      <p>The results are impressive. Physicians using AI documentation assistants report saving 1-2 hours daily, according to a pilot study conducted at Stanford Medical Center. That's equivalent to reclaiming 30-60 clinical days per year.</p>
      
      <h2>Real-World Impact</h2>
      <p>Dr. Sarah Chen, a family physician in Chicago, reports that implementing AI documentation has transformed her practice: "Before using ConvoNotes Genius, I was spending evenings catching up on notes. Now I complete most documentation during the visit, and I leave the office with my work done. I've reclaimed my evenings with my family."</p>
      
      <p>Similarly, Dr. Michael Rodriguez notes that AI documentation has improved not just his efficiency but his job satisfaction: "I'm capturing more comprehensive notes while spending less time on documentation. I can focus on my patients during visits instead of typing, which has improved both the quality of care and my professional satisfaction."</p>
      
      <h2>Looking Forward</h2>
      <p>As AI technology continues to evolve, we can expect even more sophisticated documentation solutions. Future systems will likely incorporate more advanced clinical decision support, predictive analytics, and personalized documentation based on physician preferences and specialty requirements.</p>
      
      <p>For now, though, the message is clear: AI-powered documentation tools are an effective intervention for reducing physician burnout by addressing one of its root causes - the administrative burden of medical documentation.</p>
      
      <p>In a healthcare system facing physician shortages and increasing demands, tools that help doctors work more efficiently while improving their well-being aren't just convenient—they're essential for sustainable healthcare delivery.</p>
    `,
    date: "2025-05-10",
    author: "Dr. James Wilson, MD",
    authorTitle: "Chief of Internal Medicine, University Medical Center",
    category: "AI in Healthcare",
    image: "/blog/physician-burnout.jpg",
    tags: ["AI Doctor Notes", "Physician Burnout", "EHR", "Healthcare Efficiency"]
  };

  return (
    <>
      <Helmet>
        <title>{post.title} | ConvoNotes Genius Blog</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={`${post.title} | ConvoNotes Genius Blog`} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://aidoctornotes.com/blog/${slug}`} />
        <meta property="og:image" content={`https://aidoctornotes.com${post.image}`} />
      </Helmet>

      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          {/* Back to blog link */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/blog")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Blog
            </Button>
          </div>

          {/* Article header */}
          <div className="max-w-3xl mx-auto mb-8">
            <div className="mb-4">
              <span className="bg-medical-light text-medical-primary px-3 py-1 rounded-full text-sm font-medium">
                {post.category}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
            
            <p className="text-xl text-gray-600 mb-6">{post.excerpt}</p>
            
            <div className="flex items-center mb-6">
              <div className="h-12 w-12 rounded-full bg-gray-200 mr-3 flex items-center justify-center">
                <User className="h-6 w-6 text-gray-500" />
              </div>
              <div>
                <div className="font-medium">{post.author}</div>
                <div className="text-sm text-gray-500">{post.authorTitle}</div>
              </div>
              <div className="ml-auto flex items-center text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                <span className="text-sm">{post.date}</span>
              </div>
            </div>
          </div>

          {/* Featured image */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
              <img 
                src={post.image || "/placeholder.svg"} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Article content */}
          <div className="max-w-3xl mx-auto">
            <article className="prose lg:prose-xl prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 max-w-none mb-8"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2 mb-8 pt-4 border-t">
              <span className="text-gray-500">Tags:</span>
              {post.tags?.map((tag, index) => (
                <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                  {tag}
                </span>
              ))}
            </div>

            {/* Social sharing */}
            <div className="flex flex-wrap items-center gap-3 mb-8 pt-4 border-t">
              <span className="text-gray-500">Share:</span>
              <Button variant="outline" size="icon" className="rounded-full h-8 w-8">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full h-8 w-8">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full h-8 w-8">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full h-8 w-8">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Related posts placeholder */}
          <div className="max-w-5xl mx-auto mt-16">
            <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border rounded-lg overflow-hidden">
                  <div className="h-40 bg-gray-200"></div>
                  <div className="p-4">
                    <h3 className="font-bold mb-2">Related Article Title</h3>
                    <p className="text-gray-600 text-sm mb-4">A brief excerpt from the related article...</p>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-medical-primary"
                      onClick={() => navigate("/blog/sample-slug")}
                    >
                      Read More
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogPost;
