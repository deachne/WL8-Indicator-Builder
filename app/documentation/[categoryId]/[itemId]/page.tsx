import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { DocumentationLayout } from "@/components/documentation-layout";
import { DocumentationNav } from "@/components/documentation-nav";
import { getDocCategories, getDocItem, getDocNavItems } from "@/lib/documentation";
import { MarkdownContent } from "@/components/markdown-content";
import { AiAssistant } from "@/components/ai-assistant";
import { notFound } from "next/navigation";

interface ItemPageProps {
  params: {
    categoryId: string;
    itemId: string;
  };
}

export default function ItemPage({ params }: ItemPageProps) {
  const { categoryId, itemId } = params;
  const item = getDocItem(itemId);
  
  if (!item || item.category !== categoryId) {
    notFound();
  }
  
  const navItems = getDocNavItems();
  
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Documentation Page Header */}
      <div className="bg-gradient-to-br from-[#1a365d] to-[#0d9488] text-white py-12">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{item.title}</h1>
          {item.description && (
            <p className="text-xl max-w-3xl">
              {item.description}
            </p>
          )}
        </div>
      </div>
      
      {/* Documentation Content */}
      <DocumentationLayout
        sidebar={<DocumentationNav items={navItems} />}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
              <MarkdownContent content={item.content} />
            </div>
          </div>
          <div className="lg:col-span-1">
            <AiAssistant initialContext={`${item.title}: ${item.content.substring(0, 500)}`} placeholder="Ask about this documentation..." />
          </div>
        </div>
      </DocumentationLayout>
      
      <Footer />
    </main>
  );
}

// Generate static paths for all items
export function generateStaticParams() {
  const categories = getDocCategories();
  const paths: { categoryId: string; itemId: string }[] = [];
  
  categories.forEach((category) => {
    category.items.forEach((item) => {
      paths.push({
        categoryId: category.id,
        itemId: item.id,
      });
    });
  });
  
  return paths;
}
