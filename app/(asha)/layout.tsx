import { redirect } from "next/navigation";
import Link from "next/link";
import { auth, signOut } from "@/app/(auth)/auth";
import { Button } from "@/components/ui/button";

export default async function AshaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "asha") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-zinc-950">
      {/* Sidebar */}
      <aside className="w-64 bg-green-600 text-white flex flex-col">
        <div className="p-4 border-b border-green-500">
          <div className="flex items-center gap-2">
            <span className="text-2xl">👩‍⚕️</span>
            <div>
              <h1 className="font-bold text-lg">ASHA Portal</h1>
              <p className="text-xs text-green-200">आशा कार्यकर्ता</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/asha"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-green-500 transition-colors"
          >
            <span>🏠</span>
            <span>Dashboard</span>
          </Link>
          <Link
            href="/asha/beneficiaries"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-green-500 transition-colors"
          >
            <span>👨‍👩‍👧‍👦</span>
            <span>Beneficiaries</span>
          </Link>
          <Link
            href="/asha/vaccinations"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-green-500 transition-colors"
          >
            <span>💉</span>
            <span>Vaccinations</span>
          </Link>
          <Link
            href="/asha/visits"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-green-500 transition-colors"
          >
            <span>🏡</span>
            <span>Home Visits</span>
          </Link>
          <Link
            href="/asha/pregnancies"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-green-500 transition-colors"
          >
            <span>🤰</span>
            <span>Pregnancy Tracking</span>
          </Link>
          <Link
            href="/asha/alerts"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-green-500 transition-colors"
          >
            <span>🚨</span>
            <span>Health Alerts</span>
          </Link>
          <Link
            href="/asha/resources"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-green-500 transition-colors"
          >
            <span>📚</span>
            <span>Resources</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-green-500">
          <div className="mb-3 text-sm">
            <p className="font-medium">{session.user.name || "ASHA Worker"}</p>
            <p className="text-green-200 text-xs">{session.user.district || "Maharashtra"}</p>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <Button
              variant="outline"
              className="w-full bg-transparent border-green-400 text-white hover:bg-green-500"
            >
              Sign Out
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
