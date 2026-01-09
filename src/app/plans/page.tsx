import Link from "next/link";
import { getAllPlans } from "@/lib/content";

export default function PlansPage() {
  const plans = getAllPlans().sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <div className="bg-slate-50">
      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-12 md:px-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-slate-900">Plans</h1>
          <p className="text-sm text-slate-600">Multi-fix bundles tailored to a goal or room.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {plans.map((plan) => (
            <Link
              key={plan.slug}
              href={`/plan/${plan.slug}`}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-slate-900">{plan.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{plan.summary}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                {plan.audienceTags.map((tag) => (
                  <span key={tag} className="rounded-full bg-slate-100 px-2 py-1">
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
