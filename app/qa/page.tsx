import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function QAPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Q&A Page Header */}
      <div className="bg-gradient-to-br from-[#1a365d] to-[#0d9488] text-white py-12">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Q&A Platform</h1>
          <p className="text-xl max-w-3xl">
            Get answers to your questions about Wealth-Lab 8 and indicator development from our AI assistant.
          </p>
        </div>
      </div>
      
      {/* Q&A Content Placeholder */}
      <div className="container mx-auto px-6 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6">Q&A Platform Coming Soon</h2>
          <p className="text-gray-600 mb-4">
            Our AI-powered Q&A platform for Wealth-Lab 8 is currently in development.
            Soon you'll be able to ask questions and get expert answers about WL8 indicator development.
          </p>
          <p className="text-gray-600">
            Check back soon for updates or explore our documentation in the meantime.
          </p>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}