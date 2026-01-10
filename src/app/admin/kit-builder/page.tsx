import { requireAdmin } from "@/lib/adminAuth";
import DbInitBanner from "@/components/DbInitBanner";
import { shouldShowDbInitBanner } from "@/lib/db";
import { getAmazonDefaultTag } from "@/lib/env";
import KitBuilderForm from "@/components/admin/KitBuilderForm";

export default async function KitBuilderPage() {
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
  const tag = getAmazonDefaultTag();

  const placeholderLines = ["B000000000,1", "B000000001,2", "B000000002,1"].join("\n");

  return (
    <div className="bg-slate-50">
      <DbInitBanner show={dbNotInitialized} />
      <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-12 md:px-6">
        <h1 className="text-3xl font-semibold text-slate-900">Kit Builder</h1>
        <p className="text-sm text-slate-600">
          Paste ASINs and quantities (one per line). Use &ldquo;ASIN,qty&rdquo; or &ldquo;ASIN x qty&rdquo;. Quantity
          defaults to 1.
        </p>
        <KitBuilderForm tag={tag} placeholder={placeholderLines} />
      </div>
    </div>
  );
}
