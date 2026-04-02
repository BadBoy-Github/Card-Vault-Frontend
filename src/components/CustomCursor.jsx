import { useEffect, useState, useRef } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const cursorRef = useRef(null);
  const ringsRef = useRef(null);

  useEffect(() => {
    // Mouse movement handler
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    // Mouse enter/leave handlers
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    // Handle hover state for interactive elements
    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.classList.contains("cursor-pointer") ||
        target.closest(".cursor-pointer")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    // Add event listeners
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseover", handleMouseOver);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  // Smooth follow with CSS transform
  useEffect(() => {
    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate(${position.x}px, ${position.y}px)`;
    }
    if (ringsRef.current) {
      ringsRef.current.style.transform = `translate(${position.x}px, ${position.y}px)`;
    }
  }, [position]);

  if (!isVisible) return null;

  return (
    <>
      {/* Main cursor dot */}
      <div
        ref={cursorRef}
        className="fixed pointer-events-none z-[9999] mix-blend-difference"
        style={{
          left: 0,
          top: 0,
          transform: `translate(${position.x}px, ${position.y}px)`,
          transition: "transform 0.05s ease-out",
        }}
      >
        {/* Inner dot - bigger */}
        <div
          className="absolute rounded-full bg-white"
          style={{
            left: "-6px",
            top: "-6px",
            width: "12px",
            height: "12px",
            transform: isHovering ? "scale(1.5)" : "scale(1)",
            transition: "transform 0.15s ease",
          }}
        />
      </div>

      {/* Circling rings - bigger and closer to cursor */}
      <div
        ref={ringsRef}
        className="fixed pointer-events-none z-[9998]"
        style={{
          left: 0,
          top: 0,
          transform: `translate(${position.x}px, ${position.y}px)`,
          transition: "transform 0.1s ease-out",
        }}
      >
        {/* Outer ring 1 - small, clockwise */}
        <div
          className="absolute"
          style={{
            left: "-14px",
            top: "-14px",
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            border: "2px solid var(--color-accent)",
            animation: "spin-clockwise 1.5s linear infinite",
            opacity: isHovering ? 0.2 : 0.5,
            transform: isHovering ? "scale(1.3)" : "scale(1)",
            transition: "all 0.2s ease",
          }}
        />

        {/* Outer ring 2 - medium, counter-clockwise */}
        <div
          className="absolute"
          style={{
            left: "-20px",
            top: "-20px",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: "1.5px solid var(--color-accent)",
            animation: "spin-counter-clockwise 2s linear infinite",
            opacity: isHovering ? 0.15 : 0.35,
            transform: isHovering ? "scale(1.2)" : "scale(1)",
            transition: "all 0.2s ease",
          }}
        />

        {/* Outer ring 3 - small, clockwise, slower */}
        <div
          className="absolute"
          style={{
            left: "-26px",
            top: "-26px",
            width: "52px",
            height: "52px",
            borderRadius: "50%",
            border: "1px solid var(--color-accent)",
            animation: "spin-clockwise 2.5s linear infinite",
            opacity: isHovering ? 0.1 : 0.2,
            transform: isHovering ? "scale(1.1)" : "scale(1)",
            transition: "all 0.2s ease",
          }}
        />
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes spin-clockwise {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-counter-clockwise {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        /* Hide custom cursor on touch devices and mobile/tablet screens */
        @media (hover: none) and (pointer: coarse) {
          .custom-cursor-component {
            display: none !important;
          }
        }
        
        /* Hide custom cursor on screens smaller than desktop */
        @media (max-width: 1023px) {
          .custom-cursor-component {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
