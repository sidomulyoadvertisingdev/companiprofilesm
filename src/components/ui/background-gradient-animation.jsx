import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export const BackgroundGradientAnimation = ({
  gradientBackgroundStart = "rgb(108, 0, 162)",
  gradientBackgroundEnd = "rgb(0, 17, 82)",
  firstColor = "18, 113, 255",
  secondColor = "221, 74, 255",
  thirdColor = "100, 220, 255",
  fourthColor = "200, 50, 50",
  fifthColor = "180, 180, 50",
  pointerCircleColor = "220, 20, 60",
  size = "80%",
  blendingValue = "hard-light",
  children,
  className,
  interactive = true,
  containerClassName,
}) => {
  const interactiveRef = useRef(null);

  const [curX, setCurX] = useState(0);
  const [curY, setCurY] = useState(0);
  const [tgX, setTgX] = useState(0);
  const [tgY, setTgY] = useState(0);

  useEffect(() => {
    document.body.style.setProperty(
      "--gradient-background-start",
      gradientBackgroundStart
    );
    document.body.style.setProperty(
      "--gradient-background-end",
      gradientBackgroundEnd
    );
    document.body.style.setProperty("--first-color", firstColor);
    document.body.style.setProperty("--second-color", secondColor);
    document.body.style.setProperty("--third-color", thirdColor);
    document.body.style.setProperty("--fourth-color", fourthColor);
    document.body.style.setProperty("--fifth-color", fifthColor);
    document.body.style.setProperty("--pointer-circle-color", pointerCircleColor);
    document.body.style.setProperty("--gradient-size", size);
    document.body.style.setProperty("--blending-value", blendingValue);
  }, [
    gradientBackgroundStart,
    gradientBackgroundEnd,
    firstColor,
    secondColor,
    thirdColor,
    fourthColor,
    fifthColor,
    pointerCircleColor,
    size,
    blendingValue,
  ]);

  useEffect(() => {
    let animationId;
    const handleMouseMove = (e) => {
      if (interactiveRef.current) {
        const rect = interactiveRef.current.getBoundingClientRect();
        setCurX(e.clientX - rect.left);
        setCurY(e.clientY - rect.top);
      }
    };

    const animate = () => {
      setTgX((prev) => prev + (curX - prev) / 40);
      setTgY((prev) => prev + (curY - prev) / 40);
      animationId = requestAnimationFrame(animate);
    };

    const el = interactiveRef.current;
    if (el) {
      el.addEventListener("mousemove", handleMouseMove);
      animationId = requestAnimationFrame(animate);
    }

    return () => {
      if (el) el.removeEventListener("mousemove", handleMouseMove);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [curX, curY]);

  return (
    <div
      className={cn(
        "h-screen w-full relative overflow-hidden top-0 left-0 bg-[linear-gradient(40deg,var(--gradient-background-start),var(--gradient-background-end))]",
        containerClassName
      )}
    >
      <div className="absolute h-screen w-full [filter:blur(var(--gradient-size))] [inset:-40px_0] opacity-100 z-0">
        <div
          className="absolute [background:radial-gradient(circle_at_center,var(--first-color)_0_0,_transparent_0)] w-[var(--gradient-size)] h-[var(--gradient-size)] top-[calc(50%-var(--gradient-size)/2)] left-[calc(50%-var(--gradient-size)/2)] [mix-blend-mode:var(--blending-value)]"
          style={{ transform: `translate(${tgX * 15}px, ${tgY * 15}px)` }}
        />
        <div
          className="absolute [background:radial-gradient(circle_at_center,var(--second-color)_0_0,_transparent_0)] w-[var(--gradient-size)] h-[var(--gradient-size)] top-[calc(50%-var(--gradient-size)/2+20%)] left-[calc(50%-var(--gradient-size)/2-50%)] [mix-blend-mode:var(--blending-value)]"
          style={{ transform: `translate(${tgX * 20}px, ${tgY * 20}px)` }}
        />
        <div
          className="absolute [background:radial-gradient(circle_at_center,var(--third-color)_0_0,_transparent_0)] w-[var(--gradient-size)] h-[var(--gradient-size)] top-[calc(50%-var(--gradient-size)/2+50%)] left-[calc(50%-var(--gradient-size)/2+20%)] [mix-blend-mode:var(--blending-value)]"
          style={{ transform: `translate(${-tgX * 10}px, ${tgY * 10}px)` }}
        />
        <div
          className="absolute [background:radial-gradient(circle_at_center,var(--fourth-color)_0_0,_transparent_0)] w-[var(--gradient-size)] h-[var(--gradient-size)] top-[calc(50%-var(--gradient-size)/2-50%)] left-[calc(50%-var(--gradient-size)/2-20%)] [mix-blend-mode:var(--blending-value)]"
          style={{ transform: `translate(${-tgX * 15}px, ${-tgY * 15}px)` }}
        />
        <div
          className="absolute [background:radial-gradient(circle_at_center,var(--fifth-color)_0_0,_transparent_0)] w-[var(--gradient-size)] h-[var(--gradient-size)] top-[calc(50%-var(--gradient-size)/2)] left-[calc(50%-var(--gradient-size)/2+40%)] [mix-blend-mode:var(--blending-value)]"
          style={{ transform: `translate(${tgX * 10}px, ${-tgY * 10}px)` }}
        />
        {interactive && (
          <motion.div
            ref={interactiveRef}
            className="absolute inset-0 z-10"
            style={{
              background: `radial-gradient(circle at ${curX}px ${curY}px, var(--pointer-circle-color) 0%, transparent 60%)`,
            }}
          />
        )}
      </div>
      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
};
