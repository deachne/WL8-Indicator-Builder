import Link from "next/link";
import { Icon } from "@/components/ui/icon";

export function HeroSection() {
  return (
    <div className="bg-gradient-to-br from-[#1a365d] to-[#0d9488] text-white py-16">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Build Powerful WL8 Indicators with AI
        </h1>
        <p className="text-xl mb-8 max-w-3xl mx-auto">
          Create, test, and deploy custom indicators for Wealth-Lab 8 with intelligent assistance.
          Access documentation, get answers, and build indicators all in one place.
        </p>

        <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-6">
          <Link
            href="/documentation"
            className="bg-white text-gray-800 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold shadow-lg transition-all flex items-center justify-center"
          >
            <Icon name="fa-book" className="mr-2 h-5 w-5" /> Browse Documentation
          </Link>
          <Link
            href="/builder"
            className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg transition-all flex items-center justify-center"
          >
            <Icon name="fa-code" className="mr-2 h-5 w-5" /> Start Building
          </Link>
        </div>

        {/* Abstract Code to Chart Visualization */}
        <div className="mt-12 flex justify-center">
          <div className="bg-white bg-opacity-10 p-4 rounded-lg">
            <div className="flex flex-col md:flex-row items-center">
              <div className="text-left font-mono text-sm bg-gray-800 bg-opacity-60 p-3 rounded-lg md:rounded-r-none w-full md:w-64">
                <div className="text-green-400">// Sample WL8 Indicator</div>
                <div className="text-blue-300">
                  function <span className="text-yellow-300">MyIndicator</span>(data) {"{"}
                </div>
                <div className="pl-4 text-white">let sma = SMA(data, 20);</div>
                <div className="pl-4 text-white">let ema = EMA(data, 10);</div>
                <div className="pl-4 text-white">return sma.crossover(ema);</div>
                <div className="text-blue-300">{"}"}</div>
              </div>
              <div className="text-3xl px-4 text-teal-300 hidden md:block">
                <Icon name="fa-arrow-right" />
              </div>
              <div className="bg-gray-800 bg-opacity-60 p-2 rounded-lg md:rounded-l-none mt-2 md:mt-0">
                <svg width="100" height="80" viewBox="0 0 100 80">
                  {/* Simplified chart visualization */}
                  <path
                    d="M0,60 Q10,30 20,50 T40,40 T60,60 T80,20"
                    stroke="#0d9488"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M0,40 Q20,45 40,35 T60,45 T80,30"
                    stroke="#60a5fa"
                    strokeWidth="2"
                    fill="none"
                  />
                  {/* Crossover point */}
                  <circle cx="70" cy="38" r="3" fill="#fbbf24" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}