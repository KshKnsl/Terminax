import React from 'react';
import { Button } from "./ui/button";
import { Github } from "lucide-react";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';

const Login = () => {
  const handleGithubLogin = () => {
    // Redirect to the GitHub OAuth flow
    window.location.href = `${SERVER_URL}/auth/github`;
  };

  return (
    <div className="space-y-4 p-4 bg-terminal-dark border border-terminal-border text-terminal-text">
      <h2 className="text-terminal-green font-bold text-lg mb-4">Terminal Login</h2>
      
      <div className="text-center mb-4">
        <p className="text-terminal-text mb-2">Sign in with your GitHub account to access Terminax.</p>
        <p className="text-terminal-text text-xs mb-4">We only access your public information.</p>
      </div>
      
      <div className="terminal-button-container mt-4">
        <Button 
          type="button"
          className="terminal-button bg-white text-black hover:bg-gray-100 w-full"
          onClick={handleGithubLogin}
        >
          <Github className="w-4 h-4 mr-2" />
          Continue with GitHub
        </Button>
      </div>
      
      <div className="text-xs text-gray-500 mt-4 text-center">
        By signing in, you agree to our <br />
        <a href="#" className="text-terminal-green hover:underline">Terms of Service</a>
        {" & "}
        <a href="#" className="text-terminal-green hover:underline">Privacy Policy</a>
      </div>
    </div>
  );
};

export default Login;