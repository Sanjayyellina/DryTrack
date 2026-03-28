# DryTrack — Product Blueprint
## Next-Generation Grain Dryer Intelligence Platform

> Version 1.0 | 28 March 2026
> Author: Sanjay Yellina + Claude (Principal Product Architect)
> Status: Pre-build Design Phase

---

# PART 1: COMPETITIVE LANDSCAPE ANALYSIS

---

## 1.1 AGRIS (Cultura Technologies)

**What it is:** Full ERP for grain elevators — accounting, scale ticketing, contracts, settlements, position management.

**What it does well:**
- Gold standard for grain accounting and position management
- Deep USDA compliance (warehouse receipts, regulatory reporting)
- Mature truck scale integration (decades of refinement)
- Handles complex contract types — basis pricing, delayed pricing, hedge accounting
- End-to-end: scale ticket → settlement → accounting in one system

**Where it fails:**
- **UI is from 2005.** Dense data grids, toolbar-heavy Windows forms, tabbed dialogs. Training takes weeks.
- **Zero drying intelligence.** Tracks inventory but has no concept of moisture curves, airflow optimization, or drying recommendations.
- **No mobile/tablet.** Desktop-only. Operators can't use it at the bin site.
- **No offline capability.** Requires persistent server connection.
- **Pricing excludes small/mid operators.** $25K–$80K/year + implementation fees.
- **Vendor lock-in.** Data export is painful; switching costs are enormous.
- **No real-time anything.** Batch-processed, report-driven. You find problems after they happen, not while they're happening.

**Key insight:** AGRIS knows grain *accounting* deeply but knows nothing about grain *drying*.

---

## 1.2 Agvance (SSI — Software Solutions Integrated)

**What it is:** ERP platform for ag retailers, cooperatives, and grain elevators. Modules: grain, agronomy, energy, feed, accounting.

**What it does well:**
- Strong cross-module integration (grain + agronomy + energy + accounting share one database)
- Handles cooperative-specific needs: patronage, equity tracking, member settlements
- Solid scale interface integration
- Good contract management for grain merchandising

**Where it fails:**
- **Same legacy UI problem as AGRIS.** Windows desktop app, early-2000s aesthetic.
- **Learning curve is brutal.** Complex navigation, hundreds of screens. New hires need 2–4 weeks of training.
- **Slow modernization.** "Agvance Sky" (cloud version) has been in progress for years; migration is gradual and incomplete.
- **Not designed for drying.** Grain module focuses on buy/sell/store accounting — zero drying workflow support.
- **Support is hit-or-miss.** Slow turnaround reported by users.
- **Overkill for single-facility operations.** Built for multi-location cooperatives, not for a single dryer site.
- **No mobile.** No tablet. No offline.

**Key insight:** Agvance is an accounting system that happens to handle grain. It doesn't understand operations.

---

## 1.3 AgroLog (Supertech Agroline)

**What it is:** Grain storage monitoring system — temperature sensors, moisture sensors, automated fan control. Europe-focused.

**What it does well:**
- Proven sensor hardware — decades of field use, robust and reliable
- Automated aeration control (runs fans when ambient conditions favor drying) — genuinely saves energy and prevents spoilage
- Early hotspot detection via temperature trend alerts — has saved operators from massive grain losses
- Strong data logging for quality compliance and audit trails

**Where it fails:**
- **Hardware lock-in.** Proprietary sensors only. Can't integrate with third-party IoT.
- **Monitoring only — no operations.** Tracks temp and moisture but has no intake, dispatch, scheduling, or reporting workflow.
- **Desktop-first UI.** Functional but dated. Mobile was an afterthought.
- **No intelligence.** Shows data, doesn't make recommendations. "Your bin is 18% moisture" — but doesn't say "switch to down-air in 4 hours."
- **Expensive.** Sensor hardware + installation + annual license = thousands per facility before you even open the app.
- **European market focus.** Limited presence and support in US/India.

**Key insight:** AgroLog monitors grain. It doesn't manage grain operations or optimize drying.

---

## 1.4 Vertical Software (Grain Elevator Management)

**What it is:** ERP for grain elevators and merchandisers — scale ticketing, grain accounting, contracts, settlements, position management.

**What it does well:**
- Best-in-class grain position tracking — long/short positions, P&L by commodity
- Strong USDA compliance (warehouse licensing, official grade tracking)
- Multi-location support with centralized reporting
- Tight scale integration for automated ticketing

**Where it fails:**
- **Identical to AGRIS/Agvance in its weaknesses.** Legacy Windows app. Dense screens. Steep learning curve.
- **Zero drying capability.** Strong on accounting, nonexistent on physical bin management.
- **Custom reporting is hard.** Built-in reports are rigid; customization requires vendor involvement.
- **Not for small operators.** Designed for mid-to-large commercial operations.
- **No mobile, no offline, no real-time.**

**Key insight:** Every major competitor is an *accounting system that touches grain*. None are an *operations system that optimizes drying*.

---

## 1.5 Competitive Gap Summary

| Capability | AGRIS | Agvance | AgroLog | Vertical | **DryTrack** |
|---|---|---|---|---|---|
| Grain accounting | +++++ | +++++ | — | +++++ | ++ |
| Scale integration | ++++ | ++++ | — | ++++ | ++ |
| Drying workflow | — | — | + | — | **+++++** |
| Moisture prediction | — | — | — | — | **+++++** |
| Real-time alerts | — | — | ++ | — | **+++++** |
| Mobile/tablet | — | — | + | — | **+++++** |
| Offline mode | — | — | + | — | **+++++** |
| Modern UI | — | — | + | — | **+++++** |
| Energy optimization | — | — | ++ | — | **+++++** |
| Multi-tenant SAAS | — | — | — | — | **+++++** |
| Price accessibility | — | — | ++ | — | **+++++** |
| Operator-friendly | — | + | ++ | — | **+++++** |

**The gap is massive.** No one is building an operator-first, intelligence-driven drying platform.

---

# PART 2: DESIGN IMPROVEMENT FRAMEWORK

---

## 2.1 What to KEEP from existing tools

| From | Keep |
|---|---|
| AGRIS/Agvance | Grain accounting concepts: contracts, settlements, position tracking |
| AGRIS/Vertical | Scale integration architecture (API-based, hardware-agnostic) |
| AgroLog | Sensor-driven monitoring model; automated aeration logic |
| All | Multi-location/multi-site management capability |
| All | Regulatory compliance awareness (USDA grades, warehouse requirements) |

## 2.2 What to REMOVE

- Dense data grids as primary interface (replace with cards + actions)
- Desktop-only architecture (kill it completely)
- Proprietary hardware lock-in (support any sensor via standard protocols)
- Batch-processed reporting (replace with real-time)
- Multi-week training requirement (if it needs training, it's designed wrong)
- ERP-style module menus with 50+ navigation items

## 2.3 What to IMPROVE

| Current State | Improved State |
|---|---|
| Manual moisture checks every few hours | Continuous monitoring with predicted completion time |
| Paper-based intake logs | One-tap intake with photo capture + OCR |
| Manual airflow switching decisions | AI-recommended switch times based on moisture curve |
| After-the-fact reporting | Real-time dashboard with live KPIs |
| Complex settlement workflows | Auto-generated receipts with one-click dispatch |
| Static bin status display | Dynamic bin cards with progress bars and countdown timers |

## 2.4 What to ADD (new capabilities)

| Capability | Why it matters |
|---|---|
| **Drying curve prediction** | "BIN-3 will reach 14% in 6.2 hours" — operators stop guessing |
| **Energy cost tracking** | Real-time cost per ton dried — managers see money in/out |
| **Automated alerts** | Push notification: "BIN-7 at target moisture — ready for dispatch" |
| **Weather-integrated drying** | Adjust recommendations based on ambient temp/humidity forecast |
| **Truck queue management** | During harvest: queue trucks, estimate wait times, reduce chaos |
| **Quality grading** | Auto-calculate USDA grade from moisture, test weight, damage % |
| **Photo documentation** | Attach photos to intakes, maintenance, quality issues |
| **WhatsApp/SMS receipts** | Send dispatch receipt to buyer's phone instantly |
| **Voice input** | "Log intake, truck KA-12-3456, 22 tons, moisture 18" — hands-free at scale |
| **Predictive maintenance** | "Fan #3 has run 2,400 hours — schedule service" |
| **Benchmarking** | "Your drying efficiency is top 20% of facilities your size" (SAAS data) |

---

# PART 3: COMPLETE PRODUCT DESIGN

---

## 3A: CORE MODULES

---

### MODULE 1: INTAKE & WEIGHING

**Purpose:** Log incoming grain loads. Capture every data point in under 60 seconds.

**Step-by-step workflow:**
1. Truck arrives → operator taps **"New Intake"**
2. **Scan/enter vehicle number** (camera OCR or manual entry)
3. **Weigh truck** (manual entry or auto-read from connected scale)
4. **Probe moisture** (enter reading from moisture meter, or auto-read from Dickey-John/Perten)
5. **Enter commodity details** — hybrid/variety, farmer name, challan number
6. **System auto-recommends chamber** based on: moisture level, current chamber loads, hybrid match
7. Operator confirms or overrides allocation
8. **System calculates:** net weight, moisture discount, expected dry weight
9. One-tap **"Confirm Intake"** — ticket generated, SMS sent to farmer
10. Truck proceeds to dump pit

**UI Layout:**
```
┌──────────────────────────────────────────────────┐
│  NEW INTAKE                           Step 2 of 4│
│                                                   │
│  ┌─────────────────────────────────────────────┐ │
│  │  📷  Scan Vehicle Number                    │ │
│  │  ─────────────────────                      │ │
│  │  KA-12-AB-3456          ✓ Recognized        │ │
│  └─────────────────────────────────────────────┘ │
│                                                   │
│  Farmer: [Auto-filled from last visit          ] │
│  Hybrid: [Dropdown — top 5 shown first         ] │
│  Challan: [________________]  📷 Photo          │
│                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │Gross Wt  │  │Tare Wt   │  │ Net: 22.4 T  │  │
│  │ 34.2 T   │  │ 11.8 T   │  │ (auto-calc)  │  │
│  └──────────┘  └──────────┘  └──────────────┘  │
│                                                   │
│  Moisture: 18.2%    Test Wt: 56 lb/bu             │
│                                                   │
│  ┌─────────────────────────────────────────────┐ │
│  │  RECOMMENDED: Chamber 7 (same hybrid,       │ │
│  │  current load: 60%, moisture match: 17.8%)  │ │
│  │  [ Accept ]  [ Choose Different ]           │ │
│  └─────────────────────────────────────────────┘ │
│                                                   │
│        [ ← Back ]          [ Confirm Intake → ]  │
└──────────────────────────────────────────────────┘
```

**Data captured:** vehicle_number, farmer_name, farmer_phone, challan_number, challan_photo, commodity, hybrid, gross_weight, tare_weight, net_weight, moisture_in, test_weight, damage_pct, chamber_allocated, timestamp, operator_id

**Automation opportunities:**
- OCR vehicle plate scanning (camera → number)
- Auto-fill returning vehicles/farmers from history
- Scale API integration (auto-read weight)
- Moisture meter API integration (auto-read moisture)
- Smart chamber recommendation (algorithm)
- Auto-SMS intake ticket to farmer

---

### MODULE 2: MOISTURE TESTING

**Purpose:** Track moisture readings across all chambers. Show progress toward target.

**Step-by-step workflow:**
1. Operator opens **"Moisture Round"** (single button)
2. System shows all active chambers in a grid
3. For each chamber, operator enters current moisture reading
4. System auto-calculates: moisture drop rate, estimated time to target, trend direction
5. System flags anomalies: stalled drying, uneven readings, approaching target
6. One-tap **"Save Round"** — all readings saved with timestamp
7. Drying curve chart updates in real-time

**UI Layout:**
```
┌──────────────────────────────────────────────────┐
│  MOISTURE ROUND               Today 14:30        │
│  Last round: 2 hours ago                         │
│                                                   │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐            │
│  │ CH-1    │ │ CH-2    │ │ CH-3    │ ...         │
│  │ 16.2%   │ │ 14.1%   │ │ 18.8%   │            │
│  │ ▼ 0.3/h │ │ ✅ READY │ │ ▼ 0.2/h │            │
│  │ ~6h left│ │         │ │ ~22h    │            │
│  │ [____]  │ │ [____]  │ │ [____]  │            │
│  └─────────┘ └─────────┘ └─────────┘            │
│                                                   │
│  ⚠️ CH-5: Drying stalled (0.0/h for 4 hours)    │
│  ✅ CH-2: Target reached — ready for dispatch     │
│                                                   │
│              [ Save All Readings ]                │
└──────────────────────────────────────────────────┘
```

**Data captured:** chamber_id, moisture_reading, ambient_temp, ambient_humidity, airflow_direction, fan_status, timestamp, operator_id

**Automation opportunities:**
- Wireless moisture sensor integration (auto-read, no manual entry)
- Moisture drop rate calculation (rolling average)
- Time-to-target prediction (linear + weighted model)
- Stalled-drying detection (alert if rate < 0.05%/hour for 3+ hours)
- Weather API integration (factor ambient humidity into prediction)

---

### MODULE 3: CHAMBER ALLOCATION

**Purpose:** Visual overview of all chambers. Smart allocation for new loads.

**Step-by-step workflow:**
1. Dashboard shows all chambers as **visual tiles** with color-coded status
2. Tapping a chamber opens detail card: current hybrid, load weight, moisture, days in drying, airflow direction
3. **Allocation rules engine** prevents mixing hybrids in same chamber (unless operator overrides with reason)
4. System suggests optimal chamber based on: current fill level, moisture compatibility, hybrid match, proximity to target

**UI Layout:**
```
┌──────────────────────────────────────────────────┐
│  CHAMBER MAP                                      │
│                                                   │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐             │
│  │ 1  │ │ 2  │ │ 3  │ │ 4  │ │ 5  │             │
│  │🟡  │ │🟢  │ │🟠  │ │⚪  │ │🔴  │             │
│  │82% │ │RDY │ │45% │ │MTY │ │!!  │             │
│  │16% │ │14% │ │19% │ │    │ │STL │             │
│  └────┘ └────┘ └────┘ └────┘ └────┘             │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐             │
│  │ 6  │ │ 7  │ │ 8  │ │ 9  │ │ 10 │             │
│  │🟡  │ │🟡  │ │🟢  │ │⚪  │ │🟡  │             │
│  │70% │ │55% │ │RDY │ │MTY │ │90% │             │
│  │17% │ │16% │ │13% │ │    │ │15% │             │
│  └────┘ └────┘ └────┘ └────┘ └────┘             │
│                                                   │
│  Legend: 🟡 Drying  🟢 Ready  🟠 Intake          │
│          ⚪ Empty   🔴 Alert                      │
│                                                   │
│  Top %: fill level  Bottom %: current moisture    │
└──────────────────────────────────────────────────┘
```

**Data captured:** chamber_id, status, hybrid, total_capacity, current_load, moisture_current, target_moisture, intake_date, days_in_drying, airflow_direction, fan_on

**Automation opportunities:**
- Auto-suggest best chamber for new intake (scoring algorithm)
- Prevent hybrid mixing (hard rule with override audit log)
- "Express empty" flow — one-tap to mark chamber empty + trigger bin history snapshot
- Color + progress bar system eliminates need to read numbers

---

### MODULE 4: DRYING CYCLE MANAGEMENT

**Purpose:** Track and optimize each chamber's drying cycle from intake to target moisture.

**Step-by-step workflow:**
1. Cycle begins automatically when intake is confirmed
2. System tracks: start moisture, current moisture, moisture per hour drop rate, airflow direction + switches, fan runtime hours
3. **Airflow recommendations** appear as action cards:
   - "Switch CH-3 to down-air — top layer at 15%, bottom still at 18%"
   - "Reduce heat on CH-7 — approaching target, risk of over-drying"
4. Operator taps to confirm airflow switch → logged with timestamp
5. When chamber reaches target moisture → notification + status change to "Ready"
6. Operator dispatches or moves to holding storage

**UI Layout (Chamber Detail):**
```
┌──────────────────────────────────────────────────┐
│  ← CHAMBER 3                      Day 4 of ~6    │
│                                                   │
│  Hybrid: DKC 67-44        Load: 38.2 T           │
│  Farmer: Rajesh Kumar     Intake: 24 Mar          │
│                                                   │
│  ┌─────────────────────────────────────────────┐ │
│  │  MOISTURE CURVE                              │ │
│  │  22% ┐                                       │ │
│  │      │╲                                      │ │
│  │  18% │  ╲                                    │ │
│  │      │    ╲                                  │ │
│  │  14% │─ ─ ─╲─ ─ ─ ─ ─ ─ TARGET ─ ─ ─ ─ ── │ │
│  │      │      ╲  (predicted)                   │ │
│  │  10% │       ╲                               │ │
│  │      └──┬──┬──┬──┬──┬──┬──┬──               │ │
│  │        D1 D2 D3 D4 D5 D6 D7                 │ │
│  └─────────────────────────────────────────────┘ │
│                                                   │
│  Current: 16.2%  │  Target: 14.0%                │
│  Rate: -0.31%/hr │  ETA: ~6.5 hours              │
│  Airflow: UP-AIR │  Fan: ON (82 hrs total)       │
│                                                   │
│  ┌─────────────────────────────────────────────┐ │
│  │  ⚡ RECOMMENDATION                          │ │
│  │  Switch to DOWN-AIR in ~2 hours.            │ │
│  │  Top layer approaching target faster than    │ │
│  │  bottom. Down-air will equalize.            │ │
│  │                                              │ │
│  │  [ Switch Now ]  [ Remind Me Later ]         │ │
│  └─────────────────────────────────────────────┘ │
│                                                   │
│  [ Log Moisture ]  [ Switch Airflow ]  [ Empty ] │
└──────────────────────────────────────────────────┘
```

**Data captured:** chamber_id, moisture_readings[] (time series), airflow_switches[] (timestamps + direction), fan_runtime_hours, ambient_conditions[], energy_consumed, operator_actions[]

**Automation opportunities:**
- Drying curve prediction (ML model trained on historical data)
- Airflow switch recommendations based on moisture gradient
- Over-drying prevention alerts
- Energy usage tracking per chamber per cycle
- Auto-close cycle when target moisture reached

---

### MODULE 5: OUTPUT & DISPATCH

**Purpose:** Weigh, grade, and dispatch dried grain. Generate receipt. Track buyer.

**Step-by-step workflow:**
1. Chamber marked "Ready" → appears in **Dispatch Queue**
2. Operator taps "Create Dispatch" → selects chamber(s)
3. Enter: buyer name, vehicle number, destination
4. System auto-fills: hybrid, dry weight, moisture out, quality grade
5. Weigh outbound truck (manual or scale API)
6. System calculates: shrink (weight loss from drying), yield %, cost per ton
7. **Generate receipt** with QR code (verifiable, tamper-evident)
8. One-tap send via WhatsApp/SMS to buyer
9. Chamber auto-transitions to "Empty" → bin history snapshot saved

**UI Layout:**
```
┌──────────────────────────────────────────────────┐
│  NEW DISPATCH                                     │
│                                                   │
│  From: Chamber 2 (Ready — 14.0%)                 │
│  Hybrid: DKC 67-44                               │
│                                                   │
│  Buyer: [Dropdown + search________________]      │
│  Vehicle: [KA-12-______]  📷 Scan                 │
│  Destination: [________________________]          │
│                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │Intake Wt │  │Dispatch  │  │ Shrink       │  │
│  │ 42.0 T   │  │ 38.2 T   │  │ 9.0%         │  │
│  │ (wet)    │  │ (dry)    │  │ (3.8T water) │  │
│  └──────────┘  └──────────┘  └──────────────┘  │
│                                                   │
│  Moisture: 22% → 14%  (8 points removed)         │
│  Grade: US No. 2 (auto-calculated)               │
│  Drying cost: ₹1,240 / $15.20 per ton           │
│                                                   │
│  Receipt ID: DT-2026-003421                      │
│                                                   │
│  [ Cancel ]     [ Generate Receipt & Dispatch → ]│
└──────────────────────────────────────────────────┘
```

**Data captured:** dispatch_id, receipt_id, chamber_ids, buyer_name, buyer_phone, vehicle_number, destination, weight_out, moisture_out, grade, shrink_pct, shrink_weight, drying_cost, qr_hash, timestamp, operator_id

**Automation opportunities:**
- Auto-calculate shrink from intake vs dispatch weights
- Auto-grade using USDA standards (moisture, test weight, damage)
- QR code receipt with tamper-evident hash
- WhatsApp Business API integration for instant receipt delivery
- Buyer auto-complete from history

---

### MODULE 6: REPORTING & ANALYTICS

**Purpose:** Real-time operational intelligence. Not just historical reports — actionable insights.

**Reports:**
1. **Daily Operations Summary** — intakes today, dispatches today, chambers active, total throughput
2. **Drying Efficiency Report** — avg hours per chamber, energy per ton, shrink by hybrid
3. **Capacity Utilization** — % chambers in use over time, bottleneck identification
4. **Moisture Trend Analysis** — drying curves across chambers, hybrid comparison
5. **Financial Summary** — revenue, drying costs, margin per ton, pending payments
6. **Quality Report** — grade distribution, average moisture out, damage rates
7. **Operator Performance** — intakes processed per operator, response time to alerts
8. **Seasonal Summary** — total throughput, best/worst performing hybrids, YoY comparison

**Automation opportunities:**
- Auto-generated daily email/WhatsApp to facility manager
- Benchmark against other facilities (SAAS aggregate data)
- Export to Excel, PDF, or accounting software (Tally integration for India)
- Anomaly detection: "Drying efficiency dropped 15% this week vs last"

---

## 3B: INTELLIGENCE LAYER (KEY DIFFERENTIATOR)

This is what makes DryTrack a **10x product**, not a CRUD app.

---

### B1: Drying Curve Prediction Engine

**What it does:** Predicts when each chamber will reach target moisture.

**Inputs:**
- Historical moisture readings for this chamber (time series)
- Current moisture reading
- Ambient temperature and humidity (weather API or manual)
- Airflow direction and fan status
- Hybrid type (different hybrids dry at different rates)
- Chamber fill level (fuller chambers dry slower)
- Season / time of year

**Model (Phase 1 — Rule-based):**
```
moisture_drop_rate = avg(last_3_readings_delta) / time_between_readings
hours_remaining = (current_moisture - target_moisture) / moisture_drop_rate
confidence = based on variance in drop rate
```

**Model (Phase 2 — ML):**
```
Train gradient boosted model on historical drying data:
  Features: hybrid, initial_moisture, ambient_temp, ambient_humidity,
            airflow_direction, fill_level, chamber_position, season
  Target: hours_to_target
```

**Output:**
- "Chamber 3: 16.2% → 14.0% | ETA: 6.5 hours | Confidence: High"
- Displayed as countdown timer on chamber card
- Chart shows actual vs predicted curve

**User interaction:**
- Passive — prediction shown automatically on every chamber card
- Operator can tap to see full drying curve chart
- Manager can see facility-wide "completion forecast" — all chambers on one timeline

---

### B2: Airflow Switch Recommender

**What it does:** Tells operator when to switch between up-air and down-air.

**Logic:**
- Track moisture at different sampling points (top, middle, bottom of chamber)
- If top-bottom moisture differential > 2%: recommend switch
- If chamber is within 2% of target: recommend reducing heat or switching to ambient air
- Factor in ambient humidity: don't recommend ambient air if humidity > 80%

**Output:**
- Action card on chamber detail: "Switch to DOWN-AIR — top layer drying faster than bottom"
- Push notification to operator's device
- Logged with timestamp when operator confirms the switch

---

### B3: Alert System

| Alert | Trigger | Severity | Action |
|---|---|---|---|
| Target Reached | Moisture ≤ target | Info (green) | "Chamber 2 ready — create dispatch?" |
| Stalled Drying | Drop rate < 0.05%/hr for 3+ hours | Warning (amber) | "Check fan, airflow direction, or heating element" |
| Over-Drying Risk | Moisture < target - 1% | Critical (red) | "Chamber 5 at 12.8% — over-dried. Dispatch immediately" |
| Uneven Drying | Top-bottom differential > 3% | Warning (amber) | "Switch airflow direction" |
| High Ambient Humidity | Humidity > 85% | Info (blue) | "Natural drying ineffective — switch to heated air" |
| Fan Runtime High | Fan hours > threshold | Maintenance (purple) | "Fan #3: 2,400 hours — schedule service" |
| Chamber Overdue | Days in drying > 2x expected | Warning (amber) | "Chamber 9: day 14, expected 7 — investigate" |

**Delivery:** In-app notification bell + push notification + optional WhatsApp/SMS

---

### B4: Energy Optimization

**What it does:** Tracks and minimizes energy consumption per ton dried.

**Inputs:**
- Fan runtime hours per chamber
- Heating fuel consumed (propane/gas/electric — manual or meter-connected)
- Ambient temperature (weather API)
- Throughput (tons dried)

**Outputs:**
- Cost per ton dried (₹ or $)
- Cost per point of moisture removed
- "Use natural air for next 6 hours — ambient conditions favorable, save ₹X"
- Seasonal energy report: total fuel, total electricity, efficiency trends
- Benchmark: "Your facility: ₹180/ton. Regional average: ₹220/ton"

---

## 3C: UI/UX DESIGN

---

### Design Philosophy: "Stripe meets Tesla for the farm"

- **Clean, not busy.** White space is not wasted space.
- **Action-first.** Every screen answers "what should I do next?"
- **Touch-optimized.** 48px minimum tap targets. Works with gloves.
- **Glanceable.** Status visible in 2 seconds. Details on tap.
- **Dark mode for night shifts.** Auto-switch based on time.

---

### Color System

| Token | Color | Usage |
|---|---|---|
| `--primary` | `#2563EB` (Blue-600) | Primary actions, links, active states |
| `--primary-dark` | `#1D4ED8` | Hover states |
| `--success` | `#16A34A` (Green-600) | Ready status, positive metrics |
| `--warning` | `#F59E0B` (Amber-500) | Drying status, caution alerts |
| `--danger` | `#DC2626` (Red-600) | Critical alerts, over-drying |
| `--info` | `#0EA5E9` (Sky-500) | Intake status, informational |
| `--neutral-50` | `#F8FAFC` | Page background |
| `--neutral-100` | `#F1F5F9` | Card background |
| `--neutral-900` | `#0F172A` | Primary text |
| `--neutral-500` | `#64748B` | Secondary text |
| `--brand` | `#F59E0B` (Amber-500) | DryTrack brand accent |

**Dark mode:** Invert surfaces (`--neutral-900` as background, `--neutral-50` as text). Keep status colors the same for consistency.

---

### Typography

| Element | Font | Size | Weight |
|---|---|---|---|
| Page title | Inter | 24px / 1.5rem | 700 (Bold) |
| Section header | Inter | 18px / 1.125rem | 600 (Semibold) |
| Card title | Inter | 16px / 1rem | 600 |
| Body text | Inter | 14px / 0.875rem | 400 (Regular) |
| Small/caption | Inter | 12px / 0.75rem | 500 (Medium) |
| Numbers/data | JetBrains Mono | 20px / 1.25rem | 700 |
| KPI large | JetBrains Mono | 32px / 2rem | 800 |

**Why Inter:** Excellent readability at all sizes. Wide language support (Hindi, Telugu, English). Free.
**Why JetBrains Mono for data:** Tabular figures (numbers align), highly legible for moisture readings and weights.

---

### Screen-by-Screen Navigation

```
┌─────────────────────────────────────────────┐
│  TOPBAR                                      │
│  [☰] DryTrack    [🔔 3] [🌐 EN] [👤 SY]   │
├────────┬────────────────────────────────────┤
│SIDEBAR │  PAGE CONTENT                      │
│        │                                     │
│ ◉ Home │  (varies by page)                  │
│ ○ Intake│                                    │
│ ○ Chambers│                                  │
│ ○ Dispatch│                                  │
│ ○ Reports│                                   │
│        │                                     │
│ ─────  │                                     │
│ ○ Maint│                                     │
│ ○ Labor│                                     │
│ ○ Settings│                                  │
│        │                                     │
│ [Sign Out]                                   │
└────────┴────────────────────────────────────┘
```

**Screens:**

1. **Home (Dashboard)**
   - Greeting + facility name
   - 5 KPI cards (Total Intake, Active Chambers, Ready to Dispatch, Dispatched Today, Avg Moisture)
   - Chamber grid (color-coded tiles)
   - Action feed: "What needs attention" (alerts, ready chambers, stalled drying)
   - Today's activity log

2. **Intake Register**
   - Table of recent intakes (searchable, filterable)
   - "New Intake" wizard (4 steps, as described in Module 1)
   - Intake detail card (tap to expand)

3. **Chambers (Bin Monitor)**
   - Full chamber grid with moisture, fill %, countdown
   - "Moisture Round" mode (batch entry)
   - Chamber detail view with drying curve chart
   - Airflow switch log

4. **Dispatch**
   - Dispatch queue (chambers ready)
   - "New Dispatch" form
   - Receipt preview + QR code
   - Send via WhatsApp button

5. **Reports**
   - Daily summary (auto-generated)
   - Drying efficiency chart
   - Capacity utilization timeline
   - Financial summary
   - Export buttons (Excel, PDF)

6. **Maintenance**
   - Log list with status badges (Open / In Progress / Done)
   - New maintenance entry form
   - Equipment list with runtime hours

7. **Labor & Shifts**
   - Shift calendar view
   - Log entry: worker name, role, hours, notes
   - Weekly/monthly summary

8. **Settings**
   - Company profile (name, logo, brand color)
   - Chamber configuration (count, names, capacity)
   - Target moisture settings per commodity
   - User management (invite, roles: admin/manager/operator)
   - Notification preferences
   - Language selection
   - Subscription & billing

---

### Mobile vs Tablet vs Desktop

| Viewport | Layout | Primary use |
|---|---|---|
| **Mobile** (< 640px) | Bottom tab nav, stacked cards, full-width forms | Operator in the field — quick moisture entry, check alerts |
| **Tablet** (640–1024px) | Sidebar collapsed to icons, 2-column grid | Operator at scale — intake form, chamber overview |
| **Desktop** (> 1024px) | Full sidebar, 3–5 column grid, side-by-side panels | Manager — reports, analytics, settings |

**Mobile-specific features:**
- Swipe between chambers (left/right)
- Pull-to-refresh
- Floating action button for "New Intake" and "Log Moisture"
- Camera integration for challan photo + vehicle OCR

---

### Offline Mode

| State | Behavior |
|---|---|
| **Online** | All reads/writes go to Supabase. Real-time subscriptions active. |
| **Offline detected** | Amber banner: "You're offline — changes will sync when connected" |
| **Writes while offline** | Queued in IndexedDB (not localStorage — better for structured data) |
| **Back online** | Auto-sync queue. Toast: "12 entries synced successfully" |
| **Conflict resolution** | Last-write-wins for simple fields. Flag conflicts for manager review on critical data (weights, moisture). |

**IndexedDB queue schema:**
```
{
  id: uuid,
  table: "intakes" | "moisture_readings" | "dispatches" | ...,
  operation: "INSERT" | "UPDATE",
  payload: { ... },
  created_at: timestamp,
  synced: false,
  retry_count: 0
}
```

---

## 3D: WORKFLOW OPTIMIZATION

---

### Intake Process

| Step | Current (Manual) | DryTrack |
|---|---|---|
| Record vehicle number | Write on paper | Camera OCR or 1 field |
| Weigh truck | Read scale, write on paper | Auto-read from scale API |
| Test moisture | Read meter, write on paper | Enter 1 number (or auto-read) |
| Decide which chamber | Ask supervisor, check paper log | System auto-recommends |
| Record intake | Fill paper register | Auto-generated from form |
| Notify farmer | Verbal / phone call | Auto-SMS with ticket |
| **Total time** | **8–12 minutes** | **60–90 seconds** |
| **Steps** | **8–10 manual steps** | **4 taps** |

---

### Moisture Monitoring (20 chambers)

| Step | Current (Manual) | DryTrack |
|---|---|---|
| Check each chamber | Walk to each, read meter, write on paper | Open "Moisture Round", enter 20 numbers |
| Calculate drop rate | Mental math or not done | Auto-calculated per chamber |
| Decide airflow switch | Experience / guesswork | AI recommendation with reasoning |
| Record readings | Paper log | Auto-saved with timestamp |
| Alert manager when ready | Phone call | Auto push notification |
| **Total time** | **45–60 minutes** | **5–10 minutes** |

---

### Dispatch Process

| Step | Current (Manual) | DryTrack |
|---|---|---|
| Identify ready chambers | Check paper logs | Filtered "Ready" queue |
| Create dispatch | Handwritten receipt | 3-field form, auto-filled |
| Calculate shrink | Manual calculator | Auto-calculated |
| Generate receipt | Carbon copy book | Digital receipt + QR code |
| Send to buyer | Physical copy only | WhatsApp + printed copy |
| Update chamber status | Erase whiteboard | Auto-transitions to "Empty" |
| **Total time** | **15–20 minutes** | **2–3 minutes** |

---

## 3E: SYSTEM ARCHITECTURE

```
┌─────────────────────────────────────────────────┐
│                    CLIENTS                       │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌───────────┐  │
│  │Mobile│  │Tablet│  │Desktop│  │ PWA (iOS) │  │
│  │ React│  │ React│  │ React │  │  React    │  │
│  └──┬───┘  └──┬───┘  └──┬───┘  └─────┬─────┘  │
│     └──────────┴─────────┴────────────┘         │
│                    │                             │
│            Next.js App Router                    │
│            (Server Components +                  │
│             Server Actions +                     │
│             API Routes)                          │
│                    │                             │
├────────────────────┼────────────────────────────┤
│               SUPABASE                           │
│  ┌─────────┐ ┌────────┐ ┌──────────┐           │
│  │  Auth   │ │Postgres│ │ Realtime │           │
│  │(email/  │ │  + RLS │ │(websocket│           │
│  │ magic   │ │        │ │ subscr.) │           │
│  │ link)   │ │        │ │          │           │
│  └─────────┘ └────────┘ └──────────┘           │
│  ┌─────────┐ ┌────────┐ ┌──────────┐           │
│  │ Storage │ │  Edge  │ │  Cron    │           │
│  │ (photos,│ │Functions│ │ (daily   │           │
│  │  logos) │ │(webhooks│ │  reports,│           │
│  │         │ │ alerts)│ │  alerts) │           │
│  └─────────┘ └────────┘ └──────────┘           │
│                                                  │
├──────────────────────────────────────────────────┤
│              EXTERNAL SERVICES                   │
│  ┌──────────┐ ┌──────────┐ ┌───────────────┐   │
│  │ Weather  │ │ Razorpay │ │   WhatsApp    │   │
│  │ API      │ │ (billing)│ │   Business    │   │
│  │(OpenWeather│ │          │ │   API         │   │
│  │  /IMD)   │ │          │ │               │   │
│  └──────────┘ └──────────┘ └───────────────┘   │
│                                                  │
├──────────────────────────────────────────────────┤
│              OPTIONAL IoT LAYER                  │
│  ┌──────────────────────────────────────┐       │
│  │  Sensor Gateway (MQTT / HTTP)        │       │
│  │  → Temperature cables                │       │
│  │  → Moisture sensors                  │       │
│  │  → Scale API                         │       │
│  │  → Fan status (on/off)               │       │
│  │                                       │       │
│  │  Supabase Edge Function receives      │       │
│  │  sensor data → INSERT into            │       │
│  │  moisture_readings / sensor_data      │       │
│  └──────────────────────────────────────┘       │
└──────────────────────────────────────────────────┘
```

### Tech Stack Decision Record

| Layer | Choice | Why |
|---|---|---|
| **Framework** | Next.js 16 (App Router) | SSR for fast first paint, server actions for forms, API routes for webhooks, RSC for data fetching |
| **Language** | TypeScript | Type safety across 12+ tables, prevents the `state.bins[id-1]` class of bugs |
| **Styling** | Tailwind CSS | Utility-first, design tokens via config, dark mode built-in, fast iteration |
| **Database** | Supabase (PostgreSQL) | RLS for multi-tenancy, realtime subscriptions, auth, storage, edge functions — all-in-one |
| **Auth** | Supabase Auth | Email/password + magic link, SSO ready for enterprise tier |
| **State (client)** | Zustand or React Context | Lightweight, no Redux complexity, works with server components |
| **Charts** | Recharts or Tremor | Drying curves, analytics, built for React |
| **Offline** | IndexedDB (via Dexie.js) + Service Worker | Structured queue, survives browser close, better than localStorage |
| **Hosting** | Vercel | Auto-deploy from GitHub, edge network, custom domains per tenant |
| **Payments** | Razorpay (India) / Stripe (US) | Regional payment support |
| **Notifications** | WhatsApp Business API + Web Push | Operators don't check email — they check WhatsApp |

### Database Architecture (Multi-Tenant)

```sql
-- Tenant isolation function (used by all RLS policies)
CREATE FUNCTION get_user_company_id()
RETURNS UUID AS $$
  SELECT company_id FROM company_users
  WHERE user_id = auth.uid()
  LIMIT 1
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Example RLS policy (applied to every table)
CREATE POLICY "Tenant isolation" ON bins
  FOR ALL
  USING (company_id = get_user_company_id())
  WITH CHECK (company_id = get_user_company_id());
```

Every table has `company_id`. Every query is automatically filtered. Impossible for Company A to see Company B's data.

---

## 3F: MVP ROADMAP

---

### Phase 1: Core Operations (Months 1–3)

**Goal:** Replace paper logs completely. Match V1 functionality with better architecture.

| Feature | Priority |
|---|---|
| Auth (login, signup, magic link) | P0 |
| Onboarding (company setup, chamber config) | P0 |
| Dashboard (KPIs, chamber grid) | P0 |
| Intake Register (log loads, allocate chambers) | P0 |
| Chamber Monitor (moisture entry, status management) | P0 |
| Dispatch (receipt generation, QR code) | P0 |
| Offline mode (IndexedDB queue, auto-sync) | P0 |
| Basic reporting (daily summary, export to Excel) | P1 |
| Multi-language (English, Hindi, Telugu) | P1 |
| PWA (installable, works from home screen) | P1 |

**Milestone:** Yellina Seeds fully operational on DryTrack V2.

---

### Phase 2: Intelligence + Alerts (Months 4–6)

**Goal:** Make the system smarter than any human operator.

| Feature | Priority |
|---|---|
| Moisture history tracking (time series per chamber) | P0 |
| Drying curve chart per chamber | P0 |
| Moisture drop rate calculation | P0 |
| Time-to-target prediction (rule-based) | P0 |
| Alert system (target reached, stalled, over-drying) | P0 |
| Airflow switch recommendations | P1 |
| Push notifications (web push) | P1 |
| WhatsApp receipt delivery | P1 |
| Energy tracking (fan hours, fuel consumption) | P1 |
| Photo attachments on intake | P2 |

**Milestone:** Facility manager gets push notification: "Chamber 7 ready. Chamber 12 stalled — check fan."

---

### Phase 3: SAAS + AI (Months 7–12)

**Goal:** Multi-tenant platform ready for paying customers.

| Feature | Priority |
|---|---|
| Multi-tenant onboarding (self-service signup) | P0 |
| Custom domain per company | P0 |
| Billing (Razorpay / Stripe subscription) | P0 |
| Super-admin panel (manage all tenants) | P0 |
| ML-based drying prediction (trained on historical data) | P1 |
| Weather API integration (ambient conditions) | P1 |
| Benchmarking across facilities (anonymized) | P1 |
| Truck queue management (during harvest rush) | P2 |
| Voice input (speech-to-text for hands-free entry) | P2 |
| Scale API integration (hardware) | P2 |
| Predictive maintenance (fan service alerts) | P2 |

**Milestone:** Second customer onboarded. First monthly subscription payment received.

---

## 3G: BUSINESS MODEL

---

### Pricing (India)

| Plan | Price | Includes |
|---|---|---|
| **Trial** | Free (30 days) | Full features, 1 facility, 3 users |
| **Starter** | ₹2,000/month | 1 facility, up to 20 chambers, 5 users |
| **Professional** | ₹5,000/month | 1 facility, unlimited chambers, 10 users, analytics, WhatsApp receipts, alerts |
| **Enterprise** | ₹12,000/month | Multi-facility, unlimited users, API access, dedicated support, custom domain |

### Pricing (US)

| Plan | Price | Includes |
|---|---|---|
| **Trial** | Free (30 days) | Full features, 1 facility |
| **Starter** | $99/month | 1 facility, up to 50 bins, 5 users |
| **Professional** | $249/month | 1 facility, unlimited bins, 15 users, analytics, alerts, energy tracking |
| **Enterprise** | $599/month | Multi-facility, unlimited users, API, IoT integration, dedicated support |

### ROI Justification

**For a 20-chamber, 800-ton facility:**

| Benefit | Annual Savings |
|---|---|
| **Reduce over-drying by 1%** | ₹2–4 lakh / $3,000–5,000 (preserved grain weight = revenue) |
| **Energy optimization** | ₹1–3 lakh / $2,000–4,000 (smarter fan/heater control) |
| **Reduce spoilage** | ₹3–5 lakh / $5,000–8,000 (early stalled-drying detection) |
| **Labor efficiency** | ₹1–2 lakh / $2,000–3,000 (fewer manual checks needed) |
| **Total annual savings** | **₹7–14 lakh / $12,000–20,000** |
| **DryTrack cost** | **₹60,000/year / $2,988/year** |
| **ROI** | **10–20x return** |

The product pays for itself in the first month.

---

## 3H: POSITIONING

---

### What DryTrack IS:

> **DryTrack is the operating system for grain drying facilities.**
> It replaces paper logs, gut feelings, and reactive firefighting with real-time monitoring, predictive intelligence, and one-tap operations.

### What DryTrack is NOT:

- Not a grain accounting/ERP system (we don't compete with AGRIS on contracts and ledgers)
- Not a hardware/sensor company (we integrate with any sensor, we don't sell our own)
- Not a generic farm management tool (we are laser-focused on post-harvest drying operations)

### Why DryTrack wins:

| vs Competitor | DryTrack Advantage |
|---|---|
| vs AGRIS/Agvance/Vertical | They do accounting. We do operations. They have no drying intelligence. |
| vs AgroLog | They monitor. We manage + predict + recommend. They need $10K in hardware. We need a phone. |
| vs Spreadsheets/Paper | We are 10x faster, with predictions, alerts, and receipts built in. |
| vs Building in-house | We are a $99–249/month product. Building takes 6–12 months and $50K+ in dev time. |

### One-line pitch:

> **"DryTrack tells you which chamber needs attention, when to switch airflow, and when your grain is ready — before you even check."**

### Tagline:

> **"Dry smarter. Not harder."**

---

# END OF BLUEPRINT

This document is the complete specification for DryTrack V2. Every design decision, every screen, every workflow, every architecture choice is documented here. This is not a theoretical exercise — this is a buildable product blueprint.

**Next step:** Start building Phase 1, Module 1 — Auth + Onboarding + Dashboard.
