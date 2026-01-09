export default function DevAmazonWarning({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="bg-amber-50 px-4 py-2 text-center text-xs text-amber-900">
      AMAZON_ASSOCIATE_TAG is missing. Add it to your .env for accurate attribution.
    </div>
  );
}
