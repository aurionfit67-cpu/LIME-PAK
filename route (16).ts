import { NextResponse } from 'next/server';
import { getAIService } from '@/services/ai/AIServiceFactory';
import { mockDataStore } from '@/lib/mockData';

// POST /api/chat - Chat with an AI agent
export async function POST(request: Request) {
  try {
    const { agentId, message, conversationHistory } = await request.json();

    if (!agentId || !message) {
      return NextResponse.json(
        { error: 'Agent ID and message are required' },
        { status: 400 }
      );
    }

    // Get agent for context
    const agent = mockDataStore.agents.find(a => a.id === agentId);
    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    // Build messages array including conversation history
    const messages = [
      ...(conversationHistory || []),
      { role: 'user' as const, content: message },
    ];

    // Get AI service (Gemini if key exists, Mock otherwise)
    const aiService = getAIService();
    const response = await aiService.chat(messages, {
      role: agent.role,
      name: agent.name,
      department: agent.department,
      personality: agent.personality,
      instructions: agent.instructions,
      goals: agent.goals,
    });

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chat error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to process chat';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
