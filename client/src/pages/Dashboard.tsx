import { useState } from "react"
import { Terminal, Settings, Grid3X3, List, ExternalLink, Plus, Square, Play, RefreshCw, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { DotPattern } from "@/components/magicui/dot-pattern"
import Setting from "./Setting"

interface Application {
  id: string
  name: string
  repository: string
  status: "running" | "stopped" | "deploying" | "error"
  url: string
  language: string
  lastDeploy: string
  description: string
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"apps" | "settings">("apps")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const applications: Application[] = [
    {
      id: "app-1",
      name: "ml-training-monitor",
      repository: "github.com/user/ml-training",
      status: "running",
      url: "https://terminax.io/v/a1b2c3d4e5f6",
      language: "Python",
      lastDeploy: "2 hours ago",
      description: "Real-time machine learning training progress monitor with loss tracking and epoch visualization.",
    },
    {
      id: "app-2",
      name: "build-system",
      repository: "github.com/user/cpp-project",
      status: "stopped",
      url: "https://terminax.io/v/g7h8i9j0k1l2",
      language: "C++",
      lastDeploy: "1 day ago",
      description: "Automated C++ build system with real-time compilation output and error reporting.",
    },
    {
      id: "app-3",
      name: "test-runner",
      repository: "github.com/user/java-tests",
      status: "deploying",
      url: "https://terminax.io/v/m3n4o5p6q7r8",
      language: "Java",
      lastDeploy: "deploying...",
      description: "Continuous integration test runner with detailed test results and coverage reports.",
    },
    {
      id: "app-4",
      name: "log-analyzer",
      repository: "github.com/user/log-tools",
      status: "running",
      url: "https://terminax.io/v/n4o5p6q7r8s9",
      language: "JavaScript",
      lastDeploy: "30 minutes ago",
      description: "Real-time log analysis tool with pattern matching and alert notifications.",
    },
    {
      id: "app-5",
      name: "data-processor",
      repository: "github.com/user/data-pipeline",
      status: "error",
      url: "https://terminax.io/v/o5p6q7r8s9t0",
      language: "Python",
      lastDeploy: "1 hour ago",
      description: "High-performance data processing pipeline with streaming analytics and visualization.",
    },
    {
      id: "app-6",
      name: "api-monitor",
      repository: "github.com/user/api-tools",
      status: "running",
      url: "https://terminax.io/v/p6q7r8s9t0u1",
      language: "Go",
      lastDeploy: "4 hours ago",
      description: "API endpoint monitoring with response time tracking and uptime statistics.",
    },
  ]

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "running":
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "stopped":
      case "ended":
        return "bg-gray-100 text-gray-800 dark:bg-black/20 dark:text-gray-400"
      case "deploying":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-black/20 dark:text-gray-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
      case "active":
        return <Play className="w-3 h-3" />
      case "stopped":
      case "ended":
        return <Square className="w-3 h-3" />
      case "deploying":
        return <RefreshCw className="w-3 h-3 animate-spin" />
      case "error":
        return <Zap className="w-3 h-3" />
      default:
        return <Terminal className="w-3 h-3" />
    }
  }

  const getLanguageColor = (language: string) => {
    switch (language.toLowerCase()) {
      case "python":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "javascript":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "java":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
      case "c++":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
      case "go":
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-black/20 dark:text-gray-400"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="relative bg-white dark:bg-[#0A0A0A] border-b border-gray-200 dark:border-gray-800">
        <div className="absolute inset-0 overflow-hidden">
          <DotPattern
            width={20}
            height={20}
            cx={1}
            cy={1}
            cr={0.8}
            className="absolute inset-0 w-full h-full opacity-30"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-purple-500">Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Manage your terminal applications and monitor active sessions
              </p>
            </div>
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg">
              <Plus className="w-4 h-4 mr-2" />
              Deploy New App
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8">
          {[
            { id: "apps", label: "Applications", icon: Terminal },
            { id: "settings", label: "Settings", icon: Settings },
          ].map((tab) => {
            const IconComponent = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center px-4 py-2 rounded-lg font-medium transition-all",
                  activeTab === tab.id
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"
                    : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#0A0A0A]",
                )}
              >
                <IconComponent className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Applications Tab */}
        {activeTab === "apps" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Applications</h2>
              <div className="flex items-center space-x-2">
                <div className="flex items-center bg-white dark:bg-[#0A0A0A] rounded-lg border border-gray-200 dark:border-gray-700 p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "p-2 rounded-md transition-all",
                      viewMode === "grid"
                        ? "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400"
                        : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300",
                    )}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "p-2 rounded-md transition-all",
                      viewMode === "list"
                        ? "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400"
                        : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300",
                    )}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Grid View */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white dark:bg-[#0A0A0A] rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200 hover:border-purple-300 dark:hover:border-purple-600"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                          <Terminal className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{app.name}</h3>
                          <span
                            className={cn(
                              "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                              getLanguageColor(app.language),
                            )}
                          >
                            {app.language}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{app.description}</p>

                    <div className="flex items-center mb-4">
                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                          getStatusBadgeColor(app.status),
                        )}
                      >
                        {getStatusIcon(app.status)}
                        <span className="ml-1 capitalize">{app.status}</span>
                      </span>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{app.repository}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* List View */}
            {viewMode === "list" && (
              <div className="bg-white dark:bg-[#0A0A0A] rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {applications.map((app) => (
                    <div key={app.id} className="p-6 hover:bg-gray-50 dark:hover:bg-[#171717]/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                            <Terminal className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-3">
                              <h3 className="font-semibold text-gray-900 dark:text-white">{app.name}</h3>
                              <span
                                className={cn(
                                  "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                                  getStatusBadgeColor(app.status),
                                )}
                              >
                                {getStatusIcon(app.status)}
                                <span className="ml-1 capitalize">{app.status}</span>
                              </span>
                              <span
                                className={cn(
                                  "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                                  getLanguageColor(app.language),
                                )}
                              >
                                {app.language}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{app.description}</p>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{app.repository}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg">
                              <ExternalLink className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg">
                              <Settings className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <Setting />
        )}
      </div>
    </div>
  )
}
