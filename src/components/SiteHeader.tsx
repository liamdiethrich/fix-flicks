import Link from "next/link";

const navItems = [
  { href: "/fixes", label: "Fixes" },
  { href: "/fitfinder", label: "FitFinder" },
  { href: "/plans", label: "Plans" },
  { href: "/request", label: "Request" },
];

export default function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 md:px-6">
        <Link href="/" className="text-lg font-semibold text-slate-900">
          FixFlicks
        </Link>
        <nav className="flex gap-4 text-sm font-medium text-slate-600">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-slate-900">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
