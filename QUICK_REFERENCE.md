# Quick Reference Card

## 🚀 Instant Start

```bash
npm install && npm run dev
```
Open http://localhost:3000 - Done! ✅

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `src/app/(dashboard)/` | All pages |
| `src/components/Sidebar.tsx` | Navigation |
| `src/lib/mockData.ts` | Demo data |
| `src/services/ai/MockAIService.ts` | AI responses |
| `src/db/schema.ts` | Database schema |

---

## 🎯 Main Features

| Feature | Location |
|---------|----------|
| Dashboard | `/dashboard` |
| Chat with AI | `/agents` → Select agent |
| Create Agent | `/agents/new` |
| Kanban Board | `/tasks` |
| Generate Website | `/website` |
| Org Chart | `/organization` |
| Team | `/team` |
| Projects | `/projects` |
| Knowledge | `/knowledge` |

---

## 🔌 Connect Real Services

### OpenAI
```bash
# 1. Get key from platform.openai.com
# 2. Add to .env.local
OPENAI_API_KEY=sk-...

# 3. Install
npm install openai

# 4. Use OpenAIService (see LAUNCH_GUIDE.md)
```

### Database
```bash
# 1. Create database at neon.tech
# 2. Add to .env.local
DATABASE_URL=postgresql://...

# 3. Push schema
npx drizzle-kit push

# 4. Use DatabaseService (see LAUNCH_GUIDE.md)
```

### Auth
```bash
# 1. Create app at clerk.com
# 2. Add to .env.local
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...

# 3. Install
npm install @clerk/nextjs

# 4. Setup (see LAUNCH_GUIDE.md)
```

---

## 🚀 Deploy

### Vercel
```bash
vercel
# Follow prompts, add env variables
```

### Railway
```bash
railway init
railway up
```

---

## 📚 Documentation

| Need | Read |
|------|------|
| Try the app | [QUICK_START.md](QUICK_START.md) |
| See features | [FEATURES.md](FEATURES.md) |
| Understand design | [README.md](README.md) |
| Learn architecture | [ARCHITECTURE.md](ARCHITECTURE.md) |
| Add real APIs | [LAUNCH_GUIDE.md](LAUNCH_GUIDE.md) |
| Full integration | [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) |

---

## 💻 Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run typecheck    # Check TypeScript

# Database
npx drizzle-kit push      # Push schema to database
npx drizzle-kit studio    # Open database GUI
npx tsx src/scripts/seed.ts  # Seed database

# Deploy
vercel                # Deploy to Vercel
railway up            # Deploy to Railway
```

---

## 🐛 Quick Fixes

### Port already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
npm run dev
```

### Module not found
```bash
rm -rf node_modules .next
npm install
```

### Build fails
```bash
npm run typecheck  # Check errors
npm run build      # Try building
```

### Database connection fails
```bash
echo $DATABASE_URL  # Check it's set
npx drizzle-kit studio  # Test connection
```

---

## 🎨 Customization

### Change colors
Edit `src/app/globals.css` and component classes

### Add pages
Create in `src/app/(dashboard)/yourpage/page.tsx`

### Add API routes
Create in `src/app/api/yourroute/route.ts`

### Modify agents
Edit `src/lib/mockData.ts` → agents array

---

## 📊 Project Stats

- **Pages**: 13
- **Components**: 20+
- **API Routes**: 4
- **Features**: 200+
- **Lines of Code**: ~5,000
- **Documentation**: 70KB+

---

## 🆘 Help

### Getting Started
1. Read [QUICK_START.md](QUICK_START.md)
2. Try the features
3. Read [LAUNCH_GUIDE.md](LAUNCH_GUIDE.md)

### Integration
1. Read [LAUNCH_GUIDE.md](LAUNCH_GUIDE.md)
2. Follow step-by-step
3. Check [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) for details

### Understanding
1. Read [ARCHITECTURE.md](ARCHITECTURE.md)
2. Explore the code
3. Check inline comments

---

## ✅ Current Status

- ✅ Fully functional with mocks
- ✅ Production build passing
- ✅ TypeScript validated
- ✅ Deploy ready
- ✅ Integration ready

---

## 🎯 Quick Goals

### 5 minutes
- [x] Install and run
- [x] View dashboard
- [x] Chat with agent

### 30 minutes
- [ ] Add OpenAI
- [ ] Connect database
- [ ] Deploy to Vercel

### 1 hour
- [ ] Add authentication
- [ ] Customize design
- [ ] Invite team

---

**Start here**: [LAUNCH_GUIDE.md](LAUNCH_GUIDE.md)

**Questions?** Check [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)
