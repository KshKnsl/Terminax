import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import terminaxLogo from "@/assets/terminax-logo.png";
import { cn } from "@/lib/utils";
import { DotPattern } from "@/components/ui/dot-pattern";
import { MovingGradient } from "@/components/ui/moving-gradient";
import {
  Coffee,
  CloudLightningIcon as Lightning,
  Wrench,
  FileText,
  Code,
  Cpu,
  Gem,
  Hash,
  Copy,
  ExternalLink,
} from "lucide-react";

export default function HomePage() {
  const [typedText, setTypedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPrompt] = useState("user@terminax:~$");

  const heroText = "git push terminax main # Instantly run, code, and collaborate online";

  useEffect(() => {
    if (currentIndex < heroText.length) {
      const timeout = setTimeout(() => {
        setTypedText(heroText.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 80);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, heroText]);

  const supportedLanguages = [
    { name: "Java", supported: true, icon: Coffee, color: "text-orange-400" },
    { name: "C++", supported: true, icon: Lightning, color: "text-blue-400" },
    { name: "C", supported: true, icon: Wrench, color: "text-cyan-400" },
    {
      name: "JavaScript",
      supported: true,
      icon: FileText,
      color: "text-yellow-400",
    },
    { name: "Python", supported: false, icon: Code, color: "text-purple-400" },
    { name: "Go", supported: false, icon: Cpu, color: "text-teal-400" },
    { name: "Rust", supported: false, icon: Gem, color: "text-red-400" },
    { name: "Ruby", supported: false, icon: Hash, color: "text-pink-400" },
  ];

  return (
    <div>
      <div className="text-center">
        <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden">
          <DotPattern
            width={40}
            height={40}
            cx={1}
            cy={1}
            cr={1.2}
            glow={true}
            className={cn("absolute inset-0 w-full h-screen")}
          />
          <MovingGradient
            size={600}
            blur={150}
            speed={10}
            color1="rgba(147, 51, 234, 0.7)"
            color2="rgba(168, 85, 247, 0.5)"
            opacity={0.6}
            className="z-0"
          />
          <MovingGradient
            size={400}
            blur={120}
            speed={15}
            color1="rgba(139, 92, 246, 0.65)"
            color2="rgba(91, 33, 182, 0.45)"
            opacity={0.5}
            className="z-0"
          />
          <div className="z-10 flex flex-col items-center max-w-3xl">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <img
                  src={terminaxLogo}
                  alt="Terminax Logo"
                  className="relative h-28 w-28 rounded-xl shadow-lg"
                />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
                Instant Online Coding
              </span>
              <span className="text-gray-900 dark:text-white">for CLI Projects</span>
            </h1>
            <p className="max-w-2xl mx-auto mt-6 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              <span className="font-semibold text-gray-900 dark:text-white">Terminax</span> is a
              collaborative online coding platform. Instantly run code, share live terminals, and
              collaborate in real time—no setup required. Supports C++, Java, Python, and more.
            </p>
            <div className="relative bg-gray-100/80 dark:bg-[#0A0A0A]/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-lg p-4 max-w-2xl mx-auto mt-8 shadow-lg group">
              <div className="absolute -top-3 left-4 px-2 py-1 bg-purple-600 dark:bg-purple-500 text-white text-xs rounded-full font-mono">
                terminal
              </div>
              <div className="flex items-center">
                <span className="text-pink-500 dark:text-pink-400 mr-2 font-mono">
                  {currentPrompt}
                </span>
                <span className="text-gray-900 dark:text-white font-mono">
                  {typedText}
                  <span className="cursor-blink">█</span>
                </span>
              </div>
              <div className="text-purple-600 dark:text-purple-400 mt-2 flex items-center font-mono text-sm">
                <span className="group-hover:underline transition-all">
                  run, code, and collaborate instantly
                </span>
                <img
                  src={terminaxLogo}
                  alt="Terminax Logo"
                  className="h-3 w-3 ml-2 opacity-70 group-hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
            <div className="flex justify-center flex-wrap gap-4 mt-8">
              <Button
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700 text-white border-none backdrop-blur-sm shadow-md transform hover:scale-105 transition-all duration-300">
                <Copy className="w-4 h-4 mr-2" />
                Copy Command
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 dark:bg-white/5 border border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-600 dark:text-purple-400 backdrop-blur-sm shadow-md transform hover:scale-105 transition-all duration-300">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

    </div>
    </div>
  );
}
