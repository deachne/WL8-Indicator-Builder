import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { FeatureCard } from "@/components/feature-card";
import { StepItem } from "@/components/step-item";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Features Section */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon="fa-book"
            iconColor="text-blue-600"
            bgColor="bg-blue-100"
            borderColor="bg-blue-600"
            title="Documentation Browser"
            description="Access and search through the complete Wealth-Lab 8 documentation. Find APIs, frameworks, and examples to help build your indicators."
            linkText="Browse Docs"
            linkHref="/documentation"
            linkColor="text-blue-600"
          />
          
          <FeatureCard 
            icon="fa-tools"
            iconColor="text-teal-600"
            bgColor="bg-teal-100"
            borderColor="bg-teal-600"
            title="Indicator Builder"
            description="Create and test custom indicators with AI assistance. Get real-time feedback and optimization suggestions as you build."
            linkText="Start Building"
            linkHref="/builder"
            linkColor="text-teal-600"
          />
          
          <FeatureCard 
            icon="fa-question-circle"
            iconColor="text-purple-600"
            bgColor="bg-purple-100"
            borderColor="bg-purple-600"
            title="Q&A Platform"
            description="Get answers to your questions about Wealth-Lab 8 and indicator development. Our AI assistant is trained on WL8 documentation."
            linkText="Ask Questions"
            linkHref="/qa"
            linkColor="text-purple-600"
          />
        </div>
      </div>
      
      {/* Getting Started Section */}
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <StepItem 
              number={1}
              title="Browse Documentation"
              description="Explore the WL8 API and framework documentation to understand available functions."
            />
            
            <StepItem 
              number={2}
              title="Define Your Indicator"
              description="Describe what you want your indicator to do or start coding with AI assistance."
            />
            
            <StepItem 
              number={3}
              title="Test & Refine"
              description="Test your indicator on sample data and refine based on results and AI suggestions."
            />
            
            <StepItem 
              number={4}
              title="Deploy to WL8"
              description="Export your finished indicator for use in Wealth-Lab 8 platform."
            />
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="bg-gradient-to-br from-[#1a365d] to-[#0d9488] text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to build your first indicator?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Join other traders who are enhancing their strategies with custom WL8 indicators.</p>
          <Link 
            href="/builder" 
            className="bg-white text-gray-800 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold shadow-lg transition-all inline-block"
          >
            Get Started Now
          </Link>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}