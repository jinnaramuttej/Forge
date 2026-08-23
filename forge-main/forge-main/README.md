# FORGE — Autonomous Operating System for High-Velocity Companies

> *"FORGE does the work. You stay in control."*

![FORGE Dashboard Preview](public/illustrations/dashboard-founder.png)

FORGE is a unified founder operating system that synchronizes Finance, Hiring, Legal, and Marketing into a single real-time company graph. Designed with human-in-the-loop governance, FORGE autonomously stages actions, reconciles ledgers, screens talent, and prepares contracts for one-click founder decision making.

---

## 🏛️ Core Workspaces & Capabilities

### 1. **Executive Overview**
- **Company Snapshot**: Live reconciled metrics (Cash balance, Net burn rate, Runway projection, Active headcount).
- **Attention Queue**: High-priority decisions awaiting founder sign-off across Legal, Hiring, and Marketing.
- **Operating Pulse**: Live chronological stream of autonomous agent actions.

### 2. **FORGE Command OS (`⌘K` / `Ctrl+K`)**
- Operating-system level command palette with 3-phase execution lifecycle:
  $$\text{INPUT} \longrightarrow \text{UNDERSTANDING} \longrightarrow \text{ACTION PREPARATION} \longrightarrow \text{RESULT}$$
- Real-time categorized search across `Pages`, `Documents`, `People`, `Campaigns`, and `Activities`.
- Direct contextual action deep links (`[Review document →]`, `[Open Finance →]`, `[Review candidates →]`, `[View Approvals →]`).

### 3. **Approvals & Governance**
- Human-in-the-loop decision queue for executive sign-off.
- Side-by-side inspection panel with contract previews, candidate scorecard synthesis, and legal guardrail audit checks.
- One-click approval and instruction-logged rejection flows.

### 4. **Finance & Runway Engine**
- Real-time runway calculations calibrated against bank feeds and Stripe receivables.
- Expense breakdown, monthly burn trajectory, and manual snapshot recalibration.

### 5. **Hiring Pipeline**
- 5-stage talent pipeline (`New Inbound` $\to$ `Technical Screening` $\to$ `Interview Loop` $\to$ `Final Deep Dive` $\to$ `Offer Staged`).
- Candidate evaluation briefs with match scoring, open-source portfolio audits, and compensation benchmarking.

### 6. **Legal & Compliance Vault**
- Delaware corporate bylaws and bilateral mutual NDA repository.
- Contract drafting with strict IP assignment covenants and zero-deviation guardrails.

### 7. **Marketing & Growth**
- Multi-channel launch campaign coordination (LinkedIn, Substack, Press Wires, Product Hunt).
- Editorial content drafting and embargo scheduling.

### 8. **Company Calendar**
- Clean monthly grid and mobile agenda views for candidate loops, Delaware filing deadlines, and product launch milestones.

### 9. **Live Activity Stream**
- Unified audit trail tracking every approval, candidate progression, contract execution, and ledger reconciliation.

### 10. **Profile & Settings**
- Founder identity management, startup incorporation credentials, notification routing, and workspace preferences.

---

## 🎨 Design Philosophy & Aesthetics

- **Typography**: Editorial contrast pairing **Fraunces** serif for headlines with **General Sans** for crisp operational density.
- **Color Palette**: Warm monochrome foundation (`#16130F`, `#FCFAF4`, `#F6F1E8`) with restrained functional department accents:
  - Finance: `#52735A`
  - Hiring: `#48647F`
  - Legal: `#C17F3E`
  - Marketing: `#B8461F`
- **Liquid Glass & Linework**: Selective backdrop blur (`backdrop-filter: blur(20px)`) and custom hand-drawn editorial linework illustrations.
- **Calm Software Principles**: No aggressive chatbot bubbles, glowing AI robot motifs, or artificial gradients.

---

## 🛠️ Architecture & Tech Stack

```
src/
├── components/
│   ├── dashboard/
│   │   ├── activity/        # Activity audit log & filtering
│   │   ├── approvals/       # Decision queue, review panel & audit
│   │   ├── calendar/        # Monthly grid, events & modals
│   │   ├── finance/         # Runway modeling & ledger
│   │   ├── hiring/          # Candidate pipeline & scorecards
│   │   ├── legal/           # Contract repository & clauses
│   │   ├── marketing/       # Campaigns & editorial drafts
│   │   ├── profile/         # Founder & workspace info
│   │   ├── settings/        # Preferences, security & notifications
│   │   ├── CommandModal.tsx # Global ⌘K Command OS Palette
│   │   ├── ForgeCommand.tsx # Natural language prompt bar
│   │   ├── OverviewView.tsx # Executive pulse & attention queue
│   │   ├── Sidebar.tsx      # Sticky navigation & badge counters
│   │   └── TopBar.tsx       # Search trigger & live notification bell
│   ├── LandingPage.tsx      # Editorial marketing surface
│   └── LoginModal.tsx       # One-click demo authentication
├── context/
│   └── ForgeContext.tsx     # Centralized typed state store & dispatches
├── services/
│   ├── commandService.ts    # Decoupled async command processing engine
│   ├── searchService.ts     # Categorized search & grouping
│   ├── mockData.ts          # Centralized mock entities
│   └── types.ts             # Service contracts & data models
└── types/
    └── forge.ts             # Shared application domain models
```

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + Custom CSS Design System
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Deployment**: Vercel

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/prashanthpoloju990-oss/forge.git
cd forge

# Install dependencies
npm install

# Start local development server
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

---

## 📄 License
MIT License. Built for high-velocity founders.
