import { redirect } from "next/navigation";
import Link from "next/link";
import { auth, signOut } from "@/app/(auth)/auth";
import { Button } from "@/components/ui/button";

export default async function OfficerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "officer") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-zinc-950">
      {/* Sidebar */}
      <aside className="w-64 bg-purple-700 text-white flex flex-col">
        <div className="p-4 border-b border-purple-600">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏥</span>
            <div>
              <h1 className="font-bold text-lg">Officer Portal</h1>
              <p className="text-xs text-purple-200">स्वास्थ्य अधिकारी</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/officer"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-purple-600 transition-colors"
          >
            <span>📊</span>
            <span>Dashboard</span>
          </Link>
          <Link
            href="/officer/asha-workers"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-purple-600 transition-colors"
          >
            <span>👩‍⚕️</span>
            <span>ASHA Workers</span>
          </Link>
          <Link
            href="/officer/coverage"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-purple-600 transition-colors"
          >
            <span>💉</span>
            <span>Vaccination Coverage</span>
          </Link>
          <Link
            href="/officer/surveillance"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-purple-600 transition-colors"
          >
            <span>🦠</span>
            <span>Disease Surveillance</span>
          </Link>
          <Link
            href="/officer/reports"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-purple-600 transition-colors"
          >
            <span>📈</span>
            <span>Reports</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-purple-600">
          <div className="mb-3 text-sm">
            <p className="font-medium">{session.user.name || "Health Officer"}</p>
            <p className="text-purple-200 text-xs">{session.user.district || "District"} District</p>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <Button
              variant="outline"
              className="w-full bg-transparent border-purple-400 text-white hover:bg-purple-600"
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
