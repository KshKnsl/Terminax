import { Button } from "./ui/button";
import { Github, LogIn, User as UserIcon } from "lucide-react";
import { useState } from "react";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setdisplayName] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");

  const handleGithubLogin = () => {
    window.location.href = `${SERVER_URL}/auth/github`;
  };
  const handleGoogleLogin = () => {
    window.location.href = `${SERVER_URL}/auth/google`;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const endpoint = isRegister ? "/auth/register" : "/auth/login";
    const body = isRegister ? { email, password, displayName } : { email, password };
    try {
      const res = await fetch(`${SERVER_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        // Check for provider error
        if (data.error && /provider/i.test(data.error)) {
          setError(
            "This email is already registered with a different provider. Please use the correct login method."
          );
        } else {
          setError(data.error || "Login failed");
        }
        return;
      }
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white dark:bg-black text-gray-700 dark:text-gray-200 font-mono border-t border-gray-200 dark:border-gray-700">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
          Authenticate
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Sign in with GitHub, Google, or Email to continue to Terminax.
        </p>
      </div>

      <div className="space-y-3">
        <Button
          type="button"
          className="w-full bg-gray-100 dark:bg-black hover:bg-gray-200 dark:hover:bg-[#0A0A0A] text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700"
          onClick={handleGithubLogin}>
          <Github className="w-4 h-4 mr-2" />
          Continue with GitHub
        </Button>
        <Button
          type="button"
          className="w-full bg-gray-100 dark:bg-black hover:bg-gray-200 dark:hover:bg-[#0A0A0A] text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700"
          onClick={handleGoogleLogin}>
          <LogIn className="w-4 h-4 mr-2" />
          Continue with Google
        </Button>
      </div>

      {/* Always show email form */}
      <form className="space-y-3 pt-2" onSubmit={handleEmailSubmit}>
        {isRegister && (
          <div>
            <label className="block text-xs mb-1" htmlFor="displayName">
              displayName
            </label>
            <input
              id="displayName"
              type="text"
              className="w-full rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-black px-2 py-1"
              value={displayName}
              onChange={(e) => setdisplayName(e.target.value)}
              required
            />
          </div>
        )}
        <div>
          <label className="block text-xs mb-1" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-black px-2 py-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-xs mb-1" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-black px-2 py-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="text-xs text-red-500">{error}</div>}
        <Button type="submit" className="w-full bg-purple-600 text-white mt-2">
          {isRegister ? <UserIcon className="w-4 h-4 mr-2" /> : <LogIn className="w-4 h-4 mr-2" />}
          {isRegister ? "Register with Email" : "Login with Email"}
        </Button>
        <div className="text-xs text-center mt-2">
          {isRegister ? (
            <>
              Already have an account?
              <button type="button" className="underline" onClick={() => setIsRegister(false)}>
                Login
              </button>
            </>
          ) : (
            <>
              New here?
              <button type="button" className="underline" onClick={() => setIsRegister(true)}>
                Register
              </button>
            </>
          )}
        </div>
      </form>

      <p className="text-xs text-gray-500 dark:text-gray-400 text-center px-4">
        By continuing, you agree to our Terms of Service and Privacy Policy. We only request access
        to your public GitHub, Google, or email information.
      </p>
    </div>
  );
};

export default Login;
