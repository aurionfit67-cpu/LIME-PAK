# 🚀 AI Company Builder

A complete AI-powered company management platform with intelligent agents, smart failover, and beautiful UI.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## ✨ Features

- 🤖 **AI Agent Workforce** - Create & chat with AI agents using real Gemini/Groq APIs
- 💬 **Smart AI Failover** - Automatic switching: Gemini → Groq → Mock
- 🌐 **AI Website Builder** - Generate complete websites from text prompts
- 📋 **Project Management** - Kanban boards with drag-and-drop
- 👥 **Team Organization** - C-suite positions, org charts, team management
- 📚 **Knowledge Base** - Centralized company knowledge
- 🔐 **Authentication** - Secure login with session management
- 🎨 **Premium UI** - Modern, colorful, responsive design

## 🚀 Deploy to Vercel

### 1. Push to GitHub

```bash
git clone <your-repo>
cd ai-company-builder
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Add environment variables:
   - `GEMINI_API_KEY` - Your Gemini API key
   - `GROQ_API_KEY` - Your Groq API key
4. Click **Deploy**

### 3. Test Your Deployment

Visit `/login` and use demo credentials:
- Email: `ceo@acme.com`
- Password: `password`

## 💻 Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Demo Login

- **CEO**: `ceo@acme.com` / `password`
- **Demo User**: `demo@acme.com` / `password`

## 🔑 Environment Variables

Create `.env.local`:

```bash
# AI Providers (at least one required)
GEMINI_API_KEY=your_gemini_key_here
GROQ_API_KEY=your_groq_key_here

# Database (optional)
DATABASE_URL=postgresql://user:password@host:5432/database
```

Get API keys:
- **Gemini**: [aistudio.google.com](https://aistudio.google.com/apikey)
- **Groq**: [console.groq.com](https://console.groq.com/keys)

## 🏗️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL + Drizzle ORM
- **AI**: Google Gemini & Groq
- **Auth**: Session-based (expandable to NextAuth/Clerk)

## 📚 Documentation

- [**GITHUB_DEPLOY.md**](GITHUB_DEPLOY.md) - Complete deployment guide
- [**INTEGRATION_GUIDE.md**](INTEGRATION_GUIDE.md) - API integration details
- [**ARCHITECTURE.md**](ARCHITECTURE.md) - System architecture
- [**QUICK_START.md**](QUICK_START.md) - User guide

## 🎯 How It Works

### AI Failover System

```
User Message
    ↓
Try Gemini API (primary)
    ↓ fails?
Try Groq API (fallback)
    ↓ fails?
Use Mock AI (development)
    ↓ Gemini recovers?
Auto-switch back to Gemini
```

### Authentication Flow

```
Visit /dashboard (unauthenticated)
    ↓
Middleware redirects to /login
    ↓
User logs in
    ↓
Session cookie set
    ↓
Access granted to all dashboard routes
```

## 🎨 Screenshots

### Dashboard
Modern overview with company metrics, goals, and activity feed.

### AI Agent Chat
ChatGPT-style interface with real-time AI responses using Gemini/Groq.

### Kanban Board
Drag-and-drop task management with team and AI agent assignments.

### Website Builder
Generate complete websites from text prompts with live preview.

## 📦 Project Structure

```
src/
├── app/
│   ├── (dashboard)/          # Protected routes
│   │   ├── dashboard/        # Main dashboard
│   │   ├── agents/           # AI agents & chat
│   │   ├── projects/         # Project management
│   │   ├── tasks/            # Kanban board
│   │   ├── knowledge/        # Knowledge base
│   │   └── website/          # Website builder
│   ├── login/                # Login page
│   └── api/                  # API routes
├── components/               # Reusable components
├── services/
│   ├── ai/                   # AI service layer
│   └── auth/                 # Auth service layer
├── lib/                      # Utilities
└── middleware.ts             # Auth & routing
```

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run typecheck    # Check TypeScript
```

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

MIT License - feel free to use this project for your own company!

## 🌟 Features Roadmap

- [ ] Real-time agent collaboration
- [ ] Voice chat with agents
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] Slack/Discord integration
- [ ] Multi-company support
- [ ] Advanced permissions system

## 🆘 Support

- **Documentation**: Check the `/docs` files in this repo
- **Issues**: Open a GitHub issue
- **Deployment Help**: See [GITHUB_DEPLOY.md](GITHUB_DEPLOY.md)

---

**Built with ❤️ using Next.js, TypeScript, and AI**

**Ready to deploy?** Click the button below:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
