"use client";

import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react";
import { useState } from "react";
import { ExplanationPanel } from "@/components/ExplanationPanel";
import { SimulationBoard } from "@/components/simulation/SimulationBoard";
import { Button } from "@/components/ui/button";
import { demonstrationSteps } from "@/lib/demonstration-steps";

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const currentStepData = demonstrationSteps[currentStep];

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
      <header className="flex h-16 items-center justify-between px-8 border-b border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm z-50">
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
      <main className="flex-1 relative w-full flex flex-col overflow-hidden">
        {/* Simulation Area */}
        <div className="flex-1 w-full relative">
          <SimulationBoard currentStep={currentStepData} />
        </div>

        {/* Explanation Panel - Always visible at bottom, or conditional */}
        <div className="z-50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border-t border-slate-200 dark:border-slate-700">
          {/* Navigation controls - Moved here for better UX */}
          <div className="flex items-center justify-center gap-4 py-2 border-b border-slate-200/50 dark:border-slate-700/50">
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
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
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

          <ExplanationPanel step={currentStepData} isVisible={true} />
        </div>
      </main>
    </div>
  );
}
