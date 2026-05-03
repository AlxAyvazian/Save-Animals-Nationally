# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

### VoiceMap National: Animal Protection Portal (`artifacts/voicemap`)
- **Route**: `/` (root)
- **Type**: React + Vite, frontend-only (localStorage)
- **Design**: Kurzgesagt civic-tech — deep navy (#080c1a), purple (#970CDA), green (#47CC5E). NO RED anywhere.
- **Language**: Responsible — "alleged", "reported concern", "requires investigation"
- **Font**: Montserrat Black for headings; stat numbers use class `kz-stat-number`
- **localStorage keys**: `voicemap_concerns`, `voicemap_shelter_incidents`, `voicemap_escalation_chains`, `voicemap_agency_contacts`, `voicemap_evidence_vault`, `voicemap_action_plans`

### Pages (35 total)

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | home.tsx | Landing page: hero, workflow pipeline, new tools grid, feature cards |
| `/intake` | intake.tsx | Multi-step concern intake wizard |
| `/jurisdiction` | jurisdiction.tsx | Jurisdiction helper questionnaire |
| `/report-packet` | report-packet.tsx | Report packet generator |
| `/dashboard` | dashboard.tsx | National dashboard with Recharts |
| `/advocacy` | advocacy.tsx | Advocacy toolkit |
| `/resources` | resources.tsx | Resources & safety guide |
| `/shelter-tracker` | shelter-tracker.tsx | Shelter accountability tracker |
| `/stray-tools` | stray-tools.tsx | Stray & at-risk animal tools |
| `/usa-map` | usa-map.tsx | Interactive 50-state USA map |
| `/authority-directory` | authority-directory.tsx | Authority directory |
| `/emergency` | emergency.tsx | Emergency protocol |
| `/foia` | foia.tsx | FOIA request generator |
| `/escalation` | escalation.tsx | Escalation chain builder |
| `/witness-statement` | witness-statement.tsx | Witness statement builder |
| `/state-laws` | state-laws.tsx | 50-state law guide |
| `/legislators` | legislators.tsx | Legislative tracker + testimony generator |
| `/pattern-detector` | pattern-detector.tsx | Pattern detector (reads voicemap_concerns) |
| `/media-contacts` | media-contacts.tsx | 65-outlet media directory + tip email generator |
| `/agency-tracker` | agency-tracker.tsx | Agency response tracker, deadlines, Non-Response Record |
| `/evidence-vault` | evidence-vault.tsx | Evidence log, tags, Chain of Custody doc |
| `/case-summary` | case-summary.tsx | Case file generator (reads all 3 LS stores) |
| `/action-plan` | action-plan.tsx | Personalized day-by-day escalation plan |
| `/heat-emergency` | heat-emergency.tsx | Heat/cold animal emergency quick guide |
| `/national-resources` | national-resources.tsx | 31 resources across 7 categories |
| `/prosecution-guide` | prosecution-guide.tsx | Court & prosecution support guide |
| `/my-cases` | my-cases.tsx | My Cases Dashboard (reads all LS stores) |
| `/surrender-prevention` | surrender-prevention.tsx | Surrender prevention guide |
| `/pet-theft` | pet-theft.tsx | Pet theft & recovery guide |
| `/hoarding-response` | hoarding-response.tsx | Animal hoarding response guide |
| `/anonymous-tips` | anonymous-tips.tsx | Anonymous reporting safety guide |
| `/puppy-mill-guide` | puppy-mill-guide.tsx | USDA APHIS puppy mill complaint guide |
| `/social-campaign` | social-campaign.tsx | Social media campaign builder |
| `/vet-abuse-guide` | vet-abuse-guide.tsx | Veterinary injury evidence guide |
| `/dogfighting-guide` | dogfighting-guide.tsx | Dogfighting response guide |

### Key Components
- `AnimatedBackgroundOrbs` — fixed background gradient orbs
- `Navigation` — fixed nav with Emergency, Document, USA Map, Authorities, Tools dropdown (35 items)
- `PawPrintScatter` / `PawIcon` / `PawPrint` — decorative paw print elements

### Data Files
- `src/data/state-laws.ts` — StateLaw[] for all 50 states with contactUrl
- `src/data/media-contacts.ts` — 65 MediaContact records + STATE_NAMES map

### Navigation TOOLS_ITEMS (35 items)
Jurisdiction Helper, Document Evidence, Generate Reports, Dashboard, Advocacy Toolkit, Resources,
Shelter Accountability, Stray & At-Risk, USA Map, Authorities, Emergency, FOIA Generator,
Escalation Chain, Witness Statement, State Law Guide, Legislative Tracker, Pattern Detector,
Media Directory, Agency Tracker, Evidence Vault, Case Summary, Action Plan, Heat / Cold Emergency,
Resource Directory, Court & Prosecution, My Cases, Surrender Prevention, Pet Theft & Recovery,
Hoarding Response, Anonymous Reporting, Puppy Mill Complaints, Social Media Campaign,
Injury Evidence Guide, Dogfighting Response