/**
 * Health Analytics API Route
 * GET /api/health/analytics - Fetch analytics data
 */

import { NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";

// Sample analytics data - in production, this would come from the database
function generateAnalyticsData(period: string) {
  const multiplier = period === 'weekly' ? 1 : period === 'monthly' ? 4 : 12;
  
  return {
    overview: {
      totalChats: Math.floor(312 * multiplier + Math.random() * 100),
      totalChatsChange: +(Math.random() * 20 - 5).toFixed(1),
      activeUsers: Math.floor(85 * multiplier + Math.random() * 30),
      activeUsersChange: +(Math.random() * 15 - 3).toFixed(1),
      emergencies: Math.floor(6 * multiplier + Math.random() * 5),
      emergenciesChange: +(Math.random() * 30 - 15).toFixed(1),
      avgResponseTime: +(2 + Math.random()).toFixed(1),
      avgResponseTimeChange: +(Math.random() * 10 - 5).toFixed(1),
    },
    categoryDistribution: [
      { category: 'pregnancy', count: Math.floor(78 * multiplier), percentage: 25 },
      { category: 'vaccines', count: Math.floor(62 * multiplier), percentage: 20 },
      { category: 'dengue', count: Math.floor(47 * multiplier), percentage: 15 },
      { category: 'malaria', count: Math.floor(37 * multiplier), percentage: 12 },
      { category: 'nutrition', count: Math.floor(34 * multiplier), percentage: 11 },
      { category: 'child_health', count: Math.floor(31 * multiplier), percentage: 10 },
      { category: 'general', count: Math.floor(23 * multiplier), percentage: 7 },
    ],
    languageDistribution: [
      { language: 'hi', count: Math.floor(131 * multiplier), percentage: 42 },
      { language: 'en', count: Math.floor(97 * multiplier), percentage: 31 },
      { language: 'mr', count: Math.floor(53 * multiplier), percentage: 17 },
      { language: 'pa', count: Math.floor(31 * multiplier), percentage: 10 },
    ],
    roleDistribution: [
      { role: 'citizen', count: Math.floor(214 * multiplier), percentage: 69 },
      { role: 'asha', count: Math.floor(75 * multiplier), percentage: 24 },
      { role: 'officer', count: Math.floor(23 * multiplier), percentage: 7 },
    ],
    riskDistribution: [
      { level: 'low', count: Math.floor(206 * multiplier), percentage: 66 },
      { level: 'medium', count: Math.floor(72 * multiplier), percentage: 23 },
      { level: 'high', count: Math.floor(28 * multiplier), percentage: 9 },
      { level: 'emergency', count: Math.floor(6 * multiplier), percentage: 2 },
    ],
    dailyChats: [
      { day: 'Mon', count: Math.floor(45 + Math.random() * 20) },
      { day: 'Tue', count: Math.floor(45 + Math.random() * 20) },
      { day: 'Wed', count: Math.floor(45 + Math.random() * 20) },
      { day: 'Thu', count: Math.floor(45 + Math.random() * 20) },
      { day: 'Fri', count: Math.floor(45 + Math.random() * 20) },
      { day: 'Sat', count: Math.floor(35 + Math.random() * 15) },
      { day: 'Sun', count: Math.floor(40 + Math.random() * 15) },
    ],
    hourlyActivity: [
      { hour: '6AM', count: Math.floor(5 + Math.random() * 10) },
      { hour: '8AM', count: Math.floor(15 + Math.random() * 20) },
      { hour: '10AM', count: Math.floor(25 + Math.random() * 30) },
      { hour: '12PM', count: Math.floor(20 + Math.random() * 20) },
      { hour: '2PM', count: Math.floor(22 + Math.random() * 25) },
      { hour: '4PM', count: Math.floor(28 + Math.random() * 30) },
      { hour: '6PM', count: Math.floor(30 + Math.random() * 35) },
      { hour: '8PM', count: Math.floor(25 + Math.random() * 25) },
      { hour: '10PM', count: Math.floor(10 + Math.random() * 15) },
    ],
    recentEmergencies: [
      { id: 1, type: 'Chest Pain', language: 'hi', time: '2 hours ago', resolved: true },
      { id: 2, type: 'High Fever (Child)', language: 'mr', time: '4 hours ago', resolved: true },
      { id: 3, type: 'Breathing Difficulty', language: 'en', time: '6 hours ago', resolved: false },
      { id: 4, type: 'Pregnancy Emergency', language: 'pa', time: '8 hours ago', resolved: true },
    ],
    generatedAt: new Date().toISOString(),
  };
}

export async function GET(request: Request) {
  try {
    const session = await auth();
    
    // Optional: require authentication for analytics
    // if (!session?.user) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'weekly';

    const data = generateAnalyticsData(period);

    return NextResponse.json({
      success: true,
      period,
      data,
    });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
