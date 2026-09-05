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

export type CSuiteRole = 'CEO' | 'CFO' | 'COO' | 'CTO' | 'CMO' | 'CHRO' | 'CPO' | 'CRO' | 'CLO' | 'CSO';
