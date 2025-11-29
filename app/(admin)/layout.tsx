import { redirect } from "next/navigation";
import Link from "next/link";
import { auth, signOut } from "@/app/(auth)/auth";
import {
  BarChart3,
  Users,
  Settings,
  Home,
  LogOut,
  Shield,
  Building2,
  Activity,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: Home },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Facilities", href: "/admin/facilities", icon: Building2 },
  { name: "Reports", href: "/admin/reports", icon: FileText },
  { name: "System Health", href: "/admin/system", icon: Activity },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "admin") {
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-background flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 border-b px-6 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Arogya Mitra</h1>
            <p className="text-xs text-muted-foreground">Admin Portal</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </nav>

        {/* User Info */}
        <div className="border-t p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Shield className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {session.user.name || session.user.email}
              </p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <Button variant="outline" size="sm" className="w-full">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
