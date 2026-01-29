import UnlockForm from "../UnlockForm";
import LocalVideosAndUpload from "../components/LocalVideosAndUpload";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function DevPage() {
  const cookieStore = await cookies();
  const unlocked = cookieStore.get("dev_unlocked")?.value === "1";

  if (!unlocked) {
    return <UnlockForm />;
  }
  // Show admin/upload UI when unlocked
  return (
    <>
      <div className="max-w-7xl mx-auto px-4">
        <LocalVideosAndUpload />
      </div>
    </>
  );
}