# 🤖 AGENTS.md — AI Coding Assistant Guidelines & Project Architecture

This file provides system context, guardrails, and architectural conventions for AI coding assistants (such as Antigravity, Copilot, Windsurf, Cursor, or Claude Code) working on this codebase.

---

## 🎯 Project Overview & Tech Stack

- **Framework**: Next.js 16 (App Router / Turbopack), React 19, TypeScript
- **Visualization**: Recharts
- **Styling**: Vanilla CSS custom properties & Tailwind CSS
- **Backend Architecture**: PostgREST / PostgreSQL & Addax ETL Engine (via Next.js BFF Proxy)

---

## ⛔ Strict Design Guardrails & Coding Rules

1. **System Default Typography**:
   - Strictly rely on **system-default fonts** (`font-sans`, system UI font stack).
   - **Do NOT** import heavy external web fonts (e.g. Google Fonts) or add custom font loading scripts.

2. **Internationalization & Locale Policy**:
   - Default locale is strictly **`zh-TW`** (Traditional Chinese / 繁體中文).
   - **Do NOT** reintroduce "North" / "華北" / "北" region terminology in UI strings or JSON dictionaries.
   - Always retrieve UI labels using the `useI18n()` hook (`m.<category>.<key>`).
   - Maintain key synchronization across `messages/zh-TW.json`, `messages/zh-CN.json`, `messages/en-US.json`, and `messages/ja-JP.json`.

3. **Backend-for-Frontend (BFF) & API Proxy Pattern**:
   - **Never** expose raw PostgREST URLs or DB ports (`3000`/`5432`) directly in client components.
   - Route all API calls through Next.js server-side route handlers under [`src/app/api/`](file:///home/student_03_a8cc42dc8126/ReactNextLab/src/app/api/).
   - Always register local routes and remote endpoints in [`src/lib/apiMap.ts`](file:///home/student_03_a8cc42dc8126/ReactNextLab/src/lib/apiMap.ts).

4. **Multi-Environment Profiles**:
   - Default environment is **`DEV`** (not `PROD`).
   - Use `src/lib/config.ts` to resolve environment parameters (`DEV`, `UAT`, `PRD`).

5. **Date & Time Formatting**:
   - Use `dateFormatter` ([`src/utils/dateFormatter.ts`](file:///home/student_03_a8cc42dc8126/ReactNextLab/src/utils/dateFormatter.ts)) for all user-facing timestamps and chart tick labels (`formatDateTime`, `formatChartDay`).

---

## 📁 Key Directory Structure

```text
ReactNextLab/
├── messages/                  # i18n Dictionaries (zh-TW primary)
├── src/
│   ├── app/
│   │   ├── api/              # Server-Side API Wrapper Handlers (BFF Proxy)
│   │   ├── layout.tsx        # App Root & Providers
│   │   └── page.tsx          # Main Console Controller
│   ├── components/           # View Panels & Recharts Charts
│   ├── context/              # Global React Context (I18nContext)
│   ├── data/                 # Datasets & DEV Simulation Fallbacks
│   ├── lib/
│   │   ├── config.ts         # Centralized Env Profile Resolver (DEV/UAT/PRD)
│   │   └── apiMap.ts         # Central API Mapping Registry (/api/* -> Remote)
│   ├── services/             # API Services & PostgreSQL DDL Specifications
│   ├── types/                # TypeScript Interfaces & Contracts
│   └── utils/                # Date & Utility Services
├── .env                      # Environment Variable Overrides
├── README.md                 # Public Project Documentation
└── SESSION_SUMMARY.md        # Architectural Context & Handover Summary
```

---

## 🚀 Common Command References

```bash
# Start Development Server
npm run dev

# Run Production Build Check
npm run build

# Start Production Server
npm run start
```
