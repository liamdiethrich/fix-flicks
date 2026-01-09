export default function AdminLoginPage() {
  return (
    <div className="bg-slate-50">
      <div className="mx-auto w-full max-w-sm space-y-6 px-4 py-12 md:px-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-slate-900">Admin login</h1>
          <p className="text-sm text-slate-600">Enter the admin password to continue.</p>
        </div>
        <form
          action="/api/admin/login"
          method="post"
          className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6"
        >
          <label className="text-sm font-semibold text-slate-700">
            Password
            <input
              name="password"
              type="password"
              required
              className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-sm"
            />
          </label>
          <button type="submit" className="w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
