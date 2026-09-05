# AI Company Builder

A complete fullstack application for building and managing AI-powered companies with intelligent agents, team collaboration, and AI-driven website generation.

## 🚀 Features

### 🏢 Company Management
- **Company Dashboard** - Overview of company metrics, goals, and recent activity
- **Organization Chart** - Visual C-suite hierarchy and leadership structure
- **Mission & Vision** - Company mission, vision, and strategic goals

### 👥 Team Management
- **Team Directory** - Manage team members across departments
- **C-Suite Positions** - CEO, CFO, COO, CTO, CMO, CHRO, CPO, CRO, CLO, CSO
- **Department Organization** - Organize teams by functional areas

### 🤖 AI Agent Workforce
- **Agent Builder** - Create custom AI agents with specific roles and capabilities
- **Agent Chat Interface** - ChatGPT-style conversation interface with agents
- **Agent Configuration** - Define personality, goals, tools, and permissions
- **Department Assignment** - Assign agents to specific departments

### 💼 Project & Task Management
- **Project Dashboard** - Track all company projects and progress
- **Kanban Board** - Visual task management with drag-and-drop
- **Task Assignment** - Assign tasks to team members and AI agents
- **Progress Tracking** - Monitor project completion and team performance

### 📚 Company Knowledge
- **Knowledge Base** - Centralized repository for company information
- **Document Storage** - Store notes, guides, and documentation
- **Searchable Content** - Easy access to company knowledge (ready for future RAG integration)

### 🌐 AI Website Builder
- **AI Website Generation** - Generate complete websites from text prompts
- **Section-Based Design** - Navbar, Hero, Features, About, CTA, Footer
- **Live Preview** - Preview generated websites in real-time
- **Publish/Draft System** - Control website publication status

## 🏗️ Architecture

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Responsive Design** - Mobile-friendly layouts

### Backend
- **Next.js API Routes** - Server-side API endpoints
- **Service Layer** - Clean separation of business logic
- **Mock Data Store** - In-memory storage for development
- **PostgreSQL Ready** - Drizzle ORM schema defined

### AI Integration (Mock)
- **Mock AI Service** - Simulates AI responses for development
- **Abstraction Layer** - Easy to swap with real AI APIs
- **Context-Aware Responses** - Agent-specific responses based on role

## 📁 Project Structure

```
src/
├── app/
│   ├── (dashboard)/          # Dashboard route group
│   │   ├── dashboard/        # Main dashboard
│   │   ├── organization/     # Company org chart
│   │   ├── team/            # Team management
│   │   ├── agents/          # AI agents
│   │   │   ├── new/         # Agent builder
│   │   │   └── [id]/        # Agent chat
│   │   ├── projects/        # Project management
│   │   ├── tasks/           # Kanban board
│   │   ├── knowledge/       # Knowledge base
│   │   ├── website/         # Website builder
│   │   │   └── [id]/        # Website editor
│   │   └── apps/            # App builder (coming soon)
│   ├── api/
│   │   └── health/          # Health check endpoint
│   └── layout.tsx           # Root layout
├── components/
│   └── Sidebar.tsx          # Navigation sidebar
├── db/
│   ├── schema.ts            # Drizzle ORM schema
│   └── index.ts             # Database connection
├── lib/
│   └── mockData.ts          # Mock data store
├── services/
│   └── ai/
│       ├── AIService.ts     # AI service interface
│       └── MockAIService.ts # Mock implementation
└── types/
    └── index.ts             # TypeScript types
```

## 🎨 Design Philosophy

The interface follows a **modern AI operating system** aesthetic:

- ✨ **Colorful yet minimal** - Tasteful use of color without overwhelming
- 🎯 **Clean spacing** - Generous whitespace and clear visual hierarchy
- 🔄 **Smooth interactions** - Subtle transitions and micro-animations
- 📱 **Responsive** - Works seamlessly on all screen sizes
- 🎭 **Premium feel** - Polished components and typography

## 🔧 Mock Services

### Mock AI Service
The application includes a sophisticated mock AI service that provides realistic responses:

- **Context-aware** - Responses vary based on agent role
- **Domain-specific** - Different responses for marketing, finance, technical, etc.
- **Streaming simulation** - Simulates real-time AI response streaming
- **Website generation** - Creates complete website configurations

### Mock Data Store
In-memory data storage with:

- **Demo data** - Pre-populated company, users, agents, projects, tasks
- **CRUD operations** - Full create, read, update, delete support
- **Relationships** - Maintains data relationships between entities
- **Easy migration** - Designed to be replaced with real database

## 🔌 Future API Integration

The architecture is designed for easy integration with real services:

### Replace Mock AI Service
```typescript
// Instead of MockAIService
import { OpenAIService } from '@/services/ai/OpenAIService';
// or
import { AnthropicService } from '@/services/ai/AnthropicService';
```

### Replace Mock Data Store
The Drizzle schema is already defined. To use PostgreSQL:

1. Configure `DATABASE_URL` in `.env`
2. Run `npx drizzle-kit push` to apply schema
3. Replace mock store calls with Drizzle queries

### Add Authentication
The sidebar displays user info, ready for auth integration:

```typescript
// Add your auth provider
import { useAuth } from '@/lib/auth';
const { user } = useAuth();
```

## 🗃️ Database Schema

Complete PostgreSQL schema includes:

- **companies** - Company information and configuration
- **users** - Team members with roles and departments
- **agents** - AI agents with capabilities and permissions
- **conversations** - Agent conversation history
- **messages** - Individual messages in conversations
- **projects** - Project management
- **projectMembers** - Project team assignments
- **tasks** - Task management with status and priority
- **knowledge** - Company knowledge base
- **websites** - Generated websites
- **activities** - Activity log

## 🎯 Key Features Ready for Real AI

### Agent Chat
- ✅ Conversation UI
- ✅ Message history
- ✅ Streaming responses
- 🔌 Ready for: OpenAI, Anthropic, or custom LLM

### Website Builder
- ✅ Prompt-based generation
- ✅ Section-based architecture
- ✅ Live preview
- 🔌 Ready for: AI website generation APIs

### Knowledge Base
- ✅ Document storage structure
- ✅ Content organization
- 🔌 Ready for: Vector DB, RAG, semantic search

## 📊 Dashboard Metrics

The dashboard displays:

- Team member count
- AI agent count
- Active projects
- Open tasks
- Company goals
- Recent activity
- Project progress

## 🤖 Agent Capabilities

Agents support:

- **Roles** - Marketing, Finance, Product, Engineering, etc.
- **Tools** - Data Analysis, Content Generation, Research, etc.
- **Permissions** - Granular access control
- **Goals** - Agent-specific objectives
- **Personality** - Customizable behavior and tone
- **Instructions** - Specific behavioral guidelines

## 🎨 C-Suite Positions

Support for all major executive roles:

- **CEO** - Chief Executive Officer
- **CFO** - Chief Financial Officer
- **COO** - Chief Operating Officer
- **CTO** - Chief Technology Officer
- **CMO** - Chief Marketing Officer
- **CHRO** - Chief Human Resources Officer
- **CPO** - Chief Product Officer
- **CRO** - Chief Revenue Officer
- **CLO** - Chief Legal Officer
- **CSO** - Chief Security Officer

## 🚀 Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run development server**
   ```bash
   npm run dev
   ```

3. **Open browser**
   Navigate to `http://localhost:3000`

4. **Explore the app**
   - View the dashboard
   - Create AI agents
   - Chat with agents
   - Build a website
   - Manage projects and tasks

## 🔜 Coming Soon

- **App Builder** - Generate mobile and web applications
- **Real-time Collaboration** - Multi-user editing
- **Advanced Analytics** - Company performance metrics
- **Integrations** - Connect with external tools
- **Mobile App** - Native mobile experience

## 📝 Development Notes

### Type Safety
Full TypeScript coverage with strict type checking.

### Code Organization
- **Components** - Reusable UI components
- **Services** - Business logic abstraction
- **Types** - Centralized type definitions
- **Clean separation** - UI, logic, and data layers

### Performance
- **Static generation** where possible
- **Optimized builds** - Production-ready
- **Lazy loading** - Code splitting

### Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation support

## 🎓 Learning Resources

This application demonstrates:

- Next.js 16 App Router patterns
- Server components and client components
- TypeScript best practices
- Tailwind CSS utility patterns
- Service abstraction
- Mock-to-real API migration strategy
- Database schema design with Drizzle ORM

## 📄 License

This is a template project for demonstration purposes.

## 🤝 Contributing

This is a starting point. Customize it for your needs:

1. Replace mock services with real APIs
2. Add authentication
3. Connect to PostgreSQL
4. Enhance UI components
5. Add more features

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
