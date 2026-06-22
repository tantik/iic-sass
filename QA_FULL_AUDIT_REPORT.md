# QA_FULL_AUDIT_REPORT — IZUMI IT COMPANY / LINE Business OS

**Audit type:** Independent QA / pre-launch audit (analysis only — no production files changed)
**Date:** 2026-06-22
**Repo:** `D:\project\iic-sass` — branch `main` (up to date with `origin/main`)
**Auditor roles applied:** UI/UX designer, conversion designer, frontend engineer, QA engineer, Japanese B2B SaaS copywriter, SEO specialist, security/privacy reviewer, legal/risk reviewer, product manager, prospective Japanese small-business customer.

> **Audit integrity note (read first).** At the start of this audit, `git status` was clean except for the pre-existing untracked `COPY_AUDIT_REPORT.md`. By the end, the working tree additionally showed `api/form.php` and `.gitignore` as **modified** and a new untracked `api/form-provider.example.php`. **These were NOT made by this audit** — the only file this audit created is `QA_FULL_AUDIT_REPORT.md`. The changes appear to be a concurrent external edit that refactored the contact handler from native `mail()` (with a hardcoded backup email) to a **Web3Forms proxy** whose access key is loaded only from a gitignored `api/form-provider.local.php`. This effectively addresses finding #3 below. **The `api/form.php` findings in this report describe the version present at audit start;** the current working copy differs. No files were reverted or further modified by this audit.

---

## 1. Executive summary

**Overall status: ALMOST READY → effectively launch-ready.** The site is well-built, internally consistent, legally careful, and visually professional. It does **not** feel like a 2012 site. The known critical bug (the 「こんな店舗に向いています」 card heading overflowing on desktop) is **NOT reproducible** at any tested width — it has been mitigated in CSS (`overflow-wrap: anywhere` + `min-width: 0` on the grid items). No forbidden marketing/legal claims were found.

The only meaningful pre-launch item is a **server-config** matter (HTTP is not redirected to HTTPS), not a site-file defect. Everything else is low-priority polish.

### Top 5 blockers
There are **no true blockers** (severity = blocker) for a public marketing-site launch. The closest items (all server/infra, not content):
1. **HTTP is served with 200 and is not redirected to HTTPS** (`http://izumiit.com/` returns the page directly). SEO duplicate-content + security concern. *(Medium — server config)*
2. No **HSTS** header and no baseline security headers on HTML responses. *(Low/Medium — server config)*
3. (Confirm only) `api/form.php` contains a **personal Gmail backup address** hardcoded in source — fine if repo is private and address is intended, but should be confirmed. *(Low — privacy/ops)*
4. Live form **mail delivery cannot be verified from QA** (no PHP locally; did not submit a real lead to production). *(Low — needs manual send test)*
5. `contact.html` header logo link is missing the `aria-label` the other pages have (empty accessible name). *(Low — a11y)*

### Top 5 improvements
1. Add a 301 `http → https` redirect + HSTS at the nginx layer.
2. Add `<lastmod>` to `sitemap.xml` and consider security headers (`X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`/CSP).
3. Make the homepage trust card heading「500社以上の支援実績」explicitly scoped to Web制作・開発 in the heading itself (company.html already does this well).
4. Normalize `main.js` loading (index.html loads it at end of `<body>` without `defer`; other pages use `defer` in `<head>`).
5. Consider adding real product screenshots/case examples later to strengthen conversion (current mockups are clearly labeled "デモ／イメージ", which is honest and good).

### Final launch risk level: **LOW**
Safe to launch publicly after adding the HTTP→HTTPS redirect (server config). Content, legal, responsive, and conversion fundamentals are in good shape.

---

## 2. Verification scope

### What was verified
- **Static review** of all 10 public HTML pages + `assets/css/style.css`, `assets/js/main.js`, `api/form.php`, `robots.txt`, `sitemap.xml`, `.gitignore`.
- **Live HTTP status** for all public pages, assets, old site, and the form endpoint.
- **Runtime visual + layout** via a local static server (`python -m http.server`) driven through the Cursor browser (Chromium/CDP): horizontal-overflow detection, fit-card heading geometry, pricing card alignment, mobile menu behavior, broken-image detection.
- **Forbidden-claim / draft-text / `/new/`-link** scans across all HTML.
- **SEO meta** (title/description/canonical/OG/Twitter/favicon) on every page.

### What was NOT verified (honest limitations)
- **PHP runtime locally:** PHP is not installed on this machine, so `api/form.php` was only reviewed statically + tested live for the GET=405 behavior. The full POST→email pipeline was **not** executed (no test lead sent to production).
- **Full browser console-stream capture:** the CDP bridge returns command results, not console events, so a complete console-error log was **not** captured. JS was instead validated by behavior (menu, FAQ, form validation all function; no functional errors observed).
- **Every page at every one of the 9 widths:** `index.html` was swept at **all 9** widths. Other pages were spot-checked at representative widths (320 = mobile min, 1440 = desktop, plus 1920 for contact). No page showed overflow at any width tested.
- **HSTS / TLS cert deep inspection:** only header presence was checked.

### Commands / tools run (all non-mutating)
- `git status`, `git status --porcelain`, `git --no-pager ls-files`
- `python -m http.server 8765 --bind 127.0.0.1` (local preview; stopped after)
- `curl.exe` status-code + header checks against `https://izumiit.com` and `http://izumiit.com`
- Cursor browser (CDP): `Emulation.setDeviceMetricsOverride`, `Runtime.evaluate` (overflow/geometry/image checks), screenshots
- `Grep`/`Glob`/`Read` for static content

### URLs checked live (all returned 200 unless noted)
`/`, `/index.html`, `/products.html`, `/pricing.html`, `/security.html`, `/company.html`, `/contact.html`, `/privacy.html`, `/terms.html`, `/commercial-disclosure.html`, `/disclaimer.html`, `/robots.txt`, `/sitemap.xml`, `/favicon.ico`, `/favicon.svg`, `/apple-touch-icon.png`, `/assets/images/og-image.png`, `/assets/images/logo_01.svg`, `/assets/images/logo_02.svg`, `/assets/images/biz_partner_type2.png`, `/old21062026/index.html` (200, backup as intended).
`/api/form.php` GET → **405** (correct). Random nonexistent path → **404** (correct).

> Note: an early file-listing tool returned an incomplete `assets/images/` set; this was a **tooling artifact** — `git status` is clean (no deletions) and `git ls-files` + live 200s confirm all images (`logo_01.svg`, `logo_02.svg`, `biz_partner_type2.png`, etc.) exist. **No broken images.**

---

## 3. Page-by-page audit

### index.html — status: PASS
- **Visual:** Hero, flow panel, problem grid, before/after, fit cards, product cards, pricing preview, onboarding, FAQ, CTA all render cleanly. Header does not overlap content. Footer tidy.
- **Known bug — fit cards:** Heading 「こんな店舗に向いています」 measured at 320/375/390/430/768/1024/1366/1440/1920 — **never overflows the card** (`textOverflowsEl=false`, `overflowsCard=false` at every width). **Bug not present.**
- **Horizontal overflow:** none at any of the 9 widths (`scrollWidth == clientWidth`).
- **Copy:** Clear umbrella framing (LINE Business OS) vs. company (IZUMI IT). Soft, non-guaranteeing language ("〜しやすくします", "軽減しやすく").
- **SEO:** unique title, description, canonical `https://izumiit.com/`, full OG + Twitter, favicons. PASS.
- **Legal/risk:** 500社 scoped to Web制作・開発; 給与計算/法定勤怠 only as exclusions; mockups labeled「デモ」「画面は説明用のイメージです」. PASS.
- **Minor:** Trust card heading「500社以上の支援実績」relies on adjacent body text for the Web制作 scope (heading itself is unscoped). `main.js` included at end of body without `defer` (other pages use `defer`). **Severity: low.**

### products.html — status: PASS
- Three services clearly differentiated; Workforce (cafe/restaurant), Booking (salon/clinic), Custom Automation (個別開発, explicitly "個別にお見積り"). Exclusion notice present. "今後の検討" section correctly labeled "検討段階であり、現在提供中のサービスではありません".
- No overflow at 320 / 1440. SEO complete. **Severity: none.**

### pricing.html — status: PASS
- Workforce + Booking plans (Starter/Standard/Business/Enterprise) as independent products. Cards **equal height (450px) and aligned** at desktop. Tax-exclusion noted, LINE official-account cost noted, exclusion notice repeated. "正式な料金は個別お見積り" — does not over-promise.
- No overflow at 320 / 1440. **Severity: none.**

### security.html — status: PASS (with careful wording)
- Uses configuration-of-design language ("〜よう配慮して設計しています", "管理します") and a crucial disclaimer: 「特定の認証取得や法令への適合を保証するものではありません」. Does **not** claim ISO27001 / Pマーク / LINE認定 / certified compliance. Customer-responsibility section is appropriate.
- No overflow at 320. **Severity: none.**

### company.html — status: PASS
- Best-in-site disclaimer discipline: 500社+ explicitly 「Web制作・開発領域で」 and 「LINE Business OSの導入実績を示すものではありません」. Awards/認定 scoped to Web制作.
- **Severity: none.**

### contact.html — status: PASS
- Form: `method="post"`, `action="api/form.php"`, all required fields, **privacy consent checkbox** (`required`, links to privacy.html), **honeypot** field (`website`, aria-hidden), `started_at` hidden field, `maxlength` on message. Fallback `mailto:izumi@izumiit.com` in multiple places. CTAs route to `#contactInquiryForm`. Does **not** promise instant reply ("内容を確認のうえご連絡いたします").
- No overflow (1920); no broken images.
- **Minor:** header logo link missing `aria-label` (empty accessible name in AX tree); every other page has `aria-label="IZUMI IT COMPANY ホーム"`. **Severity: low (a11y).**

### privacy.html — status: PASS
- Complete 11-section policy, dated 2026年6月, contact email present. No draft/legal-advice text. No overflow at 320. **Severity: none.**

### terms.html — status: PASS
- Complete 20-article terms. §3 correctly excludes 給与計算/法定勤怠/税務/労務/帳簿/行政手続/士業助言. §13 disclaims guaranteed outcomes (売上/工数削減/キャンセル防止/来店忘れ防止/法令適合/安全性). Anti-social-forces clause is standard. **Severity: none.**

### commercial-disclosure.html (特商法) — status: PASS
- 販売事業者 IZUMI IT COMPANY, 運営責任者 Roman Siedovolosyi, address/phone "請求があった場合、遅滞なく開示" (legally acceptable for sole operators), email, price/payment/cancellation/environment, exclusion note. **Severity: none.**
- *(Product-manager note: confirm the "請求があれば開示" approach is acceptable to your payment processor — some require a full displayed address/phone.)*

### disclaimer.html — status: PASS
- Positions service correctly, disclaims guaranteed outcomes and external-service dependencies. No draft text. **Severity: none.**

---

## 4. Cross-site technical audit

- **Internal links:** Header/footer nav consistent across all pages; all targets are real local files. No dead internal links found.
- **`/new/` links:** **none** (grep across all HTML = 0).
- **Old site:** present only at `/old21062026/` (live 200). **No references to it** from any current page.
- **Assets / images:** all referenced images exist and load (logos, biz partner badge, favicons, OG image). No broken images detected in-browser (`naturalWidth>0` for all).
- **Favicon / OGP:** `favicon.ico` + `favicon.svg` + `apple-touch-icon` linked on every page; OG image `assets/images/og-image.png` live 200.
- **robots.txt:** `User-agent: * / Allow: / / Sitemap: https://izumiit.com/sitemap.xml`. PASS.
- **sitemap.xml:** 10 public URLs, no `/new/`, no old pages. Missing `<lastmod>` (minor). PASS.
- **Form endpoint:** `GET /api/form.php` → **405** with clean JSON `{"ok":false,"message":"method_not_allowed"}` and `Allow: POST` — **no PHP errors/debug leaked**. Honeypot + server-side validation + header-injection stripping present in source.
- **JS (`main.js`):** Mobile menu (focus trap, scroll lock, backdrop, Esc, resize-close), FAQ accordion, contact validation (required fields, email regex, service required, consent required), and IntersectionObserver reveal with a 2.6s safety fallback. Behaviorally verified working; no functional errors observed. (Full console stream not captured — see scope.)
- **CSS:** Modern, token-based (`clamp()`, CSS grid `minmax(0,1fr)`, custom properties). Japanese wrapping handled deliberately (`word-break: keep-all` desktop, `normal` ≤480px, `overflow-wrap: anywhere` on fit-card headings).
- **Performance concerns:** Single CSS + single JS file, inline SVG-ish icons via text, no heavy frameworks → light. No obvious perf issues. (No Lighthouse run performed.)
- **Mobile concerns:** None found; menu works, no overflow at 320–430.

---

## 5. SEO audit

| Item | Result |
|---|---|
| Unique `<title>` per page | PASS (each page distinct) |
| `meta description` per page | PASS (all present, unique) |
| `canonical` | PASS (each points to its own correct https URL) |
| OG title / description / image / url / type / locale | PASS (all present) |
| Twitter card (`summary_large_image`) + title/desc/image | PASS |
| Favicon links | PASS (ico + svg + apple-touch) |
| robots.txt | PASS (allow all + sitemap) |
| sitemap.xml | PASS (public pages only; no `/new/`, no old) |
| noindex present | NONE (good) |
| Root `https://izumiit.com/` | 200 |
| HTTP → HTTPS redirect | **FAIL — http serves 200 directly, no 301** |
| HSTS header | **Missing** |
| sitemap `<lastmod>` | Missing (minor) |
| canonical pointing to wrong URLs | None |

**SEO verdict:** Strong on-page SEO. One real issue: HTTP and HTTPS both serve identical content with 200 (duplicate-content / no forced TLS). Canonical tags point to https, which mitigates indexing, but a 301 is still recommended.

---

## 6. Legal / safety audit

### Forbidden claims — scan result: **NONE FOUND**
Searched all HTML for: LINE公式認定 / ISO27001 / Pマーク / 法定勤怠対応 / 給与計算対応 / 税務対応 / 労務管理対応 / 売上保証 / no-show完全防止 / 導入500社 / 1200+ / 99% / 4.8/5 / 削減工数 / 導入店舗数. **No positive claims of any of these.**

### Acceptable disclaimers / exclusions (correctly used)
- 給与計算・法定勤怠管理・税務・労務管理 → always as **exclusions** ("目的としたシステムではありません") on index, products, pricing, terms, disclaimer, 特商法.
- **500社以上 → scoped to Web制作・開発 領域** everywhere; company.html explicitly states it is *not* a LINE Business OS adoption figure.
- security.html explicitly disclaims certification/legal-compliance guarantees.
- Booking uses "来店忘れリスクを軽減**しやすく**します" — **not** "no-show完全防止".
- terms §13 / disclaimer §2 disclaim guaranteed outcomes.

### Draft / legal-advice text — scan result: **NONE**
No 「本ページはドラフトです」, no 「法的助言」, no 「正式な内容は専門家による法務確認後に更新します」. Legal pages read as finished documents (dated 2026年6月).

### What still requires a lawyer (recommended, not blocking)
- Final review of 利用規約 §15 (liability cap = 1 month's fees) and 特商法 "address on request" approach for B2C/consumer enforceability and payment-processor requirements.
- Confirm privacy policy meets APPI obligations for the specific data processors you actually use (LINE, mail, payment, hosting) — currently written generically, which is fine for launch but should be tightened once vendors are fixed.

### Must-fix before public launch (legal/safety): **none.** The copy is conservative and well-disclaimed.

---

## 7. Conversion audit

**Clear:**
- What is sold (LINE-based store operations support: Workforce / Booking / Custom Automation).
- Who it's for (cafes/restaurants → Workforce; salons/clinics → Booking) and **who it's not for** (the 向いていないケース card — a strong trust signal).
- Next step (導入相談 / フォーム / メール) — short path, consistent CTA「導入相談する」.
- Pricing is transparent and non-scary (from ¥14,800/mo, "1店舗から", "必要なサービスだけ").

**Trust before contact:** 2018 founding, 500+ Web制作 track record (honestly scoped), 比較ビズ認定, MVL award, security page, onboarding steps, FAQ. Good for a first contact.

**Friction before form:** Reasonable — the form asks 8 fields + service checkboxes + consent. For a B2B consult this is acceptable, though slightly long; all are justified for qualification. Honeypot is invisible to users.

**Could be stronger (later):** Real product screenshots/case examples would lift conversion (current mockups are explicitly "デモ／イメージ" — honest, but less persuasive than real UI). CTAs do not conflict.

---

## 8. Design audit

- **Visual hierarchy:** Strong — eyebrow → H2 → lead pattern is consistent; clear section rhythm.
- **Typography:** Clean, modern Japanese-friendly stack; balanced headings (`text-wrap: balance`). No 2012 feel.
- **Spacing:** Fluid `clamp()` spacing; no giant random gaps observed.
- **Cards:** Product/pricing/trust/fit cards consistent; pricing cards equal-height and aligned.
- **Buttons:** Primary (navy) + secondary clearly distinguished; no buttons overflow blocks.
- **Navigation:** Desktop inline nav + mobile off-canvas drawer with backdrop; logical.
- **Footer:** Tidy two-tier (brand/links + legal row) on every page.
- **Mobile:** Drawer menu works, vertical list + CTA; ~200px-wide left drawer is functional (could be a touch wider, optional).
- **Premium feeling:** Yes — cohesive palette, soft shadows, LINE-green accents used tastefully.
- **Specific visual bugs:** None found. The reported fit-card heading overflow is not reproducible.

---

## 9. Responsive audit

Method: CDP `Emulation.setDeviceMetricsOverride` + geometry checks (off-canvas nav excluded from overflow detection, which is expected to sit off-screen).

| Width | index.html | products | pricing | security | privacy | contact | Observed issues |
|---|---|---|---|---|---|---|---|
| 320 | PASS | PASS | PASS | PASS | PASS | not verified* | No overflow; fit headings OK |
| 375 | PASS (menu tested) | not verified | not verified | not verified | not verified | not verified | Mobile menu opens/closes correctly |
| 390 | PASS | not verified | not verified | not verified | not verified | not verified | No overflow |
| 430 | PASS | not verified | not verified | not verified | not verified | not verified | No overflow |
| 768 | PASS | not verified | not verified | not verified | not verified | not verified | No real overflow (only off-canvas nav off-screen, expected) |
| 1024 | PASS | not verified | not verified | not verified | not verified | not verified | No overflow |
| 1366 | PASS | not verified | not verified | not verified | not verified | not verified | No overflow |
| 1440 | PASS | PASS | PASS (cards aligned) | not verified | not verified | not verified | fit heading OK; pricing cards equal height |
| 1920 | PASS | not verified | not verified | not verified | not verified | PASS | No overflow |

\* contact verified for overflow at 1920 (PASS) but not at 320 specifically.

**Screenshots captured** (in the session screenshot cache, not committed):
- `index-1440-full.png` — desktop hero/header clean
- `index-375-menu-open.png` — mobile menu drawer open, clean
- `pricing-full.png` — pricing hero, header clean
- (`pricing-1440-cards.png` — element capture glitched; pricing alignment instead confirmed via geometry: equal 450px heights, identical top)

**Responsive verdict:** No horizontal overflow found at any width tested on any page. Index fully swept across all 9 widths and is clean.

---

## 10. Prioritized fix list

| # | Priority | Issue | Page / file | Exact location | Severity | Recommended fix | Risk if not fixed |
|---|---|---|---|---|---|---|---|
| 1 | P1 | HTTP not redirected to HTTPS (http serves 200) | server (nginx) | `http://izumiit.com/` | Medium | Add 301 redirect http→https + HSTS | Duplicate content; insecure transport; weaker SEO |
| 2 | P2 | No baseline security headers on HTML | server (nginx) | all HTML responses | Low/Med | Add `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `X-Frame-Options`/CSP | Minor hardening gap |
| 3 | P2 | Personal Gmail backup hardcoded | `api/form.php` | line ~25 `ADMIN_BACKUP_TO` | Low | Confirm intended; ensure repo is private | Internal email exposure if repo/source ever public |
| 4 | P2 | Live mail pipeline unverified | `api/form.php` (prod) | POST handler | Low | Send one real test submission and confirm receipt | Leads silently lost if mail() misconfigured |
| 5 | P3 | Logo link missing aria-label | `contact.html` | header `<a class="logo">` | Low | Add `aria-label="IZUMI IT COMPANY ホーム"` like other pages | Minor a11y/SEO inconsistency |
| 6 | P3 | "500社以上の支援実績" heading unscoped | `index.html` | line 74 trust card `<h3>` | Low | Scope heading to Web制作・開発 (as company.html does) | Slight risk of misreading as SaaS adoption |
| 7 | P3 | `main.js` load inconsistency | `index.html` | line 248 (no `defer`) | Low | Use `defer` in `<head>` like other pages | Negligible; minor render timing |
| 8 | P3 | sitemap missing `<lastmod>` | `sitemap.xml` | each `<url>` | Low | Add `<lastmod>` dates | Minor SEO freshness signal |

*All fixes are out of scope for this audit (analysis only) and are listed as recommendations.*

---

## 11. Do-not-touch list

- **Do not change** the legal pages' substance (privacy / terms / 特商法 / disclaimer) without lawyer sign-off — wording is deliberately conservative.
- **Do not add** any of these claims under any circumstances: LINE公式認定, ISO27001, Pマーク, 法定勤怠対応, 給与計算対応, 税務対応, 労務管理対応, 売上保証, no-show完全防止, SaaS/LINE Business OS 導入○○社, 1200+, 99%, 4.8/5, 削減工数 figures, 導入店舗数.
- **Do not** present 500社以上 / awards / 認定 as LINE Business OS (SaaS) results — they are Web制作・開発 領域 only.
- **Do not** weaken the disclaimers that 給与計算/法定勤怠/税務/労務 are *out of scope*, or the "results not guaranteed" language.
- **Legal areas requiring a lawyer:** liability cap (terms §15), 特商法 disclosure completeness for your payment processor, APPI alignment for your actual data processors.
- **Do not** remove the honeypot field, the privacy-consent checkbox, or the GET=405 behavior on `api/form.php`.

---

## 12. Final verdict

- **Can it launch publicly now?** **Yes** — the content, legal posture, responsive behavior, conversion clarity, and design are launch-ready. The reported critical fit-card bug is not present.
- **Must fix before actively selling:** Add the **HTTP→HTTPS 301 redirect (+ HSTS)** at the server, and **send one real contact-form test** to confirm production mail delivery. Confirm the hardcoded backup email is intended and the repo is private.
- **Can wait (post-launch):** security headers, `contact.html` logo `aria-label`, homepage 500社 heading scoping, `main.js` `defer` consistency, sitemap `<lastmod>`, real product screenshots/case studies.
- **Must verify manually (could not be done here):** live form email round-trip; full browser console on production; Lighthouse/perf if desired; payment-processor 特商法 requirements; lawyer review of terms/privacy.

**Bottom line:** Low launch risk. No content/legal/visual blockers. The one item worth doing before driving traffic is the server-side HTTPS redirect; everything else is polish.
