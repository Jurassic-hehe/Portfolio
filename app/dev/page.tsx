import UnlockForm from "../UnlockForm";
// Local upload UI removed — uploads are disabled in this build.
import EmbedForm from "../components/EmbedForm";
import MyEditsGrid from "../components/MyEditsGrid";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function DevPage() {
  const cookieStore = await cookies();
  const unlocked = cookieStore.get("dev_unlocked")?.value === "1";

  if (!unlocked) {
    return <UnlockForm />;
  }
  // Show admin/upload UI when unlocked
  // Fetch embeds server-side so admin grid can render initial list
  let embeds: string[] = [];
  try {
    const res = await fetch('/api/embeds', { cache: 'no-store' });
    if (res.ok) embeds = await res.json();
  } catch {}

  return (
    <>
      <div className="max-w-7xl mx-auto px-4">
        <EmbedForm />
        <MyEditsGrid embeds={embeds} />
        <hr className="my-8 border-t border-purple-600/20" />
        {/* Local uploads removed — use EmbedForm to add YouTube links */}
      </div>
    </>
  );
}