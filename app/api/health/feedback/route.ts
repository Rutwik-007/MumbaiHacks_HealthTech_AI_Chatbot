/**
 * Health Feedback API Route
 * POST /api/health/feedback - Submit user feedback
 * GET /api/health/feedback - Get feedback summary (admin)
 */

import { NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";

// In-memory storage for demo - in production, save to database
const feedbackStore: Array<{
  id: string;
  userId?: string;
  rating: number;
  isHelpful: boolean | null;
  category: string | null;
  comment: string;
  chatId?: string;
  language: string;
  createdAt: string;
}> = [];

export async function POST(request: Request) {
  try {
    const session = await auth();
    const body = await request.json();

    const {
      rating,
      isHelpful,
      category,
      comment,
      chatId,
      language,
    } = body;

    // Validate required fields
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Invalid rating. Must be between 1 and 5.' },
        { status: 400 }
      );
    }

    // Create feedback entry
    const feedback = {
      id: crypto.randomUUID(),
      userId: session?.user?.id,
      rating,
      isHelpful: isHelpful ?? null,
      category: category ?? null,
      comment: comment ?? '',
      chatId,
      language: language ?? 'en',
      createdAt: new Date().toISOString(),
    };

    // Store feedback (in production, save to database)
    feedbackStore.push(feedback);

    console.log('📝 Feedback received:', {
      id: feedback.id,
      rating,
      isHelpful,
      category,
      language,
    });

    return NextResponse.json({
      success: true,
      message: 'Feedback submitted successfully',
      id: feedback.id,
    });
  } catch (error) {
    console.error('Feedback API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit feedback' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth();
    
    // Optional: require admin role for viewing all feedback
    // if (!session?.user) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');

    // Calculate summary statistics
    const totalFeedback = feedbackStore.length;
    const avgRating = totalFeedback > 0
      ? feedbackStore.reduce((sum, f) => sum + f.rating, 0) / totalFeedback
      : 0;
    
    const helpfulCount = feedbackStore.filter(f => f.isHelpful === true).length;
    const notHelpfulCount = feedbackStore.filter(f => f.isHelpful === false).length;
    
    const categoryBreakdown = feedbackStore.reduce((acc, f) => {
      if (f.category) {
        acc[f.category] = (acc[f.category] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const ratingDistribution = [1, 2, 3, 4, 5].map(rating => ({
      rating,
      count: feedbackStore.filter(f => f.rating === rating).length,
    }));

    return NextResponse.json({
      success: true,
      summary: {
        total: totalFeedback,
        avgRating: +avgRating.toFixed(2),
        helpfulRate: totalFeedback > 0 
          ? +((helpfulCount / (helpfulCount + notHelpfulCount)) * 100).toFixed(1)
          : 0,
        ratingDistribution,
        categoryBreakdown,
      },
      recent: feedbackStore.slice(-limit).reverse(),
    });
  } catch (error) {
    console.error('Feedback GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch feedback' },
      { status: 500 }
    );
  }
}
