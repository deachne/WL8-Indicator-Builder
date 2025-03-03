import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { DocumentationLayout } from "@/components/documentation-layout";
import { DocumentationNav } from "@/components/documentation-nav";
import { fetchDocItem, fetchDocNavItems, fetchDocCategory, fetchDocCategories } from "@/lib/documentation";
import { MarkdownContent } from "@/components/markdown-content";
import { notFound } from "next/navigation";

interface ItemPageProps {
  params: {
    categoryId: string;
    itemId: string;
  };
}

export default async function ItemPage({ params }: ItemPageProps) {
  const { categoryId, itemId } = params;
  const item = await fetchDocItem(itemId);
  
  if (!item) {
    notFound();
  }
  
  const category = await fetchDocCategory(categoryId);
  const navItems = await fetchDocNavItems();
  
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
        <div className="grid gap-6">
          <div className="text-sm breadcrumbs">
            <ul className="flex space-x-2">
              <li className="text-gray-500">Documentation</li>
              <li className="text-gray-500 before:content-['/'] before:mr-2">{category?.title || categoryId}</li>
              <li className="font-medium before:content-['/'] before:mr-2 before:text-gray-500">{item.title}</li>
            </ul>
          </div>
          
          <div className="prose prose-slate max-w-none dark:prose-invert">
            <MarkdownContent content={item.content} />
          </div>
        </div>
      </DocumentationLayout>
      
      <Footer />
    </main>
  );
}

// Generate static paths for all items
export async function generateStaticParams() {
  const categories = await fetchDocCategories();
  const paths: { categoryId: string; itemId: string }[] = [];
  
  for (const category of categories) {
    for (const item of category.items) {
      paths.push({
        categoryId: category.id,
        itemId: item.id,
      });
    }
  }
  
  return paths;
}
