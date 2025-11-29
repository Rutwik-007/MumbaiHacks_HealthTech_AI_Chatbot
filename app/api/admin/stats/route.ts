import { auth } from "@/app/(auth)/auth";
import { getUserStats, getAllUsers } from "@/lib/db/queries";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    // Check if user is authenticated and is an admin
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userStats = await getUserStats();

    // Mock additional stats for demo
    const stats = {
      users: userStats,
      facilities: 48,
      appointments: 342,
      activeChats: 89,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Failed to fetch admin stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
