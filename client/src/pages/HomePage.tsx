import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import terminaxLogo from "@/assets/terminax-logo.png";
import { cn } from "@/lib/utils";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { MovingGradient } from "@/components/magicui/moving-gradient";
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

  const heroText = "echo 'Deploy CLI apps to web' | nc terminax.io 1337";

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
            className={cn(
              "absolute inset-0 w-full h-full dot-pattern"
            )}
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
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Pipe CLI Output to the Web, Instantly.
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
              Terminax lets you share your terminal session in real-time,
              without any hassle. Monitor long-running processes, share output
              with friends, or embed a terminal in your own application.
            </p>
            <div className="bg-gray-100/80 dark:bg-[#0A0A0A]/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-lg p-4 max-w-2xl mx-auto mt-8 shadow-lg">
              <div className="flex items-center">
                <span className="text-pink-500 dark:text-pink-400 mr-2">
                  {currentPrompt}
                </span>
                <span className="text-gray-900 dark:text-white">
                  {typedText}
                  <span className="cursor-blink">█</span>
                </span>
              </div>
              <div className="text-purple-600 dark:text-purple-400 mt-2 flex items-center">
                <span>serving at https://terminax.io/v/{"{url}"}</span>
                <img
                  src={terminaxLogo}
                  alt="Terminax Logo"
                  className="h-3 w-3 ml-2 opacity-70"
                />
              </div>
            </div>
            <div className="flex justify-center flex-wrap gap-4 mt-8">
              <Button
                size="lg"
                className="bg-gray-100/90 hover:bg-gray-200 dark:bg-[#0A0A0A]/90 dark:hover:bg-[#171717] text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 backdrop-blur-sm shadow-md"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Command
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent dark:bg-transparent border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-[#0A0A0A] text-gray-800 dark:text-white backdrop-blur-sm shadow-md"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t border-dotted border-gray-200 dark:border-gray-700 mb-16"></div>

        <div id="client" className="space-y-6 py-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center">
          A Powerful Client
        </h2>
        <p className="text-center max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
          While you can use netcat for convenience, our native client provides a
          better experience with more features. Install it via pip:
        </p>
        <div className="flex justify-center">
          <code className="text-lg bg-gray-100 dark:bg-[#0A0A0A] text-pink-600 dark:text-pink-400 p-2 rounded font-mono">
            pip install terminax
          </code>
        </div>
      </div>

        <div className="border-t border-dotted border-gray-200 dark:border-gray-700 my-16"></div>

        <div id="examples" className="space-y-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center">
          Usage Examples
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-[#0A0A0A] p-6 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm dark:shadow-md dark:shadow-purple-900/10">
            <h3 className="text-purple-600 dark:text-purple-400 font-bold text-lg mb-3">
              Show output on both stdout and Terminax:
            </h3>
            <div className="bg-gray-100 dark:bg-black p-4 rounded-md border border-gray-200 dark:border-gray-700">
              <pre>
                <code className="font-mono">$ python train.py | terminax</code>
              </pre>
              <pre>
                <code className="text-purple-600 dark:text-purple-400 font-mono">
                  serving at https://terminax.io/v/{"{url}"}
                </code>
              </pre>
              <pre>
                <code className="text-gray-900 dark:text-white font-mono">
                  Epoch 1/1000, loss = 12.483
                </code>
              </pre>
              <pre>
                <code className="text-gray-500 dark:text-gray-500 font-mono">
                  {"{...}"}
                </code>
              </pre>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0A0A0A] p-6 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm dark:shadow-md dark:shadow-purple-900/10">
            <h3 className="text-purple-600 dark:text-purple-400 font-bold text-lg mb-3">
              Show output using netcat:
            </h3>
            <div className="bg-gray-100 dark:bg-black p-4 rounded-md border border-gray-200 dark:border-gray-700">
              <pre>
                <code>$ go test -v | tee &gt;(nc terminax.io 1337)</code>
              </pre>
              <pre>
                <code className="text-purple-600 dark:text-purple-400">
                  serving at https://terminax.io/v/{"{url}"}
                </code>
              </pre>
              <pre>
                <code className="text-gray-900 dark:text-white">
                  === RUN TestTerminaxBasic
                </code>
              </pre>
              <pre>
                <code className="text-gray-500 dark:text-gray-500">
                  {"{...}"}
                </code>
              </pre>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0A0A0A] p-6 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm dark:shadow-md dark:shadow-purple-900/10">
            <h3 className="text-purple-600 dark:text-purple-400 font-bold text-lg mb-3">
              Show stdout and stderr:
            </h3>
            <div className="bg-gray-100 dark:bg-black p-4 rounded-md border border-gray-200 dark:border-gray-700">
              <pre>
                <code>$ npm install 2&gt;&1 | terminax</code>
              </pre>
              <pre>
                <code className="text-purple-600 dark:text-purple-400">
                  serving at https://terminax.io/v/{"{url}"}
                </code>
              </pre>
              <pre>
                <code className="text-yellow-500 dark:text-yellow-400">
                  npm WARN prefer global node-gyp@3.6.2
                </code>
              </pre>
              <pre>
                <code className="text-gray-500 dark:text-gray-500">
                  {"{...}"}
                </code>
              </pre>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0A0A0A] p-6 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm dark:shadow-md dark:shadow-purple-900/10">
            <h3 className="text-purple-600 dark:text-purple-400 font-bold text-lg mb-3">
              Delay before full-screen command:
            </h3>
            <div className="bg-gray-100 dark:bg-black p-4 rounded-md border border-gray-200 dark:border-gray-700">
              <pre>
                <code>$ htop | terminax --delay 5</code>
              </pre>
              <pre>
                <code className="text-purple-600 dark:text-purple-400">
                  serving at https://terminax.io/v/{"{url}"}
                </code>
              </pre>
              <pre>
                <code className="text-gray-500 dark:text-gray-500">
                  {"{5 second delay}"}
                </code>
              </pre>
              <pre>
                <code className="text-gray-500 dark:text-gray-500">
                  {"{...}"}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>

        <div className="border-t border-dotted border-gray-200 dark:border-gray-700 my-16"></div>

        <div id="languages" className="space-y-6">
        <h2 className="text-3xl font-bold text-white text-center">
          Supported Languages
        </h2>
        <p className="text-center max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
          Terminax supports multiple programming language runtimes for executing
          CLI applications.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {supportedLanguages.map((language) => {
            const IconComponent = language.icon;
            return (
              <div
                key={language.name}
                className={`bg-white dark:bg-[#0A0A0A] p-4 text-center transition-all duration-300 hover:border-purple-400 hover:scale-105 ${
                  !language.supported ? "opacity-60" : ""
                }`}
              >
                <IconComponent
                  className={`w-8 h-8 ${language.color} mx-auto mb-3`}
                />
                <div className="text-white font-semibold">{language.name}</div>
                <div
                  className={`text-sm ${
                    language.supported
                      ? "text-purple-600 dark:text-purple-400"
                      : "text-gray-500"
                  }`}
                >
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
          Feedback and feature requests:{" "}
          <a href="mailto:kushkansal0@gmail.com">support@terminax.io</a>
        </p>
      </div>
      </div>
    </div>
  );
}
