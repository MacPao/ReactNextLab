# 📄 Architectural Session Summary & AI LLM Handover Context

**Date**: July 23, 2026  
**Project**: Enterprise Operations Platform & POS Analytics Console  
**Stack**: Next.js 16 (App Router / Turbopack), React 19, TypeScript, Recharts, PostgREST / PostgreSQL, Addax / DataX ETL Engine  

---

## 1. Accomplished Features & Architecture Changes

### A. Next.js Backend-for-Frontend (BFF) API Wrapper & Proxy
- **Problem**: Needed to protect internal PostgREST URLs/ports from direct browser exposure without requiring complex client-side JWT management.
- **Solution**: Built server-side API proxy route handlers in Next.js App Router:
  - [`GET /api/get_order_today`](file:///home/student_03_a8cc42dc8126/ReactNextLab/src/app/api/get_order_today/route.ts) → Proxies to internal PostgREST RPC `/rpc/get_order_today`
  - [`GET /api/kpi/pos-products`](file:///home/student_03_a8cc42dc8126/ReactNextLab/src/app/api/kpi/pos-products/route.ts) → Proxies to internal PostgREST table `/pos_products`
  - [`GET /api/etl/jobs`](file:///home/student_03_a8cc42dc8126/ReactNextLab/src/app/api/etl/jobs/route.ts) → Proxies to internal table `/etl_jobs`
- **Security**: Injects internal secret header (`X-Internal-Secret`) server-to-server and keeps database ports on loopback/internal network.

### B. Centralized Environment Configuration ([`.env`](file:///home/student_03_a8cc42dc8126/ReactNextLab/.env) & [`src/lib/config.ts`](file:///home/student_03_a8cc42dc8126/ReactNextLab/src/lib/config.ts))
- Created [`.env`](file:///home/student_03_a8cc42dc8126/ReactNextLab/.env) and [`.env.example`](file:///home/student_03_a8cc42dc8126/ReactNextLab/.env.example) configuration files.
- Built [`src/lib/config.ts`](file:///home/student_03_a8cc42dc8126/ReactNextLab/src/lib/config.ts) to read `process.env` safely with typed fallbacks.

### C. Centralized API Route Mapping Registry ([`src/lib/apiMap.ts`](file:///home/student_03_a8cc42dc8126/ReactNextLab/src/lib/apiMap.ts))
- Created a single source of truth mapping public frontend routes (`/api/*`) to internal target URLs:
  ```typescript
  export const API_ROUTE_MAPPINGS = {
    getOrderToday: {
      localPath: '/api/get_order_today',
      remoteEndpoint: '/rpc/get_order_today',
      targetUrl: (baseUrl) => `${baseUrl}/rpc/get_order_today`,
    },
    posProducts: {
      localPath: '/api/kpi/pos-products',
      remoteEndpoint: '/pos_products?select=*&order=daily_revenue.desc',
      targetUrl: (baseUrl) => `${baseUrl}/pos_products?select=*&order=daily_revenue.desc`,
    },
  };
  ```

### D. Multi-Environment Profile Capability (`DEV` / `UAT` / `PRD`)
- Built environment profile switching logic in `src/lib/config.ts` supporting `DEV`, `UAT`, and `PRD`.
- Controlled via `NEXT_PUBLIC_APP_ENV=DEV|UAT|PRD` environment variable.

### E. Codebase Cleanliness & Documentation ([`README.md`](file:///home/student_03_a8cc42dc8126/ReactNextLab/README.md))
- Documented full codebase directory tree and architecture guidelines in [`README.md`](file:///home/student_03_a8cc42dc8126/ReactNextLab/README.md).

---

## 2. Key File Map

| File Path | Role & Description |
| :--- | :--- |
| [`.env`](file:///home/student_03_a8cc42dc8126/ReactNextLab/.env) | Active environment variables & cluster base URLs |
| [`.env.example`](file:///home/student_03_a8cc42dc8126/ReactNextLab/.env.example) | Environment template for deployment |
| [`src/lib/config.ts`](file:///home/student_03_a8cc42dc8126/ReactNextLab/src/lib/config.ts) | Centralized environment resolver (`DEV`/`UAT`/`PRD`) |
| [`src/lib/apiMap.ts`](file:///home/student_03_a8cc42dc8126/ReactNextLab/src/lib/apiMap.ts) | Central API mapping registry (`/api/*` → PostgREST/RPC) |
| [`src/app/api/get_order_today/route.ts`](file:///home/student_03_a8cc42dc8126/ReactNextLab/src/app/api/get_order_today/route.ts) | Route handler for `/api/get_order_today` |
| [`src/app/api/kpi/pos-products/route.ts`](file:///home/student_03_a8cc42dc8126/ReactNextLab/src/app/api/kpi/pos-products/route.ts) | Route handler for `/api/kpi/pos-products` |
| [`src/app/api/etl/jobs/route.ts`](file:///home/student_03_a8cc42dc8126/ReactNextLab/src/app/api/etl/jobs/route.ts) | Route handler for `/api/etl/jobs` |
| [`src/services/kpiService.ts`](file:///home/student_03_a8cc42dc8126/ReactNextLab/src/services/kpiService.ts) | Client POS service & PostgREST PostgreSQL DDL |
| [`src/services/etlService.ts`](file:///home/student_03_a8cc42dc8126/ReactNextLab/src/services/etlService.ts) | Client ETL service & Addax DDL |
| [`src/components/PosPerformancePage.tsx`](file:///home/student_03_a8cc42dc8126/ReactNextLab/src/components/PosPerformancePage.tsx) | POS Dashboard UI, Recharts & API Spec tab |

---

## 3. Verification & Operational Commands

### Live Development Execution
```bash
npm run dev
```

### Environment Overrides Example
```bash
# Run targeting UAT cluster
NEXT_PUBLIC_APP_ENV=UAT npm run dev

# Run targeting PRD cluster
NEXT_PUBLIC_APP_ENV=PRD npm run dev
```

### Production Build Verification
```bash
npm run build
```
*(Verified: Next.js 16 production build compiles with **0 errors**)*

### API Verification Commands
```bash
curl -s http://localhost:3000/api/get_order_today
curl -s http://localhost:3000/api/kpi/pos-products
```

---

## 4. Next Recommended Actions for Future Sessions
1. **Live PostgREST Integration**: Set `ENABLE_LIVE_POSTGREST=true` in `.env` when connecting to a real PostgreSQL container instance.
2. **AD / Local User Capacity Integration**: Finalize local user storage and Active Directory sync UI logic in `UserSettingsPage.tsx`.
