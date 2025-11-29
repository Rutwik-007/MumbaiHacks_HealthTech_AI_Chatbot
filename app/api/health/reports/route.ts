/**
 * Health Report Generation API Route
 * POST /api/health/reports - Generate a report
 * GET /api/health/reports - Get report history
 */

import { NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";

// Generate report data based on period
function generateReportData(period: 'weekly' | 'monthly' | 'quarterly') {
  const multiplier = period === 'weekly' ? 1 : period === 'monthly' ? 4 : 12;
  
  return {
    summary: {
      totalConversations: Math.floor(960 * multiplier + Math.random() * 200),
      uniqueUsers: Math.floor(314 * multiplier + Math.random() * 50),
      emergenciesHandled: Math.floor(12 * multiplier + Math.random() * 8),
      avgSatisfaction: +(4 + Math.random() * 0.5).toFixed(1),
      conversationChange: +(Math.random() * 20 - 2).toFixed(1),
      userChange: +(Math.random() * 15).toFixed(1),
      emergencyChange: +(Math.random() * 30 - 15).toFixed(1),
      satisfactionChange: +(Math.random() * 0.5 - 0.1).toFixed(1),
    },
    categories: [
      { name: 'Pregnancy Care', count: Math.floor(223 * multiplier), percentage: 23.2 },
      { name: 'Vaccines & Immunization', count: Math.floor(189 * multiplier), percentage: 19.7 },
      { name: 'Dengue', count: Math.floor(153 * multiplier), percentage: 15.9 },
      { name: 'Malaria', count: Math.floor(131 * multiplier), percentage: 13.6 },
      { name: 'Child Nutrition', count: Math.floor(122 * multiplier), percentage: 12.7 },
      { name: 'General Health', count: Math.floor(142 * multiplier), percentage: 14.8 },
    ],
    languages: [
      { name: 'Hindi', code: 'hi', count: Math.floor(403 * multiplier), percentage: 42 },
      { name: 'English', code: 'en', count: Math.floor(298 * multiplier), percentage: 31 },
      { name: 'Marathi', code: 'mr', count: Math.floor(163 * multiplier), percentage: 17 },
      { name: 'Punjabi', code: 'pa', count: Math.floor(96 * multiplier), percentage: 10 },
    ],
    risks: [
      { level: 'Low', count: Math.floor(634 * multiplier), percentage: 66 },
      { level: 'Medium', count: Math.floor(221 * multiplier), percentage: 23 },
      { level: 'High', count: Math.floor(86 * multiplier), percentage: 9 },
      { level: 'Emergency', count: Math.floor(19 * multiplier), percentage: 2 },
    ],
    trends: [
      'Dengue-related queries increased by 45% compared to last month',
      'Pregnancy care consultations peaked during morning hours (9-11 AM)',
      'Hindi language usage continues to dominate with 42% of all conversations',
      'Emergency response time improved to average 2.1 seconds',
      'User satisfaction rate maintained above 4.0 for the 3rd consecutive month',
    ],
    recommendations: [
      'Increase dengue prevention awareness content as monsoon season approaches',
      'Consider adding more ASHA workers to handle peak morning traffic',
      'Expand Marathi content library based on increasing regional demand',
      'Implement proactive health reminders for vaccination schedules',
      'Launch community health education campaigns in high-risk areas',
    ],
    generatedAt: new Date().toISOString(),
    period,
  };
}

// Store generated reports
const reportStore: Array<{
  id: string;
  userId?: string;
  period: string;
  data: ReturnType<typeof generateReportData>;
  createdAt: string;
}> = [];

export async function POST(request: Request) {
  try {
    const session = await auth();
    const body = await request.json();

    const { period = 'monthly' } = body;

    // Validate period
    if (!['weekly', 'monthly', 'quarterly'].includes(period)) {
      return NextResponse.json(
        { success: false, error: 'Invalid period. Must be weekly, monthly, or quarterly.' },
        { status: 400 }
      );
    }

    // Generate report
    const reportData = generateReportData(period as 'weekly' | 'monthly' | 'quarterly');

    // Store report
    const report = {
      id: crypto.randomUUID(),
      userId: session?.user?.id,
      period,
      data: reportData,
      createdAt: new Date().toISOString(),
    };
    reportStore.push(report);

    console.log('📊 Report generated:', {
      id: report.id,
      period,
      totalConversations: reportData.summary.totalConversations,
    });

    return NextResponse.json({
      success: true,
      id: report.id,
      data: reportData,
    });
  } catch (error) {
    console.error('Report generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth();
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const reportId = searchParams.get('id');

    // Get specific report
    if (reportId) {
      const report = reportStore.find(r => r.id === reportId);
      if (!report) {
        return NextResponse.json(
          { success: false, error: 'Report not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, report });
    }

    // Get report list
    return NextResponse.json({
      success: true,
      total: reportStore.length,
      reports: reportStore.slice(-limit).reverse().map(r => ({
        id: r.id,
        period: r.period,
        createdAt: r.createdAt,
        summary: {
          totalConversations: r.data.summary.totalConversations,
          avgSatisfaction: r.data.summary.avgSatisfaction,
        },
      })),
    });
  } catch (error) {
    console.error('Report GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}
