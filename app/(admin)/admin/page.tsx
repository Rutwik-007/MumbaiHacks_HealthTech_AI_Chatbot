"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Users,
  Building2,
  FileText,
  Activity,
  TrendingUp,
  Calendar,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardStats {
  users: {
    total: number;
    citizen: number;
    asha: number;
    officer: number;
    admin: number;
  };
  facilities: number;
  appointments: number;
  activeChats: number;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description?: string;
  trend?: { value: number; positive: boolean };
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {trend && (
        <div
          className={`flex items-center text-xs ${
            trend.positive ? "text-green-500" : "text-red-500"
          }`}
        >
          <TrendingUp
            className={`h-3 w-3 mr-1 ${!trend.positive && "rotate-180"}`}
          />
          {trend.value}% from last month
        </div>
      )}
    </CardContent>
  </Card>
);

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/admin/stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  // Mock stats for demo if API not ready
  const displayStats = stats || {
    users: { total: 1247, citizen: 1100, asha: 120, officer: 25, admin: 2 },
    facilities: 48,
    appointments: 342,
    activeChats: 89,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {session?.user?.name || session?.user?.email}! Here's an
          overview of the Arogya Mitra platform.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={displayStats.users.total}
          icon={Users}
          description="Registered platform users"
          trend={{ value: 12, positive: true }}
        />
        <StatCard
          title="Health Facilities"
          value={displayStats.facilities}
          icon={Building2}
          description="PHCs, CHCs & Hospitals"
        />
        <StatCard
          title="Appointments"
          value={displayStats.appointments}
          icon={Calendar}
          description="This month"
          trend={{ value: 8, positive: true }}
        />
        <StatCard
          title="Active Chats"
          value={displayStats.activeChats}
          icon={MessageSquare}
          description="Last 24 hours"
        />
      </div>

      {/* User Distribution */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">User Distribution by Role</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  label: "Citizens",
                  value: displayStats.users.citizen,
                  color: "bg-blue-500",
                  icon: "👨‍👩‍👧‍👦",
                },
                {
                  label: "ASHA Workers",
                  value: displayStats.users.asha,
                  color: "bg-green-500",
                  icon: "👩‍⚕️",
                },
                {
                  label: "Health Officers",
                  value: displayStats.users.officer,
                  color: "bg-purple-500",
                  icon: "🏥",
                },
                {
                  label: "Administrators",
                  value: displayStats.users.admin,
                  color: "bg-red-500",
                  icon: "⚙️",
                },
              ].map((role) => (
                <div key={role.label} className="flex items-center gap-3">
                  <span className="text-xl">{role.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span>{role.label}</span>
                      <span className="font-medium">{role.value}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full ${role.color}`}
                        style={{
                          width: `${(role.value / displayStats.users.total) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">System Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                {
                  type: "warning",
                  message: "5 ASHA workers pending verification",
                  time: "2 hours ago",
                },
                {
                  type: "info",
                  message: "Monthly health report ready for review",
                  time: "5 hours ago",
                },
                {
                  type: "success",
                  message: "Vaccination campaign data synced",
                  time: "1 day ago",
                },
                {
                  type: "error",
                  message: "2 facilities with connectivity issues",
                  time: "2 days ago",
                },
              ].map((alert, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 rounded-lg p-3 ${
                    alert.type === "warning"
                      ? "bg-yellow-500/10 border-yellow-500/20"
                      : alert.type === "error"
                        ? "bg-red-500/10 border-red-500/20"
                        : alert.type === "success"
                          ? "bg-green-500/10 border-green-500/20"
                          : "bg-blue-500/10 border-blue-500/20"
                  } border`}
                >
                  <AlertTriangle
                    className={`h-4 w-4 mt-0.5 ${
                      alert.type === "warning"
                        ? "text-yellow-500"
                        : alert.type === "error"
                          ? "text-red-500"
                          : alert.type === "success"
                            ? "text-green-500"
                            : "text-blue-500"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-4">
            {[
              {
                label: "View All Users",
                href: "/admin/users",
                icon: Users,
                color: "bg-blue-500",
              },
              {
                label: "View Analytics",
                href: "/admin/analytics",
                icon: Activity,
                color: "bg-green-500",
              },
              {
                label: "Manage Facilities",
                href: "/admin/facilities",
                icon: Building2,
                color: "bg-purple-500",
              },
              {
                label: "Generate Reports",
                href: "/admin/reports",
                icon: FileText,
                color: "bg-orange-500",
              },
            ].map((action) => (
              <a
                key={action.label}
                href={action.href}
                className="flex items-center gap-3 rounded-lg border p-4 hover:bg-muted transition-colors"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${action.color} text-white`}
                >
                  <action.icon className="h-5 w-5" />
                </div>
                <span className="font-medium text-sm">{action.label}</span>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Platform Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                action: "New user registered",
                details: "citizen@example.com joined as Citizen",
                time: "5 minutes ago",
              },
              {
                action: "Appointment booked",
                details: "OPD at Sassoon Hospital, Pune",
                time: "12 minutes ago",
              },
              {
                action: "ASHA worker verified",
                details: "Sunita Devi (Yerawada PHC) verified by admin",
                time: "1 hour ago",
              },
              {
                action: "Scheme application",
                details: "Ayushman Bharat application submitted",
                time: "2 hours ago",
              },
              {
                action: "Health alert sent",
                details: "Monsoon health advisory to Pune district",
                time: "3 hours ago",
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-3 border-b last:border-0 pb-3 last:pb-0"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.details}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
