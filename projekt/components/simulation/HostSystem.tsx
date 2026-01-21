import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Cpu,
  FileText,
  Globe,
  Layers,
  Monitor,
  Network,
  Server,
  Shield,
} from "lucide-react";
import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface HostSystemProps {
  type: "client" | "server";
  activeElements: string[];
}

export const HostSystem: React.FC<HostSystemProps> = ({
  type,
  activeElements,
}) => {
  const isClient = type === "client";
  const hostId = isClient ? "client-host" : "server-host";
  const appId = isClient ? "client-app" : "target-internet";
  const osId = isClient ? "client-os" : "server-os";
  const tunId = isClient ? "client-tun" : "server-tun";
  const vpnId = isClient ? "client-vpn-process" : "server-vpn-process";
  const nicId = isClient ? "client-nic" : "server-nic";
  const natId = isClient ? "" : "server-nat";

  const isActive = (id: string) => activeElements.includes(id);

  const Box = ({
    id,
    label,
    icon: Icon,
    children,
    className = "",
  }: {
    id: string;
    label: string;
    icon: any;
    children?: React.ReactNode;
    className?: string;
  }) => (
    <div
      className={`
        relative p-2 rounded-lg border-2 transition-all duration-300 flex flex-col items-center gap-1 justify-center
        ${
          isActive(id)
            ? "border-amber-500 bg-amber-50/50 dark:bg-amber-900/10 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
            : "border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50"
        }
        ${className}
      `}
    >
      <div className="flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300 text-center leading-tight">
        <Icon className="h-3 w-3 shrink-0" />
        {label}
      </div>
      {children}
    </div>
  );

  return (
    <Card
      className={`h-full border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm flex flex-col overflow-hidden ${
        isClient ? "rounded-r-none border-r-0" : "rounded-l-none border-l-0"
      }`}
    >
      <CardHeader className="pb-2 px-4 py-3 shrink-0">
        <CardTitle className="flex items-center gap-2 text-base">
          {isClient ? (
            <Monitor className="h-4 w-4" />
          ) : (
            <Server className="h-4 w-4" />
          )}
          {isClient ? "Host Użytkownika" : "Serwer VPN & Internet"}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-2 p-3 min-h-0">
        {/* Layer 1: Application / Internet Destination */}
        <div className="flex-none h-16">
          <Box
            id={appId}
            label={isClient ? "Aplikacja (Przeglądarka)" : "Internet Docelowy"}
            icon={isClient ? Globe : Globe}
            className="h-full w-full"
          >
            {!isClient && (
              <div className="text-[9px] text-slate-400 text-center font-mono">
                142.250.185.78:443
              </div>
            )}
          </Box>
        </div>

        {/* Arrow Connector */}
        <div className="flex justify-center text-slate-400 shrink-0 h-4">
          <ArrowDown className="h-4 w-4 animate-bounce opacity-20" />
        </div>

        {/* Layer 2: OS Kernel Space */}
        <div className="flex-1 relative min-h-0">
          <div
            className={`
            w-full h-full border-2 border-dashed rounded-xl p-2 pt-4
            flex flex-col
            ${
              isActive(osId)
                ? "border-indigo-400 bg-indigo-50/30 dark:bg-indigo-900/10"
                : "border-slate-200 dark:border-slate-800"
            }
          `}
          >
            <span className="absolute -top-2.5 left-4 bg-white dark:bg-slate-950 px-2 text-[10px] font-mono text-slate-500 uppercase tracking-wider border rounded-full">
              Kernel Space
            </span>

            <div className="grid grid-cols-2 gap-2 flex-1 min-h-0">
              {/* Left Column: Network Stack / Routing */}
              <div className="flex flex-col justify-center">
                <Box
                  id={isClient ? "routing" : natId}
                  label={isClient ? "Routing Table" : "NAT (Maskarada)"}
                  icon={Layers}
                  className="h-full w-full"
                />
              </div>

              {/* Right Column: Interfaces */}
              <div className="flex flex-col gap-2 h-full">
                <Box
                  id={tunId}
                  label="Interfejs TUN (Virtual)"
                  icon={FileText}
                  className="flex-1 w-full border-blue-200 dark:border-blue-900"
                >
                   <div className="text-[9px] text-slate-400 text-center font-mono">
                    10.8.0.{isClient ? "2" : "1"}
                   </div>
                </Box>
                <Box
                  id={nicId}
                  label="Karta Fizyczna (NIC)"
                  icon={Network}
                  className="flex-1 w-full border-emerald-200 dark:border-emerald-900"
                >
                  <div className="text-[9px] text-slate-400 text-center font-mono">
                    {isClient ? "192.168.1.100" : "185.245.12.34"}
                  </div>
                </Box>
              </div>
            </div>
          </div>
        </div>

        {/* Layer 3: User Space VPN Process */}
        <div className="flex-none h-20 mt-1 mx-4">
          <Box
            id={vpnId}
            label={
              isClient ? "Proces OpenVPN (Klient)" : "Proces OpenVPN (Serwer)"
            }
            icon={Shield}
            className={`h-full w-full border-2 ${isActive(vpnId) ? "border-blue-500" : "border-slate-300"}`}
          >
            <div className="flex gap-1 text-[9px] text-slate-500 flex-wrap justify-center">
              <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono">
                UDP:1194
              </span>
              <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">
                OpenSSL
              </span>
            </div>
          </Box>
        </div>
      </CardContent>
    </Card>
  );
};
