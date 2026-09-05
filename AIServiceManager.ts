import { AIService, ChatMessage } from './AIService';
import { MockAIService } from './MockAIService';
import { GeminiAIService } from './GeminiAIService';
import { GroqAIService } from './GroqAIService';

type ProviderName = 'gemini' | 'groq' | 'mock';

interface ProviderHealth {
  name: ProviderName;
  available: boolean;
  lastCheck: number;
  consecutiveFailures: number;
  lastError?: string;
}

const HEALTH_COOLDOWN_MS = 60_000; // Re-check failed providers every 60s
const MAX_CONSECUTIVE_FAILURES = 3;
const HEALTH_CHECK_INTERVAL_MS = 30_000; // Check health every 30s

/**
 * Smart AI service that chains Gemini → Groq → Mock with automatic failover.
 * When Gemini recovers, it switches back automatically.
 */
export class AIServiceManager extends AIService {
  private providers: Map<ProviderName, AIService> = new Map();
  private health: Map<ProviderName, ProviderHealth> = new Map();
  private providerOrder: ProviderName[] = [];

  constructor(config: { geminiKey?: string; groqKey?: string }) {
    super();

    // Register providers in priority order
    if (config.geminiKey) {
      this.providers.set('gemini', new GeminiAIService(config.geminiKey));
      this.health.set('gemini', {
        name: 'gemini',
        available: true,
        lastCheck: Date.now(),
        consecutiveFailures: 0,
      });
      this.providerOrder.push('gemini');
    }

    if (config.groqKey) {
      this.providers.set('groq', new GroqAIService(config.groqKey));
      this.health.set('groq', {
        name: 'groq',
        available: true,
        lastCheck: Date.now(),
        consecutiveFailures: 0,
      });
      this.providerOrder.push('groq');
    }

    // Mock is always available as last resort
    this.providers.set('mock', new MockAIService());
    this.health.set('mock', {
      name: 'mock',
      available: true,
      lastCheck: Date.now(),
      consecutiveFailures: 0,
    });
    this.providerOrder.push('mock');

    console.log(`[AI Manager] Providers registered: ${this.providerOrder.join(' → ')}`);
  }

  private getAvailableProviders(): ProviderName[] {
    const now = Date.now();

    return this.providerOrder.filter((name) => {
      const h = this.health.get(name)!;

      // If provider was failing, check if cooldown expired (try it again)
      if (!h.available && now - h.lastCheck > HEALTH_COOLDOWN_MS) {
        h.available = true;
        h.consecutiveFailures = 0;
        console.log(`[AI Manager] Retrying ${name} after cooldown`);
      }

      return h.available;
    });
  }

  private recordSuccess(name: ProviderName): void {
    const h = this.health.get(name);
    if (h) {
      h.consecutiveFailures = 0;
      h.available = true;
      h.lastError = undefined;
    }
  }

  private recordFailure(name: ProviderName, error: string): void {
    const h = this.health.get(name);
    if (h) {
      h.consecutiveFailures++;
      h.lastCheck = Date.now();
      h.lastError = error;

      if (h.consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
        h.available = false;
        console.warn(
          `[AI Manager] ${name} marked unavailable after ${h.consecutiveFailures} failures: ${error}`
        );

        // Schedule re-check
        setTimeout(() => {
          h.available = true;
          h.consecutiveFailures = 0;
          console.log(`[AI Manager] ${name} re-enabled for retry`);
        }, HEALTH_COOLDOWN_MS);
      }
    }
  }

  private isRetryableError(error: unknown): boolean {
    const msg = error instanceof Error ? error.message : String(error);
    return (
      msg.includes('503') ||
      msg.includes('429') ||
      msg.includes('500') ||
      msg.includes('high demand') ||
      msg.includes('rate limit') ||
      msg.includes('overloaded') ||
      msg.includes('timeout') ||
      msg.includes('ECONNRESET') ||
      msg.includes('fetch failed')
    );
  }

  async chat(messages: ChatMessage[], agentContext?: any): Promise<string> {
    const providers = this.getAvailableProviders();
    let lastError: Error | null = null;

    for (const name of providers) {
      const service = this.providers.get(name)!;
      try {
        const result = await service.chat(messages, agentContext);
        this.recordSuccess(name);
        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (this.isRetryableError(error) || name !== 'mock') {
          this.recordFailure(name, lastError.message);
          console.warn(`[AI Manager] ${name} chat failed, trying next...`);
          continue;
        }
        throw lastError;
      }
    }

    throw lastError || new Error('All AI providers failed');
  }

  async *streamChat(messages: ChatMessage[], agentContext?: any): AsyncGenerator<string> {
    const providers = this.getAvailableProviders();

    for (const name of providers) {
      const service = this.providers.get(name)!;
      try {
        yield* service.streamChat(messages, agentContext);
        this.recordSuccess(name);
        return;
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        this.recordFailure(name, msg);
        console.warn(`[AI Manager] ${name} stream failed, trying next...`);
        continue;
      }
    }

    yield 'I apologize, but I am temporarily unable to respond. Please try again.';
  }

  async generateWebsite(prompt: string, companyInfo: any): Promise<any> {
    const providers = this.getAvailableProviders();
    let lastError: Error | null = null;

    for (const name of providers) {
      const service = this.providers.get(name)!;
      try {
        const result = await service.generateWebsite(prompt, companyInfo);
        this.recordSuccess(name);
        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        this.recordFailure(name, lastError.message);
        console.warn(`[AI Manager] ${name} website gen failed, trying next...`);
        continue;
      }
    }

    throw lastError || new Error('All AI providers failed');
  }

  /** Returns current health status of all providers */
  getStatus(): ProviderHealth[] {
    return Array.from(this.health.values());
  }
}
