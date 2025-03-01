import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-6 py-16 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold mb-4">Documentation Not Found</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl">
          Sorry, we couldn't find the documentation you're looking for. It might have been moved or doesn't exist.
        </p>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/documentation">
              Browse Documentation
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">
              Go Home
            </Link>
          </Button>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
