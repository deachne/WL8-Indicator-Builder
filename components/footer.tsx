import Link from "next/link";
import { Icon } from "@/components/ui/icon";

export function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center">
                <Icon name="fa-chart-line" className="text-white text-sm" />
              </div>
              <span className="font-bold">WL8 Indicator Builder</span>
            </div>
          </div>

          <div className="flex space-x-4">
            <Link href="#" className="text-gray-400 hover:text-white transition-all">
              <Icon name="fa-github" className="text-xl" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white transition-all">
              <Icon name="fa-twitter" className="text-xl" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white transition-all">
              <Icon name="fa-envelope" className="text-xl" />
            </Link>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-6 pt-6 text-center text-gray-400 text-sm">
          <p>© 2025 WL8 Indicator Builder. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}