import Groq from 'groq-sdk';
import { AIService, ChatMessage } from './AIService';

const GROQ_MODEL = 'llama-3.3-70b-versatile';

export class GroqAIService extends AIService {
  private client: Groq;

  constructor(apiKey: string) {
    super();
    this.client = new Groq({ apiKey });
  }

  async chat(messages: ChatMessage[], agentContext?: any): Promise<string> {
    const systemPrompt = this.buildSystemPrompt(agentContext);

    const groqMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...messages.map((m) => ({
        role: m.role === 'assistant' ? ('assistant' as const) : ('user' as const),
        content: m.content,
      })),
    ];

    const completion = await this.client.chat.completions.create({
      model: GROQ_MODEL,
      messages: groqMessages,
      temperature: 0.7,
      max_tokens: 2048,
    });

    return completion.choices[0]?.message?.content || '';
  }

  async *streamChat(messages: ChatMessage[], agentContext?: any): AsyncGenerator<string> {
    const systemPrompt = this.buildSystemPrompt(agentContext);

    const groqMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...messages.map((m) => ({
        role: m.role === 'assistant' ? ('assistant' as const) : ('user' as const),
        content: m.content,
      })),
    ];

    const stream = await this.client.chat.completions.create({
      model: GROQ_MODEL,
      messages: groqMessages,
      temperature: 0.7,
      max_tokens: 2048,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        yield content;
      }
    }
  }

  async generateWebsite(prompt: string, companyInfo: any): Promise<any> {
    const completion = await this.client.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are an expert website designer. You generate complete website configurations as valid JSON. Always return ONLY valid JSON with no markdown fences, no code blocks, no explanation text.',
        },
        {
          role: 'user',
          content: `Generate a complete website for "${companyInfo.name}" (${companyInfo.industry || 'Technology'}).
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

Make the content professional, compelling, and specific to the company. Use appropriate emojis for icons.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 4096,
    });

    const text = completion.choices[0]?.message?.content || '{}';
    const cleaned = text.replace(/```json?\s*/g, '').replace(/```\s*/g, '').trim();
    return JSON.parse(cleaned);
  }

  private buildSystemPrompt(agentContext?: any): string {
    if (!agentContext) {
      return 'You are a helpful AI assistant working at a company. Provide professional, insightful, and actionable advice. Be concise but thorough. Use bullet points when appropriate.';
    }

    let prompt = `You are ${agentContext.name}, serving as the ${agentContext.role}`;
    if (agentContext.department) prompt += ` in the ${agentContext.department} department`;
    prompt += '.';
    if (agentContext.personality) prompt += `\n\nPersonality: ${agentContext.personality}`;
    if (agentContext.instructions) prompt += `\n\nInstructions: ${agentContext.instructions}`;
    if (agentContext.goals?.length) {
      prompt += `\n\nGoals:\n${agentContext.goals.map((g: string) => `- ${g}`).join('\n')}`;
    }
    prompt += '\n\nAlways respond in character. Provide professional, actionable advice relevant to your expertise. Use clear formatting with bullet points or numbered lists when appropriate.';
    return prompt;
  }
}
