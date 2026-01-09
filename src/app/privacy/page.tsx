export default function PrivacyPage() {
  return (
    <div className="bg-slate-50">
      <div className="mx-auto w-full max-w-3xl space-y-4 px-4 py-12 md:px-6">
        <h1 className="text-3xl font-semibold text-slate-900">Privacy</h1>
        <p className="text-sm text-slate-600">
          FixFlicks collects lightweight usage events (page views, clicks, and search) to improve fixes.
          We also store requests you submit and optional email addresses for follow-up.
        </p>
        <p className="text-sm text-slate-600">
          We do not sell personal data, and we do not store raw IP addresses. You can email us to
          delete your request data.
        </p>
      </div>
    </div>
  );
}
