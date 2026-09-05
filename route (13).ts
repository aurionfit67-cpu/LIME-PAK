import { NextResponse } from 'next/server';
import { MockAuthService } from '@/services/auth/MockAuthService';

const authService = new MockAuthService();

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const user = await authService.login(email, password);

    // Create response with session cookie
    const response = NextResponse.json({ user, success: true });

    // Set a simple session cookie (replace with JWT in production)
    response.cookies.set('session-user', JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Login failed' },
      { status: 401 }
    );
  }
}
