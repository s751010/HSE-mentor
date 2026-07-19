# Graph Report - HSE-mentor  (2026-07-19)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 234 nodes · 555 edges · 16 communities (14 shown, 2 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `77eec4e9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- 🛡️ مراجعة تطويرية — منصة «مرشد السلامة»
- 🔍 مراجعة نقدية شاملة — منصة «مرشد السلامة»
- ٨. خطة عمل بأولويات
- index.ts
- index.ts
- 0001_rls_policies.sql
- save
- showToast
- ar
- switchTab
- finishKwadarat
- showApp
- hseAnalyze
- getCurrentLevel
- submitAuth
- loadCloudProgress

## God Nodes (most connected - your core abstractions)
1. `showToast()` - 37 edges
2. `ar()` - 30 edges
3. `switchTab()` - 26 edges
4. `save()` - 23 edges
5. `renderAll()` - 19 edges
6. `addXP()` - 17 edges
7. `el()` - 16 edges
8. `saveFConfig()` - 15 edges
9. `sendChat()` - 13 edges
10. `fpRenderAll()` - 12 edges

## Surprising Connections (you probably didn't know these)
- `fpSaveSettings()` --calls--> `saveFConfig()`  [EXTRACTED]
  murshid.html → murshid.html  _Bridges community 7 → community 11_
- `founderLogin()` --calls--> `fpRenderAll()`  [EXTRACTED]
  murshid.html → murshid.html  _Bridges community 15 → community 7_
- `founderLogin()` --calls--> `renderAll()`  [EXTRACTED]
  murshid.html → murshid.html  _Bridges community 15 → community 6_
- `founderLogin()` --calls--> `showApp()`  [EXTRACTED]
  murshid.html → murshid.html  _Bridges community 15 → community 11_
- `fpSwitch()` --calls--> `fpLoadUsers()`  [EXTRACTED]
  murshid.html → murshid.html  _Bridges community 7 → community 8_

## Import Cycles
- None detected.

## Communities (16 total, 2 thin omitted)

### Community 0 - "🛡️ مراجعة تطويرية — منصة «مرشد السلامة»"
Cohesion: 0.17
Nodes (11): الأولويات (أثر × جهد), الخلاصة, بطاقة النضج, خارطة التحوّل إلى SaaS — مزيج مرحلي, كمنصة و SaaS · من زاوية التصنيفات · الأدوات · لوحات المؤسس, ما الذي أُصلح الآن (في هذا الفرع), 🛡️ مراجعة تطويرية — منصة «مرشد السلامة», ١. التصنيفات — الأضعف بنيوياً (+3 more)

### Community 1 - "🔍 مراجعة نقدية شاملة — منصة «مرشد السلامة»"
Cohesion: 0.13
Nodes (14): 🔴 استراتيجية (الربع القادم), كمشروع تسويقي شخصي لـ سياف الهذلي · أخصائي السلامة والصحة المهنية, 🟡 متوسطة المدى (هذا الشهر), 🔍 مراجعة نقدية شاملة — منصة «مرشد السلامة», 🟢 مكاسب سريعة (هذا الأسبوع), ١. التموضع والرسالة (Positioning), ٢. تجربة المستخدم ومعدل التحويل (Conversion / UX), ٣. البراندنق الشخصي (Personal Branding) (+6 more)

### Community 2 - "٨. خطة عمل بأولويات"
Cohesion: 0.05
Nodes (16): FCONFIG, FLASH, HAZARD_BANK, HSE_SEV, HZ, kwAns, kwQs, LANG (+8 more)

### Community 5 - "0001_rls_policies.sql"
Cohesion: 0.25
Nodes (6): public.ai_usage, public.founder_config, public.photo_history, public.platform_secrets, public.profiles, public.user_progress

### Community 6 - "save"
Cohesion: 0.09
Nodes (37): addNote(), addXP(), _analyzeField(), analyzeField2(), ansKW(), ansWU(), appendBubble(), BADGES (+29 more)

### Community 7 - "showToast"
Cohesion: 0.11
Nodes (34): applyFConfig(), copyTBT(), esc(), fpAddHazard(), fpAddQuestion(), fpAddScenario(), fpApplyImport(), fpDelHazard() (+26 more)

### Community 8 - "ar"
Cohesion: 0.16
Nodes (24): ar(), buildQHTML(), buildResultHTML(), el(), finishWU(), fpLoadUsers(), genSerial(), hzFinish() (+16 more)

### Community 9 - "switchTab"
Cohesion: 0.15
Nodes (18): ALL_PAGES, askAboutFlash(), askAboutFlash2(), buildRiskMatrix(), closeTBT(), discussWU(), generateTBT(), isToolHidden() (+10 more)

### Community 10 - "finishKwadarat"
Cohesion: 0.36
Nodes (10): finishKwadarat(), hideEl(), renderKWScores(), resetKwadarat(), restartWU(), showEl(), showKWQ(), startKwadarat() (+2 more)

### Community 11 - "showApp"
Cohesion: 0.22
Nodes (9): animateNum(), closeAuth(), fpSaveSettings(), initLandingFX(), initReveal(), logoutUser(), renderDevBadge(), showApp() (+1 more)

### Community 12 - "hseAnalyze"
Cohesion: 0.33
Nodes (7): hseAnalyze(), hseGenRef(), hseRenderResult(), renderPhotoHist(), savePhotoHistoryCloud(), showPhotoHist(), uploadHseImage()

### Community 13 - "getCurrentLevel"
Cohesion: 0.33
Nodes (6): downloadCert(), generateReport(), getCurrentLevel(), getLevel(), LEVELS, renderLevelsPage()

### Community 14 - "submitAuth"
Cohesion: 0.40
Nodes (5): applyAuthMode(), authErr(), openAuth(), submitAuth(), toggleAuthMode()

### Community 15 - "loadCloudProgress"
Cohesion: 0.40
Nodes (5): checkAuthSession(), founderLogin(), getHseImageUrl(), loadCloudProgress(), loadPhotoHistory()

## Knowledge Gaps
- **46 isolated node(s):** `FCONFIG`, `TOOL_NAMES`, `TOOL_PAGES`, `LEGAL_CONTENT`, `S` (+41 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `showToast()` connect `showToast` to `٨. خطة عمل بأولويات`, `save`, `ar`, `switchTab`, `finishKwadarat`, `showApp`, `hseAnalyze`, `getCurrentLevel`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **Why does `ar()` connect `ar` to `٨. خطة عمل بأولويات`, `save`, `showToast`, `switchTab`, `finishKwadarat`, `getCurrentLevel`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **Why does `switchTab()` connect `switchTab` to `٨. خطة عمل بأولويات`, `save`, `ar`, `finishKwadarat`, `hseAnalyze`, `getCurrentLevel`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._
- **What connects `FCONFIG`, `TOOL_NAMES`, `TOOL_PAGES` to the rest of the system?**
  _46 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `🔍 مراجعة نقدية شاملة — منصة «مرشد السلامة»` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
- **Should `٨. خطة عمل بأولويات` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `save` be split into smaller, more focused modules?**
  _Cohesion score 0.09309309309309309 - nodes in this community are weakly interconnected._