import FitFinderWizard from "@/components/FitFinderWizard";
import { getAllFixes } from "@/lib/content";

export default function FitFinderPage() {
  const fixes = getAllFixes();

  return (
    <div className="bg-slate-50">
      <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-12 md:px-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-slate-900">FitFinder</h1>
          <p className="text-sm text-slate-600">
            Answer three quick questions and we will match you with the best fixes.
          </p>
        </div>
        <FitFinderWizard fixes={fixes} />
      </div>
    </div>
  );
}
