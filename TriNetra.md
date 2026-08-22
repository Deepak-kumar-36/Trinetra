# TriNetra — Product Requirements Document
### A Mobile-First, Capability-Aware Disaster Response Coordination & Dispatch Platform
**Version:** 1.0 (Hackathon MVP PRD) · **Status:** Implementation-Ready

---

## 1. Executive Summary

TriNetra is a mobile-first coordination and dispatch platform that turns fragmented, chaotic disaster reports — phone calls, WhatsApp texts, voice notes, social posts, paper logs — into structured, prioritized, and explainable response missions. It answers one operational question that most emergency tools fail to answer well: **who needs help first, what exactly do they need, and which available responder can safely and quickly meet that need?**

The system pairs an AI extraction layer (which reads free-form citizen reports and turns them into structured incident data) with a deterministic rules engine (which scores urgency, filters responders by hard capability constraints, and ranks the survivors of that filter by ETA and fit). A human coordinator approves every dispatch. Volunteers and responder teams receive missions, accept or decline them, and move through a tracked status pipeline that citizens can follow in real time. The result is a shared operational picture that would otherwise take a room full of people, radios, and whiteboards to maintain.

This PRD describes both the durable product vision and a strictly scoped 48–72 hour hackathon MVP that demonstrates the core differentiator — capability-based dispatch with explainable urgency scoring and human-in-the-loop approval — end to end, live, on a phone.

---

## 2. Product Vision

> **TriNetra transforms fragmented disaster reports into prioritized, explainable, human-approved response missions.**

TriNetra is not a reporting app, not a volunteer app, not an SOS button, not a map, and not a chatbot. Each of those is a feature TriNetra contains; none of them is what TriNetra *is*. TriNetra is the coordination layer that sits between the moment someone says "we need help" and the moment the right responder — with the right skills, the right equipment, and the right capacity — is on the way and everyone involved knows it.

The long-term vision is a system that NGOs, municipal disaster-response cells, and trained volunteer networks can stand up before a disaster and lean on during one: a shared, explainable, auditable operational picture that turns individually reasonable decisions (dispatch the closest person) into collectively correct ones (dispatch the person who can actually solve the problem, fastest, safely).

---

## 3. Problem Statement

During floods, earthquakes, fires, landslides, cyclones, and building collapses, information about who needs help arrives simultaneously through many disconnected channels — phone calls, WhatsApp messages, voice notes, social media posts, paper intake forms — and is handled by many disconnected actors: citizens, volunteers, NGOs, shelters, field teams, and separate government response units.

No single coordinator can hold this in their head, and no shared source of truth exists to hold it for them. The consequence isn't just delay — it's **misallocation**: the volunteer with a motorcycle gets sent to a flooded rooftop because he's closest, while the boat crew five minutes further away sits idle. Duplicate reports about the same family spawn three separate rescue attempts while another family goes unlogged entirely. A shelter that is actually full keeps getting recommended because no one updated a spreadsheet.

**Core problem:** Emergency coordinators cannot quickly and reliably match the most urgent incident with the best available responder or resource, because the information needed to do so is scattered, unstructured, unprioritized, and not capability-aware.

TriNetra exists to close that gap — structuring the information, scoring the urgency transparently, filtering responders on hard requirements before ranking them on speed, and keeping a human in charge of the final call.

---

## 4. Target Users

| User | Context of use | Core need |
|---|---|---|
| **Citizen** (affected person / bystander reporting on their behalf) | Under stress, possibly injured, possibly on poor connectivity, may be reporting for someone else | Report an emergency in seconds, know it was received, know someone is coming |
| **Volunteer / Responder** (individual or team, e.g. rescue crew, medic, driver) | In the field, moving, sometimes in low signal areas | Receive missions matched to what they can actually do, navigate to them, report status honestly |
| **Coordinator** (NGO ops lead, municipal emergency officer, shift lead) | Managing many simultaneous incidents, often on a phone or tablet, not always a desktop | See what's most urgent, see who can handle it and why, approve or correct dispatch quickly |
| **Relief Partner / NGO Manager** (secondary role for MVP) | Managing an organization's people and assets | Keep responder/vehicle/supply/shelter data accurate so the matching engine has good inputs |

For the MVP, the build prioritizes **Citizen → Volunteer → Coordinator**, in that order, with NGO/partner management reduced to the minimum data entry needed to seed the demo.

---

## 5. Personas

### Persona 1 — Meera, the Citizen Reporter
32, lives in a flood-prone riverside neighborhood. During a flash flood, her family's ground floor fills with water and her elderly father can't move to the roof unassisted. She has a low-end Android phone, patchy signal, and thirty seconds of attention to spare between managing the situation and reporting it. She needs to report with almost no typing, ideally by voice, and needs to see — without calling anyone — that help is coming and roughly when.

### Persona 2 — Arjun, the Volunteer Responder
27, part of a community rescue crew with a small motorized boat. He is not a professional first responder but has taken water-rescue training through a local NGO. He wants missions that match what his boat and training can actually do, wants to decline honestly without feeling like he's failed, and wants a clear map and ETA once he accepts — not a wall of text.

### Persona 3 — Farah, the Coordinator
41, an NGO operations lead running a district relief cell out of a tent with a tablet and a phone. She is managing a dozen simultaneous incidents of wildly different severity, with volunteers she trusts and some she's never worked with. She needs the system to tell her, in one glance, what's on fire (sometimes literally) and *why* it's rated that way, needs to see who it's recommending and why they're a better fit than the nearest person, and needs to approve, correct, or reassign in a few taps — because she is also fielding radio calls at the same time.

### Persona 4 — Devika, the NGO/Partner Manager (secondary)
Runs the logistics side for a mid-size relief NGO — a fleet of vehicles, a roster of trained volunteers, two shelters, and two supply hubs. Her job, for MVP purposes, is keeping capacity numbers honest so the matching and resource engines don't recommend something that isn't really available.

---

## 6. User Pain Points

- **Fragmentation:** the same emergency exists in five different places (a call log, a WhatsApp group, a paper form) and nobody has the full picture.
- **Nearest-is-not-best:** dispatch by proximity alone sends the wrong tool to the job.
- **Invisible urgency:** two incidents look equally bad on paper until someone reads the details; no shared, explainable score exists to triage at a glance.
- **Duplicate effort:** the same family gets reported by three neighbors and three separate responses get launched.
- **Stale resource data:** shelters, boats, and supplies get recommended after they're already full or exhausted.
- **No status visibility:** citizens have no idea whether their report was seen, is being acted on, or was lost.
- **Brittle connectivity:** disaster zones have unreliable networks, and most tools assume a normal internet connection.
- **Accountability gaps:** when something goes wrong, there's no record of who decided what, when, and why.

---

## 7. Product Goals

1. Convert unstructured citizen reports (text, voice, photo) into structured, actionable incident records in seconds.
2. Score every incident's urgency transparently and consistently, using a deterministic, auditable formula — not an opaque AI judgment call.
3. Recommend responders based on **capability fit first, speed second** — never proximity alone.
4. Keep a human coordinator in the approval loop for every dispatch.
5. Give citizens, volunteers, and coordinators live, trustworthy status visibility into every mission.
6. Detect likely duplicate reports and let a human decide whether to merge them.
7. Prevent resource over-allocation (shelters, boats, medical kits) through reservation tracking.
8. Degrade gracefully — not silently fail — under poor connectivity.
9. Be operable under stress: clear, fast, low-cognitive-load, accessible interfaces on a phone screen.
10. Be demonstrably buildable as a real, working mobile MVP in 48–72 hours.

---

## 8. Non-Goals

TriNetra explicitly does **not**:

- Replace 112/911 or any official emergency dispatch authority.
- Act as an autonomous dispatch system — AI never assigns a responder without human approval.
- Provide medical diagnosis or triage in the clinical sense.
- Guarantee that any calculated route is safe or current during an active disaster.
- Guarantee that a dispatched responder will arrive or that help is available.
- Attempt full offline-first architecture in the MVP (that is future roadmap).
- Become a general-purpose disaster-management or logistics ERP.
- Train or fine-tune a custom AI model — it uses existing hosted APIs for extraction, transcription, and translation only.
- Assume constant internet connectivity anywhere in its design.

---

## 9. Core Value Proposition

TriNetra's value is not "an app to report emergencies." Reporting apps exist. Its value is the layer most disaster tech skips: **turning a pile of individually reasonable reports into a collectively optimal, explainable, human-approved dispatch order** — fast enough to matter, transparent enough to trust, and safe enough that a human is always the one who pulls the trigger.

---

## 10. Key Differentiators

### 10.1 Capability-Based Emergency Dispatch (the central differentiator)

TriNetra never simply assigns the nearest available person. It evaluates **hard constraints** (required skills, equipment, vehicle type, passenger/cargo capacity, availability, conflicting missions) before it ever ranks by distance or ETA. A responder who fails a hard constraint is never shown as a primary recommendation, no matter how close they are.

**Worked example:**
A person is trapped on a rooftop during flooding.
- Volunteer A is 2 km away but has only a motorcycle. → **Excluded**: fails the mandatory-boat hard constraint.
- Rescue Team B is 5 km away with a rescue boat, life jackets, a first-aid kit, water-rescue training, and available capacity. → **Recommended**, ETA 12 minutes.

The UI states this plainly:

> *"Volunteer A is closer but cannot satisfy the mandatory boat requirement. Rescue Team B is recommended because it has a rescue boat, medical capability, sufficient capacity, and an estimated arrival time of 12 minutes."*

### 10.2 Explainable Urgency, Not a Black Box

Every incident's priority is a transparent, itemized score (0–100) built from a deterministic formula, not a single AI-generated verdict. Every citizen, volunteer-facing summary, and coordinator screen that shows a priority level can show the "Why is this urgent?" breakdown behind it.

### 10.3 Human-in-the-Loop by Design, Not by Afterthought

AI extracts and suggests. The rules engine scores and filters. A coordinator approves. This separation is structural, not a checkbox — it is described fully in Section 20.

### 10.4 Dynamic Reassignment as a First-Class Workflow

Field conditions change. A blocked road, a declined mission, or a worsening incident triggers automatic re-ranking of alternative responders — surfaced to the coordinator as a decision, not executed silently.

### 10.5 Duplicate-Aware Intake

Reports about the same real-world incident are flagged for human merge/keep-separate/investigate decisions instead of silently spawning redundant missions.


---

## 11. Mobile App Information Architecture

Each role gets its own tab structure and its own home screen — there is no shared "one app for everyone" navigation shell, because a citizen in a panic and a coordinator running twelve incidents need fundamentally different first screens. Role is selected/assigned at login and the navigation shell is generated from it.

### 11.1 Citizen Navigation (bottom tab bar, 4 tabs)

| Tab | Purpose |
|---|---|
| **Home** | Status of active request(s) if any; otherwise the entry point to report |
| **My Requests** | History and live tracking of all reports the citizen has filed |
| **Nearby Help** | Shelters, safe zones, safety information — useful even with no active report |
| **Profile** | Account, language, saved locations, settings |

A persistent, always-reachable primary CTA — **"REPORT EMERGENCY"** — is pinned above the tab bar (a large red floating action button) on every citizen screen, not just Home. In a real emergency the user should never have to navigate to find it.

**Reasoning:** four tabs is the ceiling for a stressed user; report/track/find-help/me maps directly onto the only four things a citizen ever needs mid-disaster.

### 11.2 Volunteer Navigation (bottom tab bar, 4 tabs)

| Tab | Purpose |
|---|---|
| **Home** | Availability toggle, current mission (if any), incoming mission alert |
| **Missions** | Active + historical missions, accept/decline queue |
| **Map** | Incident location, route, ETA for the current mission |
| **Profile** | Skills, vehicle, equipment, capacity, availability schedule |

**Reasoning:** a volunteer in the field thinks in terms of "what am I doing right now," "what have I been asked to do," "how do I get there," and "what can I even do" — four tabs, task-oriented, not information-dense.

### 11.3 Coordinator Navigation (bottom tab bar, 5 tabs — tablet-friendly)

| Tab | Purpose |
|---|---|
| **Operations** | The single-glance command view: Critical/High incidents, active missions, responders needing attention, resource shortages |
| **Incidents** | Full sortable/filterable incident queue |
| **Map** | Live map of incidents, responders, shelters, supply hubs, routes |
| **Missions** | All active/past missions and their state |
| **Resources** | Shelters, supplies, vehicles, capacity tracking |

Profile/settings and audit log are accessible from a top-right icon rather than consuming a sixth tab, since coordinators spend nearly all their time in the first three tabs.

**Reasoning (deviation from the brief's 6-tab suggestion):** the brief's original navigation folds "Resources" and a separate "Alerts" screen into extra tabs; this PRD merges shelter/supply oversight into one **Resources** tab and treats alerts as **notifications**, not a tab, because notifications are transient and belong in a bell icon/inbox, not permanent navigation. This keeps the coordinator shell at 5 tabs, which is still comfortably usable one-handed on a large phone and two-handed on a tablet.

### 11.4 Relief Partner / NGO Manager (secondary, MVP-simplified)

A single **Manage** screen (not a full tab set) with list-and-edit views for Responders, Vehicles, Supplies, and Shelters. No dedicated navigation shell is built for this role in the MVP; it is reached via a coordinator-adjacent "Org Admin" entry point.

---

## 12. User Journeys

### 12.1 Citizen Journey — Reporting and Tracking
1. Opens app under stress → sees REPORT EMERGENCY CTA immediately, no login wall for the first report (guest-mode reporting allowed, account optional).
2. Chooses text or voice → describes situation naturally ("three people trapped on rooftop, water rising, child has asthma").
3. Confirms auto-detected location or drops a manual pin.
4. Optionally attaches a photo.
5. Reviews AI-extracted structured summary (people affected, vulnerabilities, hazards) and can correct it before submitting.
6. Submits → sees confirmation + a live status tracker.
7. Watches status move: Received → Prioritized → Responder Assigned → En Route → Arrived → Completed.
8. Can report worsening conditions at any time, which re-triggers scoring.
9. Can browse Nearby Help (shelters) independent of having filed a report.

### 12.2 Volunteer Journey — Onboarding to Mission Completion
1. Registers, sets up profile: skills, vehicle, equipment, capacity.
2. Toggles Available.
3. Receives an incoming mission notification with a plain-language reason ("you're being asked because you have a rescue boat and water-rescue training").
4. Accepts or declines (decline requires a one-tap reason).
5. Navigates via in-app map to the incident.
6. Updates status: En Route → Arrived → Completed, or reports a blocker (road blocked, can't proceed).
7. If blocked and reassignment is triggered, sees clearly that the mission was reassigned and why (not silently pulled).
8. Mission closes; appears in history.

### 12.3 Coordinator Journey — Triage to Dispatch to Resolution
1. Opens Operations dashboard → sees Critical incidents surfaced at the top, unprompted.
2. Taps an incident → sees the urgency breakdown ("Why is this urgent?"), extracted details, and confidence flags.
3. Views ranked recommended responders with the exclusion reasoning for anyone filtered out.
4. Approves the top recommendation, or picks an alternative, or corrects extracted data (which recalculates the score).
5. Monitors the mission through its status pipeline.
6. If the system flags a blocker or reassignment need, reviews the alternative and approves or rejects it.
7. Handles a duplicate-report flag: merges, keeps separate, or marks for investigation.
8. Reviews the incident timeline/audit log after resolution.


---

## 13. Core Workflows

### 13.1 Master Workflow

```text
Emergency report (text/voice/photo)
      ↓
AI extracts structured information (with confidence score)
      ↓
Incident created (status: Received)
      ↓
Deterministic urgency engine calculates score + explanation
      ↓
Required skills/resources identified (from extracted + inferred needs)
      ↓
Hard-constraint filter removes incompatible responders
      ↓
Soft-ranking scores and orders remaining responders (ETA, distance, fit)
      ↓
ETA + route calculated for top candidates
      ↓
Coordinator reviews ranked list + reasoning, approves dispatch
      ↓
Responder receives mission (push notification)
      ↓
Accepted → En Route → Arrived → Completed
      ↓
Citizen receives status updates at each transition
```

### 13.2 Duplicate Detection Workflow
New report → geo-proximity + category + semantic similarity + time-window check against open incidents → if similarity exceeds threshold, flag "Possible duplicate incident" on the coordinator's incident detail screen → coordinator merges, keeps separate, or marks for investigation. Never auto-merged.

### 13.3 Dynamic Reassignment Workflow
Mission assigned → volunteer accepts → en route → blocker reported (or ETA degrades past a threshold, or volunteer goes unavailable) → system detects the problem → coordinator alert raised → alternative responders re-ranked → coordinator approves reassignment → original responder released back to available pool (with the blocker logged) → new responder notified.

### 13.4 Resource Reservation Workflow
Dispatch approved that consumes a resource (shelter beds, boat, supply units) → resource reserved atomically at approval time (not at request time) → reservation decremented from "available" → on mission completion or cancellation, reservation is released or converted to "deployed/consumed" depending on resource type → system never recommends a resource whose available count is already zero.


---

## 14. Screen-by-Screen Requirements

Format per screen: Purpose · User · Entry points · UI components · Primary action · Secondary actions · Data displayed · API/backend dependencies · Loading/Empty/Error states · Permissions · Success state · Key edge cases.

### 14.A Citizen Screens

**1. Splash / Onboarding**
- Purpose: brand trust + language selection before anything else.
- User: Citizen (first launch).
- Entry: app cold start.
- Components: logo, 2–3 slide explainer ("Report. Track. Get Help."), language picker, "Skip"/"Continue."
- Primary action: Continue to Login/Guest.
- Secondary: change language.
- Data: none (static).
- API: `GET /config` (supported languages).
- Loading: brief skeleton; Empty: n/a; Error: fallback to default language, never block progress.
- Permissions: none yet.
- Success: lands on Login/Registration.
- Edge cases: no network on first launch → still allow onward navigation (config not required to proceed).

**2. Login / Registration**
- Purpose: identify the user (optional for emergency reporting — see §11.1).
- User: Citizen.
- Entry: post-splash, or "Sign in" from Profile.
- Components: phone-number field, OTP field, "Continue as Guest" (prominent), name field (optional).
- Primary action: Verify OTP / Continue as Guest.
- Secondary: switch to email login (if supported).
- Data: phone number, OTP.
- API: `POST /auth/otp/request`, `POST /auth/otp/verify`.
- Loading: OTP send/verify spinner; Empty: n/a; Error: invalid OTP, network failure — retry with clear countdown.
- Permissions: none.
- Success: token issued, routed to Role Selection or Citizen Home if role already known.
- Edge cases: OTP never arrives (poor network) → offer "Continue as Guest" without penalty; guest reports are still fully functional, just not tied to a persistent history across devices.

**3. Role Selection**
- Purpose: route the account into the correct navigation shell.
- User: any first-time user.
- Entry: after first login/registration.
- Components: three large cards — "I need help," "I want to volunteer," "I'm a coordinator" (coordinator requires org invite code).
- Primary action: select role.
- Secondary: "I'm not sure" → defaults to Citizen (least-privilege default).
- Data: chosen role.
- API: `PATCH /users/:id/role`.
- Loading: brief; Empty: n/a; Error: retry.
- Permissions: none.
- Success: routes to the matching home screen.
- Edge cases: Coordinator role requires a valid org invite code and is never self-service without one (see §22).

**4. Citizen Home**
- Purpose: single-glance status + fastest path to reporting.
- User: Citizen.
- Entry: default landing tab.
- Components: REPORT EMERGENCY floating CTA, active-request summary card(s) if any, safety tips carousel, "Nearby Help" shortcut.
- Primary action: Report Emergency.
- Secondary: tap active request to track it.
- Data: active incident status summary.
- API: `GET /incidents?reporter_id=me&status=active`.
- Loading: skeleton card; Empty: friendly "No active reports" + safety tip; Error: cached last-known state + offline banner.
- Permissions: location (prompted contextually, not on launch).
- Success: n/a (dashboard).
- Edge cases: multiple simultaneous active reports (family reported separately) shown as a stacked list, most urgent first.

**5. Report Emergency**
- Purpose: entry point choosing text or voice reporting, fastest possible path.
- User: Citizen.
- Entry: REPORT EMERGENCY CTA (always reachable).
- Components: two large buttons — "Type" / "Speak" — plus an optional photo-attach icon, minimal chrome.
- Primary action: choose input mode.
- Secondary: attach photo before describing.
- Data: none yet.
- API: none yet.
- Loading: n/a; Empty: n/a; Error: n/a.
- Permissions: microphone (only if Speak chosen), camera (only if photo chosen).
- Success: proceeds to the chosen input flow.
- Edge cases: user is reporting for someone else — a "Who is this for?" toggle (Myself / Someone else) sits above the input choice.

**6. Voice Emergency Report**
- Purpose: hands-free, low-literacy-friendly reporting.
- User: Citizen.
- Entry: "Speak" from Report Emergency.
- Components: large record button, live waveform, real-time partial transcript, re-record option.
- Primary action: record → stop → confirm.
- Secondary: switch to typing mid-flow.
- Data: audio, resulting transcript.
- API: `POST /reports/voice` (audio upload → speech-to-text → AI extraction).
- Loading: "Understanding your report…" spinner during transcription/extraction; Empty: n/a; Error: transcription failed → fallback to text input with a clear, non-blaming message.
- Permissions: microphone.
- Success: routes to Incident Details (extracted) for review.
- Edge cases: background noise/poor audio → low-confidence transcript flagged for extra citizen confirmation before submit.

**7. Location Confirmation**
- Purpose: verify the location the response will be sent to.
- User: Citizen.
- Entry: after text/voice input.
- Components: map with pin (GPS auto-detected), accuracy radius indicator, "Move pin" drag handle, manual address search fallback.
- Primary action: Confirm location.
- Secondary: search address manually; use a saved location (e.g., "Home").
- Data: lat/long, accuracy meters, optional address text.
- API: reverse-geocoding call (or offline fallback — see §16).
- Loading: "Finding your location…"; Empty: GPS unavailable → manual pin/search required; Error: geocoding failure → allow raw coordinates submission.
- Permissions: location (foreground).
- Success: proceeds to Incident Details.
- Edge cases: GPS accuracy poor (>100m) → visible warning + encouragement to drop pin manually; location denied entirely → manual pin on map is still mandatory before submission (never submit with no location).

**8. Incident Details (Review & Confirm)**
- Purpose: show the AI-extracted structured summary and let the citizen correct it before submitting.
- User: Citizen.
- Entry: after voice/text + location.
- Components: editable fields — description, people affected count, vulnerabilities (child/elderly/disability/pregnant/medical), hazard tags, confidence flags on any field the AI is unsure of, photo thumbnail if attached.
- Primary action: Submit Report.
- Secondary: edit any field; add photo; go back.
- Data: full structured incident draft.
- API: `POST /incidents` (final submit).
- Loading: submit spinner; Empty: n/a; Error: submission failed → auto-queued for retry (see §19), citizen told plainly it will resend automatically.
- Permissions: none additional.
- Success: routes to Report Submitted Confirmation.
- Edge cases: AI extraction produced an unsafe assumption (e.g., guessed a depth from a photo) → such fields are never auto-filled with invented specifics; only "possible/needs verification" flags are shown (see §12).

**9. Report Submitted Confirmation**
- Purpose: immediate reassurance the report was received.
- User: Citizen.
- Entry: after successful submit.
- Components: confirmation checkmark, reference ID, "We've received your report" message, CTA to Track Request, safety reminder ("If this is life-threatening, also contact local emergency services").
- Primary action: Track this request.
- Secondary: report another emergency; return home.
- Data: incident ID, submission timestamp.
- API: none (uses prior response).
- Loading: n/a; Empty: n/a; Error: n/a (this screen only renders on success).
- Permissions: none.
- Success: n/a.
- Edge cases: submitted while offline → confirmation still shows but labeled "Queued — will send when connected," with a visible pending indicator.

**10. Request Tracking (My Requests)**
- Purpose: list all of a citizen's reports, active and past.
- User: Citizen.
- Entry: My Requests tab.
- Components: list of request cards with status chip (Received/Prioritized/Assigned/En Route/Arrived/Completed), timestamps.
- Primary action: tap a request → Request Detail.
- Secondary: filter active vs. past.
- Data: list of incidents for this reporter.
- API: `GET /incidents?reporter_id=me`.
- Loading: skeleton list; Empty: "No requests yet"; Error: cached list + offline banner.
- Permissions: none.
- Success: n/a.
- Edge cases: guest (unauthenticated) users only see requests made on this device/session.

**11. Request Detail**
- Purpose: live status of one specific request.
- User: Citizen.
- Entry: from My Requests or the confirmation screen.
- Components: status timeline (visual stepper), current responder info if assigned (name/org, not private contact details), ETA, "Report worsening condition" button, map preview of responder position if en route.
- Primary action: Report worsening condition (if still relevant).
- Secondary: cancel request; contact-safety-info shortcut.
- Data: incident status, assigned responder public info, ETA.
- API: `GET /incidents/:id`, realtime subscription for status changes.
- Loading: skeleton; Empty: n/a; Error: last-known cached status + "Last updated Xm ago" if connection lost.
- Permissions: none.
- Success: n/a (live view).
- Edge cases: responder reassigned mid-mission → citizen sees a clear, non-alarming "We've assigned a new responder to reach you faster" message, not a raw status flip.

**12. Worsening Condition / Escalation**
- Purpose: let the citizen tell the system things have gotten worse without re-filing from scratch.
- User: Citizen.
- Entry: "Report worsening condition" on Request Detail.
- Components: quick-select chips (water rising, fire spreading, someone injured, running out of time, other — text/voice), submit.
- Primary action: Submit update.
- Secondary: attach a new photo.
- Data: escalation note, appended to incident.
- API: `POST /incidents/:id/escalate`.
- Loading: submit spinner; Empty: n/a; Error: queued for retry.
- Permissions: none additional.
- Success: confirmation the update was received and the score is being recalculated.
- Edge cases: repeated escalations in a short window are still each logged (never silently deduped) but visually grouped in the timeline.

**13. Nearby Shelters**
- Purpose: help independent of an active report.
- User: Citizen.
- Entry: Nearby Help tab.
- Components: list/map toggle of shelters, each with distance, capacity status (Open/Filling/Full), basic info (has medical support, accepts pets, etc.).
- Primary action: get directions to a shelter.
- Secondary: call shelter (if number available), view details.
- Data: shelter list with live capacity.
- API: `GET /shelters?near=lat,long`.
- Loading: skeleton; Empty: "No shelters listed nearby yet"; Error: cached list, staleness timestamp shown.
- Permissions: location.
- Success: n/a.
- Edge cases: a shelter shown as "Full" is still visible (never hidden) but visually deprioritized, since conditions can change and citizens may still choose to go.

**14. Safety Information**
- Purpose: static/lightly dynamic guidance (what to do in a flood/earthquake/fire while waiting).
- User: Citizen.
- Entry: Nearby Help tab or Home.
- Components: categorized safety tip cards.
- Primary action: none (informational).
- Secondary: share tip.
- Data: static content, locally cachable.
- API: `GET /safety-content`.
- Loading: skeleton; Empty: n/a; Error: fully cached locally, always available offline.
- Permissions: none.
- Success: n/a.
- Edge cases: this screen must work fully offline (see §19) — it is a safety-critical fallback.

**15. Notifications**
- Purpose: central log of all push/status updates.
- User: Citizen.
- Entry: bell icon.
- Components: chronological notification list, unread indicators.
- Primary action: tap → relevant Request Detail.
- Secondary: mark all read.
- Data: notification history.
- API: `GET /notifications?user=me`.
- Loading: skeleton; Empty: "No notifications yet"; Error: cached list.
- Permissions: push notification permission (requested contextually after first report, not on launch).
- Success: n/a.
- Edge cases: critical notifications ("responder arrived") are also shown as a system push/banner even if the app is backgrounded.

**16. Profile / Settings**
- Purpose: account, language, saved locations, data controls.
- User: Citizen.
- Entry: Profile tab.
- Components: name/phone, language selector, saved locations (e.g., Home), notification preferences, logout, data/privacy info link.
- Primary action: save changes.
- Secondary: log out, switch to guest.
- Data: user profile fields.
- API: `PATCH /users/:id`.
- Loading: spinner on save; Empty: n/a; Error: retry.
- Permissions: none additional.
- Success: confirmation toast.
- Edge cases: guest users see a simplified profile with a prompt to register for cross-device history, not a broken/empty screen.

### 14.B Volunteer Screens

**17. Volunteer Onboarding**
- Purpose: explain expectations and responsibilities before profile setup.
- User: Volunteer.
- Entry: after selecting "I want to volunteer" role.
- Components: short explainer of how missions are matched and that accepting is a commitment; org affiliation field (optional/select from list).
- Primary action: Continue to Skills Setup.
- Secondary: link an existing NGO org code.
- Data: org affiliation (if any).
- API: `GET /organizations`.
- Loading: skeleton list; Empty: "No organizations listed — continue as independent volunteer"; Error: allow proceeding without org link.
- Permissions: none.
- Success: n/a.
- Edge cases: independent (unaffiliated) volunteers are fully supported, not just org-linked ones.

**18. Skills Setup**
- Purpose: capture what this volunteer/team can actually do.
- User: Volunteer.
- Entry: onboarding step 2.
- Components: multi-select skill tags (first aid, water rescue, structural assessment, medical/paramedic, translation + language list, driving, general labor, etc.), free-text "other."
- Primary action: Continue.
- Secondary: skip (flagged as incomplete profile, limits mission matching).
- Data: skill set array.
- API: `PATCH /responders/:id/skills`.
- Loading: n/a; Empty: n/a; Error: local draft retained, retry on submit.
- Permissions: none.
- Success: n/a.
- Edge cases: skills claimed here are not independently verified in the MVP — see §22 for the resulting trust/authorization implications.

**19. Vehicle Setup**
- Purpose: capture transport capability.
- User: Volunteer.
- Entry: onboarding step 3.
- Components: vehicle type selector (none/on-foot, motorcycle, car, van, boat, ambulance, truck, other), plate/ID (optional).
- Primary action: Continue.
- Secondary: skip (defaults to on-foot).
- Data: vehicle type.
- API: `PATCH /responders/:id/vehicle`.
- Loading: n/a; Empty: n/a; Error: retry.
- Permissions: none.
- Success: n/a.
- Edge cases: a boat listed here becomes a hard-constraint-satisfying asset elsewhere in the system — accuracy here directly affects who lives through triage in the matching logic, so the copy on this screen stresses honesty.

**20. Equipment Setup**
- Purpose: capture on-hand equipment beyond the vehicle.
- User: Volunteer.
- Entry: onboarding step 4.
- Components: multi-select (life jackets, first-aid kit, rope/rescue gear, food/water supplies, medical oxygen, generator, other).
- Primary action: Continue.
- Secondary: skip.
- Data: equipment array.
- API: `PATCH /responders/:id/equipment`.
- Loading: n/a; Empty: n/a; Error: retry.
- Permissions: none.
- Success: n/a.
- Edge cases: equipment quantities (e.g., "4 life jackets") captured where relevant to capacity-style hard constraints.

**21. Capacity Setup**
- Purpose: how many people/how much cargo this responder can actually carry.
- User: Volunteer.
- Entry: onboarding step 5.
- Components: numeric steppers for passenger capacity and/or cargo capacity (context-sensitive to vehicle type).
- Primary action: Finish setup.
- Secondary: none.
- Data: passenger_capacity, cargo_capacity.
- API: `PATCH /responders/:id/capacity`.
- Loading: n/a; Empty: n/a; Error: retry.
- Permissions: none.
- Success: routes to Volunteer Home.
- Edge cases: a capacity of 0/unset blocks this responder from being matched to anything requiring capacity until corrected (they can still be matched to non-capacity tasks like assessment/first aid on scene).

**22. Availability Toggle**
- Purpose: real-time on/off duty status.
- User: Volunteer.
- Entry: Volunteer Home (prominent switch).
- Components: large Available/Unavailable switch, optional "available until" time.
- Primary action: toggle.
- Secondary: set a scheduled availability window.
- Data: availability boolean + optional window.
- API: `PATCH /responders/:id/availability`.
- Loading: instant optimistic UI, reconciled on response; Empty: n/a; Error: revert toggle + toast on failure.
- Permissions: none.
- Success: visible state change.
- Edge cases: going Unavailable while on an active mission is blocked with a warning — must report a blocker or complete the mission first (see edge case #11 in §24).

**23. Volunteer Home**
- Purpose: single-glance "what am I doing right now."
- User: Volunteer.
- Entry: default landing tab.
- Components: availability switch, current mission card (if any) with big "Open mission" CTA, incoming-mission alert banner (if a new one just arrived), quick stats (missions completed).
- Primary action: respond to incoming mission, or open current mission.
- Secondary: toggle availability.
- Data: current + incoming mission summaries.
- API: `GET /responders/:id/current-mission`, realtime subscription.
- Loading: skeleton; Empty: "You're available — no missions right now"; Error: cached state + offline banner.
- Permissions: location (background, only while on an active mission), push notifications.
- Success: n/a.
- Edge cases: two missions cannot be "current" at once — the system will not offer a second mission while one is active (see hard constraint in §17).

**24. Incoming Mission**
- Purpose: fast, clear accept/decline decision.
- User: Volunteer.
- Entry: push notification tap, or Home banner.
- Components: incident summary, urgency badge, required capabilities and why this volunteer matches them, ETA estimate, distance, large Accept / Decline buttons, countdown to auto-offer-next-responder if no response.
- Primary action: Accept.
- Secondary: Decline (requires quick reason: too far / lack capability / unavailable / other).
- Data: incident summary, match reasoning.
- API: `POST /missions/:id/respond`.
- Loading: submit spinner; Empty: n/a; Error: retry, mission held for this responder briefly before reoffering.
- Permissions: none additional.
- Success: routes to Mission Detail.
- Edge cases: response timeout (no answer within window) → mission auto-reoffered to next-ranked responder, coordinator notified of the non-response, not treated as a decline against the volunteer's record.

**25. Mission Detail**
- Purpose: everything needed to execute the mission.
- User: Volunteer.
- Entry: from Missions list or after accepting.
- Components: incident description, location, citizen-provided vulnerabilities/hazards, status stepper (Accepted/En Route/Arrived/Completed), "Navigate" CTA, "Update Status" CTA, "Report Blocker" link.
- Primary action: Navigate / Update Status.
- Secondary: Report Blocker; request reassignment.
- Data: full mission + incident detail.
- API: `GET /missions/:id`, `PATCH /missions/:id/status`.
- Loading: skeleton; Empty: n/a; Error: cached last-known detail + retry banner.
- Permissions: location.
- Success: n/a (live).
- Edge cases: citizen-provided info updates mid-mission (e.g., worsening condition) → volunteer sees a clear "Updated" badge, not a silent change.

**26. Navigation / Route**
- Purpose: get the volunteer physically to the incident.
- User: Volunteer.
- Entry: "Navigate" from Mission Detail.
- Components: map, route line, ETA, distance remaining, "Report road blocked" button.
- Primary action: follow route.
- Secondary: report blockage.
- Data: route polyline, ETA.
- API: routing service call (or seeded/mocked route data — see §14, §21).
- Loading: "Calculating route…"; Empty: no route available → straight-line distance + compass fallback; Error: routing API failure → fallback to last cached/mocked route with a visible disclaimer.
- Permissions: location.
- Success: n/a.
- Edge cases: always displays the disclaimer "Route information may be outdated during active disasters. Follow authorized local guidance."

**27. Status Update**
- Purpose: quick, honest status changes.
- User: Volunteer.
- Entry: "Update Status" on Mission Detail.
- Components: large tappable status options appropriate to current state (e.g., from En Route: "Arrived," "Blocked").
- Primary action: confirm new status.
- Secondary: add a note.
- Data: new status + optional note.
- API: `PATCH /missions/:id/status`.
- Loading: spinner; Empty: n/a; Error: change queued for retry, UI shows "pending sync."
- Permissions: none additional.
- Success: status reflected instantly (optimistic) and confirmed.
- Edge cases: offline status updates are queued and applied in order once connectivity returns (see §19).

**28. Report Blocker**
- Purpose: flag an obstacle without abandoning the mission.
- User: Volunteer.
- Entry: "Report Blocker" from Mission Detail/Navigation.
- Components: quick-select reasons (road blocked, vehicle issue, situation beyond my capability, need backup, other — text), submit.
- Primary action: Submit blocker.
- Secondary: none.
- Data: blocker reason + note.
- API: `POST /missions/:id/blocker`.
- Loading: spinner; Empty: n/a; Error: queued.
- Permissions: none additional.
- Success: confirmation "Coordinator notified — we're finding backup," triggers reassignment workflow (§13.3).
- Edge cases: reporting a blocker does not automatically remove the volunteer from the mission until the coordinator acts — avoids leaving an incident unattended mid-transition.

**29. Unable-to-Complete Flow**
- Purpose: formal handoff when a volunteer genuinely cannot finish.
- User: Volunteer.
- Entry: from Mission Detail, "I can't complete this."
- Components: reason selection, confirmation warning ("This will notify your coordinator and reassign the mission"), submit.
- Primary action: Confirm unable to complete.
- Secondary: cancel and go back.
- Data: reason.
- API: `POST /missions/:id/unable-to-complete`.
- Loading: spinner; Empty: n/a; Error: retry.
- Permissions: none additional.
- Success: mission released, reassignment triggered, volunteer returned to available pool.
- Edge cases: distinct from "Report Blocker" — this ends the volunteer's involvement rather than pausing it; frequency of this per volunteer feeds their reliability score (§17).

**30. Mission Completion**
- Purpose: close out a mission with a minimal, quick form.
- User: Volunteer.
- Entry: "Mark Completed" from Mission Detail (available once Arrived).
- Components: outcome summary chips (person(s) rescued/assisted, resources delivered, further help needed), optional note/photo.
- Primary action: Submit completion.
- Secondary: flag that further help is still needed (creates a follow-up incident link rather than a brand-new unlinked report).
- Data: completion outcome.
- API: `PATCH /missions/:id/status` (Completed) + `POST /missions/:id/outcome`.
- Loading: spinner; Empty: n/a; Error: queued.
- Permissions: none additional.
- Success: mission moves to history, volunteer returned to available pool, citizen notified.
- Edge cases: "further help needed" keeps the case open/linked instead of forcing the citizen to file a brand-new report from scratch.

**31. Mission History**
- Purpose: past missions for this volunteer.
- User: Volunteer.
- Entry: Missions tab.
- Components: chronological list with outcome summaries.
- Primary action: tap → read-only mission detail.
- Secondary: filter by date/type.
- Data: completed/cancelled missions list.
- API: `GET /missions?responder_id=me&status=closed`.
- Loading: skeleton; Empty: "No completed missions yet"; Error: cached list.
- Permissions: none.
- Success: n/a.
- Edge cases: none beyond standard list edge cases.

**32. Volunteer Profile**
- Purpose: edit skills/vehicle/equipment/capacity after onboarding.
- User: Volunteer.
- Entry: Profile tab.
- Components: editable versions of screens 18–21, reliability indicator (view-only), org affiliation.
- Primary action: save changes.
- Secondary: log out.
- Data: full responder profile.
- API: `PATCH /responders/:id`.
- Loading: spinner; Empty: n/a; Error: retry.
- Permissions: none additional.
- Success: confirmation toast.
- Edge cases: editing capability profile mid-active-mission does not retroactively affect the current mission's matching, only future matches.

### 14.C Coordinator Screens

**33. Coordinator Onboarding / Login**
- Purpose: gated entry — coordinators are not self-service.
- User: Coordinator.
- Entry: Role Selection with an org invite code, or direct coordinator login.
- Components: invite code field, org context display once validated.
- Primary action: Verify code → login.
- Secondary: request access (routes to a manual approval placeholder for MVP).
- Data: invite code, org ID.
- API: `POST /auth/coordinator/verify-invite`.
- Loading: spinner; Empty: n/a; Error: invalid code, clear message.
- Permissions: none.
- Success: routes to Operations Dashboard.
- Edge cases: invite codes are single-org-scoped; a coordinator cannot see another org's data (§22).

**34. Operations Dashboard**
- Purpose: the single most important screen in the product — the coordinator's command view.
- User: Coordinator.
- Entry: default landing tab.
- Components: Critical incidents strip (always top, never collapsed), High-priority list, active missions summary, "responders needing attention" (declined/blocked/unreachable), resource shortage banner.
- Primary action: tap any item → relevant detail screen.
- Secondary: refresh, filter by area.
- Data: aggregated live counts and top items across incidents/missions/resources.
- API: `GET /operations/summary` + realtime subscription.
- Loading: skeleton cards; Empty: "No active incidents" (still shows resource/responder panels); Error: cached snapshot + prominent "Last updated Xm ago" + reconnect banner.
- Permissions: none additional.
- Success: n/a (live dashboard).
- Edge cases: simultaneous Critical incidents (edge case #3, §24) are never hidden behind pagination — the strip scrolls horizontally but all Criticals are always reachable within one screen.

**35. Incident Queue**
- Purpose: full sortable/filterable list of all incidents.
- User: Coordinator.
- Entry: Incidents tab.
- Components: sortable list (default sort: urgency score descending), filter chips (status, urgency level, category, area), search.
- Primary action: tap → Incident Detail.
- Secondary: bulk filter/sort changes.
- Data: full incident list with score, status, age.
- API: `GET /incidents?sort=urgency_desc`.
- Loading: skeleton list; Empty: "No incidents match this filter"; Error: cached list.
- Permissions: none additional.
- Success: n/a.
- Edge cases: incident age is shown alongside score — an aging Medium incident is visually distinguishable from a fresh one, since urgency and staleness are different problems.

**36. Incident Detail**
- Purpose: everything about one incident.
- User: Coordinator.
- Entry: from queue, dashboard, or map.
- Components: full extracted description, editable fields, urgency score + link to explanation, required capabilities, photo (if any), confidence flags, timeline preview, "View Recommended Responders" CTA, duplicate-flag banner if applicable.
- Primary action: View Recommended Responders (→ dispatch flow) or Edit incident.
- Secondary: mark false/invalid report, escalate manually, merge duplicate.
- Data: full incident record.
- API: `GET /incidents/:id`, `PATCH /incidents/:id`.
- Loading: skeleton; Empty: n/a; Error: retry banner, cached last view.
- Permissions: none additional.
- Success: n/a.
- Edge cases: editing a field (e.g., correcting "2 people" to "4 people") immediately triggers score recalculation with a visible "Recalculating…" state, and the change is attributed to the coordinator in the audit log.

**37. Urgency Explanation ("Why is this urgent?")**
- Purpose: full transparency on the score.
- User: Coordinator (and simplified versions surfaced to citizen/volunteer).
- Entry: from Incident Detail.
- Components: itemized additive/subtractive breakdown (see §16 for exact format), final score, urgency band (Critical/High/Medium/Low), confidence note.
- Primary action: back to Incident Detail.
- Secondary: manually override score (requires a reason, logged).
- Data: score components.
- API: `GET /incidents/:id/score-breakdown`.
- Loading: skeleton; Empty: n/a; Error: retry.
- Permissions: override requires coordinator role.
- Success: n/a.
- Edge cases: manual override is always visually distinguished from the system-calculated score ("Coordinator-adjusted from 62 to 80 — reason: victim's condition confirmed worse via phone call").

**38. Recommended Responders**
- Purpose: the heart of the dispatch decision.
- User: Coordinator.
- Entry: from Incident Detail.
- Components: ranked list of responders that passed hard constraints, each showing match score, ETA, key matched capabilities; a separate, clearly-labeled "Not eligible" section showing filtered-out responders with the specific failed constraint (e.g., "No boat available").
- Primary action: select top responder → Dispatch Approval.
- Secondary: compare two responders side by side; manually search all responders.
- Data: ranked responder list + exclusion reasons.
- API: `GET /incidents/:id/responders`.
- Loading: skeleton; Empty: "No eligible responders currently available" (see edge case #2, §24) with escalation options; Error: retry.
- Permissions: none additional.
- Success: n/a.
- Edge cases: zero eligible responders is a first-class state with its own guidance (broaden search radius, request mutual aid, manually override a soft constraint) — never a blank/broken-looking screen.

**39. Responder Comparison**
- Purpose: side-by-side decision support for close calls.
- User: Coordinator.
- Entry: "Compare" from Recommended Responders.
- Components: 2–3 column comparison table (skills, equipment, capacity, ETA, distance, reliability, match score).
- Primary action: select one → Dispatch Approval.
- Secondary: add/remove a responder from comparison.
- Data: selected responders' full profiles.
- API: `GET /responders/:id` (batch).
- Loading: skeleton table; Empty: n/a; Error: retry.
- Permissions: none additional.
- Success: n/a.
- Edge cases: none beyond standard.

**40. Dispatch Approval**
- Purpose: the explicit human-in-the-loop gate — nothing dispatches without this screen.
- User: Coordinator.
- Entry: from Recommended Responders or Comparison.
- Components: summary of incident + chosen responder + reasoning + ETA, large "Approve Dispatch" button, "Cancel."
- Primary action: Approve Dispatch.
- Secondary: go back and pick someone else.
- Data: proposed mission summary.
- API: `POST /missions`.
- Loading: spinner; Empty: n/a; Error: retry, mission not created until success confirmed (no partial dispatch state).
- Permissions: coordinator role required (enforced server-side, not just UI-hidden).
- Success: confirmation + routes to Active Mission Tracking.
- Edge cases: two coordinators attempting to dispatch the same responder to different incidents simultaneously (edge case #20, §24) — server-side optimistic locking rejects the second approval with a clear "This responder was just assigned to another incident" message and refreshes recommendations.

**41. Active Mission Tracking**
- Purpose: live view of one dispatched mission.
- User: Coordinator.
- Entry: from Dispatch Approval success, or Missions tab.
- Components: status stepper, live map position (if available), citizen + responder summary, "Reassign" button, timeline.
- Primary action: monitor (passive) or Reassign if needed.
- Secondary: contact responder (in-app message/call bridge if available), cancel mission.
- Data: mission status, position, timeline.
- API: `GET /missions/:id`, realtime subscription.
- Loading: skeleton; Empty: n/a; Error: cached last-known state + staleness indicator.
- Permissions: none additional.
- Success: n/a (live).
- Edge cases: responder goes silent (no status update or position ping beyond a threshold) → visually flagged as "No update in Xm," not silently trusted as still-fine.

**42. Reassignment**
- Purpose: coordinator-approved responder swap.
- User: Coordinator.
- Entry: "Reassign" on Active Mission Tracking, or triggered automatically from a volunteer's blocker report.
- Components: reason (auto-filled if triggered by a blocker), re-ranked alternative responder list, same recommendation/exclusion format as screen 38.
- Primary action: Approve reassignment.
- Secondary: cancel and keep current responder (e.g., blocker was resolved).
- Data: new candidate list.
- API: `POST /missions/:id/reassign`.
- Loading: spinner; Empty: "No alternative responders currently available"; Error: retry.
- Permissions: coordinator role.
- Success: original responder released, new responder notified, citizen informed.
- Edge cases: original responder's partial progress/notes are preserved and visible to the new responder and coordinator, not discarded.

**43. Live Map**
- Purpose: full spatial operational picture.
- User: Coordinator.
- Entry: Map tab.
- Components: layered markers (incidents by urgency color, responders by availability/status, shelters, supply hubs), route overlays for active missions, filter toggles per layer.
- Primary action: tap a marker → relevant detail screen.
- Secondary: toggle layers, search area.
- Data: all geo-tagged entities.
- API: `GET /map/snapshot` + realtime subscription.
- Loading: skeleton map; Empty: "No active entities in this area"; Error: cached snapshot + staleness banner.
- Permissions: location (coordinator's own, optional).
- Success: n/a.
- Edge cases: dense marker clusters auto-cluster with a count badge rather than overlapping illegibly.

**44. Resource Overview**
- Purpose: shelters + supplies + vehicles capacity tracking in one place.
- User: Coordinator.
- Entry: Resources tab.
- Components: tabbed sub-sections (Shelters / Supplies / Vehicles), each with available/reserved/deployed/exhausted counts.
- Primary action: tap an item → detail/edit.
- Secondary: manually adjust counts (logged).
- Data: resource inventory.
- API: `GET /resources`.
- Loading: skeleton; Empty: "No resources registered"; Error: cached list.
- Permissions: coordinator/NGO-manager role.
- Success: n/a.
- Edge cases: an over-allocation attempt (see §16 example) is blocked at the API level, not just the UI, with a clear reason.

**45. Shelter Overview**
- Purpose: shelter-specific detail (sub-view of Resources).
- User: Coordinator.
- Entry: from Resource Overview → Shelters tab, or a shelter marker on the map.
- Components: capacity bar (used/total), special capabilities (medical, pet-friendly), contact info, recent occupancy trend.
- Primary action: edit capacity (NGO-manager) or none (coordinator, view-only unless also manager).
- Secondary: mark full/closed.
- Data: shelter record.
- API: `GET /shelters/:id`, `PATCH /shelters/:id`.
- Loading: skeleton; Empty: n/a; Error: retry.
- Permissions: edit requires NGO-manager or coordinator-with-write role.
- Success: confirmation toast.
- Edge cases: none beyond standard over-allocation guard.

**46. Alerts (Notification Inbox)**
- Purpose: coordinator's own notification log — see §15 for full notification catalog.
- User: Coordinator.
- Entry: bell icon.
- Components: chronological, filterable by priority (Critical/normal), acknowledgement requirement flag.
- Primary action: tap → relevant detail; acknowledge if required.
- Secondary: mark all read (non-critical only — critical alerts require individual acknowledgement).
- Data: notification history.
- API: `GET /notifications?user=me`, `POST /notifications/:id/ack`.
- Loading: skeleton; Empty: "No alerts"; Error: cached list.
- Permissions: push notifications.
- Success: n/a.
- Edge cases: unacknowledged Critical alerts persist visibly (badge count on the tab) until acknowledged, not just until viewed.

**47. Incident Timeline**
- Purpose: full chronological history of one incident, human-readable.
- User: Coordinator.
- Entry: from Incident Detail.
- Components: chronological event list (report received, score calculated, escalations, dispatch, status changes, reassignments, completion) in plain language.
- Primary action: none (read-only).
- Secondary: export/share (future roadmap in MVP; may render a shareable summary).
- Data: incident event log.
- API: `GET /incidents/:id/timeline`.
- Loading: skeleton; Empty: n/a (an incident always has at least a "Received" event); Error: cached view.
- Permissions: coordinator role.
- Success: n/a.
- Edge cases: this is the human-readable twin of the Audit Log (screen 48) — it explains *what happened*, while the audit log explains *who did it and when* at a system level.

**48. Audit Log**
- Purpose: accountability record for every consequential system/human action.
- User: Coordinator (org-admin level).
- Entry: Profile/settings → Audit Log.
- Components: filterable log (by incident, by actor, by action type, by date range), each entry showing actor, action, target, timestamp, before/after values where relevant.
- Primary action: none (read-only).
- Secondary: filter/export.
- Data: full audit trail.
- API: `GET /audit-log`.
- Loading: skeleton; Empty: n/a; Error: cached page.
- Permissions: coordinator/admin role only — never visible to citizens or volunteers.
- Success: n/a.
- Edge cases: audit log entries are append-only and cannot be edited or deleted through the app, including by admins (see §22).


---

## 15. Functional Requirements

**FR-1** The system shall accept emergency reports via text and voice input, with optional photo attachment.
**FR-2** The system shall extract structured incident data (people affected, vulnerabilities, hazards, category, location) from free-form input using an AI extraction layer.
**FR-3** The system shall attach a confidence score to each extracted field and visually flag low-confidence fields as "needs verification."
**FR-4** The system shall never auto-fill a field with an invented specific value (e.g., an exact depth, an exact headcount) that was not stated or clearly implied by the reporter.
**FR-5** The system shall calculate a deterministic urgency score (0–100) for every incident using the formula defined in §16, and shall never delegate the final score to an LLM judgment call.
**FR-6** The system shall display an itemized, human-readable breakdown of every urgency score on demand.
**FR-7** The system shall allow a coordinator to manually correct extracted incident data, and shall recalculate the urgency score immediately upon any such correction.
**FR-8** The system shall identify required responder capabilities (skills, equipment, vehicle, capacity) for each incident based on extracted data and category-based inference rules.
**FR-9** The system shall filter candidate responders using hard constraints before ranking, and shall never present a responder who fails a hard constraint as a primary recommendation.
**FR-10** The system shall rank hard-constraint-passing responders using a deterministic soft-scoring formula (§17) incorporating ETA, distance, capability match quality, and reliability.
**FR-11** The system shall display, for every recommendation, a plain-language reason why that responder was chosen and why others were excluded.
**FR-12** The system shall require explicit coordinator approval before any mission is created; no mission shall be auto-dispatched by AI or the rules engine alone.
**FR-13** The system shall notify the selected responder of a new mission and require an explicit accept/decline response.
**FR-14** The system shall track mission status through the pipeline: Assigned → Accepted → En Route → Arrived → Completed (with Declined/Blocked/Cancelled/Reassigned as branching states).
**FR-15** The system shall propagate status changes to the citizen in real time (or as soon as connectivity allows).
**FR-16** The system shall detect a mission blocker report and surface a coordinator alert with re-ranked alternative responders.
**FR-17** The system shall never execute a reassignment without coordinator approval, except releasing the original responder back to "available" once approval is given.
**FR-18** The system shall flag new incident reports that are likely duplicates of existing open incidents, based on geographic proximity, category match, semantic similarity, and time window, and shall surface a merge/keep-separate/investigate decision to a coordinator. It shall never auto-merge.
**FR-19** The system shall track resource inventory (shelter beds, vehicles, supply units) across available/reserved/deployed/exhausted states and shall reserve resources atomically at dispatch approval time.
**FR-20** The system shall prevent any dispatch or recommendation that would over-allocate a resource beyond its available count.
**FR-21** The system shall queue citizen reports and status updates locally when offline and submit them automatically upon reconnection, preserving original timestamps.
**FR-22** The system shall display a clear, persistent offline indicator whenever connectivity is degraded or unavailable, along with a "last synced" timestamp.
**FR-23** The system shall enforce role-based access control server-side (not only via UI hiding) for all coordinator- and admin-level actions.
**FR-24** The system shall maintain an append-only audit log of every consequential state change (score override, dispatch approval, reassignment, resource adjustment) including actor, timestamp, and before/after values.
**FR-25** The system shall display safety disclaimers on route/map screens indicating that routes may be outdated and that TriNetra does not guarantee response arrival.
**FR-26** The system shall support at minimum the citizen's local language for voice/text input and translate extracted summaries into the coordinator's working language.

---

## 16. Urgency Scoring Engine

The urgency engine is **deterministic and rules-based**. The AI's job ends at *extraction* — turning "three people trapped on rooftop, water rising, child has asthma" into structured facts (people_affected: 3, location_type: rooftop, hazard: rising_water, vulnerability: child_medical_condition). The rules engine's job is to take those facts and compute a score using a fixed, auditable formula. This separation exists so that (a) the same facts always produce the same score, (b) a human can verify the math by hand, and (c) the score is legally/operationally defensible after the fact.

### 16.1 Scoring Factors and Weights (0–100 scale, additive with capped ceiling)

| Factor | Points | Notes |
|---|---|---|
| Immediate threat to life | +30 | Trapped, drowning risk, fire contact, structural collapse in progress |
| Rising floodwater / active fire spread / active structural failure | +12 | "Worsening hazard" flag |
| Medical emergency (non-chronic, acute) | +15 | Bleeding, unconscious, breathing difficulty |
| Medicine dependency at risk (e.g., insulin, asthma, dialysis) | +10 | Time-boxed medical risk |
| Child present | +12 | Under 12, or reporter-identified as child |
| Elderly person present | +8 | 65+, or reporter-identified as elderly |
| Person with disability present | +8 | Mobility/sensory/cognitive, as reported |
| Pregnancy | +10 | As reported |
| Number of people affected | +2 per person, capped at +14 | Scales with group size |
| Isolated / hard-to-reach location | +10 | Rooftop, cut off by water, no road access |
| Blocked access route | +6 | Compounds isolation |
| Lack of shelter (currently exposed) | +6 | Outdoors, structure destroyed |
| Time sensitivity stated by reporter ("running out of time," escalating) | +8 | From explicit language or escalation event |
| **Confidence penalty** | −3 to −10 | Applied when AI extraction confidence is low on a factor that materially affects the score; higher penalty for more uncertain critical factors |

**Ceiling:** total is capped at 100. **Floor:** total cannot go below 0. Every factor that fires is logged individually — the sum is never presented without its components.

### 16.2 Urgency Bands

| Score | Band |
|---|---|
| 80–100 | **Critical** |
| 55–79 | **High** |
| 30–54 | **Medium** |
| 0–29 | **Low** |

### 16.3 Example Breakdown (as shown to a coordinator)

```text
URGENT — 86  (Critical)

+30  Immediate threat to life
+12  Child present
+15  Medical emergency
+12  Rising water
+10  Isolated location
 -3  Incomplete information (people count unconfirmed)
────────────────────────────
 =86
```

### 16.4 Manual Correction and Recalculation

Any factual field a coordinator edits on Incident Detail (§14, screen 36) triggers an immediate, visible recalculation. The breakdown updates line-by-line so the coordinator can see exactly which correction changed which points. If a coordinator instead overrides the *final score* directly (rather than correcting a fact), that override is stored as a separate, clearly labeled delta ("Coordinator-adjusted from 62 to 80") with a mandatory reason field, and both the system-calculated and human-adjusted scores remain visible in the audit trail — the system score is never silently overwritten and lost.

### 16.5 Why This Must Be Deterministic

An LLM asked "how urgent is this?" will produce different answers for the same input on different runs, cannot be hand-verified by a stressed coordinator in five seconds, and cannot be defended after the fact ("why did the algorithm rank this lower?") without re-running an opaque model. A fixed formula can be checked with a calculator, audited after an incident, and tuned by domain experts (disaster-response professionals, not ML engineers) as real-world experience accumulates.

---

## 17. Responder Matching Engine

### 17.1 Hard Constraints (must ALL pass — disqualifying if any fails)

| Constraint | Rule |
|---|---|
| Required skill(s) | Responder's skill set must be a superset of the incident's required skill set |
| Required vehicle type | If a specific vehicle type is mandatory (e.g., boat for water rescue), responder must have it |
| Required equipment | Responder must have all mandatory equipment (e.g., life jackets for water rescue with children) |
| Capacity | Responder's passenger or cargo capacity must be ≥ the incident's required capacity |
| Availability | Responder must be marked Available |
| Conflicting mission | Responder must not currently hold an active (non-completed, non-cancelled) mission |
| Organizational eligibility (if applicable) | Responder must not be excluded by org-level restrictions (e.g., a partner org's volunteers reserved for their own service area, if configured) |

A responder failing even one hard constraint is excluded from the primary recommendation list entirely and shown, if at all, only in the "Not eligible" section with the specific failed constraint named (e.g., "No boat available," "Capacity 2 < required 5").

### 17.2 Soft Ranking Factors (applied only to hard-constraint survivors)

| Factor | Weight | Description |
|---|---|---|
| ETA | 40% | Lower is better; primary speed factor |
| Capability match quality | 25% | Exact match vs. overqualified vs. minimum-sufficient; rewards closer fit to actual need |
| Distance | 15% | Secondary to ETA (ETA accounts for road conditions; raw distance is a tiebreaker/sanity check) |
| Capacity fit | 10% | Penalizes wildly oversized capacity slightly (a 20-person van is not ideal for 1 person if a closer 4-person vehicle exists) vs. rewards a snug, sufficient fit |
| Reliability score | 10% | Historical accept rate / completion rate / low blocker-without-cause rate |

**Compatibility Score = (0.40 × normalized_ETA_score) + (0.25 × capability_match_score) + (0.15 × normalized_distance_score) + (0.10 × capacity_fit_score) + (0.10 × reliability_score)**, each sub-score normalized to 0–100 before weighting, producing a final 0–100 compatibility score per eligible responder.

### 17.3 Worked Example

Incident requires: water rescue skill, boat, life jackets, capacity ≥ 3.

| Responder | Skill | Boat | Life jackets | Capacity | Result |
|---|---|---|---|---|---|
| A (motorcycle, first aid, cap 2) | ✗ water rescue | ✗ | ✗ | 2 < 3 | **Excluded** — fails skill, vehicle, equipment, capacity |
| B (rescue boat, water rescue, first aid, cap 6, ETA 12m) | ✓ | ✓ | ✓ | 6 ≥ 3 | **Eligible** — compatibility score computed |
| C (rescue boat, water rescue, cap 4, ETA 20m, no life jackets logged) | ✓ | ✓ | ✗ | 4 ≥ 3 | **Excluded** — fails equipment constraint |

Only B is recommended; A and C appear in "Not eligible" with their specific failure reasons.

### 17.4 Why This Must Be Deterministic and Auditable

The matching decision is the moment TriNetra most directly affects whether help arrives capable of actually helping. A black-box ranking cannot be explained to a coordinator who has seconds to decide, cannot be defended afterward if a mistake is questioned, and cannot be tuned safely — a weight change should be a reviewable configuration change, not a retraining run. Every hard-constraint exclusion and every soft-score component is stored per mission for later review.


---

## 18. Resource Matching

Beyond responder-to-incident matching, TriNetra tracks physical resources — shelters, supply hubs, vehicles held in a pool rather than tied to an individual responder — through the same available/reserved/deployed/exhausted lifecycle.

**Reservation rule:** a resource is reserved at the moment a coordinator approves a dispatch or allocation that consumes it — never earlier (a mere recommendation does not reserve) and never later (waiting until "arrival" would allow double-booking in the interim).

**Over-allocation prevention:** every allocation request is validated against `available_count` at write time with an atomic decrement; a request that would drive `available_count` below zero is rejected outright, with the coordinator shown the next-best alternative resource.

**Example:** a shelter has 20 available beds and 20 are already reserved from an earlier mission. A new request for 10 more beds at that shelter is rejected; the system instead surfaces the next-nearest shelter with sufficient open capacity.

**Release rule:** on mission completion or cancellation, consumable resources (e.g., delivered food packets) move to `deployed` permanently; reusable capacity (e.g., a shelter bed, once the person leaves) can be manually released back to `available` by a coordinator/NGO-manager — it is never auto-released, since real-world occupancy isn't guaranteed to match system state without human confirmation.

---

## 19. AI Architecture

### 19.1 Division of Responsibility

| Layer | Responsibility |
|---|---|
| **AI (LLM/speech APIs)** | Speech-to-text, translation, structured extraction, incident classification, entity extraction, summarization, duplicate semantic-similarity scoring, photo description (hedged/uncertain language only), natural-language status interpretation (e.g., parsing a volunteer's free-text blocker note into a category) |
| **Deterministic rules engine** | Urgency scoring, hard capability filtering, capacity validation, responder availability checks, assignment conflict checks, dispatch approval gating, escalation trigger logic, resource over-allocation prevention, audit logging |

### 19.2 Why This Hybrid Architecture Is Safer

AI is excellent at turning messy human language into structured candidates for facts, and bad at being a consistent, explainable, accountable decision-maker under safety-critical stakes. Splitting the pipeline this way means:
- The same structured facts always produce the same urgency score and the same eligible-responder set — reproducibility a pure-LLM pipeline cannot offer.
- Every safety-critical decision (score, dispatch eligibility) can be explained in plain arithmetic to a non-technical coordinator, and defended after the fact.
- AI errors (misheard word, bad transcription, an odd photo guess) are contained to the *extraction* stage, where a human explicitly reviews and can correct the data — they cannot silently cascade into an unreviewed dispatch decision.
- The system can be tuned (weights, thresholds) by disaster-response domain experts editing a formula, not by ML engineers retraining a model.

### 19.3 Confidence Scores

Every AI-extracted field carries a confidence value. Fields below a configured threshold are visually flagged **"Needs verification"** on both the citizen's review screen (§14, screen 8) and the coordinator's Incident Detail screen (§14, screen 36), and they factor into the urgency score's confidence penalty (§16.1).

### 19.4 Hard Boundaries — What AI Must Never Invent

The AI layer must never fabricate: exact location, exact medical condition/severity, exact number of people, responder capabilities, shelter capacity, route safety, or resource availability. Where visual or textual evidence is ambiguous, the AI produces hedged language ("possible floodwater visible — verification required"), never a fabricated precise claim ("water is exactly 1.5 meters deep").

### 19.5 Photo Processing Pipeline

An attached photo is optional context, not a required or authoritative input — it is processed through a dedicated pipeline that keeps the same hedged, human-verified posture as text/voice extraction, and never blocks report submission if any step fails.

**1. Capture & compress on-device.** `expo-image-picker`/`expo-camera` capture, then `expo-image-manipulator` resizes (max ~1280px) and compresses (~70% quality) before upload — disaster-zone connectivity is poor, and an uncompressed photo can stall a report that should submit in seconds.

**2. Strip metadata, then upload.** EXIF data — especially embedded GPS, which duplicates the location already captured explicitly and could leak precise location if the photo is ever shared out of context — is stripped client-side. The image uploads to a private, RLS-protected Supabase Storage bucket. If offline, the upload queues the same way other writes queue (§26); the report itself submits without waiting on the photo.

**3. Optional quality gate.** A cheap pre-check (blur detection via Laplacian variance, corrupt-file check, minimum resolution) runs in a lightweight JS image library server-side, rejecting or flagging unusable photos before they reach the vision model. Supabase Edge Functions run on Deno, so this is implemented with a JS-native library (e.g. `sharp`), not native OpenCV bindings. This is the one place classical CV techniques belong in this pipeline — as a gate, never as the extraction engine (see §19.1's division of responsibility).

**4. Vision-language extraction, not classic object detection.** The compressed image is passed to Claude's vision input in the same call as the text/voice extraction, under a system prompt that enforces hedged language: describe only what's visible, flag possible hazards as "possible — needs verification," never assert exact depth, severity, or headcount. Output is structured JSON (e.g. `{"visible_hazards": [...], "confidence": 0.x, "notes": "..."}`), matching the same schema shape as text/voice extraction output.

**5. Merge as flagged, not authoritative, data.** Photo-derived hints write into the same `hazards`/`required_capabilities` fields as text/voice extraction, but each carries its own confidence score and a `"source": "photo"` provenance tag. A photo-derived hazard never silently overwrites a citizen-stated fact; if the two contradict, both are shown to the coordinator rather than one quietly winning.

**6. Surface with the standard uncertainty vocabulary.** On Incident Details (citizen review, §14 screen 8) and Incident Detail (coordinator, §14 screen 36), photo-derived flags render with the same **"Needs verification"** badge used everywhere else in the product (§31), keeping the vocabulary of uncertainty consistent regardless of source.

**7. Fail gracefully, never block.** A vision-API timeout or error does not fail the incident submission — the report still submits with structured fields from text/voice alone, and the raw photo remains attached for the coordinator to view manually (§33's fallback-not-fail principle applies here too).

**Schema note:** `incidents.hazards` (jsonb) and `incidents.vulnerabilities` (jsonb) entries derived from a photo carry `"source": "photo"` and their own `"confidence"` value alongside any text/voice-derived entries for the same incident, per §27's `hazards`/`vulnerabilities` fields.

---

## 20. Human-in-the-Loop Safety Model

TriNetra is a **decision-support system**, not an autonomous emergency authority. This is enforced structurally, not just by policy:

1. **No AI-only dispatch path exists in the codebase.** The `POST /missions` endpoint that creates a mission requires an authenticated coordinator-role actor; there is no service-to-service path that can call it directly from the scoring or matching engine.
2. **Every recommendation is a suggestion, never a command.** The UI language throughout uses "Recommended," never "Assigned" or "Dispatching," until a coordinator has explicitly approved (§14, screen 40).
3. **Reassignment requires the same gate.** A detected blocker produces an *alert and a re-ranked suggestion*, not an automatic swap (§13.3).
4. **Duplicate merges require the same gate.** Similarity detection never auto-merges (§17-style FR-18/§21).
5. **Score overrides are logged, not hidden.** A coordinator can override the deterministic score, but the system-calculated value and the override both remain visible and attributed (§16.4).
6. **The system explicitly disclaims replacing official emergency services** (§23) on every citizen-facing safety surface.

---

## 21. Realtime Architecture

### 21.1 Status Propagation Flow

```text
Citizen submits request
        ↓
Coordinator receives incident        (realtime push)
        ↓
Coordinator assigns responder        (dispatch approval)
        ↓
Volunteer receives notification      (push notification + realtime)
        ↓
Volunteer accepts                    (realtime update)
        ↓
Coordinator sees "Accepted"          (realtime)
        ↓
Volunteer starts mission             (status: En Route)
        ↓
Coordinator sees "En Route"          (realtime)
        ↓
Volunteer arrives                    (status: Arrived)
        ↓
Citizen sees "Arrived"               (realtime + push)
        ↓
Mission completed                    (realtime + push, all parties)
```

### 21.2 Technology Recommendation

**Recommended for the hackathon MVP: Firebase (Firestore + Firebase Cloud Messaging), or Supabase Realtime (Postgres + logical replication) as an equally strong alternative.**

| Option | Pros for a 48–72h MVP | Cons |
|---|---|---|
| **Firestore + FCM** | Realtime listeners with almost no backend code, generous free tier, push notifications built in, fast to wire into React Native, minimal ops | NoSQL data modeling is less natural for the relational incident/mission/responder schema in §27; harder complex queries |
| **Supabase Realtime (Postgres)** | Real relational schema (matches §27 directly), Row Level Security for role-based access (§29), Postgres triggers can power realtime channels, SQL is easier to reason about for the matching/scoring logic | Slightly more setup than Firestore for realtime subscriptions; push notifications need a companion service (e.g., FCM/OneSignal alongside it) |
| **Raw WebSockets + custom Node.js backend** | Full control | Too much plumbing to build in 48–72 hours; not recommended for MVP |

**Recommendation: Supabase (Postgres + Realtime + Row Level Security).** The domain model in this PRD (incidents, responders, missions, resources with foreign keys and constraints) is fundamentally relational, and the hard-constraint matching logic in §17 is naturally expressed as SQL queries and views. Row Level Security maps directly onto the role-based access rules in §29, giving security enforcement "for free" at the database layer rather than only in application code. Realtime subscriptions on `incidents`, `missions`, and `notifications` tables cover every live-update requirement in §21.1. Push notifications are layered on top via Firebase Cloud Messaging (Supabase does not include push) or a lightweight service like OneSignal, triggered by a Postgres function/edge function on relevant row changes.

---

## 22. Maps and Routing

### 22.1 Citizen
Current location (auto-detected), manual pin adjustment, location-accuracy indicator, nearby shelters/help centers on a simple map view.

### 22.2 Volunteer
Incident location, calculated route, live ETA, blocked-road reporting affordance, destination marker.

### 22.3 Coordinator
Full layered map: incident markers (color-coded by urgency band), responder markers (color-coded by status), shelter markers, supply-hub markers, active mission routes.

### 22.4 Safety Disclaimer
The map/route experience never implies a guaranteed-safe route. Every route-bearing screen displays:

> **"Route information may be outdated during active disasters. Follow authorized local guidance."**

### 22.5 Hackathon Data Strategy
Live routing APIs (Google Maps Directions, Mapbox Directions) are used where available, but the system must fall back to **mocked/seeded route data** (a small set of pre-defined polylines and ETAs for the demo area) if the live API fails or rate-limits during a demo — this is a designed fallback, not an afterthought (see §26 seed data, §21 offline strategy).

---

## 23. Notifications

### 23.1 Citizen
| Notification | Priority | Ack required? |
|---|---|---|
| Report received | Normal | No |
| Request prioritized (score assigned) | Normal | No |
| Responder assigned | High | No |
| Responder en route | High | No |
| Responder arrived | Critical | No |
| Request completed | Normal | No |
| Request escalated (system-detected worsening) | High | No |
| Important safety alert (area-wide) | Critical | No |

### 23.2 Volunteer
| Notification | Priority | Ack required? |
|---|---|---|
| New mission offer | Critical | **Yes** — accept/decline required |
| Mission changed (details updated) | High | No |
| Mission cancelled | High | No |
| Route/blockage issue affecting them | High | No |
| Reassignment request (asked to take over) | Critical | **Yes** |
| Critical area-wide alert | Critical | No |

### 23.3 Coordinator
| Notification | Priority | Ack required? |
|---|---|---|
| New Critical incident | Critical | **Yes** |
| Responder declined mission | High | No |
| Responder reported "unable to complete" | High | No |
| Duplicate report detected | Normal | No |
| Resource shortage (available count hits 0 or a low threshold) | High | No |
| Mission delayed (ETA significantly exceeded) | High | No |
| Incident worsening (citizen-reported escalation) | Critical | **Yes** |

Acknowledgement-required notifications persist as unread/badge state until explicitly acknowledged (not merely viewed), and re-surface on the Operations Dashboard until cleared.


---

## 24. Duplicate Detection

**Signals used:** geographic proximity (within a configurable radius, e.g., 150m), incident category match, semantic similarity of description (via embedding similarity on the AI-extracted summary), and a time window (e.g., reports within the last 2 hours).

**Example:**
- "Family trapped near school."
- "People stranded beside the school."
- "Three people stuck near ABC school."

These three reports, arriving close together in time and location with matching category, are flagged with a **⚠️ Possible duplicate incident** banner on the coordinator's Incident Detail screen, linking to the candidate matches.

**Coordinator options:** Merge (combines into one incident, preserving all original reporter contacts and photos as attachments to the merged record), Keep Separate (explicitly dismisses the flag, logged), or Investigate (leaves both open but linked, pending a field confirmation).

**Rule:** the system never auto-merges, especially for high-urgency incidents — a false merge could mean one of two genuinely separate emergencies never gets its own responder.

---

## 25. Dynamic Reassignment

One of the strongest demo features. Exact state transitions:

```text
Mission [Assigned]
      ↓ volunteer accepts
Mission [Accepted]
      ↓ volunteer starts moving
Mission [En Route]
      ↓ road becomes blocked / volunteer reports blocker
Mission [Blocked]  ──→  Coordinator alert raised (Critical priority, ack required)
      ↓ coordinator reviews
System re-ranks alternative eligible responders (same hard-constraint + soft-ranking pipeline as original dispatch, §17)
      ↓ coordinator approves reassignment
Mission [Reassigned] → original responder released to [Available], new responder's mission created as [Assigned]
      ↓ new responder accepts
Mission [Accepted] → ... (pipeline continues normally)
```

If the coordinator instead determines the blocker is resolved (e.g., the volunteer found an alternate path), they can dismiss the alert and the mission returns to **[En Route]** without triggering a reassignment.

If no alternative responder is eligible at the time of a blocker, the mission enters a **[Needs Backup]** state, visible prominently on the Operations Dashboard, and re-checks automatically as responder availability changes.

---

## 26. Offline/Low-Connectivity Strategy

Disasters frequently degrade connectivity. The MVP does **not** promise full offline-first architecture — that is explicitly future roadmap (§45) — but it does define a realistic, honest degraded-mode behavior:

- **Locally cached essential UI:** safety information (§14 screen 14), the citizen's own active request summary, and a volunteer's current mission detail are cached locally and remain viewable with no connection.
- **Retry queue:** report submissions, status updates, blocker reports, and escalation reports made while offline are queued locally (in order, with original timestamps) and automatically submitted once connectivity returns.
- **Pending state indicators:** any queued/unsent item is visibly marked "Pending — will send when connected," never silently treated as sent.
- **Last known information + sync timestamp:** every live-data screen (dashboard, map, mission tracking) shows a "Last updated Xm ago" indicator when data is stale, rather than presenting cached data as current.
- **Clear offline indicator:** a persistent, unmissable banner appears app-wide when the device has no connectivity.
- **Fallback demo data:** for the hackathon specifically, mocked route/location data (§22.5) ensures the golden-path demo does not depend on a live third-party API being reachable in the room.

**Future roadmap (explicitly not MVP):** offline report creation with local-first storage, SMS-based reporting fallback for feature phones, delayed multi-device synchronization, and a genuinely low-bandwidth data mode (text-only, no images/maps) for 2G-equivalent conditions.


---

## 27. Database Schema

Relational (Postgres/Supabase). Primary keys are UUIDs unless noted.

### `users`
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| name | text | |
| phone | text, unique, nullable | nullable to support guest citizens |
| email | text, unique, nullable | |
| role | enum(citizen, volunteer, coordinator, ngo_manager) | |
| language | text | ISO code |
| org_id | uuid FK → organizations.id, nullable | |
| status | enum(active, suspended) | |
| created_at | timestamptz | |

### `organizations`
id, name, type (ngo, government, independent_network), created_at.

### `incidents`
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| reporter_id | uuid FK → users.id, nullable | nullable for guest reports |
| category | enum(flood, fire, earthquake, landslide, cyclone, building_collapse, medical, other) | |
| description | text | raw + AI-normalized summary |
| location | geography(point) | lat/long |
| location_accuracy_m | numeric, nullable | |
| people_affected | integer | |
| vulnerabilities | jsonb | e.g. {"child":true,"elderly":false,"pregnant":false,"disability":false,"medical_dependency":"asthma"} |
| hazards | jsonb | e.g. {"rising_water":true,"fire":false,"structural_collapse":false}; entries may carry per-entry "source" (text/voice/photo) and "confidence" per §19.5 |
| required_capabilities | jsonb | derived: skills[], vehicle, equipment[], min_capacity |
| urgency_score | integer | 0–100 |
| urgency_score_breakdown | jsonb | itemized factors, per §16.3 |
| urgency_level | enum(critical, high, medium, low) | derived from score |
| confidence | numeric | 0–1, overall extraction confidence |
| status | enum(received, prioritized, assigned, en_route, arrived, completed, cancelled, invalid) | |
| duplicate_of | uuid FK → incidents.id, nullable | set when merged |
| photo_url | text, nullable | signed/private Supabase Storage reference, EXIF-stripped |
| photo_confidence | numeric, nullable | 0–1, overall confidence of the photo-derived extraction, per §19.5 |
| photo_extraction_status | enum(not_submitted, pending, succeeded, failed), nullable | tracks the pipeline outcome so a failed vision call is visibly distinct from "no photo attached" |
| created_at / updated_at | timestamptz | |

### `responders`
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid FK → users.id | |
| org_id | uuid FK → organizations.id, nullable | |
| skills | text[] | |
| vehicle_type | enum(none, motorcycle, car, van, boat, ambulance, truck, other) | |
| equipment | text[] | |
| passenger_capacity | integer | |
| cargo_capacity | integer, nullable | |
| languages | text[] | |
| location | geography(point) | last known position |
| availability | boolean | |
| availability_until | timestamptz, nullable | |
| current_mission_id | uuid FK → missions.id, nullable | |
| reliability_score | numeric | 0–100, computed from mission history |
| created_at / updated_at | timestamptz | |

### `missions`
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| incident_id | uuid FK → incidents.id | |
| responder_id | uuid FK → responders.id | |
| assigned_by | uuid FK → users.id | coordinator who approved dispatch |
| status | enum(assigned, accepted, declined, en_route, blocked, arrived, completed, cancelled, reassigned, needs_backup) | |
| match_score | numeric | compatibility score at time of dispatch (§17.2) |
| match_reasoning | jsonb | eligible/excluded snapshot for audit |
| eta_minutes | numeric, nullable | |
| route | jsonb, nullable | polyline/route data |
| blocker_reason | text, nullable | |
| outcome | jsonb, nullable | completion summary |
| created_at / completed_at | timestamptz | |

### `shelters`
id, name, location, total_capacity, available_capacity, reserved_capacity, special_capabilities (jsonb: medical, pet_friendly, etc.), org_id, status (open, filling, full, closed).

### `resources`
id, org_id, type (vehicle, medical_kit, food, water, blanket, other), name, unit_count_total, unit_count_available, unit_count_reserved, unit_count_deployed, location, nullable link to a shelter/supply hub.

### `resource_reservations`
id, resource_id FK, mission_id FK nullable, shelter_id FK nullable, quantity, status (reserved, deployed, released), created_at.

### `notifications`
id, user_id FK, type, priority (normal, high, critical), related_incident_id nullable, related_mission_id nullable, message, requires_ack boolean, acknowledged_at nullable, created_at.

### `incident_timeline`
id, incident_id FK, event_type, actor_id nullable (null = system), description, metadata jsonb, created_at.

### `audit_logs`
id, actor_id FK nullable, org_id nullable, action, target_type, target_id, before_value jsonb nullable, after_value jsonb nullable, reason text nullable, created_at. **Append-only — no UPDATE/DELETE permitted at the application or RLS-policy level.**

### Key relationships
`incidents.reporter_id → users.id` · `missions.incident_id → incidents.id` · `missions.responder_id → responders.id` · `responders.user_id → users.id` · `responders.current_mission_id → missions.id` · `resource_reservations.resource_id → resources.id` · `incident_timeline.incident_id → incidents.id` · `audit_logs.target_id` is polymorphic (indexed alongside `target_type`).

### Key indexes
`incidents(status, urgency_score DESC)` for the priority queue · `incidents USING GIST(location)` for proximity duplicate detection · `responders(availability, location) WHERE availability = true` partial index for fast eligible-responder lookups · `missions(status, incident_id)` · `notifications(user_id, acknowledged_at) WHERE requires_ack = true` for the unacknowledged-alert badge.

---

## 28. API Design

REST-style, implemented as Supabase Postgres tables + Row Level Security + a thin layer of Postgres/Edge Functions for anything requiring server-side logic (scoring, matching, reassignment). Equivalent endpoints either map directly to Supabase's auto-generated REST/RPC interface or to explicit Edge Functions where custom logic is required (marked below with ⚙).

```text
POST   /auth/otp/request
POST   /auth/otp/verify
POST   /auth/coordinator/verify-invite

POST   /incidents                       ⚙ triggers AI extraction + scoring
GET    /incidents                       filterable, sortable by urgency
GET    /incidents/:id
PATCH  /incidents/:id                   ⚙ triggers score recalculation
POST   /incidents/:id/score             ⚙ recompute (also called internally)
GET    /incidents/:id/score-breakdown
POST   /incidents/:id/escalate          ⚙ appends timeline + rescoring
GET    /incidents/:id/responders        ⚙ hard-constraint filter + soft ranking
GET    /incidents/:id/timeline
POST   /incidents/:id/duplicate-check   ⚙ (also runs automatically on create)
PATCH  /incidents/:id/duplicate         merge / keep_separate / investigate

POST   /reports/voice                   ⚙ speech-to-text → extraction → draft incident

POST   /missions                        ⚙ dispatch approval — coordinator-role only
PATCH  /missions/:id/status
POST   /missions/:id/respond            volunteer accept/decline
POST   /missions/:id/blocker
POST   /missions/:id/unable-to-complete
POST   /missions/:id/reassign           ⚙ re-rank + coordinator approval
POST   /missions/:id/outcome
GET    /missions/:id
GET    /missions

GET    /responders
GET    /responders/:id
PATCH  /responders/:id
PATCH  /responders/:id/skills
PATCH  /responders/:id/vehicle
PATCH  /responders/:id/equipment
PATCH  /responders/:id/capacity
PATCH  /responders/:id/availability
GET    /responders/:id/current-mission

GET    /resources
PATCH  /resources/:id                   ⚙ enforces no over-allocation
GET    /shelters
GET    /shelters/:id
PATCH  /shelters/:id

GET    /notifications
POST   /notifications/:id/ack

GET    /operations/summary              ⚙ aggregated dashboard view
GET    /map/snapshot                    ⚙ layered live entities

GET    /audit-log                       coordinator/admin-role only, read-only
GET    /organizations
```

**Realtime equivalents (Supabase Realtime channels, not polled):** `incidents` (row changes → dashboard/queue live updates), `missions` (row changes → status pipeline live updates on all three role UIs), `notifications` (inserts → push + in-app badge).

---

## 29. Authentication and Authorization

- **Citizen:** phone OTP or guest/anonymous session. Guest sessions are device-scoped and can be upgraded to a full account later without losing report history on that device.
- **Volunteer:** phone OTP + profile completion gate for full mission eligibility (an incomplete profile can still receive very limited matches, e.g., general-labor tasks with no hard requirements).
- **Coordinator:** requires an org-issued invite code at signup — never self-service. Coordinator accounts are scoped to their organization's data by default; cross-org visibility (e.g., regional mutual aid) is an explicit future-roadmap permission, not default MVP behavior.
- **NGO Manager:** same invite-gated pattern as coordinator, scoped to managing their org's responders/resources.

Role-based authorization is enforced primarily through **Postgres Row Level Security policies** (so a compromised or buggy client cannot bypass access rules by calling the API directly), with UI-level hiding as a secondary usability layer, per FR-23.

---

## 30. Security and Privacy

- **Least-privilege by default:** a citizen can only read their own incident records (or ones filed as guest on their device); a volunteer can only read incident details for missions assigned to them, and only what's operationally necessary (no other citizens' full profiles, no other volunteers' private contact info); a coordinator's default scope is their own organization.
- **Location privacy:** precise location is visible to the assigned responder and coordinator only for the duration of an active mission; it is not broadcast to other citizens or unrelated volunteers.
- **Medical information privacy:** vulnerability/medical fields are visible only to the assigned responder and coordinator, never to other citizens, and are excluded from any public-facing or aggregate view.
- **Phone number protection:** phone numbers are never displayed directly between citizen and volunteer; any needed contact happens through an in-app relay/masked-call pattern (flagged as a nice-to-have integration; MVP can substitute a simple "request coordinator to relay a message" pattern if a call-masking provider isn't wired up in time).
- **Audit logging:** every score override, dispatch approval, reassignment, and resource adjustment is logged append-only per §27's `audit_logs` table, and is visible only to coordinator/admin roles.
- **Secure storage:** photos and voice recordings are stored in access-controlled object storage (Supabase Storage with RLS-backed bucket policies), not public URLs, with signed/expiring links generated per authorized view.
- **API key protection:** all third-party API keys (speech-to-text, LLM extraction, maps/routing) live server-side in Edge Functions/backend config — never shipped in the mobile client bundle.
- **Abuse and fake-report prevention:** rate limiting on report submission per device/account; repeated reports flagged as invalid by a coordinator reduce a lightweight per-device/account trust signal that can throttle future submissions (not block outright — a genuinely repeat reporter with real emergencies must never be silently suppressed); coordinator-facing "mark false/invalid" action is always available and logged.
- **Coordinator authorization:** gated by org invite code (see §29); coordinator role changes themselves are audit-logged.

---

## 31. Safety Requirements

TriNetra is explicitly **not**: a replacement for 112/emergency services, a replacement for police/fire/ambulance command authority, an autonomous rescue authority, a medical diagnostic system, a guarantee of safe routes, or a guarantee that a responder will arrive.

The following disclaimer is shown at first citizen onboarding, on the Report Submitted Confirmation screen, and on the Safety Information screen:

> **"TriNetra provides decision support and coordination. In life-threatening emergencies, users should contact authorized emergency services according to local procedures."**

**Communicating uncertainty in the UI:** confidence flags on extracted data are shown as visible badges, not buried in fine print; route/ETA screens always carry the routing disclaimer (§22.4); urgency scores are always shown with their breakdown available in one tap, never as a bare unexplained number; "Needs verification" is used consistently as the standard low-confidence label across citizen, volunteer, and coordinator surfaces so the vocabulary of uncertainty is uniform throughout the product.


---

## 32. Edge Cases

| # | Edge Case | Expected Behavior |
|---|---|---|
| 1 | No responder available at all | Incident stays in **Prioritized**, flagged on Operations Dashboard as "Awaiting responder," coordinator can request mutual aid / broaden radius manually |
| 2 | No responder with required capability | Recommended Responders screen shows empty primary list + full "Not eligible" breakdown with reasons; coordinator can widen search radius, request mutual aid from another org, or (with explicit override + reason, logged) dispatch a partial-capability responder as a stopgap |
| 3 | Multiple Critical incidents simultaneously | All Criticals shown in the always-visible top strip of the Operations Dashboard, sorted by score then age; none hidden behind pagination |
| 4 | Duplicate reports | Flagged per §24; never auto-merged; coordinator decides |
| 5 | Incorrect GPS | Citizen sees accuracy indicator and can drag-correct the pin (§14 screen 7); coordinator sees the same accuracy metadata on Incident Detail |
| 6 | Low GPS accuracy | Visible warning above a configurable threshold (e.g., >100m); manual pin strongly encouraged before submit |
| 7 | User has no internet | Report is queued locally with a visible "Pending — will send when connected" state (§26); safety info remains available offline |
| 8 | AI extraction fails entirely | Falls back to raw text/voice transcript with all structured fields empty and clearly marked "Not yet extracted — awaiting retry"; citizen/coordinator can fill fields manually; retry attempted automatically |
| 9 | AI confidence is low | Field-level "Needs verification" badge; contributes a confidence penalty to the urgency score (§16.1); coordinator prompted to confirm/correct before dispatch where feasible |
| 10 | Volunteer declines | Mission auto-reoffered to next-ranked eligible responder; decline reason logged against the mission (not held against reliability score unless a pattern of low-effort declines emerges over time) |
| 11 | Volunteer becomes unavailable mid-mission | Availability toggle is blocked while `current_mission_id` is set (§14 screen 22); they must report a blocker or complete/hand off first |
| 12 | Volunteer is already assigned | Excluded as a hard constraint ("conflicting mission") from any other incident's eligible list (§17.1) |
| 13 | Route becomes blocked | Volunteer reports blocker → mission enters **Blocked** → reassignment workflow (§25) |
| 14 | Shelter is full | Shown as "Full," deprioritized but not hidden, in Nearby Shelters (§14 screen 13) and excluded from new capacity-consuming recommendations (§18) |
| 15 | Resource runs out | `available_count` hits 0 → resource excluded from further recommendations, coordinator gets a shortage notification (§23.3) |
| 16 | Incident becomes more severe | Citizen escalation (§14 screen 12) or coordinator manual correction (§16.4) triggers immediate rescore; if the new score crosses into Critical, a Critical-priority coordinator alert fires |
| 17 | Citizen submits multiple reports | Each is a distinct incident by default; duplicate detection (§24) flags likely duplicates for coordinator review rather than silently merging |
| 18 | False/malicious reports | Coordinator "mark invalid" action (§14 screen 36) sets `status = invalid`, logged in audit trail, contributes to the abuse-prevention trust signal (§30) without outright blocking future genuine reports |
| 19 | Coordinator overrides recommendation | Fully supported — coordinator can select any responder, not just the top-ranked one; the override and reason are logged (§16.4-style pattern applies to dispatch too) |
| 20 | Two coordinators attempt conflicting assignments | Server-side optimistic locking on `responders.current_mission_id`; the second approval attempt is rejected with a clear message and the recommendation list is refreshed automatically (§14 screen 40) |

---

## 33. Error States

Beyond the per-screen error states already specified in §14, the following app-wide error handling principles apply:

- **Never a blank/broken screen.** Every list/detail view has an explicit empty state and an explicit error state with retry, distinct from a loading skeleton.
- **Never silently fail a write.** Every submission (report, status update, dispatch approval) either confirms success, shows a clear retryable error, or — if offline — visibly queues (§26). No write is ever "fired and forgotten" from the user's perspective.
- **Staleness is always labeled.** Any cached/last-known data shown due to connectivity issues carries a "Last updated Xm ago" or equivalent timestamp — cached data is never presented as if it were live.
- **Permission denials degrade gracefully.** Denying location doesn't block reporting (manual pin still works); denying microphone doesn't block reporting (falls back to text); denying push notifications doesn't block core functionality (in-app notification inbox still works).
- **Third-party API failures fall back, not fail.** Speech-to-text failure → text input fallback; routing API failure → mocked/last-known route with disclaimer (§22.5); AI extraction failure → manual field entry (edge case #8 above).

---

## 34. MVP Scope

### P0 — Must Have (core demo, non-negotiable)
- Citizen: guest reporting via text and voice, location confirmation, incident review/submit, request tracking with live status.
- AI extraction of structured incident data with confidence flags.
- Deterministic urgency scoring engine with itemized "Why is this urgent?" breakdown.
- Hard-constraint responder filtering + soft-ranking recommendation engine.
- Coordinator: Operations Dashboard, Incident Detail, Recommended Responders, Dispatch Approval (human-in-the-loop gate).
- Volunteer: profile setup (skills/vehicle/equipment/capacity), availability toggle, incoming mission accept/decline, mission status pipeline (Accepted → En Route → Arrived → Completed).
- Realtime status propagation across all three roles (Supabase Realtime).
- Basic map view (incident + responder markers, route to destination) with seeded/mocked route fallback.
- Core database schema (§27) and API (§28) fully wired for the golden path.
- Basic notification system for the mission pipeline events.
- Minimal seed data for the golden-path demo (§37).

### P1 — Strong Differentiators (build if time permits, in this order)
1. Dynamic reassignment workflow (blocker → re-rank → coordinator approval) — this is the single highest-impact P1 for demo strength.
2. Duplicate incident detection and merge/keep-separate flow.
3. Resource management (shelters/supplies) with over-allocation prevention.
4. Responder Comparison screen.
5. Audit log / Incident Timeline read views.
6. Worsening-condition escalation flow with rescoring.

### P2 — Future Roadmap (explicitly NOT built during the hackathon)
- Full offline-first architecture, SMS fallback reporting, low-bandwidth mode.
- NGO/partner org management beyond minimal seed-level CRUD.
- In-app masked calling/messaging between citizen and volunteer.
- Cross-org mutual aid / regional coordinator visibility.
- Multi-language real-time translation beyond initial extraction/summarization.
- Advanced analytics dashboards and historical reporting exports.
- Custom-trained ML models (explicitly rejected per constraint in §35 of the source brief).

The MVP is scoped to be achievable by a small, capable team (roughly 4 people, per §43 role breakdown) within **48–72 hours**, covering P0 fully and as much of P1 as time allows, with P1 items ordered so that stopping partway through the list still leaves a coherent, demoable product.


---

## 35. Hackathon Demo Scenario (Golden Path)

**Setting:** a flash-flood scenario in a fictional district, seeded ahead of time.

### Incidents

- **R-101:** *"Two adults and a child are trapped on a rooftop. Water is rising. One person has asthma."* → expected: **Critical**, requires water-rescue skill + boat + medical-capable + capacity ≥ 3.
- **R-102:** *"Shelter needs 30 food packets."* → expected: **Medium/Low**, resource-delivery task, requires van/cargo capacity ≥ 30, no rescue skill needed.
- **R-103:** *"Family needs drinking water but is currently safe indoors."* → expected: **Low**, non-urgent supply need, no time pressure factors fire.

### Demo Script (2–3 minutes, narrated live)

1. **(0:00–0:20)** Submit R-101 via voice on the citizen app — speak the sentence naturally. Show the app transcribing and extracting structured fields live.
2. **(0:20–0:35)** Submit R-102 and R-103 quickly (pre-typed, or fast voice) to populate the queue.
3. **(0:35–0:55)** Switch to the Coordinator app: Operations Dashboard shows R-101 in the Critical strip at top, immediately, unprompted. Tap it.
4. **(0:55–1:15)** Show the urgency breakdown for R-101 ("Why is this urgent? — 86, Critical") with itemized factors. Tap "Recommended Responders."
5. **(1:15–1:35)** Show Responder A (motorcycle) excluded with reason "No boat available"; Responder B (rescue boat, water rescue, capacity 6, ETA 12m) recommended with reasoning text matching §10.1's example line. Approve dispatch.
6. **(1:35–1:50)** Switch to the Volunteer app (Responder B's device/emulator): incoming mission notification appears with the same plain-language reasoning; tap Accept.
7. **(1:50–2:05)** Volunteer marks En Route; Coordinator dashboard updates live to "En Route"; Citizen app (R-101 reporter's device) updates live to show a responder is en route with ETA.
8. **(2:05–2:20)** Trigger the seeded roadblock: volunteer taps "Report Blocker" → Blocked. Coordinator receives a Critical alert immediately.
9. **(2:20–2:40)** Coordinator opens Reassignment: sees re-ranked alternative responder, approves. New responder (seeded, pre-positioned) receives the mission instantly.
10. **(2:40–2:55)** New responder accepts, marks En Route → Arrived → Completed in rapid succession (pre-staged for pacing). Citizen app shows the full status progression ending in "Completed."
11. **(2:55–3:00)** Close on the Operations Dashboard showing R-101 resolved, R-102 and R-103 still visible lower in the queue at their correct, lower priority — reinforcing that the system triaged correctly across all three simultaneous incidents throughout the whole demo.

---

## 36. Seed Data

### Incidents (3)
R-101, R-102, R-103 as defined in §35, pre-loadable via a seed script, with R-101 also submittable live during the demo for the "wow" moment of live extraction.

### Responders (5)
| ID | Name (fictional) | Skills | Vehicle | Equipment | Capacity | Availability | Approx. ETA to R-101 |
|---|---|---|---|---|---|---|---|
| Responder A | "Ravi" | First aid | Motorcycle | First-aid kit | 2 | Available | 5 min |
| Responder B | "River Rescue Team" | Water rescue, first aid | Boat | Rescue boat, life jackets, first-aid kit | 6 | Available | 12 min |
| Responder C | "Delivery Crew" | Food delivery, driving | Van | — | 20 packages | Available | 8 min (to R-102) |
| Responder D | "Backup Rescue Team" | Water rescue | Boat | Life jackets | 4 | Available | 18 min (alternate for reassignment demo) |
| Responder E | "Medic Team" | Medical/paramedic, first aid | Ambulance | Medical kit, oxygen | 2 | **Unavailable** (seeded, for edge-case demonstration) |

### Shelters (2)
"Community Hall Shelter" (40 total, 15 available, medical support: yes) and "School Ground Shelter" (60 total, 60 available, pet-friendly: yes).

### Supply Hubs (2)
"District Supply Hub" (food packets: 500 available) and "Riverside Supply Hub" (blankets: 200, water: 300).

### Roadblock (1)
A seeded blocked-road segment on Responder B's route to R-101, triggered on cue during the demo to force the reassignment workflow onto Responder D.

### Unavailable Responder (1)
Responder E, seeded as Unavailable, to demonstrate that the matching engine correctly excludes on-duty-status alone even when skills otherwise match.

The system should demonstrate — concretely, on screen — why the closest responder (Responder A, 5 minutes away) is not the correct choice for R-101, and why Responder B, six-plus minutes further, is recommended instead.

---

## 37. Technical Architecture

```text
                         MOBILE APP (React Native + Expo)
        ┌──────────────────────┼──────────────────────┐
        ↓                      ↓                       ↓
     Citizen UI            Volunteer UI            Coordinator UI
   (role-based nav)       (role-based nav)         (role-based nav)
        │                      │                       │
        └──────────────────────┼───────────────────────┘
                               ↓
                    Supabase Client SDK (auth, queries, realtime)
                               ↓
        ┌──────────────────────┼──────────────────────┐
        ↓                      ↓                       ↓
   Postgres + RLS      Edge Functions (⚙)        Realtime Channels
  (incidents, missions,  - AI extraction proxy    (incidents, missions,
   responders, resources, - Urgency scoring         notifications tables)
   shelters, audit_logs)  - Matching engine
                          - Reassignment logic
                          - Duplicate detection
                               ↓
        ┌──────────────────────┼──────────────────────┐
        ↓                      ↓                       ↓
   AI/Speech APIs        Maps/Routing API         Push Notifications
 (extraction, STT,      (with mocked/seeded          (FCM/OneSignal)
  translation)            fallback data)
```

**Component notes:**
- **Mobile app** is a single React Native codebase with three role-based navigation shells (§11), sharing components (status stepper, map view, notification list) across roles.
- **Edge Functions** hold every piece of logic marked ⚙ in §28 — this is where the deterministic scoring formula (§16) and matching engine (§17) actually live, callable but never bypassable by the client.
- **Postgres + RLS** is both the data store and the access-control enforcement layer (§29), so security is not solely an application-code concern.
- **Realtime channels** subscribe the three role UIs to row-level changes on `incidents`, `missions`, and `notifications`, powering §21's live status propagation without polling.
- **AI/Speech APIs** are called only from Edge Functions (server-side), never directly from the client, keeping API keys out of the mobile bundle (§30).
- **Maps/Routing** calls a live provider where available, degrading to seeded/mocked data (§22.5) transparently to the UI layer.

---

## 38. Recommended Tech Stack

### Mobile Framework
| Option | Dev speed | Maps | Push | Realtime | Camera/Mic | Location | Team familiarity | Deploy |
|---|---|---|---|---|---|---|---|---|
| **React Native + Expo (recommended)** | Fastest for a small team with JS/TS experience; huge ecosystem of ready components | `react-native-maps` well-documented, Expo-compatible | Expo Notifications wraps FCM/APNs cleanly | Straightforward with Supabase JS client | Expo Camera/AV modules, minimal native config | `expo-location` simple foreground/background handling | Broadest hackathon-team familiarity (JS/TS) | Expo Go for live demo iteration, EAS build if a real device install is needed |
| Flutter | Fast, strong widget system, but a second language (Dart) most hackathon teams know less well | Good map plugins | Good | Good | Good | Good | Lower average familiarity | Solid but a steeper day-one ramp |
| Native Android/Kotlin | Best performance/platform fit | Native Google Maps | Native FCM | Requires more manual wiring | Native | Native | Locks out any iOS demo entirely, and is the slowest to build three role-based UIs in 48–72h | Not recommended for this timeline |

**Recommendation: React Native + Expo.** It is the fastest path to a working three-role mobile app with maps, camera, microphone, location, and push notifications all pre-wrapped, and it's the stack most hackathon teams can already write on day one.

### Backend
| Option | Assessment |
|---|---|
| **Supabase (recommended)** | Relational Postgres schema matches this domain model exactly (§27); Row Level Security gives role-based access control almost for free (§29); Realtime + Edge Functions cover §21 and §28 without standing up separate services; generous free tier suitable for a hackathon |
| Firebase | Also viable (§21.2), especially if the team is more Firestore-fluent, but NoSQL modeling fights the relational matching/scoring logic more than it helps |
| Custom Node.js backend | Full control, but far too much plumbing (auth, realtime, RLS-equivalent authorization, hosting) to stand up reliably in 48–72 hours |

### AI/Speech
- **Claude** (Anthropic) for structured extraction, classification, and summarization — strong at following the strict "never invent unstated specifics" constraint (§19.4) when explicitly instructed via prompt design, and at producing consistent structured-JSON extraction output.
- **Whisper** (or a hosted equivalent) for speech-to-text — mature, multilingual, well-suited to the voice-reporting flow (§14 screen 6).
- Translation can be handled by the same LLM call that performs extraction (single round-trip: transcript → structured English/coordinator-language summary), avoiding a separate translation-API integration for MVP scope.

### Maps
- **Google Maps** (via `react-native-maps` + Directions API) is the most turnkey option with the widest data coverage for a live demo; **Mapbox** is a strong alternative if custom styling or a more generous free routing quota is preferred. Either should be paired with the seeded/mocked-route fallback described in §22.5 so the demo never depends on live API availability in the room.

---

## 39. Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Performance** | Report submission → structured incident created in under ~5 seconds under normal connectivity (extraction + scoring). Realtime status propagation to other roles within ~2 seconds of a change. |
| **Reliability** | No user-facing write (report, status update, dispatch approval) is ever silently lost — queued-and-retried or explicitly errored, per §33. |
| **Usability under stress** | Citizen emergency-report flow completable in under 3 taps to reach the input screen, per §11.1's always-visible CTA. |
| **Accessibility** | Text alongside every color-coded urgency/status indicator (§40); minimum tappable target sizes suitable for stressed/imprecise input; voice input as a first-class alternative to typing. |
| **Scalability (directional, not MVP-tested)** | Schema and matching-engine design should not structurally block scaling to a real district-scale incident volume (hundreds of concurrent incidents), even though the MVP is demo-scale. |
| **Auditability** | Every safety-critical decision (score, dispatch, reassignment, resource allocation) is reconstructable after the fact from `audit_logs` and `incident_timeline`. |
| **Data privacy** | Per §30 — least-privilege access enforced at the database layer, not only in the UI. |
| **Availability of safety-critical static content** | Safety Information screen (§14 screen 14) must function fully offline. |

---

## 40. Analytics and Success Metrics

Proposed MVP product metrics (not real-world impact claims):

- **Report-to-priority time:** elapsed time from report submission to urgency score calculation.
- **Priority-to-recommendation time:** elapsed time from scoring to the responder recommendation list being available.
- **Dispatch recommendation time:** elapsed time from incident creation to a coordinator-ready recommendation set.
- **Percentage of assignments satisfying mandatory capabilities:** should be 100% by construction (hard constraints), tracked as a system-integrity check.
- **Average reassignment time:** elapsed time from a blocker report to a new responder being dispatched.
- **Duplicate incident detection rate:** proportion of true duplicates in seed/test data correctly flagged.
- **Mission completion rate:** completed missions ÷ total dispatched missions.
- **Coordinator override rate:** proportion of dispatches where the coordinator chose someone other than the top-ranked recommendation (useful for tuning soft-ranking weights over time).
- **Extraction confidence distribution:** proportion of fields flagged "Needs verification" per report.
- **Time from incident creation to responder acceptance.**


---

## 41. UI/UX Principles

The app must feel **professional, calm, trustworthy, operational, fast, accessible, and easy to use under stress** — never gamified, decorative, or dashboard-cluttered.

- **Avoid:** unnecessary animation, excessive gradients, gaming-style interfaces, overly dense/complicated dashboards, decorative elements that compete for attention during an emergency.
- **Visual hierarchy:** critical information (urgency band, mission status, active alerts) must be immediately visible without scrolling or hunting.
- **Never color-only:** urgency levels always render as text labels (**CRITICAL / HIGH / MEDIUM / LOW**) alongside their color, so the interface remains usable for color-blind users and legible in bright outdoor light where color saturation is hard to perceive.
- **Citizen flow:** minimum possible steps between opening the app and having a report in the system.
- **Coordinator flow:** may be information-dense (this user needs breadth), but must remain fully usable on a phone or tablet screen — no desktop-only layouts or off-screen overflow.

## 42. Important UX Constraint

Given the chaotic conditions TriNetra is used under, priorities are ordered explicitly:

1. **Clarity** — the user always knows what's happening and what to do next.
2. **Speed** — every core action (report, accept, approve) completes in the fewest possible steps.
3. **Reliability** — the app behaves consistently, especially under poor connectivity.
4. **Accessibility** — usable one-handed, under stress, in poor lighting, by people with varying literacy and tech familiarity.
5. **Low cognitive load** — one primary decision per screen wherever possible.
6. **Clear confirmation** — every consequential action gets an unambiguous success state.
7. **Error recovery** — every failure state offers an obvious next step, never a dead end.

A visually polished UI is secondary to operational usability — polish should never be purchased at the cost of any of the seven priorities above.

---

## 43. Acceptance Criteria

Given/When/Then criteria for major P0 features.

**Urgency Scoring**
> Given an incident report describing a trapped person, a child present, and rising water, when the urgency engine scores it, then the score must equal the sum of the corresponding factors defined in §16.1, and the breakdown must list each contributing factor individually.

> Given a coordinator corrects an extracted field (e.g., people_affected from 2 to 4), when the correction is saved, then the urgency score must recalculate immediately and the updated breakdown must be visible without requiring a page reload.

**Responder Matching**
> Given an incident requires a boat, when responder recommendations are generated, then responders without a boat must not appear as primary recommendations, and must instead appear in the "Not eligible" section with "No boat available" as the stated reason.

> Given two responders both pass all hard constraints, when they are ranked, then the responder with the higher compatibility score (§17.2 formula) must appear first.

**Dispatch Approval**
> Given a coordinator has selected a recommended responder, when they tap "Approve Dispatch," then a mission record must be created only after that explicit action, and no mission may exist in the system without a recorded `assigned_by` coordinator.

> Given two coordinators attempt to dispatch the same responder to two different incidents at nearly the same time, when the second approval is submitted, then it must be rejected with a clear conflict message and the recommendation list must refresh.

**Mission Status Pipeline**
> Given a volunteer accepts a mission, when they update their status to "En Route," then the coordinator's Active Mission Tracking screen and the citizen's Request Detail screen must both reflect "En Route" within the realtime propagation window (§39).

**Reassignment**
> Given a volunteer reports a blocker on an active mission, when the report is submitted, then the mission status must change to "Blocked," a Critical coordinator alert must be raised, and a re-ranked list of alternative eligible responders must be generated automatically.

> Given a coordinator approves a reassignment, when the new responder accepts, then the original responder's `current_mission_id` must be cleared and their availability restored, and the original responder's logged progress/notes must remain attached to the mission record.

**Duplicate Detection**
> Given two incident reports within the configured proximity radius, time window, and matching category, when the second report is submitted, then it must be flagged "Possible duplicate incident" on the coordinator's Incident Detail screen, and must never be automatically merged without coordinator action.

**Resource Allocation**
> Given a shelter has 0 available beds, when a coordinator attempts to allocate additional beds there, then the allocation must be rejected and an alternative shelter with available capacity must be surfaced.

**Offline Behavior**
> Given a citizen submits a report with no network connection, when the submission is attempted, then the report must be queued locally with a visible "Pending" state and must be automatically submitted once connectivity is restored, preserving the original timestamp.

**Human-in-the-Loop**
> Given the matching engine has produced a ranked recommendation list, when no coordinator has taken action, then no mission may exist in the system for that incident — the recommendation alone must never result in a dispatched mission.

---

## 44. Development Plan

**Phase 1 — Foundation (hours 0–12):** schema + RLS policies stood up in Supabase; auth flows (OTP + guest + coordinator invite) working; role-based navigation shells scaffolded in React Native; seed data script written and run.

**Phase 2 — Core Pipeline (hours 12–30):** citizen report flow (text + voice) end to end into a created incident; AI extraction Edge Function wired to Claude + Whisper; deterministic urgency scoring Edge Function; coordinator Incident Detail + urgency breakdown UI.

**Phase 3 — Matching and Dispatch (hours 30–42):** hard-constraint filter + soft-ranking Edge Function; Recommended Responders + Dispatch Approval screens; volunteer mission accept/decline + status pipeline; realtime propagation wired across all three roles.

**Phase 4 — Differentiators and Polish (hours 42–60):** dynamic reassignment workflow; duplicate detection; map screens with mocked-route fallback; notification system; error/empty/loading states pass across all P0 screens.

**Phase 5 — Demo Readiness (hours 60–72):** golden-path rehearsal end to end on real devices; seed data finalized for the exact demo script (§35); fallback plan rehearsed for any live API being unreachable in the demo room; pitch materials (§46–48) finalized.

## 45. 48–72 Hour Hackathon Build Plan (by role)

### Mobile/Frontend Developer
- Hours 0–8: scaffold Expo project, role-based navigation shells (§11), design tokens/theme per §41's calm-professional principles.
- Hours 8–20: Citizen flow — Report Emergency, Voice/Text input, Location Confirmation, Incident Details review, Confirmation, Request Tracking/Detail.
- Hours 20–32: Volunteer flow — onboarding screens, Home, Incoming Mission, Mission Detail, Navigation, Status Update, Blocker/Completion.
- Hours 32–48: Coordinator flow — Operations Dashboard, Incident Queue/Detail, Recommended Responders, Dispatch Approval, Active Mission Tracking, Map.
- Hours 48–60: Reassignment UI, duplicate-flag banner, notification inbox, empty/error/loading states pass.
- Hours 60–72: demo rehearsal support, bug fixes, polish pass.

### Backend Developer
- Hours 0–8: Supabase project setup, full schema (§27) as migrations, RLS policies per role (§29).
- Hours 8–20: Auth endpoints (OTP, guest sessions, coordinator invite verification); realtime channel configuration for `incidents`/`missions`/`notifications`.
- Hours 20–32: Mission lifecycle endpoints (`/missions`, `/missions/:id/status`, `/respond`, `/blocker`, `/unable-to-complete`, `/outcome`); resource/shelter endpoints with over-allocation guards.
- Hours 32–48: Reassignment endpoint; duplicate-detection query/RPC; notification insertion triggers + push integration (FCM/OneSignal).
- Hours 48–60: audit logging triggers on all consequential writes; `/operations/summary` and `/map/snapshot` aggregation endpoints.
- Hours 60–72: seed data script finalization, load-testing the golden path, bug fixes.

### AI/Algorithm Developer
- Hours 0–8: define the extraction JSON schema (matches `incidents` table fields); design the extraction prompt with explicit "never invent unstated specifics" constraints (§19.4) and confidence-scoring instructions.
- Hours 8–20: implement the extraction Edge Function (Claude) + speech-to-text integration (Whisper); test against varied phrasing of the golden-path incidents.
- Hours 20–32: implement the deterministic urgency scoring formula (§16) as pure, testable code (not an LLM call); unit test against the worked example in §16.3.
- Hours 32–48: implement the hard-constraint filter and soft-ranking compatibility score (§17) as pure, testable code; unit test against the worked example in §17.3.
- Hours 48–60: implement duplicate-detection similarity scoring (geo + category + semantic embedding + time window, §24); implement reassignment re-ranking (reuses the matching engine).
- Hours 60–72: tuning pass against seed data + demo script, ensuring R-101/R-102/R-103 score and rank exactly as designed for the live demo.

### UI/UX Designer
- Hours 0–8: define the visual language per §41 (calm, professional, high-contrast urgency indicators with text labels, per §32/§41); component library sketch (status stepper, urgency badge, match-reasoning card).
- Hours 8–24: high-fidelity screens for the golden-path critical path — Report Emergency through Confirmation (citizen), Incoming Mission through Completion (volunteer), Dashboard through Dispatch Approval (coordinator).
- Hours 24–40: remaining P0 screens; empty/error/loading state designs; accessibility pass (contrast, tap targets, text-plus-color).
- Hours 40–56: P1 screens (reassignment, duplicate flag, comparison, resource overview) as time allows.
- Hours 56–72: pitch-deck visuals (§46–48 support), demo-recording assistance, final visual QA against implemented screens.

---

## 46. Future Roadmap

- Full offline-first mobile architecture with local-first data and conflict-resolution sync.
- SMS-based reporting fallback for feature phones and zero-smartphone-access users.
- Low-bandwidth ("2G mode") text-only interface variant.
- In-app masked calling/messaging between citizens, volunteers, and coordinators.
- Cross-organization mutual-aid visibility and regional coordinator roles.
- Verified/credentialed skill claims (e.g., an NGO confirming a volunteer's water-rescue certification) rather than self-declared skills only.
- Historical analytics dashboards and after-action reporting exports for NGOs and government partners.
- Full NGO/Partner org management suite (fleet management, multi-shelter/multi-hub inventory dashboards).
- Predictive resource pre-positioning based on historical disaster patterns (explicitly NOT a custom-trained model — would use existing forecasting data sources).
- Deeper multi-language real-time translation across live chat/status updates, not just initial extraction.

---

## 47. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Live third-party API (maps, AI) unreachable during the demo | Mocked/seeded fallback data for routes (§22.5) and pre-tested extraction examples rehearsed offline |
| AI extraction misfires on an unusual phrasing during the live voice demo | Golden-path sentences pre-tested extensively; text-input fallback always available mid-demo if voice underperforms |
| Realtime sync lag makes the live cross-device demo look broken | Rehearse on the actual demo network; have a pre-recorded backup clip of the full golden path as a fallback |
| Scope creep during the 48–72 hour window | Strict P0/P1/P2 discipline (§34); P1 items explicitly ordered so any stopping point still demos coherently |
| Self-declared volunteer skills could be inaccurate/misleading | Explicitly flagged as an MVP limitation (§18 of source brief); future roadmap item is credentialed verification (§46) |
| Judges perceive this as "just an SOS app" | Golden-path demo script (§35) is explicitly structured to showcase capability-based matching and explainable scoring as the differentiator, not the reporting form |
| Team unfamiliarity with Supabase RLS causing security gaps late in the build | Backend developer prioritizes RLS policies in Phase 1 (§44), before feature work, so access control isn't retrofitted under time pressure |

---

## 48. Final MVP Definition

The TriNetra hackathon MVP is: a working, three-role (Citizen/Volunteer/Coordinator) React Native mobile app, backed by Supabase, that takes a free-form emergency report (text or voice), extracts it into structured data with visible confidence flags, scores its urgency with a fully transparent, itemized, deterministic formula, filters and ranks responders by hard capability constraints and soft speed/fit ranking, requires explicit human coordinator approval before any dispatch, propagates mission status live to all three roles, and can recover gracefully — through reassignment — when a road blocks or a responder can't complete a mission. It demonstrably proves, on three simultaneous seeded incidents, that TriNetra finds the *right* responder, not just the *nearest* one, and explains exactly why.

---

## 49. Judge-Facing Product Summary

TriNetra is a coordination and dispatch platform, not a reporting app. Most disaster-tech demos stop at "citizen sends a message, someone sees it." TriNetra starts there and goes further: it turns that message into a structured, explainable, transparently-scored incident, matches it against real responder capability constraints — not just proximity — and puts a human coordinator firmly in charge of the final call, with full auditability behind every decision. The live demo will show, side by side, why the closest volunteer is sometimes the wrong choice, and how TriNetra catches that in real time — including recovering automatically when a road blocks mid-mission. It is built mobile-first because that's how this actually gets used in the field, and it is scoped honestly: what you'll see running live is exactly what's described in this document, nothing embellished.


---

# Final Output Artifacts

## A. One-Sentence Pitch
TriNetra turns chaotic disaster reports into prioritized, explainable, human-approved response missions — matching the right responder to the right need, not just the nearest one.

## B. 30-Second Elevator Pitch
During a disaster, help requests flood in through calls, texts, and social media, and coordinators can't tell what's most urgent or who's actually equipped to respond. TriNetra fixes both problems: it structures every report with AI, scores its urgency with a transparent formula anyone can check by hand, and recommends responders based on what they can actually do — skills, equipment, capacity — not just who's closest. A human coordinator approves every dispatch. It's mobile-first, built for citizens, volunteers, and coordinators alike, and it's designed to keep working when the network doesn't.

## C. 2-Minute Judge Pitch
Every disaster produces the same failure: information scattered across calls, WhatsApp, and paper, and a coordinator trying to hold it all in their head while deciding who goes where. The default fallback — send whoever's closest — is often wrong. A motorcycle can't reach a flooded rooftop; a boat crew five minutes further away can. TriNetra is the coordination layer that catches that. A citizen reports by voice or text, in whatever way they can manage under stress. AI extracts the facts — but never invents them; anything uncertain is flagged "needs verification," not guessed. A deterministic, fully transparent scoring formula — not a black-box AI verdict — rates urgency, and shows its work: every point, itemized. The matching engine then filters responders on hard requirements first — does this one have the boat, the training, the capacity — and only then ranks the survivors by speed. A coordinator sees the recommendation and the reasoning, and approves it — TriNetra never dispatches on its own. From there, everyone — citizen, volunteer, coordinator — tracks the mission live, and if a road blocks or a responder can't continue, the system re-ranks alternatives automatically and asks the coordinator to approve the swap. We built this mobile-first, because that's how it actually gets used in the field, and we're showing you a real, working version of exactly this — three simultaneous incidents, correctly triaged, with a live reassignment mid-demo.

## D. Complete Golden-Path Demo Script
See §35 in full — timestamped 2:55–3:00 walkthrough from live voice report through dispatch, blocked-road reassignment, and completion across all three roles.

## E. MVP Feature Checklist
- [ ] Citizen guest reporting (text + voice + optional photo)
- [ ] Location confirmation with accuracy indicator
- [ ] AI structured extraction with confidence flags
- [ ] Deterministic urgency scoring with itemized breakdown
- [ ] Hard-constraint responder filtering
- [ ] Soft-ranking compatibility scoring
- [ ] Coordinator Operations Dashboard
- [ ] Recommended Responders + exclusion reasoning
- [ ] Dispatch Approval (human-in-the-loop gate)
- [ ] Volunteer profile setup (skills/vehicle/equipment/capacity)
- [ ] Mission accept/decline
- [ ] Mission status pipeline (Accepted → En Route → Arrived → Completed)
- [ ] Realtime status propagation across all roles
- [ ] Map with mocked-route fallback
- [ ] Basic notification system
- [ ] Seed data for golden-path demo
- [ ] (P1) Dynamic reassignment workflow
- [ ] (P1) Duplicate incident detection
- [ ] (P1) Resource/shelter over-allocation prevention
- [ ] (P1) Audit log / incident timeline views

## F. Mobile Screen Inventory
16 Citizen screens, 16 Volunteer screens, 16 Coordinator screens — 48 total, fully specified in §14.

## G. Database Entity Relationship Summary
`users` (1) —< `responders` (role-specific profile) · `users` (1) —< `incidents` (as reporter) · `incidents` (1) —< `missions` (1) >— `responders` · `missions` >— `users` (as assigned_by coordinator) · `resources`/`shelters` (1) —< `resource_reservations` >— `missions` · `incidents` (1) —< `incident_timeline` · all consequential actions —< `audit_logs` (polymorphic target). Full field-level schema in §27.

## H. API Endpoint Summary
Auth (3 endpoints) · Incidents (9) · Voice reporting (1) · Missions (8) · Responders (7) · Resources/Shelters (5) · Notifications (2) · Operations/Map aggregation (2) · Audit/Org (2). Full listing with realtime-channel equivalents in §28.

## I. AI vs. Rules Responsibility Table

| Task | Owner |
|---|---|
| Speech-to-text | AI |
| Translation | AI |
| Structured extraction | AI |
| Incident classification | AI |
| Entity extraction | AI |
| Summarization | AI |
| Duplicate semantic similarity | AI |
| Photo description (hedged only) | AI |
| Natural-language status interpretation | AI |
| Urgency scoring | Rules engine |
| Hard capability filtering | Rules engine |
| Capacity validation | Rules engine |
| Responder availability checks | Rules engine |
| Assignment conflict checks | Rules engine |
| Dispatch approval gating | Rules engine (with mandatory human action) |
| Escalation triggers | Rules engine |
| Audit logging | Rules engine |

## J. P0/P1/P2 Feature Table
See §34 for the complete, ordered breakdown.

## K. 48-Hour Development Task Breakdown by Role
See §45 for the full hour-by-hour plan across Mobile/Frontend, Backend, AI/Algorithm, and UI/UX.

## L. Final "What to Build vs. What NOT to Build"

**Build:**
- The full report → extract → score → match → approve → dispatch → track → complete pipeline, end to end, on real mobile devices.
- A deterministic, itemized urgency formula and a deterministic, itemized matching formula — both hand-verifiable.
- A hard human-approval gate before any dispatch.
- Real-time status propagation across all three roles.
- At least one live demonstration of dynamic reassignment.
- Honest degraded-mode behavior (queued offline writes, staleness indicators) rather than a false promise of full offline support.

**Do NOT build:**
- A generic desktop disaster-management dashboard.
- Any autonomous AI dispatch path.
- Nearest-responder-only matching.
- A custom-trained ML model of any kind.
- Full offline-first architecture, SMS fallback, or multi-device sync — future roadmap only.
- A general-purpose NGO ERP / full partner-management suite.
- Dozens of tangential features that don't serve the golden-path demo — every P1/P2 item is explicitly deferred rather than half-built.

---

*End of PRD.*
