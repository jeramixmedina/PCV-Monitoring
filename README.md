# Petty Cash Voucher Monitoring System

Offline-first Electron desktop app for managing petty cash vouchers with SQLite local storage.

## Phase 1 Scope
This commit includes project setup and modular folder structure only.

## Tech Stack
- Electron
- Vanilla JavaScript
- SQLite
- HTML/CSS

## Project Structure

```text
PCV-Monitoring/
├─ package.json
├─ .gitignore
├─ docs/
│  ├─ phases.md
│  └─ architecture.md
├─ src/
│  ├─ main/
│  │  ├─ main.js
│  │  ├─ preload.js
│  │  └─ db/
│  │     ├─ connection.js
│  │     ├─ schema.sql
│  │     └─ migrations/
│  ├─ renderer/
│  │  ├─ index.html
│  │  ├─ styles/
│  │  │  ├─ base.css
│  │  │  ├─ layout.css
│  │  │  └─ components.css
│  │  ├─ js/
│  │  │  ├─ app.js
│  │  │  ├─ router.js
│  │  │  ├─ state/
│  │  │  ├─ modules/
│  │  │  │  ├─ dashboard/
│  │  │  │  ├─ pcv-create/
│  │  │  │  ├─ pcv-records/
│  │  │  │  ├─ replenishment/
│  │  │  │  ├─ reports/
│  │  │  │  ├─ settings/
│  │  │  │  └─ printing/
│  │  │  └─ shared/
│  │  └─ assets/
│  │     ├─ icons/
│  │     └─ templates/
│  └─ shared/
│     ├─ constants/
│     ├─ utils/
│     └─ validators/
└─ scripts/
   ├─ backup.js
   └─ restore.js
```

## Getting Started (after next phases)
1. `npm install`
2. `npm run dev`

