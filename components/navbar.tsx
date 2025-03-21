"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) => {
    return pathname === path;
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/documentation/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="bg-gray-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center">
              <Icon name="fa-chart-line" className="text-white" />
            </div>
            <span className="font-bold text-xl">WL8 Indicator Builder</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link
              href="/"
              className={cn(
                "py-2 text-white hover:text-teal-300 transition-all flex items-center",
                isActive("/") && "text-teal-300"
              )}
            >
              <Icon name="fa-home" className="mr-2 h-4 w-4" /> Home
            </Link>
            <Link
              href="/documentation"
              className={cn(
                "py-2 text-white hover:text-teal-300 transition-all flex items-center",
                isActive("/documentation") && "text-teal-300"
              )}
            >
              <Icon name="fa-book" className="mr-2 h-4 w-4" /> Documentation
            </Link>
            <Link
              href="/builder"
              className={cn(
                "py-2 text-white hover:text-teal-300 transition-all flex items-center",
                isActive("/builder") && "text-teal-300"
              )}
            >
              <Icon name="fa-tools" className="mr-2 h-4 w-4" /> Indicator Builder
            </Link>
            <Link
              href="/qa"
              className={cn(
                "py-2 text-white hover:text-teal-300 transition-all flex items-center",
                isActive("/qa") && "text-teal-300"
              )}
            >
              <Icon name="fa-question-circle" className="mr-2 h-4 w-4" /> Q&A
            </Link>
            <Link
              href="/settings"
              className={cn(
                "py-2 text-white hover:text-teal-300 transition-all flex items-center",
                isActive("/settings") && "text-teal-300"
              )}
            >
              <Icon name="fa-cog" className="mr-2 h-4 w-4" /> Settings
            </Link>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center bg-gray-700 rounded-full px-3 py-1">
            <input
              type="text"
              placeholder="Search docs..."
              className="bg-transparent border-none focus:outline-none text-white text-sm w-32"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="bg-transparent border-none">
              <Icon name="fa-search" className="text-gray-400 ml-2 h-4 w-4" />
            </button>
          </form>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              className="text-white focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Icon name="fa-bars" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "md:hidden transition-all duration-300 ease-in-out overflow-hidden",
            mobileMenuOpen ? "max-h-60 mt-4" : "max-h-0"
          )}
        >
          <div className="flex flex-col space-y-3 py-2">
            <Link
              href="/"
              className={cn(
                "py-2 text-white hover:text-teal-300 transition-all flex items-center",
                isActive("/") && "text-teal-300"
              )}
            >
              <Icon name="fa-home" className="mr-2 h-4 w-4" /> Home
            </Link>
            <Link
              href="/documentation"
              className={cn(
                "py-2 text-white hover:text-teal-300 transition-all flex items-center",
                isActive("/documentation") && "text-teal-300"
              )}
            >
              <Icon name="fa-book" className="mr-2 h-4 w-4" /> Documentation
            </Link>
            <Link
              href="/builder"
              className={cn(
                "py-2 text-white hover:text-teal-300 transition-all flex items-center",
                isActive("/builder") && "text-teal-300"
              )}
            >
              <Icon name="fa-tools" className="mr-2 h-4 w-4" /> Indicator Builder
            </Link>
            <Link
              href="/qa"
              className={cn(
                "py-2 text-white hover:text-teal-300 transition-all flex items-center",
                isActive("/qa") && "text-teal-300"
              )}
            >
              <Icon name="fa-question-circle" className="mr-2 h-4 w-4" /> Q&A
            </Link>
            <Link
              href="/settings"
              className={cn(
                "py-2 text-white hover:text-teal-300 transition-all flex items-center",
                isActive("/settings") && "text-teal-300"
              )}
            >
              <Icon name="fa-cog" className="mr-2 h-4 w-4" /> Settings
            </Link>
            <form onSubmit={handleSearch} className="flex items-center bg-gray-700 rounded-full px-3 py-1 mt-2">
              <input
                type="text"
                placeholder="Search docs..."
                className="bg-transparent border-none focus:outline-none text-white text-sm w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="bg-transparent border-none">
                <Icon name="fa-search" className="text-gray-400 ml-2 h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </nav>
  );
}
