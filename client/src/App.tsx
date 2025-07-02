import { Button } from "@/components/ui/button";
import { LogIn, LogOut, User as UserIcon, LifeBuoy, Trash2 } from "lucide-react";
import terminaxLogo from "@/assets/terminax-logo.png";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Login from "@/components/Login";
import { useAuth } from "@/contexts/AuthContext";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import DeleteAccount from "@/components/DeleteAccount";
import { ThemeToggle } from "@/components/ThemeToggle";
import Project from "./pages/Project";
import DeploymentPage from "./pages/DeploymentPage";
import ProjectDashboard from "./pages/ProjectDashboard";

const App = () => {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-300 font-mono flex justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-200 font-mono">
      <div className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center justify-between shadow-sm dark:shadow-none">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <div>
          <button className="flex items-center" onClick={() => navigate("/")}>
            <img src={terminaxLogo} alt="Terminax Logo" className="h-6 w-6 rounded-md shadow-md" />
            <span className="text-gray-600 dark:text-gray-400 text-sm ml-2 font-semibold">
              terminax.io
            </span>
          </button>
        </div>
        <div className="flex items-center">
          {isLoading ? (
            <div>
              <Button
                size="sm"
                className="bg-gray-100 text-gray-800 dark:bg-[#0A0A0A] dark:text-white hover:bg-gray-200 dark:hover:bg-[#0A0A0A] border border-gray-300 dark:border-gray-600"
                disabled>
                Loading...
              </Button>
            </div>
          ) : isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div>
                  <Button
                    size="sm"
                    className="bg-gray-100 text-gray-800 dark:bg-[#0A0A0A] dark:text-white hover:bg-gray-200 dark:hover:bg-[#0A0A0A] border border-gray-300 dark:border-gray-600">
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
              <DropdownMenuContent className="bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-purple-900/20 w-64 p-0">
                <div className="bg-purple-50 dark:bg-purple-800/10 m-2 rounded-lg">
                  <div className="p-2 flex justify-between items-center">
                    <span className="text-xs font-bold uppercase bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/30 px-2 py-0.5 rounded">
                      Beta
                    </span>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 pt-0">
                    {user?.avatar && (
                      <img
                        src={user.avatar}
                        alt={user.username}
                        className="w-16 h-16 rounded-full mb-2"
                      />
                    )}
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white">
                      {user?.displayName || user?.username}
                    </h3>
                    {user?.username && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</p>
                    )}
                  </div>
                </div>
                <DropdownMenuSeparator className="bg-gray-200 dark:bg-[#171717]" />
                <div className="p-1">
                  {location.pathname !== "/dashboard" && (
                    <DropdownMenuItem
                      className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-black hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer flex items-center"
                      onClick={() => navigate("/dashboard")}>
                      <UserIcon className="w-4 h-4 mr-2" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-black hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer flex items-center"
                    onClick={() => (window.location.href = "mailto:kushkansal0@gmail.com")}>
                    <LifeBuoy className="w-4 h-4 mr-2" />
                    <span>Contact Us</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-200 dark:bg-[#171717] my-1" />
                  <DropdownMenuItem
                    className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-black hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer flex items-center"
                    onClick={logout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-200 dark:bg-[#171717] my-1" />
                  <ThemeToggle inDropdown={true} />
                  <DropdownMenuSeparator className="bg-gray-200 dark:bg-[#171717] my-1" />
                  <DeleteAccount>
                    <DropdownMenuItem
                      className="text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/50 hover:text-red-700 dark:hover:text-red-400 cursor-pointer focus:bg-red-50 dark:focus:bg-red-900/50 focus:text-red-700 dark:focus:text-red-400 flex items-center"
                      onSelect={(e) => e.preventDefault()}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      <span>Delete Account</span>
                    </DropdownMenuItem>
                  </DeleteAccount>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Dialog>
                <DialogTrigger asChild>
                  <div className="inline-block">
                    <Button
                      size="sm"
                      className="bg-gray-100 text-gray-800 dark:bg-[#0A0A0A] dark:text-white hover:bg-gray-200 dark:hover:bg-black">
                      <LogIn className="w-3 h-3 mr-2" />
                      Login
                    </Button>
                  </div>
                </DialogTrigger>
                <DialogContent className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 p-0 shadow-lg dark:shadow-purple-900/20 sm:max-w-[425px]">
                  <DialogHeader className="px-4 pt-4">
                    <DialogTitle className="text-purple-600 dark:text-purple-400">
                      Login to Terminax
                    </DialogTitle>
                    <DialogDescription className="text-gray-600 dark:text-gray-300">
                      Connect with GitHub to access your account.
                    </DialogDescription>
                  </DialogHeader>
                  <Login />
                </DialogContent>
              </Dialog>
              <div className="inline-block ml-2">
                <ThemeToggle />
              </div>
            </div>
          )}
        </div>
      </div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/" replace />}
        />
        <Route
          path="/project/:id"
          element={isAuthenticated ? <Project /> : <Navigate to="/" replace />}
        />
        <Route
          path="/project/info/:id"
          element={isAuthenticated ? <ProjectDashboard /> : <Navigate to="/" replace />}
        />
        <Route
          path="/:deploymentId"
          element={<DeploymentPage /> }
        />
      </Routes>
    </div>
  );
};

export default App;
