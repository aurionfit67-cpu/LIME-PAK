import { NextResponse } from 'next/server';
import { getAIService } from '@/services/ai/AIServiceFactory';
import { mockDataStore } from '@/lib/mockData';

// POST /api/website/generate - Generate a website with AI
export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const company = mockDataStore.getUserCompany();
    if (!company) {
      return NextResponse.json({ error: 'No company found' }, { status: 404 });
    }

    // Generate website with AI (Gemini if key exists, Mock otherwise)
    const aiService = getAIService();
    const websiteContent = await aiService.generateWebsite(prompt, company);

    const newWebsite = {
      id: `website-${Date.now()}`,
      companyId: company.id,
      name: websiteContent.name,
      description: prompt,
      content: websiteContent,
      published: false,
      createdAt: new Date(),
    };

    mockDataStore.addWebsite(newWebsite);

    return NextResponse.json({ website: newWebsite }, { status: 201 });
  } catch (error) {
    console.error('Website generation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate website';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
