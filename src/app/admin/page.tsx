import Link from "next/link";
import { requireAdmin } from "@/lib/adminAuth";
import DbInitBanner from "@/components/DbInitBanner";
import { shouldShowDbInitBanner } from "@/lib/db";

export default async function AdminDashboard() {
  let dbNotInitialized = false;

  try {
    await requireAdmin();
  } catch (error) {
    if (shouldShowDbInitBanner(error)) {
      dbNotInitialized = true;
    } else {
      throw error;
    }
  }

  const cards = [
    { href: "/admin/requests", label: "Requests" },
    { href: "/admin/feedback", label: "Feedback" },
    { href: "/admin/analytics", label: "Analytics" },
    { href: "/admin/pin-pack", label: "Pin Pack" },
    { href: "/admin/kit-builder", label: "Kit Builder" },
  ];

  return (
    <div className="bg-slate-50">
      <DbInitBanner show={dbNotInitialized} />
      <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-12 md:px-6">
        <h1 className="text-3xl font-semibold text-slate-900">Admin dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="rounded-2xl border border-slate-200 bg-white p-6 text-lg font-semibold text-slate-900"
            >
              {card.label}
            </Link>
          ))}
        </div>
        <form action="/api/admin/logout" method="post">
          <button type="submit" className="text-sm font-semibold text-slate-600">
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
