import { NextRequest, NextResponse } from 'next/server';
import { signedFetch } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * POST /api/chat — send a message
 * Body: { business_id, visitor_id, visitor_name?, message_text }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { business_id, visitor_id, visitor_name, message_text } = body;

    if (!business_id || !visitor_id || !message_text) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const response = await signedFetch(
      `${API_URL}/public/businesses/${business_id}/chat`,
      {
        method: 'POST',
        body: JSON.stringify({ visitor_id, visitor_name, message_text }),
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Chat POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/chat?business_id=...&visitor_id=...
 * Fetch message history
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get('business_id');
    const visitorId = searchParams.get('visitor_id');

    if (!businessId || !visitorId) {
      return NextResponse.json(
        { error: 'business_id and visitor_id required' },
        { status: 400 }
      );
    }

    const response = await signedFetch(
      `${API_URL}/public/businesses/${businessId}/chat/${visitorId}/messages`
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Chat GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
