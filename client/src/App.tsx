import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Github,
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
  Play,
  LogIn,
  LogOut,
  User as UserIcon,
  Menu,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Login from "@/components/Login";
import { useAuth } from "@/contexts/AuthContext";

export default function HomePage() {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const [currentTime, setCurrentTime] = useState("");
  const [typedText, setTypedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPrompt] = useState("user@terminax:~$");

  const heroText = "echo 'Deploy CLI apps to web' | nc terminax.io 1337";

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString("en-US", { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

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
    { name: "Python", supported: false, icon: Code, color: "text-green-400" },
    { name: "Go", supported: false, icon: Cpu, color: "text-teal-400" },
    { name: "Rust", supported: false, icon: Gem, color: "text-red-400" },
    { name: "Ruby", supported: false, icon: Hash, color: "text-pink-400" },
  ];

  return (
    <div className="min-h-screen bg-black text-terminal-text font-terminal">
      {/* Terminal Window Frame */}
      <div className="bg-black border-b border-terminal-border px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-gray-400 text-sm ml-4">
            terminax.io — Terminal
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-gray-400 text-sm">{currentTime}</div>
          
          {isLoading ? (
            <div className="terminal-button-container">
              <Button
                size="sm"
                className="terminal-button bg-white text-black hover:bg-gray-100"
                disabled
              >
                Loading...
              </Button>
            </div>
          ) : isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="terminal-button-container">
                  <Button
                    size="sm"
                    className="terminal-button bg-white text-black hover:bg-gray-100"
                  >
                    {user?.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.username}
                        className="w-4 h-4 rounded-full mr-2"
                      />
                    ) : (
                      <UserIcon className="w-3 h-3 mr-2" />
                    )}
                    {user?.displayName || user?.username}
                  </Button>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-terminal-dark border border-terminal-border">
                <DropdownMenuLabel className="text-terminal-green">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-terminal-border" />
                <DropdownMenuItem className="text-terminal-text hover:bg-black hover:text-terminal-green cursor-pointer">
                  <UserIcon className="w-3 h-3 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="text-terminal-text hover:bg-black hover:text-terminal-green cursor-pointer" onClick={logout}>
                  <LogOut className="w-3 h-3 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <div className="terminal-button-container">
                  <Button
                    size="sm"
                    className="terminal-button bg-white text-black hover:bg-gray-100"
                  >
                    <LogIn className="w-3 h-3 mr-2" />
                    Login
                  </Button>
                </div>
              </DialogTrigger>
              <DialogContent className="bg-black border border-terminal-border p-0 sm:max-w-[425px]">
                <DialogHeader className="px-4 pt-4">
                  <DialogTitle className="text-terminal-green">
                    Login to Terminax
                  </DialogTitle>
                  <DialogDescription className="text-terminal-text">
                    Connect with GitHub to access your account.
                  </DialogDescription>
                </DialogHeader>
                <Login />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Centered Terminal Content */}
      <div className="max-w-4xl mx-auto px-8 py-8 space-y-12">
        {/* Hero Terminal Session */}
        <div className="space-y-6">
          <div className="text-terminal-text leading-terminal space-y-1">
            <div>
              Terminax lets you pipe output from command-line programs to the
              web in real-time,
            </div>
            <div>
              even without installing any new software on your machine. You can
              use it to monitor
            </div>
            <div>
              long-running processes like experiments that print progress to the
              console.
            </div>
            <div>You can also use Terminax to share output with friends!</div>
          </div>

          <div className="space-y-2 mt-6">
            <div className="flex items-center">
              <span className="text-blue-400 mr-2">{currentPrompt}</span>
              <span className="text-green-400">
                {typedText}
                <span className="animate-pulse">█</span>
              </span>
            </div>
            <div className="text-blue-400">
              serving at https://terminax.io/v/a1b2c3d4e5f6
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            <div className="terminal-button-container">
              <Button
                size="sm"
                className="terminal-button bg-white text-black hover:bg-gray-100"
              >
                <Copy className="w-3 h-3 mr-2" />
                Copy Command
              </Button>
            </div>
            <div className="terminal-button-container">
              <Button
                size="sm"
                className="terminal-button bg-white text-black hover:bg-gray-100"
              >
                <ExternalLink className="w-3 h-3 mr-2" />
                View Demo
              </Button>
            </div>
            <div className="terminal-button-container">
              <Button
                size="sm"
                className="terminal-button bg-white text-black hover:bg-gray-100"
              >
                <Play className="w-3 h-3 mr-2" />
                Try Now
              </Button>
            </div>
          </div>
        </div>

        {/* Dotted Separator */}
        <div className="border-t border-dotted border-terminal-border"></div>

        {/* Client Section */}
        <div id="client" className="space-y-6">
          <div className="text-terminal-green text-xl font-bold uppercase tracking-wider">
            Client
          </div>
          <div className="text-terminal-text leading-terminal space-y-1">
            <div>
              While you can use netcat for convenience (because it comes
              preinstalled on most
            </div>
            <div>
              systems), if you use Terminax often, it's highly recommended that
              you install the
            </div>
            <div>
              Terminax client. You can install it by running{" "}
              <span className="text-terminal-green bg-terminal-dark px-1 py-0.5">
                pip install terminax
              </span>
              .
            </div>
          </div>
          <div className="text-terminal-text leading-terminal space-y-1">
            <div>
              Once you have the client installed, you can pipe output to{" "}
              <span className="text-terminal-green bg-terminal-dark px-1 py-0.5">
                terminax
              </span>{" "}
              instead of
            </div>
            <div>
              piping to{" "}
              <span className="text-terminal-green bg-terminal-dark px-1 py-0.5">
                nc terminax.io 1337
              </span>
              . The client gives you
            </div>
            <div>
              additional features, such as showing output on stdout as well as
              forwarding to
            </div>
            <div>
              Terminax. Run{" "}
              <span className="text-terminal-green bg-terminal-dark px-1 py-0.5">
                terminax --help
              </span>{" "}
              for more information.
            </div>
          </div>
          <div className="terminal-button-container">
            <Button
              size="sm"
              className="terminal-button bg-white text-black hover:bg-gray-100"
            >
              <Github className="w-3 h-3 mr-2" />
              Install Client
            </Button>
          </div>
        </div>

        {/* Dotted Separator */}
        <div className="border-t border-dotted border-terminal-border"></div>

        {/* Examples Section */}
        <div id="examples" className="space-y-8">
          <div className="text-terminal-green text-xl font-bold uppercase tracking-wider">
            Examples
          </div>

          <div className="space-y-8">
            <div>
              <div className="text-terminal-cyan text-lg font-bold mb-3">
                Show output on both stdout and Terminax:
              </div>
              <div className="bg-terminal-dark border border-terminal-border p-3 space-y-1">
                <div className="text-terminal-text">
                  $ python train.py | terminax
                </div>
                <div className="text-blue-400">
                  serving at https://terminax.io/v/{"{url}"}
                </div>
                <div className="text-terminal-green">
                  Epoch 1/1000, loss = 12.483
                </div>
                <div className="text-gray-500">
                  {"{"}...{"}"}
                </div>
              </div>
            </div>

            <div>
              <div className="text-terminal-cyan text-lg font-bold mb-3">
                Show output using netcat:
              </div>
              <div className="bg-terminal-dark border border-terminal-border p-3 space-y-1">
                <div className="text-terminal-text">
                  $ go test -v | tee &gt;(nc terminax.io 1337)
                </div>
                <div className="text-blue-400">
                  serving at https://terminax.io/v/{"{url}"}
                </div>
                <div className="text-terminal-green">
                  === RUN TestTerminaxBasic
                </div>
                <div className="text-gray-500">
                  {"{"}...{"}"}
                </div>
              </div>
            </div>

            <div>
              <div className="text-terminal-cyan text-lg font-bold mb-3">
                Show stdout and stderr:
              </div>
              <div className="bg-terminal-dark border border-terminal-border p-3 space-y-1">
                <div className="text-terminal-text">
                  $ npm install 2&gt;&1 | terminax
                </div>
                <div className="text-blue-400">
                  serving at https://terminax.io/v/{"{url}"}
                </div>
                <div className="text-yellow-400">
                  npm WARN prefer global node-gyp@3.6.2
                </div>
                <div className="text-gray-500">
                  {"{"}...{"}"}
                </div>
              </div>
            </div>

            <div>
              <div className="text-terminal-cyan text-lg font-bold mb-3">
                Delay before full-screen command:
              </div>
              <div className="bg-terminal-dark border border-terminal-border p-3 space-y-1">
                <div className="text-terminal-text">
                  $ htop | terminax --delay 5
                </div>
                <div className="text-blue-400">
                  serving at https://terminax.io/v/{"{url}"}
                </div>
                <div className="text-gray-500">
                  {"{"}5 second delay{"}"}
                </div>
                <div className="text-gray-500">
                  {"{"}...{"}"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dotted Separator */}
        <div className="border-t border-dotted border-terminal-border"></div>

        {/* Languages Section */}
        <div id="languages" className="space-y-6">
          <div className="text-terminal-green text-xl font-bold uppercase tracking-wider">
            Supported Languages
          </div>
          <div className="text-terminal-text leading-terminal">
            Terminax supports multiple programming language runtimes for
            executing CLI applications.
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {supportedLanguages.map((language) => {
              const IconComponent = language.icon;
              return (
                <div
                  key={language.name}
                  className={`bg-terminal-card border border-terminal-accent p-3 text-center hover:border-terminal-green transition-colors ${
                    !language.supported ? "opacity-50" : ""
                  }`}
                >
                  <IconComponent
                    className={`w-6 h-6 ${language.color} mx-auto mb-2`}
                  />
                  <div className="text-terminal-green text-xs mb-1">
                    {language.name}
                  </div>
                  <div
                    className={`text-xs ${
                      language.supported
                        ? "text-terminal-green"
                        : "text-gray-500"
                    }`}
                  >
                    {language.supported ? "Active" : "Coming Soon"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dotted Separator */}
        <div className="border-t border-dotted border-terminal-border"></div>

        {/* Notes Section */}
        <div className="space-y-6">
          <div className="text-terminal-green text-xl font-bold uppercase tracking-wider">
            Notes
          </div>
          <div className="text-terminal-text leading-terminal space-y-1">
            <div>
              • If you want plaintext output, replace{" "}
              <span className="text-terminal-green bg-terminal-dark px-1 py-0.5">
                /v/{"{url}"}
              </span>{" "}
              with{" "}
              <span className="text-terminal-green bg-terminal-dark px-1 py-0.5">
                /p/{"{url}"}
              </span>
            </div>
            <div>
              • Terminax isn't meant for data storage: sessions expire after one
              day
            </div>
            <div>
              • Each IP address is limited to 5 concurrent sessions (beta
              limitation)
            </div>
            <div>
              • Terminax is currently in beta - not recommended for
              uptime-critical apps
            </div>
            <div>
              • Feedback and feature requests:{" "}
              <a
                href="mailto:hello@terminax.io"
                className="text-terminal-green hover:underline"
              >
                hello@terminax.io
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
