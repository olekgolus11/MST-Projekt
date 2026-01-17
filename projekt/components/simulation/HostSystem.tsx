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
        relative p-3 rounded-lg border-2 transition-all duration-300 flex flex-col items-center gap-2
        ${
          isActive(id)
            ? "border-amber-500 bg-amber-50/50 dark:bg-amber-900/10 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
            : "border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50"
        }
        ${className}
      `}
    >
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      {children}
    </div>
  );

  return (
    <Card
      className={`h-full border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm ${
        isClient ? "rounded-r-none border-r-0" : "rounded-l-none border-l-0"
      }`}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          {isClient ? (
            <Monitor className="h-5 w-5" />
          ) : (
            <Server className="h-5 w-5" />
          )}
          {isClient ? "Host Użytkownika" : "Serwer VPN & Internet"}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 h-[calc(100%-4rem)] p-4">
        {/* Layer 1: Application / Internet Destination */}
        <div className="flex-1 min-h-[80px]">
          <Box
            id={appId}
            label={isClient ? "Aplikacja (Przeglądarka)" : "Internet Docelowy"}
            icon={isClient ? Globe : Globe}
            className="h-full w-full justify-center"
          />
        </div>

        {/* Arrow Connector */}
        <div className="flex justify-center text-slate-400">
          <ArrowDown className="h-5 w-5 animate-bounce opacity-20" />
        </div>

        {/* Layer 2: OS Kernel Space */}
        <div className="flex-[2] relative">
          <div
            className={`
            absolute inset-0 border-2 border-dashed rounded-xl p-4
            ${
              isActive(osId)
                ? "border-indigo-400 bg-indigo-50/30 dark:bg-indigo-900/10"
                : "border-slate-200 dark:border-slate-800"
            }
          `}
          >
            <span className="absolute -top-3 left-4 bg-white dark:bg-slate-950 px-2 text-xs font-mono text-slate-500">
              KERNEL SPACE (Jądro Systemu)
            </span>

            <div className="grid grid-cols-2 gap-4 h-full pt-2">
              {/* Left Column: Network Stack / Routing */}
              <div className="flex flex-col gap-4 justify-center">
                <Box
                  id={isClient ? "routing" : natId}
                  label={isClient ? "Routing Table" : "NAT (Maskarada)"}
                  icon={Layers}
                  className="flex-1 justify-center"
                />
              </div>

              {/* Right Column: Interfaces */}
              <div className="flex flex-col gap-4">
                <Box
                  id={tunId}
                  label="Interfejs TUN (Virtual)"
                  icon={FileText}
                  className="flex-1 justify-center border-blue-200 dark:border-blue-900"
                >
                  <div className="text-[10px] text-slate-400 text-center">
                    IP: 10.8.0.{isClient ? "2" : "1"}
                  </div>
                </Box>
                <Box
                  id={nicId}
                  label="Karta Fizyczna (NIC)"
                  icon={Network}
                  className="flex-1 justify-center border-emerald-200 dark:border-emerald-900"
                >
                  <div className="text-[10px] text-slate-400 text-center">
                    {isClient ? "ETH0 / WIFI" : "ETH0 (Public IP)"}
                  </div>
                </Box>
              </div>
            </div>
          </div>
        </div>

        {/* Layer 3: User Space VPN Process */}
        {/* We position this alongside Kernel in a real layout, but visually stacking or placing beside is tricky. 
            For this vertical flow, let's put it "floating" or integrated nicely. */}
        <div className="flex-1 min-h-[100px] mt-4 ml-8 mr-8">
          <Box
            id={vpnId}
            label={
              isClient ? "Proces OpenVPN (Klient)" : "Proces OpenVPN (Serwer)"
            }
            icon={Shield}
            className={`h-full justify-center border-2 ${isActive(vpnId) ? "border-blue-500" : "border-slate-300"}`}
          >
            <div className="flex gap-2 text-xs text-slate-500">
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">
                OpenSSL
              </span>
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">
                UDP Socket
              </span>
            </div>
          </Box>
        </div>
      </CardContent>
    </Card>
  );
};
