import { FileText, Lock } from "lucide-react";
import type React from "react";

interface PacketProps {
  status: "raw" | "encrypted" | "none";
  position: { x: number; y: number };
  label?: string;
}

export const Packet: React.FC<PacketProps> = ({ status, position, label }) => {
  if (status === "none") return null;

  return (
    <div
      className="absolute z-50 transition-all duration-700 ease-in-out flex flex-col items-center justify-center"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
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
