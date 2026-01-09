import RequestForm from "@/components/RequestForm";

export default function RequestPage() {
  return (
    <div className="bg-slate-50">
      <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-12 md:px-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-slate-900">Request a fix</h1>
          <p className="text-sm text-slate-600">
            Tell us what is not working in your space. We will prioritize the most requested fixes.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <RequestForm />
        </div>
      </div>
    </div>
  );
}
