import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface MovingGradientProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
  blur?: number;
  speed?: number;
  color1?: string;
  color2?: string;
  opacity?: number;
}

export const MovingGradient: React.FC<MovingGradientProps> = ({
  className,
  size = 500,
  blur = 120,
  speed = 20,
  color1 = "rgba(138, 43, 226, 0.8)", // Purple
  color2 = "rgba(123, 104, 238, 0.6)", // MediumSlateBlue
  opacity = 0.6,
  ...props
}) => {
  const gradientRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!gradientRef.current) return;
    
    let posX = Math.random() * window.innerWidth;
    let posY = Math.random() * window.innerHeight / 2;
    let dirX = (Math.random() - 0.5) * speed;
    let dirY = (Math.random() - 0.5) * speed;
    
    const animate = () => {
      if (!gradientRef.current) return;
      
      // Update position
      posX += dirX;
      posY += dirY;
      
      // Bounce off the edges
      if (posX <= 0 || posX >= window.innerWidth - size) {
        dirX *= -1;
      }
      
      if (posY <= 0 || posY >= window.innerHeight / 2 - size) {
        dirY *= -1;
      }
      
      // Apply the new position
      gradientRef.current.style.left = `${posX}px`;
      gradientRef.current.style.top = `${posY}px`;
      
      requestAnimationFrame(animate);
    };
    
    const animationFrame = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [size, speed]);
  
  return (
    <div
      ref={gradientRef}
      className={cn(
        "absolute pointer-events-none transition-opacity duration-1000 gradient-pulse",
        className
      )}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        filter: `blur(${blur}px)`,
        opacity: opacity,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color1} 0%, ${color2} 70%, transparent 100%)`,
      }}
      {...props}
    />
  );
};
