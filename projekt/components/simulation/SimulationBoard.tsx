import type React from "react";
import type { Step } from "@/lib/demonstration-steps";
import { HostSystem } from "./HostSystem";
import { Packet } from "./Packet";

interface SimulationBoardProps {
  currentStep: Step;
}

const COORDINATES: Record<string, { x: number; y: number }> = {
  start: { x: 21, y: 18 },
  app: { x: 21, y: 18 },
  "os-stack": { x: 15, y: 50 },
  tun: { x: 30, y: 45 },
  "vpn-client-read": { x: 21, y: 85 },
  "vpn-client-encrypt": { x: 21, y: 85 },
  "nic-out": { x: 30, y: 65 },
  tunnel: { x: 50, y: 50 },
  "control-tunnel": { x: 50, y: 50 },
  "data-tunnel": { x: 50, y: 78 },
  "server-nic-in": { x: 88, y: 65 },
  "server-vpn-process": { x: 79, y: 85 },
  "server-tun": { x: 88, y: 45 },
  "server-nat": { x: 70, y: 50 },
  "target-internet": { x: 79, y: 18 },
};

export const SimulationBoard: React.FC<SimulationBoardProps> = ({
  currentStep,
}) => {
  const activeElements = currentStep.activeElements;
  const packetLocation = currentStep.packetLocation || "start";
  const packetStatus = currentStep.packetStatus || "none";
  const packetLabel = currentStep.packetLabel || "DATA";
  const packetPos = COORDINATES[packetLocation] || COORDINATES["start"];
  const packetFromKey = currentStep.packetFrom || packetLocation;
  const packetToKey = currentStep.packetTo || packetLocation;
  const packetFrom = COORDINATES[packetFromKey] || COORDINATES["start"];
  const packetTo = COORDINATES[packetToKey] || COORDINATES["start"];
  const packetPathKeys = currentStep.packetPath;
  const packetPath = packetPathKeys
    ? packetPathKeys.map((key) => {
        const safeKey = (key ?? "start") as keyof typeof COORDINATES;
        return COORDINATES[safeKey] || COORDINATES["start"];
      })
    : [packetFrom, packetTo];
  const highlightKeys = packetPathKeys ?? [packetFromKey, packetToKey];
  const isControlActive = highlightKeys.includes("control-tunnel");
  const isDataActive = highlightKeys.includes("data-tunnel");

  return (
    <div className="relative w-full h-full flex items-stretch p-4 gap-0">
      {/* Background connection lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <title>Background connection lines</title>
        <defs>
          <pattern
            id="dashed-line"
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0,10 L20,10"
              stroke="currentColor"
              strokeDasharray="4 4"
              className="text-slate-300 dark:text-slate-700"
            />
          </pattern>
        </defs>
        {/* Control tunnel line */}
        <line
          x1="30%"
          y1="50%"
          x2="70%"
          y2="50%"
          stroke="currentColor"
          strokeWidth="4"
          strokeDasharray="8 8"
          className={`${
            isControlActive
              ? "text-blue-400"
              : "text-slate-300 dark:text-slate-700"
          } opacity-60`}
        />
        {/* Data tunnel line */}
        <line
          x1="30%"
          y1="78%"
          x2="70%"
          y2="78%"
          stroke="currentColor"
          strokeWidth="4"
          strokeDasharray="8 8"
          className={`${
            isDataActive
              ? "text-amber-400"
              : "text-slate-300 dark:text-slate-700"
          } opacity-60`}
        />
      </svg>

      {/* Client Host Area */}
      <div className="flex-1 min-w-0 z-10">
        <HostSystem type="client" activeElements={activeElements} />
      </div>

      {/* Internet / Tunnel Area */}
      <div className="w-[16%] flex flex-col items-center justify-center z-0 relative">
        <div
          className={`
          absolute inset-x-0 h-16 border-y-2 border-dashed transition-colors duration-500
          ${
            isControlActive
              ? "bg-blue-50/40 dark:bg-blue-900/10 border-blue-400"
              : "border-slate-300 dark:border-slate-700"
          }
        `}
          style={{ top: "44%" }}
        />
        <div
          className={`
          absolute inset-x-0 h-16 border-y-2 border-dashed transition-colors duration-500
          ${
            isDataActive
              ? "bg-amber-50/40 dark:bg-amber-900/10 border-amber-400"
              : "border-slate-300 dark:border-slate-700"
          }
        `}
          style={{ top: "70%" }}
        />
        <span className="absolute left-1/2 top-[38%] -translate-x-1/2 text-xs font-bold text-slate-400 uppercase tracking-widest bg-white dark:bg-slate-900 px-2">
          Internet
        </span>
        <span
          className={`absolute left-1/2 top-[50%] -translate-x-1/2 text-[11px] font-mono px-2.5 py-1 rounded border ${
            isControlActive
              ? "text-blue-600 border-blue-200 bg-blue-50"
              : "text-slate-400 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
          }`}
        >
          Control Tunnel (TLS)
        </span>
        <span
          className={`absolute left-1/2 top-[78%] -translate-x-1/2 text-[11px] font-mono px-2.5 py-1 rounded border ${
            isDataActive
              ? "text-amber-600 border-amber-200 bg-amber-50"
              : "text-slate-400 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
          }`}
        >
          Data Tunnel (UDP:1194)
        </span>
      </div>

      {/* Server Host Area */}
      <div className="flex-1 min-w-0 z-10">
        <HostSystem type="server" activeElements={activeElements} />
      </div>

      {/* The Moving Packet */}
      <Packet
        key={`${currentStep.id}-${packetFromKey}-${packetToKey}-${packetStatus}-${highlightKeys.join("-")}`}
        status={packetStatus}
        path={packetPath}
        fallbackPosition={packetPos}
        label={packetLabel}
      />
    </div>
  );
};
