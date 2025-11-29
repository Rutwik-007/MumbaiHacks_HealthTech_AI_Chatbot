"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  MoreVertical,
  UserCheck,
  UserX,
  Shield,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  email: string;
  name: string | null;
  role: "citizen" | "asha" | "officer" | "admin";
  phone: string | null;
  district: string | null;
  createdAt: string;
  status: "active" | "pending" | "suspended";
}

const roleColors = {
  citizen: "bg-blue-500/10 text-blue-700 border-blue-500/30",
  asha: "bg-green-500/10 text-green-700 border-green-500/30",
  officer: "bg-purple-500/10 text-purple-700 border-purple-500/30",
  admin: "bg-red-500/10 text-red-700 border-red-500/30",
};

const roleIcons = {
  citizen: "👨‍👩‍👧‍👦",
  asha: "👩‍⚕️",
  officer: "🏥",
  admin: "⚙️",
};

// Mock data for demonstration
const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@arogya.gov.in",
    name: "System Administrator",
    role: "admin",
    phone: "+91 9876543210",
    district: "Pune",
    createdAt: "2024-01-01",
    status: "active",
  },
  {
    id: "2",
    email: "officer@arogya.gov.in",
    name: "Dr. Rajesh Patil",
    role: "officer",
    phone: "+91 9876543211",
    district: "Pune",
    createdAt: "2024-01-15",
    status: "active",
  },
  {
    id: "3",
    email: "asha@arogya.gov.in",
    name: "Sunita Devi",
    role: "asha",
    phone: "+91 9876543212",
    district: "Pune",
    createdAt: "2024-02-01",
    status: "active",
  },
  {
    id: "4",
    email: "asha2@example.com",
    name: "Rekha Jadhav",
    role: "asha",
    phone: "+91 9876543213",
    district: "Nashik",
    createdAt: "2024-02-10",
    status: "pending",
  },
  {
    id: "5",
    email: "citizen@example.com",
    name: "Amit Kumar",
    role: "citizen",
    phone: "+91 9876543214",
    district: "Mumbai",
    createdAt: "2024-03-01",
    status: "active",
  },
  {
    id: "6",
    email: "citizen2@example.com",
    name: "Priya Sharma",
    role: "citizen",
    phone: null,
    district: null,
    createdAt: "2024-03-05",
    status: "active",
  },
  {
    id: "7",
    email: "officer2@health.gov.in",
    name: "Dr. Suresh More",
    role: "officer",
    phone: "+91 9876543215",
    district: "Nagpur",
    createdAt: "2024-03-10",
    status: "active",
  },
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.district?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = !roleFilter || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === "active").length,
    pending: users.filter((u) => u.status === "pending").length,
    byRole: {
      citizen: users.filter((u) => u.role === "citizen").length,
      asha: users.filter((u) => u.role === "asha").length,
      officer: users.filter((u) => u.role === "officer").length,
      admin: users.filter((u) => u.role === "admin").length,
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage all platform users and their roles
          </p>
        </div>
        <Button>
          <Shield className="h-4 w-4 mr-2" />
          Add Admin User
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Total Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </div>
            <p className="text-xs text-muted-foreground">Pending Verification</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {stats.byRole.asha}
            </div>
            <p className="text-xs text-muted-foreground">ASHA Workers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-600">
              {stats.byRole.officer}
            </div>
            <p className="text-xs text-muted-foreground">Health Officers</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or district..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {["citizen", "asha", "officer", "admin"].map((role) => (
                <Button
                  key={role}
                  variant={roleFilter === role ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    setRoleFilter(roleFilter === role ? null : role)
                  }
                >
                  {roleIcons[role as keyof typeof roleIcons]}{" "}
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-xl">
                    {roleIcons[user.role]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {user.name || "No name"}
                      </span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs",
                          roleColors[user.role]
                        )}
                      >
                        {user.role.toUpperCase()}
                      </Badge>
                      {user.status === "pending" && (
                        <Badge
                          variant="outline"
                          className="bg-yellow-500/10 text-yellow-700 border-yellow-500/30 text-xs"
                        >
                          Pending Verification
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </span>
                      {user.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {user.phone}
                        </span>
                      )}
                      {user.district && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {user.district}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {user.status === "pending" && (
                    <>
                      <Button size="sm" variant="outline" className="text-green-600">
                        <UserCheck className="h-4 w-4 mr-1" />
                        Verify
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600">
                        <UserX className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Edit Details</DropdownMenuItem>
                      <DropdownMenuItem>View Activity Log</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Change Role</DropdownMenuItem>
                      <DropdownMenuItem className="text-yellow-600">
                        Suspend Account
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        Delete Account
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}

            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No users found matching your criteria
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
