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
  const packetPos = COORDINATES[packetLocation] || COORDINATES["start"];

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
        {/* Draw a line representing the tunnel */}
        <line
          x1="30%"
          y1="65%"
          x2="70%"
          y2="65%"
          stroke="currentColor"
          strokeWidth="4"
          strokeDasharray="8 8"
          className="text-slate-300 dark:text-slate-700 opacity-50"
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
          absolute inset-x-0 h-16 border-y-2 border-dashed flex items-center justify-center
          transition-colors duration-500
          ${
            activeElements.includes("internet-tunnel")
              ? "bg-blue-50/50 dark:bg-blue-900/10 border-blue-400"
              : "border-slate-300 dark:border-slate-700"
          }
        `}
          style={{ top: "60%" }}
        >
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-white dark:bg-slate-900 px-2">
            Internet (Public)
          </span>
        </div>
      </div>

      {/* Server Host Area */}
      <div className="flex-1 min-w-0 z-10">
        <HostSystem type="server" activeElements={activeElements} />
      </div>

      {/* The Moving Packet */}
      <Packet status={packetStatus} position={packetPos} label="DATA" />
    </div>
  );
};
