import { requireAdmin } from "@/lib/adminAuth";
import DbInitBanner from "@/components/DbInitBanner";
import { prisma } from "@/lib/prisma";
import { shouldShowDbInitBanner } from "@/lib/db";

export default async function AdminFeedbackPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const fixSlug = typeof searchParams.fixSlug === "string" ? searchParams.fixSlug : undefined;
  let dbNotInitialized = false;
  let feedback: Awaited<ReturnType<typeof prisma.feedback.findMany>> = [];

  try {
    await requireAdmin();
    feedback = await prisma.feedback.findMany({
      where: fixSlug ? { fixSlug } : undefined,
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    if (shouldShowDbInitBanner(error)) {
      dbNotInitialized = true;
    } else {
      throw error;
    }
  }

  return (
    <div className="bg-slate-50">
      <DbInitBanner show={dbNotInitialized} />
      <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-12 md:px-6">
        <h1 className="text-3xl font-semibold text-slate-900">Feedback</h1>
        <form className="flex items-end gap-2" action="/admin/feedback" method="get">
          <label className="text-sm font-semibold text-slate-700">
            Filter by fix slug
            <input
              name="fixSlug"
              defaultValue={fixSlug}
              className="mt-2 w-full rounded-xl border border-slate-200 p-2 text-sm"
            />
          </label>
          <button type="submit" className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white">
            Filter
          </button>
        </form>
        <div className="space-y-3">
          {feedback.map((item) => (
            <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm font-semibold text-slate-900">
                {item.fixSlug} · {item.vote}
              </p>
              {item.note && <p className="mt-2 text-sm text-slate-600">{item.note}</p>}
              <p className="mt-2 text-xs text-slate-400">{item.createdAt.toISOString()}</p>
            </div>
          ))}
          {!feedback.length && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
              No feedback yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
