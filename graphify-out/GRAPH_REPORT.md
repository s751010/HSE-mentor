# Graph Report - .  (2026-07-03)

## Corpus Check
- Corpus is ~21,263 words - fits in a single context window. You may not need a graph.

## Summary
- 65 nodes · 80 edges · 10 communities (7 shown, 3 thin omitted)
- Extraction: 90% EXTRACTED · 10% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.89)
- Token cost: 32,000 input · 12,000 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Gamified Learning Loop|Gamified Learning Loop]]
- [[_COMMUNITY_Marketing Review & Question Banks|Marketing Review & Question Banks]]
- [[_COMMUNITY_AI Proxy & Flashcards|AI Proxy & Flashcards]]
- [[_COMMUNITY_Progress Sync & Analytics|Progress Sync & Analytics]]
- [[_COMMUNITY_Founder Config & Positioning|Founder Config & Positioning]]
- [[_COMMUNITY_Auth & Supabase Client|Auth & Supabase Client]]
- [[_COMMUNITY_HSE Photo Analysis & Risk Tools|HSE Photo Analysis & Risk Tools]]
- [[_COMMUNITY_OpenAI Proxy Edge Function|OpenAI Proxy Edge Function]]
- [[_COMMUNITY_HSE Image Edge Function|HSE Image Edge Function]]
- [[_COMMUNITY_XP Level Ladder|XP Level Ladder]]

## God Nodes (most connected - your core abstractions)
1. `callAI (AI proxy client)` - 10 edges
2. `sb (Supabase client)` - 9 edges
3. `addXP` - 9 edges
4. `hseAnalyze (AI photo violation analyzer)` - 6 edges
5. `loadCloudProgress` - 5 edges
6. `sendChat` - 5 edges
7. `FCONFIG (founder configuration)` - 4 edges
8. `cloudSyncProgress (debounced Supabase progress sync)` - 4 edges
9. `KWB (Kawader question bank ~100 questions)` - 4 edges
10. `checkBadges` - 4 edges

## Surprising Connections (you probably didn't know these)
- `Positioning critique` --semantically_similar_to--> `FCONFIG (founder configuration)`  [INFERRED] [semantically similar]
  MARKETING_REVIEW.md → murshid.html
- `Missing analytics (no visitor measurement)` --semantically_similar_to--> `fpLoadUsers (founder usage analytics)`  [INFERRED] [semantically similar]
  MARKETING_REVIEW.md → murshid.html
- `openai-proxy Supabase Edge Function` --implements--> `Backend AI proxy recommendation (Supabase/Cloudflare Edge Function)`  [INFERRED]
  murshid.html → MARKETING_REVIEW.md
- `callAI (AI proxy client)` --implements--> `Backend AI proxy recommendation (Supabase/Cloudflare Edge Function)`  [INFERRED]
  murshid.html → MARKETING_REVIEW.md
- `cloudSyncProgress (debounced Supabase progress sync)` --implements--> `Supabase auth and cross-device sync plan`  [INFERRED]
  murshid.html → MARKETING_REVIEW.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **AI-powered features routed through callAI proxy** — murshid_callai, murshid_sendchat, murshid_hseanalyze, murshid__analyzefield, murshid_generateincidentreport, murshid_generatereport, murshid_startwarmup, murshid__loadflashcard [EXTRACTED 1.00]
- **Gamification system (XP, levels, badges, streaks, certificates)** — murshid_addxp, murshid_checkbadges, murshid_checkstreak, murshid_levels, murshid_badges, murshid_showcertificate, murshid_s [EXTRACTED 1.00]
- **Supabase cloud layer (auth, progress sync, storage, founder config, usage)** — murshid_sb, murshid_submitauth, murshid_checkauthsession, murshid_founderlogin, murshid_cloudsyncprogress, murshid_loadcloudprogress, murshid_uploadhseimage, murshid_savephotohistorycloud, murshid_loadphotohistory, murshid_loadfconfig, murshid_savefconfig, murshid_fploadusers, murshid_callai [EXTRACTED 1.00]

## Communities (10 total, 3 thin omitted)

### Community 0 - "Gamified Learning Loop"
Cohesion: 0.19
Nodes (13): addXP, ansKW, ansWU, BADGES (achievement definitions), buildSys (Abu Salama system prompt builder), checkBadges, checkStreak, finishKwadarat (+5 more)

### Community 1 - "Marketing Review & Question Banks"
Cohesion: 0.17
Nodes (12): Competitive advantage analysis, Critical Marketing Review of Murshid Platform (June 2026), Personal branding strategy, Revenue model options (Freemium / subscription / B2B / lead generation), Sayyaf Alhothali (سياف الهذلي, HSE specialist / founder), Fabricated testimonials / missing social proof, getBankQ (offline question fallback), KWB (Kawader question bank ~100 questions) (+4 more)

### Community 2 - "AI Proxy & Flashcards"
Cohesion: 0.29
Nodes (8): OpenAI API key barrier, Backend AI proxy recommendation (Supabase/Cloudflare Edge Function), _analyzeField (situation analyzer), _loadFlashCard, callAI (AI proxy client), FLASH (flashcard deck), generateReport (weekly progress report), openai-proxy Supabase Edge Function

### Community 3 - "Progress Sync & Analytics"
Cohesion: 0.33
Nodes (7): Prioritized action plan (quick wins / monthly / quarterly), Missing analytics (no visitor measurement), Supabase auth and cross-device sync plan, cloudSyncProgress (debounced Supabase progress sync), fpLoadUsers (founder usage analytics), S (global user state), save

### Community 4 - "Founder Config & Positioning"
Cohesion: 0.38
Nodes (7): Kawader exam (اختبار كوادر, Saudi HSE certification), Positioning critique, Missing sharp value proposition, applyFConfig, FCONFIG (founder configuration), loadFConfig, saveFConfig

### Community 5 - "Auth & Supabase Client"
Cohesion: 0.38
Nodes (7): checkAuthSession, founderLogin, getHseImageUrl, loadCloudProgress, loadPhotoHistory, sb (Supabase client), submitAuth

### Community 6 - "HSE Photo Analysis & Risk Tools"
Cohesion: 0.33
Nodes (6): buildRiskMatrix (interactive 5x5 risk matrix), generateIncidentReport, hseAnalyze (AI photo violation analyzer), hseRenderResult, savePhotoHistoryCloud, uploadHseImage

## Knowledge Gaps
- **14 isolated node(s):** `corsHeaders`, `cors`, `submitAuth`, `getHseImageUrl`, `QB (general HSE question bank)` (+9 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `callAI (AI proxy client)` connect `AI Proxy & Flashcards` to `Gamified Learning Loop`, `Marketing Review & Question Banks`, `Auth & Supabase Client`, `HSE Photo Analysis & Risk Tools`?**
  _High betweenness centrality (0.493) - this node is a cross-community bridge._
- **Why does `startWarmup (morning warmup quiz)` connect `Marketing Review & Question Banks` to `AI Proxy & Flashcards`?**
  _High betweenness centrality (0.278) - this node is a cross-community bridge._
- **Why does `KWB (Kawader question bank ~100 questions)` connect `Marketing Review & Question Banks` to `Founder Config & Positioning`?**
  _High betweenness centrality (0.274) - this node is a cross-community bridge._
- **What connects `corsHeaders`, `cors`, `submitAuth` to the rest of the system?**
  _18 weakly-connected nodes found - possible documentation gaps or missing edges._