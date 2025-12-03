"use client";

import { useState } from "react";
import {
  Computer,
  GlobeLock,
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ExplanationPanel } from "@/components/ExplanationPanel";
import { demonstrationSteps } from "@/lib/demonstration-steps";

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const currentStepData = demonstrationSteps[currentStep];
  const activeElements = currentStepData?.activeElements || [];

  const isActive = (elementId: string) => activeElements.includes(elementId);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const handleNext = () => {
    if (currentStep < demonstrationSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-linear-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex flex-col">
      {/* Header */}
      <header className="flex h-16 items-center justify-between px-8 border-b border-slate-200 dark:border-slate-700">
        <div className="w-48" /> {/* Spacer for centering */}
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          Symulacja protokołu OpenVPN
        </h1>
        <div className="flex items-center gap-2 w-48 justify-end">
          {!isPlaying ? (
            <Button
              onClick={handlePlay}
              variant="default"
              size="sm"
              className="gap-2"
            >
              <Play className="h-4 w-4" />
              Start
            </Button>
          ) : (
            <Button
              onClick={handlePause}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Pause className="h-4 w-4" />
              Pauza
            </Button>
          )}
          <Button
            onClick={handleReset}
            variant="ghost"
            size="sm"
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Main Board */}
      <main
        className={`flex items-center justify-center px-8 transition-all duration-500 ${isPlaying ? "h-[45vh]" : "flex-1"}`}
      >
        <div className="flex w-full max-w-6xl items-center gap-4">
          {/* Client Device */}
          <Card
            className={`transition-all duration-300 ${isActive("client") ? "border-amber-500 shadow-lg shadow-amber-100 dark:shadow-amber-900/20" : ""}`}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 whitespace-nowrap">
                Użytkownik <Computer />
              </CardTitle>
              <CardDescription>Komputer Stacjonarny</CardDescription>
            </CardHeader>
            <CardFooter>
              <CardAction>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Wyświetl szczegóły</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Użytkownik końcowy</DialogTitle>
                      <DialogDescription>
                        Urządzenie użytkownika, które chce bezpiecznie połączyć
                        się z internetem przez VPN.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-start">
                      <DialogClose asChild>
                        <Button type="button" variant="secondary">
                          Zamknij
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardAction>
            </CardFooter>
          </Card>

          {/* Connection line: Device to VPN Client */}
          <div className="flex-1 px-2">
            <div
              className={`h-0.5 w-full border-t-2 border-dashed transition-colors duration-300 ${isActive("client") && isActive("vpn-client") ? "border-amber-500" : "border-slate-300 dark:border-slate-600"}`}
            />
          </div>

          {/* VPN Client Process */}
          <Card
            className={`transition-all duration-300 ${isActive("vpn-client") ? "border-blue-600 shadow-lg shadow-blue-100 dark:border-blue-400 dark:shadow-blue-900/20" : "border-slate-200 dark:border-slate-700"}`}
          >
            <CardHeader>
              <CardTitle>VPN Klient</CardTitle>
              <CardDescription>Enkrypcja danych</CardDescription>
            </CardHeader>
            <CardFooter>
              <CardAction>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Wyświetl szczegóły</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Klient VPN</DialogTitle>
                      <DialogDescription>
                        Oprogramowanie OpenVPN działające na urządzeniu
                        użytkownika. Odpowiada za szyfrowanie danych przed
                        wysłaniem do serwera VPN.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-start">
                      <DialogClose asChild>
                        <Button type="button" variant="secondary">
                          Zamknij
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardAction>
            </CardFooter>
          </Card>

          {/* VPN Tunnel */}
          <div className="flex-1 px-2">
            <div className="relative flex items-center">
              <Shield
                className={`absolute left-1/2 -top-8 -translate-x-1/2 transition-colors duration-300 ${isActive("vpn-tunnel") ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-600"}`}
              />
              <div
                className={`h-0.5 w-full border-t-2 border-dashed transition-colors duration-300 ${isActive("vpn-tunnel") ? "border-blue-600 dark:border-blue-400" : "border-slate-300 dark:border-slate-600"}`}
              />
              <span
                className={`absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium transition-colors duration-300 ${isActive("vpn-tunnel") ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500"}`}
              >
                Tunel VPN
              </span>
            </div>
          </div>

          {/* VPN Server Process */}
          <Card
            className={`transition-all duration-300 ${isActive("vpn-server") ? "border-blue-600 shadow-lg shadow-blue-100 dark:border-blue-400 dark:shadow-blue-900/20" : "border-slate-200 dark:border-slate-700"}`}
          >
            <CardHeader>
              <CardTitle>VPN Serwer</CardTitle>
              <CardDescription>Chowa adres IP oraz geolokację</CardDescription>
            </CardHeader>
            <CardFooter>
              <CardAction>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Wyświetl szczegóły</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Serwer VPN</DialogTitle>
                      <DialogDescription>
                        Zdalny serwer OpenVPN, który odbiera zaszyfrowane dane,
                        odszyfrowuje je i przekazuje do internetu. Ukrywa
                        prawdziwy adres IP użytkownika.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-start">
                      <DialogClose asChild>
                        <Button type="button" variant="secondary">
                          Zamknij
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardAction>
            </CardFooter>
          </Card>

          {/* Connection line: VPN Server to Internet */}
          <div className="flex-1 px-2">
            <div className="relative flex items-center">
              <div
                className={`h-0.5 w-full border-t-2 border-dashed transition-colors duration-300 ${isActive("vpn-server") && isActive("internet") ? "border-emerald-500" : "border-slate-300 dark:border-slate-600"}`}
              />
            </div>
          </div>

          {/* Internet */}
          <Card
            className={`transition-all duration-300 ${isActive("internet") ? "border-emerald-500 shadow-lg shadow-emerald-100 dark:shadow-emerald-900/20" : ""}`}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 whitespace-nowrap">
                Internet <GlobeLock />
              </CardTitle>
              <CardDescription>
                Bezpieczne przeglądanie stron www
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <CardAction>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Wyświetl szczegóły</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Internet</DialogTitle>
                      <DialogDescription>
                        Strony internetowe i usługi, z którymi użytkownik się
                        łączy. Dzięki VPN widzą tylko adres IP serwera VPN, nie
                        użytkownika.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-start">
                      <DialogClose asChild>
                        <Button type="button" variant="secondary">
                          Zamknij
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardAction>
            </CardFooter>
          </Card>
        </div>
      </main>

      {/* Explanation Panel */}
      {isPlaying && (
        <div className="flex-1 flex flex-col">
          {/* Navigation controls */}
          <div className="flex items-center justify-center gap-4 py-4">
            <Button
              onClick={handlePrevious}
              variant="outline"
              size="sm"
              disabled={currentStep === 0}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Wstecz
            </Button>
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Krok {currentStep + 1} z {demonstrationSteps.length}
            </span>
            <Button
              onClick={handleNext}
              variant="outline"
              size="sm"
              disabled={currentStep === demonstrationSteps.length - 1}
              className="gap-1"
            >
              Dalej
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <ExplanationPanel step={currentStepData} isVisible={isPlaying} />
        </div>
      )}
    </div>
  );
}
