# Architecture Documentation

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │  Dashboard  │  │   Agents    │  │   Website   │  ...   │
│  │   Routes    │  │   Routes    │  │   Routes    │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │             React Components                          │  │
│  │  (Sidebar, Forms, Cards, Kanban, Chat, etc.)        │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                     Service Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  AIService   │  │  Database    │  │   Auth       │     │
│  │  (Abstract)  │  │  Service     │  │   Service    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         ↓                  ↓                  ↓              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │MockAIService │  │ MockDataStore│  │  Mock Auth   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         ↓                  ↓                  ↓              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │OpenAI/Claude │  │  PostgreSQL  │  │NextAuth/Clerk│     │
│  │  (Future)    │  │  + Drizzle   │  │   (Future)   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                    API Routes (Next.js)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  /api/agents │  │  /api/chat   │  │ /api/website │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                    External Services                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   OpenAI     │  │   Pinecone   │  │   SendGrid   │     │
│  │   Anthropic  │  │  (Vector DB) │  │   (Email)    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Agent Chat Flow
```
User Input → Chat Component → API Route (/api/chat)
    ↓
MockAIService.chat() → Context-aware response
    ↓
Response → Chat Component → UI Update
```

**Future with Real AI:**
```
User Input → Chat Component → API Route
    ↓
OpenAIService.chat() → OpenAI API
    ↓
Stream Response → Chat Component → Real-time UI
```

### 2. Website Generation Flow
```
User Prompt → Website Builder → API Route (/api/website/generate)
    ↓
MockAIService.generateWebsite() → Mock website config
    ↓
Website config → MockDataStore → Save
    ↓
Redirect to Editor → Preview rendered website
```

### 3. Task Management Flow
```
Drag Task → Kanban Board (Client Component)
    ↓
Update State → MockDataStore.updateTask()
    ↓
Task status updated → UI reflects change
```

## Directory Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (dashboard)/              # Dashboard route group
│   │   ├── layout.tsx            # Shared layout with sidebar
│   │   ├── dashboard/page.tsx    # Main dashboard
│   │   ├── organization/page.tsx # Org chart
│   │   ├── team/page.tsx         # Team directory
│   │   ├── agents/               # Agent management
│   │   │   ├── page.tsx          # Agent list
│   │   │   ├── new/page.tsx      # Agent builder
│   │   │   └── [id]/page.tsx     # Agent chat
│   │   ├── projects/page.tsx     # Project dashboard
│   │   ├── tasks/page.tsx        # Kanban board
│   │   ├── knowledge/page.tsx    # Knowledge base
│   │   ├── website/              # Website builder
│   │   │   ├── page.tsx          # Website list
│   │   │   └── [id]/page.tsx     # Website editor
│   │   └── apps/page.tsx         # Coming soon
│   ├── api/                      # API routes
│   │   ├── agents/route.ts       # Agent CRUD
│   │   ├── chat/route.ts         # Chat endpoint
│   │   ├── website/
│   │   │   └── generate/route.ts # Website generation
│   │   └── health/route.ts       # Health check
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home (redirects)
│   └── globals.css               # Global styles
├── components/
│   └── Sidebar.tsx               # Navigation sidebar
├── db/
│   ├── schema.ts                 # Drizzle ORM schema
│   └── index.ts                  # DB connection
├── lib/
│   └── mockData.ts               # Mock data store
├── services/
│   └── ai/
│       ├── AIService.ts          # Abstract AI service
│       └── MockAIService.ts      # Mock implementation
└── types/
    └── index.ts                  # Shared types
```

## Component Architecture

### Layout Hierarchy
```
RootLayout (app/layout.tsx)
  └── DashboardLayout (app/(dashboard)/layout.tsx)
      ├── Sidebar (components/Sidebar.tsx)
      └── Page Content
          ├── Dashboard
          ├── Organization
          ├── Team
          ├── Agents
          ├── Projects
          ├── Tasks
          ├── Knowledge
          └── Website
```

### Server vs Client Components

**Server Components (Default):**
- Dashboard pages
- Organization page
- Team page
- Agent list page
- Project page
- Knowledge page (read)

**Client Components (Interactive):**
- Sidebar (navigation)
- Agent Builder (forms)
- Agent Chat (real-time)
- Kanban Board (drag-drop)
- Knowledge page (forms)
- Website Builder (forms)
- Website Editor (interactive)

## Database Schema

```
companies
├── id (uuid, PK)
├── name
├── description
├── industry
├── mission
├── vision
├── goals (jsonb)
└── timestamps

users
├── id (uuid, PK)
├── email (unique)
├── name
├── avatar
├── companyId (FK → companies)
├── role (CEO, CFO, etc.)
├── department
└── timestamps

agents
├── id (uuid, PK)
├── companyId (FK → companies)
├── name
├── role
├── department
├── purpose
├── personality
├── instructions
├── goals (jsonb)
├── tools (jsonb)
├── permissions (jsonb)
├── memory (jsonb)
├── status
└── timestamps

conversations
├── id (uuid, PK)
├── companyId (FK → companies)
├── agentId (FK → agents)
├── userId (FK → users)
├── title
└── timestamps

messages
├── id (uuid, PK)
├── conversationId (FK → conversations)
├── role (user/assistant)
├── content
└── timestamp

projects
├── id (uuid, PK)
├── companyId (FK → companies)
├── name
├── description
├── status
├── progress
└── timestamps

projectMembers
├── id (uuid, PK)
├── projectId (FK → projects)
├── userId (FK → users)
├── agentId (FK → agents)
├── role
└── timestamp

tasks
├── id (uuid, PK)
├── projectId (FK → projects)
├── title
├── description
├── status (todo/in_progress/review/done)
├── priority (low/medium/high)
├── assignedToUserId (FK → users)
├── assignedToAgentId (FK → agents)
├── dueDate
└── timestamps

knowledge
├── id (uuid, PK)
├── companyId (FK → companies)
├── title
├── content
├── type
├── metadata (jsonb)
└── timestamps

websites
├── id (uuid, PK)
├── companyId (FK → companies)
├── name
├── description
├── content (jsonb)
├── published
└── timestamps

activities
├── id (uuid, PK)
├── companyId (FK → companies)
├── userId (FK → users)
├── agentId (FK → agents)
├── action
├── description
├── metadata (jsonb)
└── timestamp
```

## Service Abstraction Pattern

### Why Service Layer?

1. **Separation of Concerns**: UI doesn't know about API details
2. **Easy Testing**: Mock services for testing
3. **Easy Migration**: Swap implementations without changing UI
4. **Consistent Interface**: Same API regardless of backend

### Example: AI Service

```typescript
// Abstract Interface
export abstract class AIService {
  abstract chat(messages: ChatMessage[]): Promise<string>;
  abstract generateWebsite(prompt: string): Promise<any>;
}

// Mock Implementation (Development)
export class MockAIService extends AIService {
  async chat(messages) {
    // Return mock response
    return "Mock AI response...";
  }
}

// Real Implementation (Production)
export class OpenAIService extends AIService {
  async chat(messages) {
    // Call OpenAI API
    return await openai.chat.completions.create(...);
  }
}

// Usage in Components (same code for both!)
const response = await aiService.chat(messages);
```

## State Management

### Current Approach
- **Server Components**: Fetch data server-side
- **Client Components**: React useState/useEffect
- **Mock Store**: Singleton in-memory store

### Migration Path
```
MockDataStore (current)
    ↓
PostgreSQL + Drizzle (database)
    ↓
React Query (caching)
    ↓
Zustand/Redux (complex state)
```

## API Design

### RESTful Endpoints
```
GET    /api/agents           # List agents
POST   /api/agents           # Create agent
GET    /api/agents/:id       # Get agent
PUT    /api/agents/:id       # Update agent
DELETE /api/agents/:id       # Delete agent

POST   /api/chat             # Chat with agent
POST   /api/website/generate # Generate website

GET    /api/health           # Health check
```

### Response Format
```typescript
// Success
{
  "data": { ... },
  "status": 200
}

// Error
{
  "error": "Error message",
  "status": 400
}
```

## Security Model

### Current (Development)
- No authentication
- No authorization
- Mock user data

### Production Ready
```
User Authentication
    ↓
Role-Based Access Control (RBAC)
    ↓
API Authorization
    ↓
Rate Limiting
    ↓
Input Validation
    ↓
Data Encryption
```

## Performance Considerations

### Static vs Dynamic
```
Static (Fast):
- Dashboard layout
- Public pages
- Static assets

Dynamic (On-demand):
- Agent chat
- User-specific data
- Real-time updates
```

### Optimization Strategies
1. **Static Generation**: Pre-render where possible
2. **Incremental Regeneration**: Update static pages
3. **Edge Functions**: Deploy close to users
4. **Code Splitting**: Load only needed code
5. **Image Optimization**: Next.js Image component
6. **Caching**: Cache API responses

## Deployment Architecture

```
┌─────────────────┐
│   GitHub Repo   │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│     Vercel      │
│   Build & CDN   │
└────────┬────────┘
         │
    ┌────┴────┐
    ↓         ↓
┌────────┐ ┌──────────┐
│  Edge  │ │ Database │
│Function│ │PostgreSQL│
└────────┘ └──────────┘
```

## Monitoring & Logging

### Future Implementation
```
Application
    ↓
Logging (Winston/Pino)
    ↓
Error Tracking (Sentry)
    ↓
Analytics (Vercel Analytics)
    ↓
Performance (Web Vitals)
```

## Scalability Plan

### Phase 1: MVP (Current)
- Single instance
- Mock services
- In-memory data

### Phase 2: Production
- PostgreSQL database
- Real AI APIs
- Authentication

### Phase 3: Scale
- Database read replicas
- Redis caching
- Message queues
- Load balancing

### Phase 4: Enterprise
- Multi-region deployment
- Microservices
- Event-driven architecture
- Auto-scaling

## Testing Strategy

### Unit Tests
```typescript
// Services
test('AIService generates response', async () => {
  const response = await aiService.chat([...]);
  expect(response).toBeDefined();
});
```

### Integration Tests
```typescript
// API Routes
test('POST /api/agents creates agent', async () => {
  const res = await fetch('/api/agents', {
    method: 'POST',
    body: JSON.stringify(agentData)
  });
  expect(res.status).toBe(201);
});
```

### E2E Tests
```typescript
// User Flows
test('User can create and chat with agent', async () => {
  // Navigate to agent builder
  // Fill form
  // Submit
  // Navigate to agent
  // Send message
  // Verify response
});
```

## CI/CD Pipeline

```
Git Push
    ↓
GitHub Actions
    ↓
Run Tests
    ↓
TypeScript Check
    ↓
Build Application
    ↓
Deploy to Vercel
    ↓
Run E2E Tests
    ↓
Production Live ✅
```

## Environment Configuration

```bash
# Development
.env.local
- Mock services
- Local database (optional)
- Debug logging

# Staging
.env.staging
- Test AI APIs
- Staging database
- Verbose logging

# Production
.env.production
- Production AI APIs
- Production database
- Error logging only
```

## Migration Strategy

### From Mock to Real

1. **Database**
   ```
   MockDataStore → PostgreSQL
   - Update DB_URL
   - Run migrations
   - Update imports
   ```

2. **AI Service**
   ```
   MockAIService → OpenAIService
   - Add API key
   - Update imports
   - Test responses
   ```

3. **Authentication**
   ```
   Mock User → NextAuth
   - Configure provider
   - Add middleware
   - Update UI
   ```

4. **File Storage**
   ```
   Mock → S3/Blob
   - Configure bucket
   - Update upload logic
   - Add CDN
   ```

---

This architecture is designed for:
- ✅ Easy development (mock services)
- ✅ Simple migration (service abstraction)
- ✅ Production ready (clean architecture)
- ✅ Scalable growth (modular design)
