import { AIService, ChatMessage } from './AIService';

export class MockAIService extends AIService {
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async chat(messages: ChatMessage[], agentContext?: any): Promise<string> {
    await this.delay(1000);

    const lastMessage = messages[messages.length - 1];
    const userMessage = lastMessage.content.toLowerCase();

    // Context-aware responses based on agent role
    const agentRole = agentContext?.role || 'Assistant';
    
    // Generate contextual responses
    if (userMessage.includes('marketing') || userMessage.includes('strategy')) {
      return this.generateMarketingResponse(agentRole);
    } else if (userMessage.includes('finance') || userMessage.includes('budget')) {
      return this.generateFinanceResponse(agentRole);
    } else if (userMessage.includes('technical') || userMessage.includes('development')) {
      return this.generateTechnicalResponse(agentRole);
    } else if (userMessage.includes('operations') || userMessage.includes('process')) {
      return this.generateOperationsResponse(agentRole);
    } else if (userMessage.includes('product') || userMessage.includes('feature')) {
      return this.generateProductResponse(agentRole);
    } else {
      return this.generateGenericResponse(agentRole, userMessage);
    }
  }

  async *streamChat(messages: ChatMessage[], agentContext?: any): AsyncGenerator<string> {
    const response = await this.chat(messages, agentContext);
    const words = response.split(' ');
    
    for (let i = 0; i < words.length; i++) {
      yield words[i] + (i < words.length - 1 ? ' ' : '');
      await this.delay(30 + Math.random() * 20);
    }
  }

  async generateWebsite(prompt: string, companyInfo: any): Promise<any> {
    await this.delay(2000);

    return {
      name: `${companyInfo.name} Website`,
      sections: [
        {
          id: 'navbar',
          type: 'navbar',
          content: {
            logo: companyInfo.name,
            links: ['Home', 'About', 'Features', 'Contact'],
          },
        },
        {
          id: 'hero',
          type: 'hero',
          content: {
            headline: `Welcome to ${companyInfo.name}`,
            subheadline: companyInfo.description || 'Innovating the future of business',
            cta: 'Get Started',
            image: '/placeholder-hero.jpg',
          },
        },
        {
          id: 'features',
          type: 'features',
          content: {
            title: 'Our Features',
            features: [
              {
                title: 'AI-Powered',
                description: 'Leveraging cutting-edge artificial intelligence',
                icon: '🤖',
              },
              {
                title: 'Scalable',
                description: 'Built to grow with your business',
                icon: '📈',
              },
              {
                title: 'Secure',
                description: 'Enterprise-grade security and privacy',
                icon: '🔒',
              },
              {
                title: 'Fast',
                description: 'Optimized for performance',
                icon: '⚡',
              },
            ],
          },
        },
        {
          id: 'about',
          type: 'about',
          content: {
            title: 'About Us',
            description: companyInfo.mission || 'We are dedicated to transforming the way businesses operate through innovative technology solutions.',
            image: '/placeholder-about.jpg',
          },
        },
        {
          id: 'cta',
          type: 'cta',
          content: {
            title: 'Ready to get started?',
            description: 'Join thousands of companies already using our platform',
            buttonText: 'Start Free Trial',
          },
        },
        {
          id: 'footer',
          type: 'footer',
          content: {
            company: companyInfo.name,
            links: {
              Product: ['Features', 'Pricing', 'FAQ'],
              Company: ['About', 'Blog', 'Careers'],
              Legal: ['Privacy', 'Terms', 'Security'],
            },
            social: ['Twitter', 'LinkedIn', 'GitHub'],
          },
        },
      ],
    };
  }

  private generateMarketingResponse(role: string): string {
    const responses = [
      `As your ${role}, I recommend a multi-channel marketing approach focusing on digital presence, content marketing, and strategic partnerships. We should prioritize SEO optimization, social media engagement, and targeted advertising campaigns to reach our ideal customer profile.`,
      `Based on current market trends, I suggest implementing an inbound marketing strategy combined with strategic outbound efforts. This includes developing high-quality content, optimizing our website for conversions, and leveraging data analytics to refine our targeting.`,
      `I propose a comprehensive marketing strategy that includes brand positioning, competitive analysis, and customer journey mapping. We'll focus on building brand awareness through thought leadership, strategic partnerships, and targeted digital campaigns.`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private generateFinanceResponse(role: string): string {
    const responses = [
      `From a financial perspective, I recommend establishing clear budget allocations across departments with quarterly reviews. We should implement robust financial tracking systems and maintain a healthy runway of at least 18 months while pursuing strategic growth investments.`,
      `I suggest developing a comprehensive financial model that includes revenue projections, cost analysis, and cash flow forecasting. We should focus on optimizing our burn rate while investing strategically in high-ROI initiatives.`,
      `As your ${role}, I recommend implementing financial controls and reporting systems that provide real-time visibility into our financial health. This includes monthly financial reviews, variance analysis, and scenario planning for different growth trajectories.`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private generateTechnicalResponse(role: string): string {
    const responses = [
      `From a technical standpoint, I recommend adopting a microservices architecture with cloud-native infrastructure. This will provide scalability, resilience, and flexibility as we grow. We should prioritize API-first design, comprehensive testing, and continuous deployment practices.`,
      `I suggest building our technical infrastructure on modern, proven technologies with a focus on developer experience and system reliability. This includes implementing robust monitoring, automated testing, and progressive deployment strategies.`,
      `As your ${role}, I recommend establishing strong engineering practices including code reviews, documentation standards, and security-first development. We should invest in scalable infrastructure and maintain technical debt at manageable levels.`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private generateOperationsResponse(role: string): string {
    const responses = [
      `For operational excellence, I recommend implementing streamlined processes, clear documentation, and automation where possible. We should establish KPIs for each department, regular operational reviews, and continuous improvement initiatives.`,
      `I suggest developing comprehensive operational procedures, workflow automation, and cross-functional collaboration frameworks. This will improve efficiency, reduce errors, and enable scalable growth.`,
      `As your ${role}, I recommend focusing on process optimization, resource allocation efficiency, and operational metrics. We should implement systems that provide visibility into operations and enable data-driven decision making.`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private generateProductResponse(role: string): string {
    const responses = [
      `From a product perspective, I recommend focusing on user-centric design, rapid iteration, and data-driven decision making. We should establish a clear product roadmap aligned with business objectives and customer needs.`,
      `I suggest implementing a product development process that balances innovation with execution. This includes user research, prototyping, iterative development, and continuous feedback loops with customers.`,
      `As your ${role}, I recommend prioritizing features based on user value, technical feasibility, and business impact. We should maintain a healthy product backlog and establish clear success metrics for each initiative.`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private generateGenericResponse(role: string, userMessage: string): string {
    const responses = [
      `As your ${role}, I've analyzed your request. I recommend taking a strategic approach that aligns with our company objectives. Let me break this down into actionable steps we can implement.`,
      `Thank you for bringing this to my attention. Based on my analysis, I suggest we approach this systematically, considering both short-term actions and long-term implications for the company.`,
      `I understand your concern. As ${role}, I believe we should evaluate this from multiple perspectives - operational, financial, and strategic. Here's my recommended approach for moving forward.`,
      `Excellent question. Let me provide you with a comprehensive perspective on this matter. I've considered various factors including our current resources, market position, and strategic goals.`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
}

// Export singleton instance
export const mockAIService = new MockAIService();
