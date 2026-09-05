// Mock data store for development (will be replaced with database)

export interface Company {
  id: string;
  name: string;
  description: string;
  industry: string;
  mission: string;
  vision: string;
  goals: string[];
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  companyId: string;
  role: string;
  department: string;
}

export interface Agent {
  id: string;
  companyId: string;
  name: string;
  role: string;
  department: string;
  purpose: string;
  personality: string;
  instructions: string;
  goals: string[];
  tools: string[];
  permissions: string[];
  status: string;
  createdAt: Date;
}

export interface Project {
  id: string;
  companyId: string;
  name: string;
  description: string;
  status: string;
  progress: number;
  memberIds: string[];
  agentIds: string[];
  createdAt: Date;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignedToUserId?: string;
  assignedToAgentId?: string;
  dueDate?: Date;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  companyId: string;
  agentId: string;
  userId: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

export interface Knowledge {
  id: string;
  companyId: string;
  title: string;
  content: string;
  type: string;
  createdAt: Date;
}

export interface Website {
  id: string;
  companyId: string;
  name: string;
  description: string;
  content: any;
  published: boolean;
  createdAt: Date;
}

// In-memory storage
class MockDataStore {
  companies: Company[] = [];
  users: User[] = [];
  agents: Agent[] = [];
  projects: Project[] = [];
  tasks: Task[] = [];
  conversations: Conversation[] = [];
  knowledge: Knowledge[] = [];
  websites: Website[] = [];
  currentUserId: string = '';

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Create demo company
    const demoCompany: Company = {
      id: 'company-1',
      name: 'Acme Innovations',
      description: 'Building the future of AI-powered business solutions',
      industry: 'Technology',
      mission: 'To empower businesses with AI-driven tools that enhance productivity and innovation',
      vision: 'A world where every company has access to intelligent automation',
      goals: [
        'Launch AI-powered product suite by Q2',
        'Acquire 1000 enterprise customers',
        'Achieve $10M ARR',
        'Build world-class AI team',
      ],
      createdAt: new Date('2024-01-01'),
    };
    this.companies.push(demoCompany);

    // Create CEO
    const ceo: User = {
      id: 'user-1',
      email: 'ceo@acme.com',
      name: 'Sarah Chen',
      avatar: '👩‍💼',
      companyId: demoCompany.id,
      role: 'CEO',
      department: 'Executive',
    };
    this.users.push(ceo);
    this.currentUserId = ceo.id;

    // Create C-suite
    const csuite: User[] = [
      {
        id: 'user-2',
        email: 'cfo@acme.com',
        name: 'Michael Rodriguez',
        avatar: '👨‍💼',
        companyId: demoCompany.id,
        role: 'CFO',
        department: 'Finance',
      },
      {
        id: 'user-3',
        email: 'cto@acme.com',
        name: 'Emily Watson',
        avatar: '👩‍💻',
        companyId: demoCompany.id,
        role: 'CTO',
        department: 'Technology',
      },
      {
        id: 'user-4',
        email: 'cmo@acme.com',
        name: 'David Kim',
        avatar: '👨‍🎨',
        companyId: demoCompany.id,
        role: 'CMO',
        department: 'Marketing',
      },
      {
        id: 'user-5',
        email: 'coo@acme.com',
        name: 'Lisa Thompson',
        avatar: '👩‍🔧',
        companyId: demoCompany.id,
        role: 'COO',
        department: 'Operations',
      },
    ];
    this.users.push(...csuite);

    // Create AI Agents
    const agents: Agent[] = [
      {
        id: 'agent-1',
        companyId: demoCompany.id,
        name: 'Atlas',
        role: 'Strategic Advisor',
        department: 'Executive',
        purpose: 'Provide strategic insights and decision support',
        personality: 'Analytical, forward-thinking, and data-driven',
        instructions: 'Analyze business situations from multiple angles and provide strategic recommendations',
        goals: ['Support executive decision-making', 'Identify growth opportunities', 'Monitor market trends'],
        tools: ['Data Analysis', 'Market Research', 'Financial Modeling'],
        permissions: ['Read all data', 'Generate reports', 'Access analytics'],
        status: 'active',
        createdAt: new Date('2024-01-15'),
      },
      {
        id: 'agent-2',
        companyId: demoCompany.id,
        name: 'Mercury',
        role: 'Marketing Strategist',
        department: 'Marketing',
        purpose: 'Develop and execute marketing strategies',
        personality: 'Creative, data-driven, and results-oriented',
        instructions: 'Create compelling marketing campaigns and analyze their performance',
        goals: ['Increase brand awareness', 'Generate qualified leads', 'Optimize conversion rates'],
        tools: ['Content Generation', 'SEO Analysis', 'Campaign Management'],
        permissions: ['Manage marketing content', 'Access analytics', 'Create campaigns'],
        status: 'active',
        createdAt: new Date('2024-01-20'),
      },
      {
        id: 'agent-3',
        companyId: demoCompany.id,
        name: 'Nova',
        role: 'Product Manager',
        department: 'Product',
        purpose: 'Manage product development and roadmap',
        personality: 'User-focused, innovative, and detail-oriented',
        instructions: 'Prioritize features based on user value and business impact',
        goals: ['Ship high-quality features', 'Improve user satisfaction', 'Drive product growth'],
        tools: ['User Research', 'Feature Planning', 'Roadmap Management'],
        permissions: ['Manage product backlog', 'Create specifications', 'Coordinate releases'],
        status: 'active',
        createdAt: new Date('2024-01-25'),
      },
      {
        id: 'agent-4',
        companyId: demoCompany.id,
        name: 'Sage',
        role: 'Financial Analyst',
        department: 'Finance',
        purpose: 'Provide financial analysis and planning',
        personality: 'Precise, analytical, and conservative',
        instructions: 'Analyze financial data and provide insights for better decision-making',
        goals: ['Optimize financial performance', 'Manage risk', 'Support budgeting'],
        tools: ['Financial Modeling', 'Data Analysis', 'Forecasting'],
        permissions: ['Access financial data', 'Generate reports', 'Create models'],
        status: 'active',
        createdAt: new Date('2024-02-01'),
      },
    ];
    this.agents.push(...agents);

    // Create projects
    const projects: Project[] = [
      {
        id: 'project-1',
        companyId: demoCompany.id,
        name: 'Q1 Product Launch',
        description: 'Launch our flagship AI platform to market',
        status: 'active',
        progress: 65,
        memberIds: ['user-1', 'user-3', 'user-4'],
        agentIds: ['agent-2', 'agent-3'],
        createdAt: new Date('2024-02-01'),
      },
      {
        id: 'project-2',
        companyId: demoCompany.id,
        name: 'Marketing Campaign',
        description: 'Multi-channel marketing campaign for product launch',
        status: 'active',
        progress: 45,
        memberIds: ['user-4'],
        agentIds: ['agent-2'],
        createdAt: new Date('2024-02-10'),
      },
      {
        id: 'project-3',
        companyId: demoCompany.id,
        name: 'Financial Planning 2024',
        description: 'Strategic financial planning and budgeting',
        status: 'active',
        progress: 80,
        memberIds: ['user-2'],
        agentIds: ['agent-4'],
        createdAt: new Date('2024-01-15'),
      },
    ];
    this.projects.push(...projects);

    // Create tasks
    const tasks: Task[] = [
      {
        id: 'task-1',
        projectId: 'project-1',
        title: 'Finalize product features',
        description: 'Complete feature specification and design',
        status: 'done',
        priority: 'high',
        assignedToAgentId: 'agent-3',
        createdAt: new Date('2024-02-01'),
      },
      {
        id: 'task-2',
        projectId: 'project-1',
        title: 'Develop landing page',
        description: 'Create responsive landing page for product',
        status: 'in_progress',
        priority: 'high',
        assignedToUserId: 'user-3',
        createdAt: new Date('2024-02-05'),
      },
      {
        id: 'task-3',
        projectId: 'project-1',
        title: 'Prepare launch announcement',
        description: 'Draft press release and social media content',
        status: 'in_progress',
        priority: 'medium',
        assignedToAgentId: 'agent-2',
        createdAt: new Date('2024-02-10'),
      },
      {
        id: 'task-4',
        projectId: 'project-2',
        title: 'Create content calendar',
        description: 'Plan content for next 3 months',
        status: 'review',
        priority: 'medium',
        assignedToAgentId: 'agent-2',
        createdAt: new Date('2024-02-12'),
      },
      {
        id: 'task-5',
        projectId: 'project-2',
        title: 'Set up advertising campaigns',
        description: 'Configure Google Ads and LinkedIn campaigns',
        status: 'todo',
        priority: 'high',
        assignedToUserId: 'user-4',
        createdAt: new Date('2024-02-15'),
      },
      {
        id: 'task-6',
        projectId: 'project-3',
        title: 'Q1 Financial Review',
        description: 'Analyze Q1 performance and variance',
        status: 'done',
        priority: 'high',
        assignedToAgentId: 'agent-4',
        createdAt: new Date('2024-01-20'),
      },
    ];
    this.tasks.push(...tasks);

    // Create knowledge entries
    const knowledge: Knowledge[] = [
      {
        id: 'knowledge-1',
        companyId: demoCompany.id,
        title: 'Company Brand Guidelines',
        content: 'Our brand represents innovation, reliability, and forward-thinking. Use primary colors: Blue (#2563eb), Purple (#7c3aed). Fonts: Inter for headings, system fonts for body.',
        type: 'document',
        createdAt: new Date('2024-01-10'),
      },
      {
        id: 'knowledge-2',
        companyId: demoCompany.id,
        title: 'Product Positioning',
        content: 'We position ourselves as the most intuitive AI platform for businesses. Key differentiators: ease of use, powerful automation, enterprise security, and exceptional support.',
        type: 'note',
        createdAt: new Date('2024-01-15'),
      },
      {
        id: 'knowledge-3',
        companyId: demoCompany.id,
        title: 'Customer Personas',
        content: 'Primary persona: Tech-savvy business leaders at mid-size companies (50-500 employees) looking to scale operations with AI. Secondary: Enterprise CTOs seeking secure, compliant AI solutions.',
        type: 'note',
        createdAt: new Date('2024-01-20'),
      },
    ];
    this.knowledge.push(...knowledge);
  }

  // Helper methods
  getCurrentUser(): User | undefined {
    return this.users.find(u => u.id === this.currentUserId);
  }

  getCompany(id: string): Company | undefined {
    return this.companies.find(c => c.id === id);
  }

  getUserCompany(): Company | undefined {
    const user = this.getCurrentUser();
    if (!user) return undefined;
    return this.companies.find(c => c.id === user.companyId);
  }

  getCompanyUsers(companyId: string): User[] {
    return this.users.filter(u => u.companyId === companyId);
  }

  getCompanyAgents(companyId: string): Agent[] {
    return this.agents.filter(a => a.companyId === companyId);
  }

  getCompanyProjects(companyId: string): Project[] {
    return this.projects.filter(p => p.companyId === companyId);
  }

  getProjectTasks(projectId: string): Task[] {
    return this.tasks.filter(t => t.projectId === projectId);
  }

  getCompanyKnowledge(companyId: string): Knowledge[] {
    return this.knowledge.filter(k => k.companyId === companyId);
  }

  getCompanyWebsites(companyId: string): Website[] {
    return this.websites.filter(w => w.companyId === companyId);
  }

  // CRUD operations (simplified)
  addAgent(agent: Agent): Agent {
    this.agents.push(agent);
    return agent;
  }

  updateAgent(id: string, updates: Partial<Agent>): Agent | undefined {
    const index = this.agents.findIndex(a => a.id === id);
    if (index === -1) return undefined;
    this.agents[index] = { ...this.agents[index], ...updates };
    return this.agents[index];
  }

  deleteAgent(id: string): boolean {
    const index = this.agents.findIndex(a => a.id === id);
    if (index === -1) return false;
    this.agents.splice(index, 1);
    return true;
  }

  addConversation(conversation: Conversation): Conversation {
    this.conversations.push(conversation);
    return conversation;
  }

  getAgentConversations(agentId: string, userId: string): Conversation[] {
    return this.conversations.filter(c => c.agentId === agentId && c.userId === userId);
  }

  addProject(project: Project): Project {
    this.projects.push(project);
    return project;
  }

  addTask(task: Task): Task {
    this.tasks.push(task);
    return task;
  }

  updateTask(id: string, updates: Partial<Task>): Task | undefined {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) return undefined;
    this.tasks[index] = { ...this.tasks[index], ...updates };
    return this.tasks[index];
  }

  addKnowledge(knowledge: Knowledge): Knowledge {
    this.knowledge.push(knowledge);
    return knowledge;
  }

  addWebsite(website: Website): Website {
    this.websites.push(website);
    return website;
  }

  updateWebsite(id: string, updates: Partial<Website>): Website | undefined {
    const index = this.websites.findIndex(w => w.id === id);
    if (index === -1) return undefined;
    this.websites[index] = { ...this.websites[index], ...updates };
    return this.websites[index];
  }
}

// Export singleton instance
export const mockDataStore = new MockDataStore();
