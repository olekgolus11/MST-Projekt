import type { Step } from "@/lib/demonstration-steps";

interface ExplanationPanelProps {
  step: Step;
  isVisible: boolean;
  phaseTitle?: string;
  phaseDescription?: string;
}

export function ExplanationPanel({
  step,
  isVisible,
  phaseTitle,
  phaseDescription,
}: ExplanationPanelProps) {
  if (!isVisible) return null;

  return (
    <div className="mx-8 mb-4 h-48 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex h-full overflow-hidden rounded-2xl border bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
        {/* Left side - Explanation */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="mb-3 sticky top-0 bg-white dark:bg-slate-800 pb-2">
            {phaseTitle && (
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                {phaseTitle}
              </div>
            )}
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {step.title}
            </h3>
            {phaseDescription && (
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {phaseDescription}
              </p>
            )}
          </div>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {step.explanation}
          </p>
        </div>

        {/* Vertical divider */}
        <div className="w-px border bg-slate-200 dark:bg-slate-700" />

        {/* Right side - Technical details */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-50 dark:bg-slate-900/50">
          <h3 className="mb-3 text-lg font-bold text-slate-800 dark:text-slate-100 sticky top-0 bg-slate-50 dark:bg-slate-900/50 pb-2">
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
