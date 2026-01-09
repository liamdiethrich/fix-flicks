export default function ContactPage() {
  return (
    <div className="bg-slate-50">
      <div className="mx-auto w-full max-w-3xl space-y-4 px-4 py-12 md:px-6">
        <h1 className="text-3xl font-semibold text-slate-900">Contact</h1>
        <p className="text-sm text-slate-600">
          Have a question or partnership idea? Email us at
          <a href="mailto:hello@fix-flicks.com" className="ml-1 font-semibold text-slate-900">
            hello@fix-flicks.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
