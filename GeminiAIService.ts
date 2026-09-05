import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIService, ChatMessage } from './AIService';

const GEMINI_MODEL = 'gemini-3.6-flash';
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 2000;

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function withRetry<T>(fn: () => Promise<T>, retries = MAX_RETRIES): Promise<T> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      const isRetryable =
        error?.message?.includes('503') ||
        error?.message?.includes('429') ||
        error?.message?.includes('high demand') ||
        error?.message?.includes('rate limit') ||
        error?.message?.includes('overloaded');

      if (isRetryable && attempt < retries) {
        const wait = BASE_DELAY_MS * Math.pow(2, attempt);
        console.warn(`[Gemini] Retry ${attempt + 1}/${retries} after ${wait}ms...`);
        await delay(wait);
        continue;
      }
      throw error;
    }
  }
  throw new Error('Max retries exceeded');
}

export class GeminiAIService extends AIService {
  private genAI: GoogleGenerativeAI;

  constructor(apiKey: string) {
    super();
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async chat(messages: ChatMessage[], agentContext?: any): Promise<string> {
    return withRetry(async () => {
      const model = this.genAI.getGenerativeModel({
        model: GEMINI_MODEL,
        systemInstruction: this.buildSystemPrompt(agentContext),
      });

      const history = messages.slice(0, -1).map((msg) => ({
        role: msg.role === 'assistant' ? 'model' as const : 'user' as const,
        parts: [{ text: msg.content }],
      }));

      const lastMessage = messages[messages.length - 1];

      if (history.length === 0) {
        const result = await model.generateContent(lastMessage.content);
        return result.response.text();
      }

      const chat = model.startChat({ history });
      const result = await chat.sendMessage(lastMessage.content);
      return result.response.text();
    });
  }

  async *streamChat(messages: ChatMessage[], agentContext?: any): AsyncGenerator<string> {
    const model = this.genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      systemInstruction: this.buildSystemPrompt(agentContext),
    });

    const history = messages.slice(0, -1).map((msg) => ({
      role: msg.role === 'assistant' ? 'model' as const : 'user' as const,
      parts: [{ text: msg.content }],
    }));

    const lastMessage = messages[messages.length - 1];

    let result;
    if (history.length === 0) {
      result = await model.generateContentStream(lastMessage.content);
    } else {
      const chat = model.startChat({ history });
      result = await chat.sendMessageStream(lastMessage.content);
    }

    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) {
        yield text;
      }
    }
  }

  async generateWebsite(prompt: string, companyInfo: any): Promise<any> {
    return withRetry(async () => {
      const model = this.genAI.getGenerativeModel({
        model: GEMINI_MODEL,
        systemInstruction: `You are an expert website designer. You generate complete website configurations as valid JSON. Always return ONLY valid JSON with no markdown fences, no code blocks, no explanation text.`,
      });

      const fullPrompt = `Generate a complete website for "${companyInfo.name}" (${companyInfo.industry || 'Technology'}).
${companyInfo.description || ''}
${companyInfo.mission ? `Mission: ${companyInfo.mission}` : ''}

User request: ${prompt}

Return a JSON object with this EXACT structure (no markdown, no fences):
{
  "name": "Website name",
  "sections": [
    {
      "id": "navbar",
      "type": "navbar",
      "content": {
        "logo": "${companyInfo.name}",
        "links": ["Home", "About", "Features", "Pricing", "Contact"]
      }
    },
    {
      "id": "hero",
      "type": "hero",
      "content": {
        "headline": "Compelling headline",
        "subheadline": "Supporting text",
        "cta": "Button text"
      }
    },
    {
      "id": "features",
      "type": "features",
      "content": {
        "title": "Our Features",
        "features": [
          { "title": "Feature 1", "description": "Description", "icon": "emoji" },
          { "title": "Feature 2", "description": "Description", "icon": "emoji" },
          { "title": "Feature 3", "description": "Description", "icon": "emoji" },
          { "title": "Feature 4", "description": "Description", "icon": "emoji" }
        ]
      }
    },
    {
      "id": "about",
      "type": "about",
      "content": {
        "title": "About Us",
        "description": "About section text"
      }
    },
    {
      "id": "testimonials",
      "type": "testimonials",
      "content": {
        "title": "What People Say",
        "testimonials": [
          { "name": "Name", "role": "Title, Company", "quote": "Quote", "avatar": "emoji" },
          { "name": "Name", "role": "Title, Company", "quote": "Quote", "avatar": "emoji" },
          { "name": "Name", "role": "Title, Company", "quote": "Quote", "avatar": "emoji" }
        ]
      }
    },
    {
      "id": "cta",
      "type": "cta",
      "content": {
        "title": "Ready to Start?",
        "description": "CTA description",
        "buttonText": "Get Started"
      }
    },
    {
      "id": "footer",
      "type": "footer",
      "content": {
        "company": "${companyInfo.name}",
        "links": {
          "Product": ["Features", "Pricing", "FAQ"],
          "Company": ["About", "Blog", "Careers"],
          "Legal": ["Privacy", "Terms"]
        },
        "social": ["Twitter", "LinkedIn", "GitHub"]
      }
    }
  ]
}

Make the content professional, compelling, and specific to the company. Use appropriate emojis for icons.`;

      const result = await model.generateContent(fullPrompt);
      const text = result.response.text();

      // Clean potential markdown fences from response
      const cleaned = text.replace(/```json?\s*/g, '').replace(/```\s*/g, '').trim();
      return JSON.parse(cleaned);
    });
  }

  private buildSystemPrompt(agentContext?: any): string {
    if (!agentContext) {
      return `You are a helpful AI assistant working at a company. Provide professional, insightful, and actionable advice. Be concise but thorough. Use bullet points when appropriate.`;
    }

    let prompt = `You are ${agentContext.name}, serving as the ${agentContext.role}`;
    if (agentContext.department) prompt += ` in the ${agentContext.department} department`;
    prompt += '.';
    if (agentContext.personality) prompt += `\n\nPersonality: ${agentContext.personality}`;
    if (agentContext.instructions) prompt += `\n\nInstructions: ${agentContext.instructions}`;
    if (agentContext.goals?.length) {
      prompt += `\n\nGoals:\n${agentContext.goals.map((g: string) => `- ${g}`).join('\n')}`;
    }
    prompt += `\n\nAlways respond in character. Provide professional, actionable advice relevant to your expertise. Use clear formatting with bullet points or numbered lists when appropriate.`;
    return prompt;
  }
}
