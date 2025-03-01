import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function DocumentationPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Documentation Page Header */}
      <div className="bg-gradient-to-br from-[#1a365d] to-[#0d9488] text-white py-12">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">WL8 Documentation</h1>
          <p className="text-xl max-w-3xl">
            Explore the complete Wealth-Lab 8 API documentation, frameworks, and examples to help build your custom indicators.
          </p>
        </div>
      </div>
      
      {/* Documentation Content Placeholder */}
      <div className="container mx-auto px-6 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6">Documentation Coming Soon</h2>
          <p className="text-gray-600 mb-4">
            We're currently organizing the WL8 documentation for easy browsing and searching.
            Check back soon for a comprehensive library of resources.
          </p>
          <p className="text-gray-600">
            In the meantime, you can start exploring the indicator builder or ask questions in our Q&A section.
          </p>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}