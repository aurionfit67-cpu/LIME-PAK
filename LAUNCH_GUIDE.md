# Complete Launch Guide

This guide will take you from zero to a fully functional AI Company Builder in production.

## 🚀 Quick Launch (5 minutes)

### Option 1: Run Locally (Development)

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser
# Navigate to http://localhost:3000
```

**That's it!** The app works immediately with mock data and mock AI.

### Option 2: Deploy to Vercel (Production)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Follow prompts
# - Link to your GitHub repo
# - Choose project name
# - Deploy!
```

Your app is now live! 🎉

---

## 🔧 Make It Fully Functional (Connect Real Services)

Now let's connect real AI, database, and authentication.

### Phase 1: Connect OpenAI (15 minutes)

#### Step 1: Get OpenAI API Key
1. Go to https://platform.openai.com/
2. Sign up or log in
3. Go to API Keys
4. Create new secret key
5. Copy the key (starts with `sk-...`)

#### Step 2: Install OpenAI SDK
```bash
npm install openai
```

#### Step 3: Add Environment Variable
```bash
# Create .env.local file
echo "OPENAI_API_KEY=sk-your-key-here" >> .env.local
```

#### Step 4: Create OpenAI Service
Create `src/services/ai/OpenAIService.ts`:

```typescript
import OpenAI from 'openai';
import { AIService, ChatMessage } from './AIService';

export class OpenAIService extends AIService {
  private client: OpenAI;

  constructor() {
    super();
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async chat(messages: ChatMessage[], agentContext?: any): Promise<string> {
    const systemPrompt = agentContext 
      ? `You are ${agentContext.name}, a ${agentContext.role} at ${agentContext.companyName}. ${agentContext.instructions || ''}`
      : 'You are a helpful AI assistant.';

    const response = await this.client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      temperature: 0.7,
    });

    return response.choices[0].message.content || '';
  }

  async *streamChat(messages: ChatMessage[], agentContext?: any): AsyncGenerator<string> {
    const systemPrompt = agentContext 
      ? `You are ${agentContext.name}, a ${agentContext.role}.`
      : 'You are a helpful AI assistant.';

    const stream = await this.client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) yield content;
    }
  }

  async generateWebsite(prompt: string, companyInfo: any): Promise<any> {
    const response = await this.client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a professional website builder. Generate complete website configurations in JSON format with sections: navbar, hero, features, about, cta, footer.`,
        },
        {
          role: 'user',
          content: `Generate a website for "${companyInfo.name}" (${companyInfo.industry}). ${prompt}
          
Return ONLY valid JSON in this exact format:
{
  "name": "Website Name",
  "sections": [
    {
      "id": "navbar",
      "type": "navbar",
      "content": { "logo": "Company Name", "links": ["Home", "About", "Features", "Contact"] }
    },
    {
      "id": "hero",
      "type": "hero",
      "content": { "headline": "Main headline", "subheadline": "Subheadline", "cta": "Button text" }
    }
  ]
}`,
        },
      ],
      response_format: { type: 'json_object' },
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  }
}

export const openAIService = new OpenAIService();
```

#### Step 5: Update API Route
Edit `src/app/api/chat/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { openAIService } from '@/services/ai/OpenAIService'; // Changed!
import { mockDataStore } from '@/lib/mockData';

export async function POST(request: Request) {
  try {
    const { agentId, message } = await request.json();

    if (!agentId || !message) {
      return NextResponse.json(
        { error: 'Agent ID and message are required' },
        { status: 400 }
      );
    }

    const agent = mockDataStore.agents.find(a => a.id === agentId);
    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    // Use OpenAI instead of mock!
    const response = await openAIService.chat(
      [{ role: 'user', content: message }],
      { 
        role: agent.role, 
        name: agent.name,
        instructions: agent.instructions 
      }
    );

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ error: 'Failed to process chat' }, { status: 500 });
  }
}
```

#### Step 6: Test It!
```bash
npm run dev
```

Go to http://localhost:3000/agents and chat with an agent - now it's using real AI! 🤖

---

### Phase 2: Connect PostgreSQL Database (20 minutes)

#### Step 1: Create Database

**Option A: Local PostgreSQL**
```bash
# Install PostgreSQL
# macOS:
brew install postgresql
brew services start postgresql

# Create database
createdb ai_company_builder
```

**Option B: Hosted Database (Recommended)**

Choose one:
- **Supabase** (free tier): https://supabase.com
- **Neon** (free tier): https://neon.tech
- **Railway** (free tier): https://railway.app
- **Vercel Postgres**: https://vercel.com/storage/postgres

For this example, I'll use **Neon** (easiest):

1. Go to https://neon.tech
2. Sign up / Log in
3. Click "Create Project"
4. Copy the connection string (looks like: `postgresql://user:pass@host/db`)

#### Step 2: Add Database URL
```bash
# Add to .env.local
echo "DATABASE_URL=postgresql://user:pass@host/db" >> .env.local
```

#### Step 3: Push Database Schema
```bash
# Install drizzle-kit if not already installed
npm install -D drizzle-kit

# Push schema to database
npx drizzle-kit push
```

This creates all the tables in your database!

#### Step 4: Create Database Service

Create `src/services/database/DatabaseService.ts`:

```typescript
import { db } from '@/db';
import * as schema from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export class DatabaseService {
  // Companies
  async getCompany(id: string) {
    const [company] = await db.select().from(schema.companies).where(eq(schema.companies.id, id));
    return company;
  }

  async createCompany(data: typeof schema.companies.$inferInsert) {
    const [company] = await db.insert(schema.companies).values(data).returning();
    return company;
  }

  // Users
  async getUser(id: string) {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.id, id));
    return user;
  }

  async getCompanyUsers(companyId: string) {
    return db.select().from(schema.users).where(eq(schema.users.companyId, companyId));
  }

  // Agents
  async getCompanyAgents(companyId: string) {
    return db.select().from(schema.agents).where(eq(schema.agents.companyId, companyId));
  }

  async createAgent(data: typeof schema.agents.$inferInsert) {
    const [agent] = await db.insert(schema.agents).values(data).returning();
    return agent;
  }

  async updateAgent(id: string, data: Partial<typeof schema.agents.$inferInsert>) {
    const [agent] = await db.update(schema.agents)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.agents.id, id))
      .returning();
    return agent;
  }

  async deleteAgent(id: string) {
    await db.delete(schema.agents).where(eq(schema.agents.id, id));
  }

  // Conversations & Messages
  async createConversation(data: typeof schema.conversations.$inferInsert) {
    const [conversation] = await db.insert(schema.conversations).values(data).returning();
    return conversation;
  }

  async addMessage(data: typeof schema.messages.$inferInsert) {
    const [message] = await db.insert(schema.messages).values(data).returning();
    return message;
  }

  async getConversationMessages(conversationId: string) {
    return db.select()
      .from(schema.messages)
      .where(eq(schema.messages.conversationId, conversationId))
      .orderBy(schema.messages.createdAt);
  }

  // Projects
  async getCompanyProjects(companyId: string) {
    return db.select().from(schema.projects).where(eq(schema.projects.companyId, companyId));
  }

  async createProject(data: typeof schema.projects.$inferInsert) {
    const [project] = await db.insert(schema.projects).values(data).returning();
    return project;
  }

  // Tasks
  async getProjectTasks(projectId: string) {
    return db.select().from(schema.tasks).where(eq(schema.tasks.projectId, projectId));
  }

  async createTask(data: typeof schema.tasks.$inferInsert) {
    const [task] = await db.insert(schema.tasks).values(data).returning();
    return task;
  }

  async updateTask(id: string, data: Partial<typeof schema.tasks.$inferInsert>) {
    const [task] = await db.update(schema.tasks)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.tasks.id, id))
      .returning();
    return task;
  }

  // Knowledge
  async getCompanyKnowledge(companyId: string) {
    return db.select().from(schema.knowledge).where(eq(schema.knowledge.companyId, companyId));
  }

  async createKnowledge(data: typeof schema.knowledge.$inferInsert) {
    const [item] = await db.insert(schema.knowledge).values(data).returning();
    return item;
  }

  // Websites
  async getCompanyWebsites(companyId: string) {
    return db.select().from(schema.websites).where(eq(schema.websites.companyId, companyId));
  }

  async createWebsite(data: typeof schema.websites.$inferInsert) {
    const [website] = await db.insert(schema.websites).values(data).returning();
    return website;
  }

  async updateWebsite(id: string, data: Partial<typeof schema.websites.$inferInsert>) {
    const [website] = await db.update(schema.websites)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(schema.websites.id, id))
      .returning();
    return website;
  }
}

export const databaseService = new DatabaseService();
```

#### Step 5: Seed Database

Create `src/scripts/seed.ts`:

```typescript
import { db } from '../db';
import * as schema from '../db/schema';

async function seed() {
  console.log('🌱 Seeding database...');

  // Create company
  const [company] = await db.insert(schema.companies).values({
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
  }).returning();

  console.log('✅ Company created:', company.name);

  // Create CEO
  const [ceo] = await db.insert(schema.users).values({
    email: 'ceo@acme.com',
    name: 'Sarah Chen',
    avatar: '👩‍💼',
    companyId: company.id,
    role: 'CEO',
    department: 'Executive',
  }).returning();

  console.log('✅ CEO created:', ceo.name);

  // Create more team members...
  const teamMembers = await db.insert(schema.users).values([
    {
      email: 'cfo@acme.com',
      name: 'Michael Rodriguez',
      avatar: '👨‍💼',
      companyId: company.id,
      role: 'CFO',
      department: 'Finance',
    },
    {
      email: 'cto@acme.com',
      name: 'Emily Watson',
      avatar: '👩‍💻',
      companyId: company.id,
      role: 'CTO',
      department: 'Technology',
    },
  ]).returning();

  console.log('✅ Team members created:', teamMembers.length);

  // Create AI agents
  const agents = await db.insert(schema.agents).values([
    {
      companyId: company.id,
      name: 'Atlas',
      role: 'Strategic Advisor',
      department: 'Executive',
      purpose: 'Provide strategic insights and decision support',
      personality: 'Analytical, forward-thinking, and data-driven',
      instructions: 'Analyze business situations from multiple angles and provide strategic recommendations',
      goals: ['Support executive decision-making', 'Identify growth opportunities'],
      tools: ['Data Analysis', 'Market Research'],
      permissions: ['Read all data', 'Generate reports'],
      status: 'active',
    },
  ]).returning();

  console.log('✅ Agents created:', agents.length);

  console.log('🎉 Database seeded successfully!');
}

seed().catch(console.error);
```

Run the seed:
```bash
npx tsx src/scripts/seed.ts
```

#### Step 6: Update Pages to Use Database

Edit `src/app/(dashboard)/dashboard/page.tsx`:

```typescript
import { databaseService } from '@/services/database/DatabaseService';

export default async function DashboardPage() {
  // Replace mockDataStore with databaseService
  const company = await databaseService.getCompany('company-id');
  const users = await databaseService.getCompanyUsers(company.id);
  const agents = await databaseService.getCompanyAgents(company.id);
  // ... rest of the code
}
```

Now your data is persistent! 🗄️

---

### Phase 3: Add Authentication (15 minutes)

We'll use **Clerk** (easiest):

#### Step 1: Create Clerk Account
1. Go to https://clerk.com
2. Sign up
3. Create new application
4. Copy API keys

#### Step 2: Install Clerk
```bash
npm install @clerk/nextjs
```

#### Step 3: Add Environment Variables
```bash
# Add to .env.local
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

#### Step 4: Wrap App with Clerk

Edit `src/app/layout.tsx`:

```typescript
import { ClerkProvider } from '@clerk/nextjs';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-gray-50 text-gray-900 antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
```

#### Step 5: Add Sign In Page

Create `src/app/sign-in/[[...sign-in]]/page.tsx`:

```typescript
import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <SignIn />
    </div>
  );
}
```

#### Step 6: Protect Dashboard

Create `src/middleware.ts`:

```typescript
import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  publicRoutes: ['/'],
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
```

#### Step 7: Update Sidebar

Edit `src/components/Sidebar.tsx`:

```typescript
'use client';

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const { user } = useUser();
  const pathname = usePathname();

  // ... existing navigation code ...

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* ... existing code ... */}

      {/* User Info */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-lg">
            {user?.firstName?.charAt(0) || '👤'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">
              {user?.fullName || 'User'}
            </div>
            <div className="text-xs text-gray-500">CEO</div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

Now you have authentication! 🔐

---

### Phase 4: Deploy to Production (10 minutes)

#### Option A: Vercel (Recommended)

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/ai-company-builder.git
git push -u origin main

# 2. Go to vercel.com
# 3. Click "New Project"
# 4. Import your GitHub repo
# 5. Add environment variables:
#    - OPENAI_API_KEY
#    - DATABASE_URL
#    - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
#    - CLERK_SECRET_KEY
# 6. Click "Deploy"
```

Done! Your app is live! 🎉

#### Option B: Railway

```bash
# 1. Install Railway CLI
npm i -g @railway/cli

# 2. Login
railway login

# 3. Initialize
railway init

# 4. Add environment variables
railway variables set OPENAI_API_KEY=sk-...
railway variables set DATABASE_URL=postgresql://...

# 5. Deploy
railway up
```

---

## 🎯 Quick Reference: What You Need

### Minimum (Free)
- ✅ Nothing! Works with mocks

### Basic AI (Free trial, then $5-20/month)
- OpenAI API key ($20 free credit)
- OR Anthropic API key

### Full Production (Free - $20/month)
- OpenAI API: ~$10-20/month
- Database: Free (Neon/Supabase)
- Auth: Free (Clerk)
- Hosting: Free (Vercel)

**Total: ~$10-20/month**

---

## 📋 Complete Checklist

### Development
- [ ] Clone/download project
- [ ] Run `npm install`
- [ ] Run `npm run dev`
- [ ] Open http://localhost:3000
- [ ] Explore with mock data

### Add Real AI
- [ ] Get OpenAI API key
- [ ] Add to `.env.local`
- [ ] Install `openai` package
- [ ] Create `OpenAIService`
- [ ] Update API routes
- [ ] Test chat with agents

### Add Database
- [ ] Create PostgreSQL database (Neon/Supabase)
- [ ] Add `DATABASE_URL` to `.env.local`
- [ ] Run `npx drizzle-kit push`
- [ ] Create `DatabaseService`
- [ ] Seed database
- [ ] Update pages to use database

### Add Authentication
- [ ] Create Clerk account
- [ ] Add API keys to `.env.local`
- [ ] Install `@clerk/nextjs`
- [ ] Wrap app with ClerkProvider
- [ ] Add middleware
- [ ] Update components

### Deploy
- [ ] Push to GitHub
- [ ] Connect to Vercel
- [ ] Add environment variables
- [ ] Deploy!
- [ ] Test production site

---

## 🆘 Troubleshooting

### "Module not found" errors
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

### Database connection fails
```bash
# Check DATABASE_URL format
echo $DATABASE_URL
# Should be: postgresql://user:pass@host:port/database

# Test connection
npx drizzle-kit studio
```

### OpenAI API errors
```bash
# Check API key
echo $OPENAI_API_KEY
# Should start with sk-

# Check credits
# Go to platform.openai.com/usage
```

### Build fails
```bash
# Check TypeScript
npm run typecheck

# Check build locally
npm run build

# Check environment variables
cat .env.local
```

---

## 🎉 You're Done!

Your AI Company Builder is now:
- ✅ Running with real AI
- ✅ Storing data in PostgreSQL
- ✅ Protecting routes with auth
- ✅ Deployed to production

### Next Steps
1. Customize the design
2. Add more agents
3. Invite team members
4. Build your company!

### Need Help?
- Check INTEGRATION_GUIDE.md for details
- Check ARCHITECTURE.md for system understanding
- Read the code comments
- OpenAI docs: platform.openai.com/docs
- Clerk docs: clerk.com/docs
- Drizzle docs: orm.drizzle.team

---

**Congratulations! Your AI Company Builder is live! 🚀**
