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
    <div className="mx-auto space-y-16">
      <div className="text-center">
        <div className="relative flex h-[650px] w-full flex-col items-center justify-center overflow-hidden">
          <DotPattern
            width={36}
            height={24}
            cx={1}
            cy={1}
            cr={1.2}
            glow={true}
            className={cn("absolute inset-0 w-full h-full dot-pattern")}
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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t border-dotted border-gray-200 dark:border-gray-700 mb-16"></div>

        <div id="features" className="space-y-8 py-4">
          <h2 className="text-3xl font-bold text-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
              Core Features
            </span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="group bg-white dark:bg-[#0A0A0A] p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 transition-all duration-300">
              <div className="text-purple-600 dark:text-purple-400 mb-3 transform group-hover:scale-110 transition-transform duration-300">
                <Code className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Instant Code Execution
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Run code in seconds. No setup, no config—just code and execute in the browser.
              </p>
            </div>
            <div className="bg-white dark:bg-[#0A0A0A] p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-purple-600 dark:text-purple-400 mb-3">
                <Lightning className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Collaborative Coding
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Share your workspace and code together in real time. Great for teams, interviews,
                and learning.
              </p>
            </div>
            <div className="bg-white dark:bg-[#0A0A0A] p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="text-purple-600 dark:text-purple-400 mb-3">
                <Cpu className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Live Terminal
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Access a real terminal in your browser. Run, debug, and see output live.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-dotted border-gray-200 dark:border-gray-700 my-16"></div>

        <div id="examples" className="space-y-8 px-4 sm:px-0">
          <h2 className="text-3xl font-bold text-center mb-8">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
              Usage Examples
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <div className="group bg-white dark:bg-[#0A0A0A] p-4 sm:p-6 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm dark:shadow-md dark:shadow-purple-900/10 hover:border-purple-400 dark:hover:border-purple-400 transition-all duration-300">
              <h3 className="text-purple-600 dark:text-purple-400 font-bold text-base sm:text-lg mb-3 flex items-center">
                <span className="flex-1">Collaborative Coding Session</span>
                <span className="text-xs font-normal px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-full">
                  real-time
                </span>
              </h3>
              <div className="bg-gray-100 dark:bg-black p-3 sm:p-4 rounded-md border border-gray-200 dark:border-gray-700 overflow-x-auto">
                <pre className="text-sm sm:text-base">
                  <code className="font-mono whitespace-pre-wrap break-all sm:break-normal">
                    // Invite a friend to code together // Share your workspace link
                  </code>
                </pre>
                <pre className="mt-2 text-sm">
                  <code className="text-purple-600 dark:text-purple-400 font-mono">
                    # Both users see changes live
                  </code>
                </pre>
              </div>
            </div>

            <div className="group bg-white dark:bg-[#0A0A0A] p-4 sm:p-6 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm dark:shadow-md dark:shadow-purple-900/10 hover:border-purple-400 dark:hover:border-purple-400 transition-all duration-300">
              <h3 className="text-purple-600 dark:text-purple-400 font-bold text-base sm:text-lg mb-3 flex items-center">
                <span className="flex-1">Run Code Instantly</span>
                <span className="text-xs font-normal px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-full">
                  instant
                </span>
              </h3>
              <div className="bg-gray-100 dark:bg-black p-3 sm:p-4 rounded-md border border-gray-200 dark:border-gray-700 overflow-x-auto">
                <pre className="text-sm sm:text-base">
                  <code className="font-mono">$ python main.py</code>
                </pre>
                <pre className="mt-2 text-sm">
                  <code className="text-purple-600 dark:text-purple-400 font-mono">
                    # Output appears instantly in the browser
                  </code>
                </pre>
              </div>
            </div>

            <div className="group bg-white dark:bg-[#0A0A0A] p-4 sm:p-6 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm dark:shadow-md dark:shadow-purple-900/10 hover:border-purple-400 dark:hover:border-purple-400 transition-all duration-300">
              <h3 className="text-purple-600 dark:text-purple-400 font-bold text-base sm:text-lg mb-3 flex items-center">
                <span className="flex-1">Live Terminal Output</span>
                <span className="text-xs font-normal px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-full">
                  terminal
                </span>
              </h3>
              <div className="bg-gray-100 dark:bg-black p-3 sm:p-4 rounded-md border border-gray-200 dark:border-gray-700 overflow-x-auto">
                <pre className="text-sm sm:text-base">
                  <code className="font-mono whitespace-pre-wrap break-all sm:break-normal">
                    $ ./my-app | terminax stream
                  </code>
                </pre>
                <pre className="mt-2 text-sm">
                  <code className="text-purple-600 dark:text-purple-400 font-mono">
                    # See logs and output live
                  </code>
                </pre>
              </div>
            </div>

            <div className="bg-white dark:bg-[#0A0A0A] p-6 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm dark:shadow-md dark:shadow-purple-900/10">
              <h3 className="text-purple-600 dark:text-purple-400 font-bold text-lg mb-3">
                Multi-language Support
              </h3>
              <div className="bg-gray-100 dark:bg-black p-4 rounded-md border border-gray-200 dark:border-gray-700">
                <pre>
                  <code>// Run C++, Java, Python, and more</code>
                </pre>
                <pre>
                  <code className="text-purple-600 dark:text-purple-400">
                    $ javac Main.java && java Main
                  </code>
                </pre>
                <pre>
                  <code className="text-yellow-500 dark:text-yellow-400">
                    $ g++ main.cpp -o main && ./main
                  </code>
                </pre>
                <pre>
                  <code className="text-gray-500 dark:text-gray-500">// ...</code>
                </pre>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-dotted border-gray-200 dark:border-gray-700 my-16"></div>

        <div id="languages" className="space-y-6">
          <h2 className="text-3xl font-bold text-center mb-8">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
              Supported Languages
            </span>
          </h2>
          <p className="text-center max-w-2xl mx-auto text-gray-600 dark:text-gray-300 mb-8">
            Terminax supports multiple programming language runtimes for executing both CLI and GUI
            applications. More languages are being added regularly.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {supportedLanguages.map((language) => {
              const IconComponent = language.icon;
              return (
                <div
                  key={language.name}
                  className={`group bg-white dark:bg-[#0A0A0A] p-6 rounded-lg border border-gray-200 dark:border-gray-700 
                    text-center transition-all duration-300 hover:border-purple-400 hover:scale-105 
                    ${!language.supported ? "opacity-60 hover:opacity-80" : ""}`}>
                  <IconComponent className={`w-8 h-8 ${language.color} mx-auto mb-3`} />
                  <div className="text-white font-semibold">{language.name}</div>
                  <div
                    className={`text-sm ${
                      language.supported ? "text-purple-600 dark:text-purple-400" : "text-gray-500"
                    }`}>
                    {language.supported ? "Supported" : "Coming Soon"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-t border-dotted border-gray-200 dark:border-gray-700 my-16"></div>

        <div className="text-center text-gray-600 dark:text-gray-300 py-8">
          <p>
            Feedback and feature requests:
            <a href="mailto:kushkansal0@gmail.com">support@terminax.io</a>
          </p>
        </div>
      </div>
    </div>
  );
}
