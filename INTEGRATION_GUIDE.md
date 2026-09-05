# Integration Guide

This guide explains how to connect real APIs and services to replace the mock implementations.

## 🤖 AI Integration

### Option 1: OpenAI

1. **Install OpenAI SDK**
   ```bash
   npm install openai
   ```

2. **Add Environment Variable**
   ```bash
   # .env
   OPENAI_API_KEY=sk-...
   ```

3. **Create OpenAI Service**
   ```typescript
   // src/services/ai/OpenAIService.ts
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
         ? `You are ${agentContext.name}, a ${agentContext.role}.`
         : 'You are a helpful AI assistant.';

       const response = await this.client.chat.completions.create({
         model: 'gpt-4',
         messages: [
           { role: 'system', content: systemPrompt },
           ...messages,
         ],
       });

       return response.choices[0].message.content || '';
     }

     async *streamChat(messages: ChatMessage[], agentContext?: any) {
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
             content: 'You are a website builder. Generate complete website configurations in JSON format.',
           },
           {
             role: 'user',
             content: `Generate a website for ${companyInfo.name}. ${prompt}`,
           },
         ],
         response_format: { type: 'json_object' },
       });

       return JSON.parse(response.choices[0].message.content || '{}');
     }
   }
   ```

4. **Update Imports**
   ```typescript
   // Replace in components and API routes
   import { mockAIService } from '@/services/ai/MockAIService';
   // with
   import { openAIService } from '@/services/ai/OpenAIService';
   ```

### Option 2: Anthropic Claude

1. **Install Anthropic SDK**
   ```bash
   npm install @anthropic-ai/sdk
   ```

2. **Add Environment Variable**
   ```bash
   # .env
   ANTHROPIC_API_KEY=sk-ant-...
   ```

3. **Create Anthropic Service**
   ```typescript
   // src/services/ai/AnthropicService.ts
   import Anthropic from '@anthropic-ai/sdk';
   import { AIService, ChatMessage } from './AIService';

   export class AnthropicService extends AIService {
     private client: Anthropic;

     constructor() {
       super();
       this.client = new Anthropic({
         apiKey: process.env.ANTHROPIC_API_KEY,
       });
     }

     async chat(messages: ChatMessage[], agentContext?: any): Promise<string> {
       const systemPrompt = agentContext 
         ? `You are ${agentContext.name}, a ${agentContext.role}.`
         : 'You are a helpful AI assistant.';

       const response = await this.client.messages.create({
         model: 'claude-3-5-sonnet-20241022',
         max_tokens: 1024,
         system: systemPrompt,
         messages: messages.map(m => ({
           role: m.role === 'assistant' ? 'assistant' : 'user',
           content: m.content,
         })),
       });

       return response.content[0].text;
     }

     // Implement other methods...
   }
   ```

## 🗄️ Database Integration

### PostgreSQL with Drizzle ORM

The schema is already defined in `src/db/schema.ts`.

1. **Configure Database URL**
   ```bash
   # .env
   DATABASE_URL=postgresql://user:password@localhost:5432/ai_company_builder
   ```

2. **Push Schema to Database**
   ```bash
   npx drizzle-kit push
   ```

3. **Create Database Service**
   ```typescript
   // src/services/database/DatabaseService.ts
   import { db } from '@/db';
   import * as schema from '@/db/schema';
   import { eq } from 'drizzle-orm';

   export class DatabaseService {
     // Agents
     async getCompanyAgents(companyId: string) {
       return db.select()
         .from(schema.agents)
         .where(eq(schema.agents.companyId, companyId));
     }

     async createAgent(data: any) {
       return db.insert(schema.agents).values(data).returning();
     }

     async updateAgent(id: string, data: any) {
       return db.update(schema.agents)
         .set(data)
         .where(eq(schema.agents.id, id))
         .returning();
     }

     async deleteAgent(id: string) {
       return db.delete(schema.agents)
         .where(eq(schema.agents.id, id));
     }

     // Conversations
     async createConversation(data: any) {
       return db.insert(schema.conversations).values(data).returning();
     }

     async addMessage(data: any) {
       return db.insert(schema.messages).values(data).returning();
     }

     async getConversationMessages(conversationId: string) {
       return db.select()
         .from(schema.messages)
         .where(eq(schema.messages.conversationId, conversationId))
         .orderBy(schema.messages.createdAt);
     }

     // Projects & Tasks
     async getCompanyProjects(companyId: string) {
       return db.select()
         .from(schema.projects)
         .where(eq(schema.projects.companyId, companyId));
     }

     async getProjectTasks(projectId: string) {
       return db.select()
         .from(schema.tasks)
         .where(eq(schema.tasks.projectId, projectId));
     }

     async updateTask(id: string, data: any) {
       return db.update(schema.tasks)
         .set(data)
         .where(eq(schema.tasks.id, id))
         .returning();
     }

     // Knowledge
     async getCompanyKnowledge(companyId: string) {
       return db.select()
         .from(schema.knowledge)
         .where(eq(schema.knowledge.companyId, companyId));
     }

     async addKnowledge(data: any) {
       return db.insert(schema.knowledge).values(data).returning();
     }

     // Websites
     async getCompanyWebsites(companyId: string) {
       return db.select()
         .from(schema.websites)
         .where(eq(schema.websites.companyId, companyId));
     }

     async createWebsite(data: any) {
       return db.insert(schema.websites).values(data).returning();
     }

     async updateWebsite(id: string, data: any) {
       return db.update(schema.websites)
         .set(data)
         .where(eq(schema.websites.id, id))
         .returning();
     }
   }

   export const databaseService = new DatabaseService();
   ```

4. **Replace Mock Store**
   ```typescript
   // In your components and API routes
   import { mockDataStore } from '@/lib/mockData';
   // Replace with
   import { databaseService } from '@/services/database/DatabaseService';
   ```

## 🔐 Authentication Integration

### Option 1: NextAuth.js

1. **Install NextAuth**
   ```bash
   npm install next-auth
   ```

2. **Configure NextAuth**
   ```typescript
   // src/app/api/auth/[...nextauth]/route.ts
   import NextAuth from 'next-auth';
   import GoogleProvider from 'next-auth/providers/google';

   const handler = NextAuth({
     providers: [
       GoogleProvider({
         clientId: process.env.GOOGLE_CLIENT_ID!,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
       }),
     ],
     callbacks: {
       async session({ session, token }) {
         // Add user info to session
         return session;
       },
     },
   });

   export { handler as GET, handler as POST };
   ```

3. **Create Auth Context**
   ```typescript
   // src/components/AuthProvider.tsx
   'use client';
   
   import { SessionProvider } from 'next-auth/react';
   
   export function AuthProvider({ children }: { children: React.ReactNode }) {
     return <SessionProvider>{children}</SessionProvider>;
   }
   ```

4. **Use in Components**
   ```typescript
   'use client';
   
   import { useSession } from 'next-auth/react';
   
   export function Sidebar() {
     const { data: session } = useSession();
     
     return (
       <div>
         {session?.user?.name}
       </div>
     );
   }
   ```

### Option 2: Clerk

1. **Install Clerk**
   ```bash
   npm install @clerk/nextjs
   ```

2. **Configure Environment**
   ```bash
   # .env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
   CLERK_SECRET_KEY=sk_...
   ```

3. **Wrap App**
   ```typescript
   // src/app/layout.tsx
   import { ClerkProvider } from '@clerk/nextjs';
   
   export default function RootLayout({ children }) {
     return (
       <ClerkProvider>
         <html>
           <body>{children}</body>
         </html>
       </ClerkProvider>
     );
   }
   ```

4. **Protect Routes**
   ```typescript
   import { auth } from '@clerk/nextjs';
   
   export default async function DashboardPage() {
     const { userId } = auth();
     if (!userId) redirect('/sign-in');
     // ...
   }
   ```

## 🔍 Search Integration

### Vector Search with Pinecone (for Knowledge Base)

1. **Install Pinecone**
   ```bash
   npm install @pinecone-database/pinecone
   ```

2. **Create Vector Service**
   ```typescript
   // src/services/vector/PineconeService.ts
   import { Pinecone } from '@pinecone-database/pinecone';
   
   export class PineconeService {
     private client: Pinecone;
     
     constructor() {
       this.client = new Pinecone({
         apiKey: process.env.PINECONE_API_KEY!,
       });
     }
     
     async indexKnowledge(id: string, text: string, metadata: any) {
       const index = this.client.index('knowledge');
       // Generate embedding (use OpenAI or similar)
       const embedding = await this.generateEmbedding(text);
       
       await index.upsert([{
         id,
         values: embedding,
         metadata,
       }]);
     }
     
     async searchKnowledge(query: string, topK = 5) {
       const index = this.client.index('knowledge');
       const embedding = await this.generateEmbedding(query);
       
       return index.query({
         vector: embedding,
         topK,
         includeMetadata: true,
       });
     }
   }
   ```

## 📧 Email Integration

### SendGrid

1. **Install SendGrid**
   ```bash
   npm install @sendgrid/mail
   ```

2. **Create Email Service**
   ```typescript
   // src/services/email/EmailService.ts
   import sgMail from '@sendgrid/mail';
   
   sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
   
   export async function sendEmail(to: string, subject: string, html: string) {
     await sgMail.send({
       to,
       from: 'noreply@yourcompany.com',
       subject,
       html,
     });
   }
   ```

## 🎨 File Storage

### AWS S3 or Vercel Blob

1. **Install AWS SDK**
   ```bash
   npm install @aws-sdk/client-s3
   ```

2. **Create Storage Service**
   ```typescript
   // src/services/storage/S3Service.ts
   import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
   
   const s3Client = new S3Client({
     region: process.env.AWS_REGION!,
     credentials: {
       accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
       secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
     },
   });
   
   export async function uploadFile(file: File, key: string) {
     const buffer = Buffer.from(await file.arrayBuffer());
     
     await s3Client.send(new PutObjectCommand({
       Bucket: process.env.AWS_BUCKET_NAME!,
       Key: key,
       Body: buffer,
       ContentType: file.type,
     }));
     
     return `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`;
   }
   ```

## 🚀 Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Add Environment Variables**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Add all required API keys

### Environment Variables Checklist

```bash
# Database
DATABASE_URL=

# AI Provider (choose one)
OPENAI_API_KEY=
# or
ANTHROPIC_API_KEY=

# Authentication (choose one)
NEXTAUTH_SECRET=
NEXTAUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
# or
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Optional Services
PINECONE_API_KEY=
SENDGRID_API_KEY=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_BUCKET_NAME=
AWS_REGION=
```

## 🧪 Testing Integration

1. **Test AI Service**
   ```typescript
   // Quick test in a server action or API route
   const response = await aiService.chat([
     { role: 'user', content: 'Hello!' }
   ]);
   console.log(response);
   ```

2. **Test Database**
   ```typescript
   const agents = await databaseService.getCompanyAgents('company-id');
   console.log(agents);
   ```

3. **Test Auth**
   ```typescript
   const session = await getServerSession();
   console.log(session?.user);
   ```

## 📚 Best Practices

1. **Environment Variables**
   - Never commit API keys
   - Use `.env.local` for local development
   - Use platform secrets for production

2. **Error Handling**
   - Always wrap API calls in try-catch
   - Provide meaningful error messages
   - Log errors for debugging

3. **Rate Limiting**
   - Implement rate limiting for AI calls
   - Cache responses where appropriate
   - Use queues for batch operations

4. **Security**
   - Validate all user inputs
   - Sanitize data before storage
   - Use prepared statements for SQL
   - Implement proper authentication checks

5. **Performance**
   - Use React Server Components for data fetching
   - Implement loading states
   - Optimize images and assets
   - Use edge functions where appropriate

---

Need help? Check the official documentation:
- [Next.js](https://nextjs.org/docs)
- [OpenAI](https://platform.openai.com/docs)
- [Drizzle ORM](https://orm.drizzle.team/docs)
- [NextAuth.js](https://next-auth.js.org)
- [Clerk](https://clerk.com/docs)
