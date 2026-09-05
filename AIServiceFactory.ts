import { AIService } from './AIService';
import { AIServiceManager } from './AIServiceManager';
import { MockAIService } from './MockAIService';

let _instance: AIService | null = null;

export function getAIService(): AIService {
  if (_instance) return _instance;

  const geminiKey = process.env.GEMNI_API_KEY || process.env.GEMINI_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;

  const hasAnyKey = geminiKey || groqKey;

  if (hasAnyKey) {
    console.log('[AI Factory] Creating AI Service Manager with failover');
    _instance = new AIServiceManager({
      geminiKey: geminiKey || undefined,
      groqKey: groqKey || undefined,
    });
  } else {
    console.log('[AI Factory] No API keys found, using Mock AI service');
    _instance = new MockAIService();
  }

  return _instance;
}

export type { AIService, ChatMessage } from './AIService';
