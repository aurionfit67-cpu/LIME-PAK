export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AIServiceInterface {
  chat(messages: ChatMessage[], agentContext?: any): Promise<string>;
  generateWebsite(prompt: string, companyInfo: any): Promise<any>;
  streamChat(messages: ChatMessage[], agentContext?: any): AsyncGenerator<string>;
}

export abstract class AIService implements AIServiceInterface {
  abstract chat(messages: ChatMessage[], agentContext?: any): Promise<string>;
  abstract generateWebsite(prompt: string, companyInfo: any): Promise<any>;
  abstract streamChat(messages: ChatMessage[], agentContext?: any): AsyncGenerator<string>;
}
