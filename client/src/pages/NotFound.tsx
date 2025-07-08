import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useState, useRef } from "react";

const NotFound = () => {
  const navigate = useNavigate();
  const [astronautPos, setAstronautPos] = useState({ x: 80, y: 80 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const astronautRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (astronautRef.current) {
      const rect = astronautRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      const maxX = window.innerWidth - 150;
      const maxY = window.innerHeight - 200;

      setAstronautPos({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      className="h-full w-full bg-black flex flex-col items-center justify-center relative overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}>
      <div
        ref={astronautRef}
        className={`absolute animate-float cursor-grab ${isDragging ? "cursor-grabbing" : ""}`}
        style={{
          left: `${astronautPos.x}px`,
          top: `${astronautPos.y}px`,
          userSelect: "none",
        }}
        onMouseDown={handleMouseDown}>
        <div className="relative">
          <div className="w-24 h-32 bg-white rounded-full relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-gray-200 rounded-full border-4 border-white">
              <div className="absolute top-2 left-2 w-12 h-12 bg-gray-300 rounded-full opacity-30"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-2 h-2 bg-black rounded-full mb-1"></div>
                <div className="w-1 h-1 bg-black rounded-full mx-auto"></div>
              </div>{" "}
            </div>
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-16 h-20 bg-gray-100 rounded-lg">
              <div className="absolute top-2 left-2 w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="absolute top-2 right-2 w-3 h-3 bg-blue-500 rounded-full"></div>
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gray-300 rounded"></div>
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-gray-300 rounded"></div>
            </div>{" "}
          </div>

          <div className="absolute top-12 -left-6 w-6 h-16 bg-white rounded-full transform rotate-45"></div>
          <div className="absolute top-12 -right-6 w-6 h-16 bg-white rounded-full transform -rotate-45"></div>

          <div className="absolute -bottom-4 left-2 w-6 h-12 bg-white rounded-full"></div>
          <div className="absolute -bottom-4 right-2 w-6 h-12 bg-white rounded-full"></div>

          <div className="absolute top-20 -left-8 w-8 h-8 bg-white rounded-full"></div>
          <div className="absolute top-20 -right-8 w-8 h-8 bg-white rounded-full"></div>

          <div className="absolute -bottom-2 left-1 w-8 h-6 bg-gray-600 rounded-lg"></div>
          <div className="absolute -bottom-2 right-1 w-8 h-6 bg-gray-600 rounded-lg"></div>
        </div>
      </div>

      <div className="text-center z-10">
        <h1 className="text-8xl font-bold text-white mb-4">404 Error</h1>
        <p className="text-xl text-gray-300 mb-8 max-w-md">
          Don't panic, and make sure to watch your oxygen levels.
        </p>
        <Button
          onClick={() => navigate("/")}
          className="bg-transparent border-2 border-white text-white px-8 py-3 text-lg hover:bg-white hover:text-black transition-colors duration-300">
          Return to safety
        </Button>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle hover:bg-blue-400 hover:w-2 hover:h-2 hover:shadow-lg hover:shadow-blue-400/50 transition-all duration-300 cursor-pointer pointer-events-auto"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default NotFound;
