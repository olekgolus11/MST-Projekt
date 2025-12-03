import type { Step } from "@/lib/demonstration-steps";

interface ExplanationPanelProps {
  step: Step;
  isVisible: boolean;
}

export function ExplanationPanel({ step, isVisible }: ExplanationPanelProps) {
  if (!isVisible) return null;

  return (
    <div className="mx-8 mb-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex h-full overflow-hidden rounded-2xl border bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
        {/* Left side - Explanation */}
        <div className="flex-1 p-6">
          <h3 className="mb-3 text-lg font-bold text-slate-800 dark:text-slate-100">
            {step.title}
          </h3>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {step.explanation}
          </p>
        </div>

        {/* Vertical divider */}
        <div className="w-px border" />

        {/* Right side - Technical details */}
        <div className="flex-1 p-6">
          <h3 className="mb-3 text-lg font-bold text-slate-800 dark:text-slate-100">
            Szczegóły techniczne
          </h3>
          <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {step.technicalDetails}
          </pre>
        </div>
      </div>
    </div>
  );
}
