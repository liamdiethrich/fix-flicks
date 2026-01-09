import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-slate-600 md:px-6">
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/affiliate-disclosure" className="hover:text-slate-900">
            Affiliate Disclosure
          </Link>
          <Link href="/privacy" className="hover:text-slate-900">
            Privacy
          </Link>
          <Link href="/about" className="hover:text-slate-900">
            About
          </Link>
          <Link href="/contact" className="hover:text-slate-900">
            Contact
          </Link>
        </div>
        <p className="text-xs text-slate-500">
          As an Amazon Associate I earn from qualifying purchases.
        </p>
        <p className="text-xs text-slate-500">
          AI-generated video for illustration; verify details on the product listing.
        </p>
      </div>
    </footer>
  );
}
