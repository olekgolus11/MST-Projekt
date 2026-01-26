import { FileText, Lock } from "lucide-react";
import type React from "react";
import { useEffect, useRef } from "react";

interface PacketProps {
  status: "raw" | "encrypted" | "none";
  path: { x: number; y: number }[];
  fallbackPosition: { x: number; y: number };
  label?: string;
}

export const Packet: React.FC<PacketProps> = ({
  status,
  path,
  fallbackPosition,
  label,
}) => {
  const packetRef = useRef<HTMLDivElement | null>(null);
  const hasPath = path.length > 1;
  const safePath = path.length > 0 ? path : [fallbackPosition];
  const startPoint = safePath[0];

  useEffect(() => {
    if (!packetRef.current || !hasPath) return;

    let cancelled = false;
    const animations: Animation[] = [];

    const runAnimations = async () => {
      // Animate through each segment of the path
      for (let i = 0; i < safePath.length - 1; i++) {
        if (cancelled) break;

        const from = safePath[i];
        const to = safePath[i + 1];

        // Animate from current point to next point
        const animation = packetRef.current!.animate(
          [
            { left: `${from.x}%`, top: `${from.y}%` },
            { left: `${to.x}%`, top: `${to.y}%` },
          ],
          {
            duration: 1000, // 1 second per segment
            easing: "ease-in-out",
            fill: "forwards",
          },
        );

        animations.push(animation);

        try {
          await animation.finished;
        } catch {
          // Animation was cancelled
          break;
        }

        // Pause at intermediate points (not at the final point)
        if (i < safePath.length - 2 && !cancelled) {
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }
    };

    runAnimations();

    return () => {
      cancelled = true;
      animations.forEach((anim) => {
        anim.cancel();
      });
    };
  }, [hasPath, safePath]);

  if (status === "none") return null;

  return (
    <div
      ref={packetRef}
      className="absolute z-50 flex flex-col items-center justify-center transition-all duration-700 ease-in-out"
      style={{
        left: `${startPoint.x}%`,
        top: `${startPoint.y}%`,
        transform: "translate(-50%, -50%)",
      }}
    >
      <div
        className={`
        relative flex items-center justify-center h-12 w-12 rounded-lg shadow-xl border-2
        ${
          status === "encrypted"
            ? "bg-red-100 border-red-500 text-red-600 dark:bg-red-900/30 dark:border-red-400 dark:text-red-400"
            : "bg-green-100 border-green-500 text-green-600 dark:bg-green-900/30 dark:border-green-400 dark:text-green-400"
        }
      `}
      >
        {status === "encrypted" ? (
          <Lock className="h-6 w-6" />
        ) : (
          <FileText className="h-6 w-6" />
        )}

        {/* Particle effect tail (simplified CSS) */}
        <div className="absolute -z-10 w-full h-full rounded-lg bg-inherit opacity-50 blur-sm animate-pulse" />
      </div>
      {label && (
        <span className="mt-2 text-xs font-bold bg-white/80 dark:bg-black/80 px-2 py-0.5 rounded backdrop-blur-sm border border-slate-200 dark:border-slate-700">
          {label}
        </span>
      )}
    </div>
  );
};
