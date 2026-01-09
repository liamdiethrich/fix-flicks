import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export default async function AdminRequestsPage() {
  await requireAdmin();
  const requests = await prisma.request.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="bg-slate-50">
      <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-12 md:px-6">
        <h1 className="text-3xl font-semibold text-slate-900">Requests</h1>
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{request.room}</p>
                  <p className="text-sm text-slate-600">{request.problem}</p>
                  <p className="text-xs text-slate-400">{request.constraints}</p>
                </div>
                <form action="/api/admin/requests" method="post" className="flex items-center gap-2">
                  <input type="hidden" name="id" value={request.id} />
                  <select
                    name="status"
                    defaultValue={request.status}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  >
                    <option value="new">new</option>
                    <option value="planned">planned</option>
                    <option value="published">published</option>
                    <option value="ignored">ignored</option>
                  </select>
                  <button
                    type="submit"
                    className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
                  >
                    Update
                  </button>
                </form>
              </div>
              {request.email && <p className="mt-2 text-xs text-slate-500">{request.email}</p>}
            </div>
          ))}
          {!requests.length && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
              No requests yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
