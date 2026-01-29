import EmbedForm from "../components/EmbedForm";
import UnlockForm from "../UnlockForm";
import MyEditsGrid from "../components/MyEditsGrid";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function DevPage() {
  const cookieStore = await cookies();
  const unlocked = cookieStore.get("dev_unlocked")?.value === "1";

  if (!unlocked) {
    return <UnlockForm />;
  }

  // Fetch embeds normally
  let embeds: string[] = [];
  try {
    const res = await fetch("/api/embeds", { cache: "no-store" });
    if (res.ok) embeds = await res.json();
  } catch {}

  return (
    <>
      <EmbedForm />
      <div className="max-w-7xl mx-auto px-4">
        <MyEditsGrid embeds={embeds} />
      </div>
    </>
  );
}