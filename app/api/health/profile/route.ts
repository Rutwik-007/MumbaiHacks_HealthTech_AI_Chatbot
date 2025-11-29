import { auth } from '@/app/(auth)/auth';
import { NextResponse } from 'next/server';

// In-memory storage for demo (replace with database in production)
const userProfiles = new Map<string, UserProfileData>();

interface UserProfileData {
  userId: string;
  name: string;
  phone: string;
  region: string;
  district: string;
  village: string;
  preferredLanguage: 'en' | 'hi' | 'mr' | 'pa';
  role: 'citizen' | 'asha' | 'officer';
  isPregnant: boolean;
  pregnancyWeek?: number;
  lastMenstrualDate?: string;
  numberOfChildren: number;
  children: ChildProfile[];
  voiceEnabled: boolean;
  updatedAt: string;
}

interface ChildProfile {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
}

// GET - Retrieve user profile
export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const profile = userProfiles.get(session.user.id);
    
    if (!profile) {
      return NextResponse.json(
        { profile: null, message: 'No profile found' },
        { status: 200 }
      );
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// POST - Create or update user profile
export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    const profile: UserProfileData = {
      userId: session.user.id,
      name: body.name || '',
      phone: body.phone || '',
      region: body.region || '',
      district: body.district || '',
      village: body.village || '',
      preferredLanguage: body.preferredLanguage || 'en',
      role: body.role || 'citizen',
      isPregnant: body.isPregnant || false,
      pregnancyWeek: body.pregnancyWeek,
      lastMenstrualDate: body.lastMenstrualDate,
      numberOfChildren: body.numberOfChildren || 0,
      children: body.children || [],
      voiceEnabled: body.voiceEnabled || false,
      updatedAt: new Date().toISOString(),
    };

    userProfiles.set(session.user.id, profile);

    return NextResponse.json({ 
      success: true, 
      profile,
      message: 'Profile saved successfully' 
    });
  } catch (error) {
    console.error('Error saving profile:', error);
    return NextResponse.json(
      { error: 'Failed to save profile' },
      { status: 500 }
    );
  }
}

// DELETE - Delete user profile
export async function DELETE() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const existed = userProfiles.delete(session.user.id);

    return NextResponse.json({ 
      success: true, 
      deleted: existed,
      message: existed ? 'Profile deleted' : 'No profile to delete'
    });
  } catch (error) {
    console.error('Error deleting profile:', error);
    return NextResponse.json(
      { error: 'Failed to delete profile' },
      { status: 500 }
    );
  }
}
