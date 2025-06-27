import { Button } from "./ui/button";
import { Github } from "lucide-react";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

const Login = () => {
  const handleGithubLogin = () => {
    window.location.href = `${SERVER_URL}/auth/github`;
  };

  return (
    <div className="space-y-6 p-6 bg-white dark:bg-black text-gray-700 dark:text-gray-200 font-mono border-t border-gray-200 dark:border-gray-700">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
          Authenticate
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Sign in with GitHub to continue to Terminax.
        </p>
      </div>

      <div>
        <Button
          type="button"
          className="w-full bg-gray-100 dark:bg-black hover:bg-gray-200 dark:hover:bg-[#0A0A0A] text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700"
          onClick={handleGithubLogin}>
          <Github className="w-4 h-4 mr-2" />
          Continue with GitHub
        </Button>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 text-center px-4">
        By continuing, you agree to our Terms of Service and Privacy Policy. We only request access
        to your public GitHub information.
      </p>
    </div>
  );
};

export default Login;
