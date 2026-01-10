export default function DbInitBanner({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-900">
      Database not initialized. Run: npm run setup
    </div>
  );
}
