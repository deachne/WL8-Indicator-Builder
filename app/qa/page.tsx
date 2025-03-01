import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AiAssistant } from "@/components/ai-assistant";

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
      
      {/* Q&A Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold mb-6">Q&A Platform</h2>
              <p className="text-gray-600 mb-4">
                Our full Q&A platform with community features is still in development, but you can already use our AI assistant to get answers to your questions about WL8.
              </p>
              <p className="text-gray-600">
                Ask anything about Wealth-Lab 8, indicator development, strategies, or API usage.
              </p>
            </div>
          </div>
          <div className="lg:col-span-2">
            <AiAssistant placeholder="Ask anything about WL8..." />
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
