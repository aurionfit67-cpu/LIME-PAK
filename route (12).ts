import { NextResponse } from 'next/server';
import { getAIService } from '@/services/ai/AIServiceFactory';
import { AIServiceManager } from '@/services/ai/AIServiceManager';

export async function GET() {
  const service = getAIService();

  if (service instanceof AIServiceManager) {
    return NextResponse.json({
      providers: service.getStatus(),
    });
  }

  return NextResponse.json({
    providers: [{ name: 'mock', available: true, consecutiveFailures: 0 }],
  });
}
