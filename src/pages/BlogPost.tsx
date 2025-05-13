
import React from "react";
import { Helmet } from "react-helmet";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, User, Tag, ArrowLeft, Share2 } from "lucide-react";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // This would typically come from a CMS or API
  // For demo purposes, we're using a hardcoded post
  const post = {
    title: "How AI Doctor Notes Reduce Physician Burnout",
    date: "May 15, 2023",
    author: "Dr. James Wilson, MD",
    category: "AI in Healthcare",
    image: "/blog/physician-burnout.jpg",
    content: `
      <p class="text-lg mb-4">Healthcare providers spend an average of 16 minutes per patient on electronic health records (EHRs), according to a 2020 study published in the Annals of Internal Medicine. This documentation burden has become a major contributor to physician burnout.</p>
      
      <p class="mb-4">AI-powered documentation solutions are emerging as a powerful tool to combat this issue. By automating the creation of clinical notes from doctor-patient conversations, these systems are giving physicians back valuable time and mental energy.</p>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">The Documentation Burden</h2>
      
      <p class="mb-4">The introduction of EHRs, while beneficial for data organization and accessibility, has inadvertently created significant administrative overhead for physicians. Studies consistently show that for every hour physicians spend with patients, they spend one to two additional hours on documentation.</p>
      
      <p class="mb-4">This imbalance leads to:</p>
      
      <ul class="list-disc pl-6 mb-6 space-y-2">
        <li>Extended workdays, with documentation often continuing into evenings and weekends</li>
        <li>Reduced face-to-face time with patients</li>
        <li>Decreased job satisfaction and increased burnout rates</li>
        <li>Higher turnover in healthcare organizations</li>
      </ul>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">How AI Documentation Assistants Help</h2>
      
      <p class="mb-4">AI-powered medical documentation tools use natural language processing to convert conversations into structured clinical notes. These systems can:</p>
      
      <ol class="list-decimal pl-6 mb-6 space-y-2">
        <li>Automatically generate SOAP notes from recorded patient encounters</li>
        <li>Extract key clinical information including symptoms, diagnoses, and treatment plans</li>
        <li>Organize information according to medical standard formats</li>
        <li>Integrate directly with existing EHR systems</li>
      </ol>
      
      <p class="mb-4">The result is a dramatic reduction in documentation time. According to our recent survey of 250 physicians using AI documentation tools, the average time saved was 1.8 hours per day.</p>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">Real-World Impact</h2>
      
      <p class="mb-4">Dr. Sarah Miller, a family physician in Boston, reported: "Before using AI documentation assistance, I was spending 2-3 hours every evening finishing notes. Now I complete most of my documentation during patient hours and rarely have to work after clinic hours."</p>
      
      <p class="mb-4">This time savings translates directly to improved well-being. In our study, 78% of physicians using AI documentation tools reported lower stress levels, and 82% reported greater job satisfaction.</p>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">The Future of Medical Documentation</h2>
      
      <p class="mb-4">As AI technology continues to improve, we can expect even more sophisticated documentation tools. Future systems will likely offer:</p>
      
      <ul class="list-disc pl-6 mb-6 space-y-2">
        <li>Real-time clinical decision support based on patient conversations</li>
        <li>Automated coding suggestions for billing</li>
        <li>Integration with telehealth platforms</li>
        <li>Voice-driven EHR navigation</li>
      </ul>
      
      <p class="mb-4">While these technologies won't replace the clinical judgment of physicians, they can handle much of the administrative burden, allowing healthcare providers to focus on what matters most: patient care.</p>
      
      <p class="mb-4">By reducing documentation burden, AI is not just saving time—it's helping preserve the well-being of our healthcare workforce.</p>
    `,
  };

  return (
    <>
      <Helmet>
        <title>{post.title} | ConvoNotes Genius Blog</title>
        <meta name="description" content={post.title} />
        <meta property="og:title" content={`${post.title} | ConvoNotes Genius Blog`} />
        <meta property="og:description" content={post.title} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={post.image} />
      </Helmet>

      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Back to blog */}
            <Button
              variant="ghost"
              className="mb-8 flex items-center gap-2"
              onClick={() => navigate("/blog")}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to all articles
            </Button>

            {/* Article header */}
            <h1 className="text-3xl md:text-4xl font-bold mb-6">{post.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-gray-500 mb-8">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">{post.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span className="text-sm">{post.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Tag className="h-4 w-4" />
                <span className="text-sm">{post.category}</span>
              </div>
            </div>

            {/* Featured image */}
            <div className="rounded-lg overflow-hidden mb-8">
              <img
                src={post.image || "/placeholder.svg"}
                alt={post.title}
                className="w-full h-auto object-cover"
                style={{ maxHeight: "400px" }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg";
                }}
              />
            </div>

            {/* Article content */}
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />

            {/* Share buttons */}
            <div className="border-t border-gray-200 mt-12 pt-6">
              <div className="flex justify-between items-center">
                <span className="font-medium">Share this article:</span>
                <div className="flex gap-3">
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                    <span className="sr-only">Share</span>
                  </Button>
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
