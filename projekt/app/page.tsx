"use client";

import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ExplanationPanel } from "@/components/ExplanationPanel";
import { SimulationBoard } from "@/components/simulation/SimulationBoard";
import { Button } from "@/components/ui/button";
import { demonstrationPhases } from "@/lib/demonstration-steps";

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPhaseId, setSelectedPhaseId] = useState(
    demonstrationPhases[0]?.id ?? "data-transmission",
  );

  const currentPhase =
    demonstrationPhases.find((phase) => phase.id === selectedPhaseId) ??
    demonstrationPhases[0];
  const phaseIndex = demonstrationPhases.findIndex(
    (phase) => phase.id === currentPhase.id,
  );
  const steps = currentPhase.steps;
  const currentStepData = steps[currentStep];

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying) {
      interval = setInterval(() => {
        if (currentStep < steps.length - 1) {
          setCurrentStep((prev) => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, 3000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, currentStep, steps.length]);

  const handlePlay = () => {
    if (currentStep === steps.length - 1) {
      setCurrentStep(0);
    }
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
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePhaseChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPhaseId(event.target.value);
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const handlePreviousPhase = () => {
    if (phaseIndex > 0) {
      const previousPhase = demonstrationPhases[phaseIndex - 1];
      setSelectedPhaseId(previousPhase.id);
      setIsPlaying(false);
      setCurrentStep(previousPhase.steps.length - 1);
    }
  };

  const handleNextPhase = () => {
    if (phaseIndex < demonstrationPhases.length - 1) {
      const nextPhase = demonstrationPhases[phaseIndex + 1];
      setSelectedPhaseId(nextPhase.id);
      setIsPlaying(false);
      setCurrentStep(0);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-linear-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex flex-col">
      {/* Header */}
      <header className="flex h-16 items-center justify-between px-8 border-b border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm z-50">
        <div className="w-64 flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Faza
          </label>
          <select
            value={selectedPhaseId}
            onChange={handlePhaseChange}
            className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            {demonstrationPhases.map((phase) => (
              <option key={phase.id} value={phase.id}>
                {phase.title}
              </option>
            ))}
          </select>
        </div>
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
      <main className="flex-1 relative w-full flex flex-col overflow-hidden min-h-0">
        {/* Simulation Area */}
        <div className="flex-1 w-full relative flex items-center justify-center p-4">
          <div className="w-full h-full max-w-7xl max-h-[800px]">
            <SimulationBoard currentStep={currentStepData} />
          </div>
        </div>

        {/* Explanation Panel - Always visible at bottom, or conditional */}
        <div className="z-50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border-t border-slate-200 dark:border-slate-700 shrink-0">
          {/* Navigation controls - Moved here for better UX */}
          <div className="flex items-center justify-center gap-4 py-2 border-b border-slate-200/50 dark:border-slate-700/50 px-4">
            <div className="flex items-center justify-center gap-3">
              <Button
                onClick={handlePreviousPhase}
                variant="ghost"
                size="sm"
                className="gap-1"
                disabled={phaseIndex === 0}
              >
                Poprzednia faza
              </Button>
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
                Krok {currentStep + 1} z {steps.length}
              </span>
              <Button
                onClick={handleNext}
                variant="outline"
                size="sm"
                disabled={currentStep === steps.length - 1}
                className="gap-1"
              >
                Dalej
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleNextPhase}
                variant="ghost"
                size="sm"
                className="gap-1"
                disabled={phaseIndex === demonstrationPhases.length - 1}
              >
                Następna faza
              </Button>
            </div>
          </div>

          <ExplanationPanel
            step={currentStepData}
            isVisible={true}
            phaseTitle={currentPhase.title}
            phaseDescription={currentPhase.description}
          />
        </div>
      </main>
    </div>
  );
}
