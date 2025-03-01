import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AiAssistant } from "@/components/ai-assistant";

export default function IndicatorBuilderPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Indicator Builder Page Header */}
      <div className="bg-gradient-to-br from-[#1a365d] to-[#0d9488] text-white py-12">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Indicator Builder</h1>
          <p className="text-xl max-w-3xl">
            Create and test custom indicators with AI assistance. Get real-time feedback and optimization suggestions.
          </p>
        </div>
      </div>
      
      {/* Indicator Builder Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold mb-6">Indicator Builder Coming Soon</h2>
              <p className="text-gray-600 mb-4">
                Our advanced indicator builder with AI assistance is currently in development.
                Soon you'll be able to create, test, and optimize your custom WL8 indicators here.
              </p>
              <p className="text-gray-600">
                Check back soon for updates or explore our documentation in the meantime.
              </p>
              <p className="text-gray-600 mt-4">
                In the meantime, you can use the AI assistant to help you with indicator development questions.
              </p>
            </div>
          </div>
          <div className="lg:col-span-1">
            <AiAssistant initialContext="WL8 indicator development" placeholder="Ask about building indicators..." />
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
