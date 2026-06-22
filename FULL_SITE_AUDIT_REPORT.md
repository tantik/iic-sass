# FULL PRE-LAUNCH AUDIT — IZUMI IT / LINE Business OS

Audit date: 2026-06-22 (Asia/Tokyo)  
Scope: the 10 requested pages, shared CSS/JS, contact form implementation, robots/sitemap, public assets, and sampled live HTTP behavior.  
Method: independent repository inspection plus read-only live HTTP requests. The in-app browser could not be connected in this session; therefore console, interaction, and pixel-level viewport findings are explicitly marked **browser verification required** rather than reported as passed.

## Executive summary

The site has a credible pre-launch foundation: the product family is separated correctly, Workforce and Booking are not presented as a forced bundle, pricing is visible, the 500+ figure is repeatedly scoped to Web production/development, prohibited positive claims were not found, all requested live URLs and core assets returned HTTP 200, metadata and H1 structure are consistent, and local internal file targets resolve.

It is not ready for an active sales launch. The largest verified issue is infrastructural: `http://izumiit.com/` returns the site with `200 OK` rather than redirecting to HTTPS. Sampled responses did not expose HSTS, CSP, `X-Content-Type-Options`, `X-Frame-Options`, or `Referrer-Policy`. The contact form also cannot be certified without a controlled test submission; its endpoint is third-party Web3Forms, and a non-submitting GET returned 403 (expected for a POST-only API but not evidence of successful delivery). Browser-only mobile, console, overflow, FAQ, and success/error rendering checks remain unverified.

The message is understandable within 10 seconds, but the home page is long and repeatedly uses cautious phrases such as 「整理します」「確認します」「導線を整えます」. This protects against overclaiming, yet weakens specificity and makes the product feel less mature than the pricing suggests. Security copy is especially abstract. Before active sales, add concrete product proof, precise operating requirements, support/SLA boundaries, and legal review.

## Launch readiness verdict

**BLOCKED**

Blocking conditions:

1. HTTP does not redirect to HTTPS.
2. No verified browser matrix, console-clean run, or end-to-end form delivery proof is available.
3. Public security headers were absent from sampled responses.
4. Legal terms, privacy posture, and the 特商法 display need Japanese counsel review before taking paid orders.

After P0 items are closed, the site should qualify as **SOFT LAUNCH READY**. It should not be labeled **ACTIVE SALES READY** until P1 proof, security details, and legal review are complete.

## Top 10 issues by severity

| Rank | Severity | Issue | Evidence / consequence |
|---:|---|---|---|
| 1 | P0 | HTTP serves content instead of redirecting to HTTPS | Live `http://izumiit.com/` returned 200; duplicate origin and downgrade risk. |
| 2 | P0 | Contact delivery is not end-to-end verified | Client code is reasonable, but no authorized POST/delivery check was made; sales leads could be lost silently outside the browser. |
| 3 | P0 | Browser QA remains incomplete | Console, actual responsive overflow, mobile menu, FAQ animation, focus order, and live success/error states require a real browser run. |
| 4 | P1 | Security headers absent | No HSTS, CSP, nosniff, frame protection, or referrer policy observed in sampled responses. |
| 5 | P1 | Product proof is mostly illustrative | The home mockups state that they are explanatory images; no real product screenshots, video, pilot quote, case study, or measurable outcome is supplied. |
| 6 | P1 | Security page is too non-specific | Phrases such as 「必要な範囲で運用・管理」 do not answer hosting region, encryption, backup, retention, incident response, subprocessors, or deletion questions. |
| 7 | P1 | Legal/commercial terms need counsel | Address/phone are disclosure-on-request, jurisdiction is vague, refund/cancellation and data-return rules defer heavily to later documents. |
| 8 | P1 | Home page is overlong and repetitive | 20 H2s and repeated positioning dilute the first conversion path, especially on mobile. |
| 9 | P2 | Pricing leaves key buying questions unanswered | No setup fee range, contract minimum, cancellation deadline, support hours/channel, implementation lead time, or precise plan comparison. |
| 10 | P2 | No structured data found | Organization/SoftwareApplication/FAQ/Breadcrumb structured data is absent; search engines receive only standard metadata. |

## Top 10 conversion improvements

1. Put a compact “who / problem / product / starting price” block directly below the hero.
2. Replace at least one explanatory mockup with authentic, legible product screenshots labeled Workforce and Booking.
3. Add a 60–90 second demo or a three-screen guided walkthrough.
4. State the expected reply time beside every consultation CTA (only if operationally supportable).
5. Add setup fee, setup time, contract term, cancellation, and support details to pricing.
6. Provide one evidence-backed pilot story; clearly label development partners and do not imply paid adoption.
7. Tailor use cases: restaurant shift collection, salon booking/cancellation, clinic operational booking with an explicit non-medical disclaimer.
8. Shorten the home page by merging duplicate “how it works / before-after / LINE reason / onboarding” sections.
9. Add objection answers for migration, LINE account cost, data export, onboarding workload, staff training, and failure recovery.
10. Reduce the contact form’s visible decision load: keep four required fields, collapse optional qualification fields, and show the response process and expected timing.

## Page-by-page audit

### `index.html`

Strengths: the H1 is clear; audience categories appear immediately; both products and Custom Automation are introduced; starting prices are visible; 500+ is explicitly scoped to Web production/development; seven FAQs address several objections.

Problems: the page is extremely long, repeats the same “LINE → management screen → organize” argument, and uses 20 H2s. “受賞” and “認定” cards dominate early trust despite applying to a different business line. The “小規模店舗の実際の声” sentence implies feedback but supplies no source or example. Replace it with verifiable evidence or remove it.

### `products.html`

Strengths: Workforce, Booking, and Custom Automation are plainly independent. Payroll/labor/tax exclusions appear in the correct disclaimer context. Target industries are separated.

Problems: Workforce lacks precise boundaries for shift creation/approval/export; Booking lacks payment, double-booking, calendar integration, cancellation rules, and clinic-data boundaries. The “今後の検討” section distracts from products for sale and can create roadmap expectations; move it to a private sales document or clearly keep it below the primary CTA.

### `pricing.html`

Strengths: transparent monthly prices, tax labeling, separate Workforce/Booking tables, and four tiers create a useful first filter.

Problems: features use imprecise adjectives (“高度な”, “強化”, “優先”), while important commercial terms are absent. A four-card row begins at 820px; it may become cramped between 820 and roughly 1100px and must be visually tested. “最大10/20/50名” needs a definition (registered users, active staff, or accounts).

### `security.html`

Strengths: avoids prohibited certification claims and explicitly states that no certification or legal compliance is guaranteed. Customer responsibility is acknowledged.

Problems: almost every control is aspirational. Before selling, disclose the verified hosting/provider region, encryption in transit/at rest, authentication/MFA availability, backups, recovery targets, log retention, tenant isolation method at a safe level, staff access logging, incident notification, deletion/export, and subprocessors. Do not add any claim that is not implemented and evidenced.

### `company.html`

Strengths: correctly distinguishes company history from SaaS adoption and repeats the 500+ limitation.

Problems: the page lacks a business address, legal entity/type clarification, representative biography, support footprint, and direct evidence links for all awards/recognitions. 「比較ビズ 認定企業」 is not one of the forbidden claims, but the basis and current validity should be linked and checked.

### `contact.html`

Strengths: clear alternatives, four truly required text fields, optional qualification fields, privacy consent, email fallback, loading/success/error messages, focus movement, and double-submit prevention.

Problems: the form still appears long, the response time is missing, and Web3Forms is not named in the visible privacy explanation. Delivery, spam handling, reply-to behavior, and mobile keyboard behavior need a controlled browser test. The access key is public by design in Web3Forms client mode and should be restricted/rotated according to provider controls; it is not a secret once embedded in HTML.

### `privacy.html`

Strengths: covers collected data, purposes, vendors, external services, safety, rights, retention, and contact.

Problems: vendor categories are generic; Web3Forms/hosting/LINE data flows, cross-border processing, exact controller identity/address, request verification, and practical retention periods should be reviewed and stated where required. “現時点で…導入していない場合でも” reads like draft/template language; state the current analytics reality directly.

### `terms.html`

Strengths: product exclusions, user responsibility, external-service dependency, non-guarantee, IP, suspension, liability, cancellation, and governing law are addressed.

Problems: the liability cap of one month’s fees, unilateral change process, service suspension/termination, data return/deletion, and court clause require counsel. 「当社所在地または個別契約で定める裁判所」 is not a precise exclusive jurisdiction. Contract precedence between estimate, application, individual contract, pricing page, and terms should be explicit.

### `commercial-disclosure.html`

Strengths: operator, responsible person, contact email, price basis, extra costs, payment, timing, delivery, cancellation, and environment are present.

Problems: whether “所在地/電話番号は請求があった場合に遅滞なく開示” is sufficient for this exact B2B sales model requires Japanese counsel. Refund rules, recurring billing, minimum term, renewal, cancellation deadline, and payment timing should not be left entirely to later documents if online applications/payments will be accepted.

### `disclaimer.html`

Strengths: forbidden outcome and professional-service claims appear only as clear non-guarantees/exclusions. External dependencies and system limitations are covered.

Problems: overlap with Terms creates maintenance risk. Ensure precedence is clear and that no disclaimer attempts to waive liability that cannot legally be waived.

## Responsive audit

The table below is a **static CSS assessment**, not a browser pass. CSS uses mobile-first grids, `minmax(0,1fr)`, root overflow containment, 44px menu control, 50px buttons, a drawer below 820px, and dedicated rules at 420/480/560/640/760/768/820/1024px. Those are good safeguards, but root `overflow-x: hidden/clip` can conceal a child overflow defect rather than eliminate it.

| Width | Static assessment | Header/nav | Main risk requiring browser verification |
|---:|---|---|---|
| 320 | Likely usable | Drawer; 44px toggle | Long Japanese/English product names, form selects, consent row, and pricing amounts. |
| 375 | Likely usable | Drawer | Hero height, CTA stacking, footer density. |
| 390 | Likely usable | Drawer | Text wrapping inside feature/price cards. |
| 430 | Likely usable | Drawer | Transition just above 420px means buttons may no longer force full width. |
| 768 | Likely usable | Drawer (<820) | Two-column grids combined with tablet typography; pricing remains one column. |
| 1024 | Elevated risk | Desktop nav | Four pricing cards from 820px may be narrow; nav/logo fit. |
| 1366 | Likely usable | Desktop nav | Excessive page length and whitespace rhythm. |
| 1440 | Likely usable | Desktop nav | Hero/readability and maximum content width. |
| 1920 | Likely usable | Desktop nav | Large empty margins; visual scale and CTA prominence. |

At every width, verify horizontal `scrollWidth`, sticky header, menu open/close/Escape/focus trap, hero wrapping, all card grids, both pricing sets, form keyboards and error focus, footer links, CTA visibility, and card text containment.

## Design audit (provisional; source/CSS review)

| Criterion | Score / 5 | Finding |
|---|---:|---|
| Visual hierarchy | 4 | Strong headings/cards, but home has too many equal-weight sections. |
| Premium feel | 3 | Cohesive gradients/shadows; generic card abundance and illustrative UI reduce product maturity. |
| Brand consistency | 4 | Consistent navy/teal, typography, buttons, and repeated header/footer. |
| Trust feeling | 3 | Good caution and legal links; weak SaaS proof and abstract security reduce confidence. |
| Spacing | 4 | Clamp-based system is coherent; long mobile page likely feels over-spaced. |
| Typography | 4 | Japanese line-breaking safeguards are thoughtful; English eyebrow labels add visual polish but some corporate distance. |
| Mobile design | 3 | Strong code safeguards; score capped until actual device/browser run. |
| CTA visibility | 4 | Frequent and consistent, occasionally too frequent/repetitive. |
| Japanese B2B appropriateness | 3 | Polite and careful, but buyers need more concrete conditions, proof, and operator detail. |

Concrete design actions: reduce home section count; use authentic product screens; make one primary CTA label site-wide; distinguish Workforce and Booking visually; avoid four pricing cards in one row at tablet widths; reduce English micro-label dependence; ensure the consent checkbox and legal footer have comfortable mobile touch targets.

## Copy audit

Naturalness is generally good and legally cautious. The main weakness is AI-like repetition: 「整理」「確認」「導線」「必要な範囲」「小さく始める」 recur so often that claims become vague. “導線を整えます” is especially overused in Booking copy. “DX” and “ERP” are not explained for a small-store owner. Security prose over-hedges instead of giving verifiable facts.

Exact recommended rewrites:

| Current | Recommended |
|---|---|
| LINEに散らばる勤務希望・予約連絡・報告を整理し… | スタッフの勤務希望とお客様の予約をLINEで受け付け、店舗側の管理画面で一覧確認できます。 |
| 営業時間外の予約にも対応しやすい導線を整えます。 | 営業時間外でも、お客様はLINEから空き枠を確認して予約できます。 |
| 連絡漏れや誤操作を減らすための導線を整えます。 | 予約確認・変更・キャンセルの操作をLINE内にまとめ、電話やDMの確認作業を減らします。 |
| 来店忘れ対策に役立つ導線を整えます。 | 設定した日時にリマインドを送り、来店予定をお客様へ再案内します。※来店を保証するものではありません。 |
| 通信やクラウド環境を、必要な範囲で運用・管理します。 | （実装確認後）通信はTLSで暗号化し、データは［提供者・地域］で保管します。バックアップは［頻度］、保持期間は［期間］です。 |
| 小規模店舗の実際の声をもとに… | 開発協力店舗で操作手順を確認し、入力項目や通知の流れを改善しています。※事実を記録できる場合のみ使用。 |
| フォームは、分かる範囲だけで送信できます。 | 必須項目は、お名前・店舗名・メールアドレス・ご相談内容の4点です。 |
| 優先サポート | 優先サポート（受付時間・回答目安・対象チャネルを明記） |

## SEO audit

Verified strengths: every requested page has one H1, a unique title, meta description, self-referencing HTTPS canonical, OG image, and Twitter summary-large-image tags. `robots.txt` allows crawling and names the sitemap. `sitemap.xml` contains all 10 requested canonical URLs with current `lastmod`. Live robots, sitemap, favicon, apple-touch-icon, and OG image returned 200. No `/new/` links were found locally or in the live text scan. Local internal link targets resolved.

Issues: HTTP canonical duplication remains until redirected; no structured data was found; OG artwork is shared across all pages; legal page descriptions are long and generic; navigation labels are English while buyer keywords are Japanese; no visible breadcrumb structure exists. Add Organization and product/service structured data only with accurate fields; FAQ schema is appropriate only if the visible FAQs remain identical. Do not use fabricated ratings, reviews, adoption counts, or results.

## Legal / risk audit

- No prohibited positive claims were found in the local scan or live text scan.
- Payroll, statutory attendance, tax, and labor-management terms appear as exclusions, which matches the brief.
- The 500+ claim is explicitly limited to Web production/development and says it is not LINE Business OS adoption.
- No ISO27001, P-mark, LINE official certification, sales guarantee, complete no-show prevention, 1200+, 99%, or 4.8/5 claim was found.
- “比較ビズ 認定企業” must remain clearly attributed to 比較ビズ and should link to current evidence; it must never be visually reframed as LINE certification.
- Clinic wording must avoid medical efficacy and should clarify whether sensitive medical information must not be entered.
- Legal review is required for 特商法 display sufficiency, privacy controller identity/data transfers, processor agreements, recurring billing/refunds, limitation of liability, jurisdiction, service suspension, data retention/export/deletion, and contract-document precedence.

## Form audit

Implementation: `contact.html` posts client-side to `https://api.web3forms.com/submit`; JavaScript prevents native submission, validates four fields/email/message length/privacy consent, submits `FormData`, disables the button, provides live status text, resets on explicit success (or Web3Forms HTTP-OK empty response), and provides an email fallback. The local PHP proxy is explicitly documented as inactive. This matches the supplied Web3Forms-free-tier context.

Risks and required tests:

1. Make one authorized test submission with a unique subject and confirm inbox receipt, reply-to, Japanese characters, selected services, spam folder behavior, and provider dashboard record.
2. Simulate offline, 4xx, 5xx, malformed JSON, and slow response; verify the button always re-enables and the error stays visible.
3. Verify Web3Forms domain restrictions, rate limits, bot protection, access-key rotation, and abuse notifications.
4. Name the form processor/data-transfer posture in the privacy materials if counsel requires it.
5. Test without JavaScript: `novalidate` plus the third-party action may behave differently and privacy consent enforcement becomes provider-dependent.
6. A read-only GET to the form endpoint returned 403; this is compatible with a protected POST API but does not validate submission.

## Technical QA audit

| Check | Result |
|---|---|
| Git status at start | Clean: `## main...origin/main` |
| Requested live pages | All 10 returned 200 |
| robots / sitemap | 200; syntactically coherent by inspection |
| favicon / apple icon / OG image | 200; correct image content types |
| Core asset weight | Small: largest local image is ~32 KB; no obvious image bloat |
| Broken local internal targets | None found among requested pages |
| `/new/` links | None found locally or in live text scan |
| Old-site links | None found; one intended external 比較ビズ evidence link exists |
| Forbidden claims | None found in scanned local/live page text |
| Framework/build bloat | None; static HTML/CSS/JS + PHP as expected |
| Lazy loading | None, but pages mainly use small logos/icons; not currently material |
| JS static review | No obvious syntax/logic failure; browser console not verified |
| Mobile menu | Good ARIA, Escape, backdrop, focus loop, resize close, scroll lock in code; browser verification required |
| FAQ | ARIA-expanded and icon toggling implemented; browser verification required |
| Horizontal overflow | Defensive CSS present; real widths not verified and root clipping may mask defects |
| HTTP → HTTPS | **Fail:** HTTP returned 200, no redirect |
| Security headers | **Fail/absent in sample:** HSTS, CSP, nosniff, frame, referrer policy |

Live content lengths differ from local file byte lengths on pretty-printed pages in a pattern consistent with CRLF-to-LF deployment normalization; minified legal pages differ by one byte. No semantic drift was established from this alone.

## Do-not-touch list

- Do not convert the project to React/Next.js/Tailwind/Vite/npm.
- Do not route the production form back through PHP while the free Web3Forms plan rejects server-side submissions.
- Do not claim LINE official recognition, ISO27001, P-mark, statutory attendance/payroll/tax/labor compliance, guaranteed sales, complete no-show prevention, or invented metrics.
- Do not turn the Web-production 500+ history into a SaaS/LINE Business OS adoption number.
- Do not bundle Workforce and Booking by implication.
- Do not publish roadmap items as available features.
- Do not add security claims until implementation and evidence exist.
- Do not remove the professional-domain exclusions without counsel.

## Priority fix list

### P0 — fix now

1. Configure a permanent HTTP → HTTPS redirect for every path and asset; retest status/location.
2. Run the full browser viewport matrix and capture console/network failures.
3. Perform an authorized Web3Forms delivery test and document the result.
4. Resolve every browser defect found; retest menu, FAQ, form states, focus, and overflow.

### P1 — before active sales

1. Add HSTS after HTTPS-only behavior is proven; add CSP, nosniff, clickjacking, and referrer protections with compatibility testing.
2. Obtain Japanese legal review of Privacy, Terms, 特商法, and Disclaimer.
3. Publish concrete, verified security and data-lifecycle information.
4. Add authentic product proof and one evidence-backed pilot story.
5. Complete pricing with setup, term, cancellation, support, and delivery details.
6. Clarify clinic/sensitive-data boundaries.

### P2 — soon after soft launch

1. Shorten and de-duplicate the home page.
2. Rewrite vague/repetitive copy using the table above.
3. Add accurate Organization/product/FAQ structured data.
4. Create page-specific OG images.
5. Add documented analytics only after privacy/cookie implications are handled.

### P3 — can wait

1. Publish deeper industry landing pages.
2. Add video demos and expanded case studies.
3. Evaluate automated accessibility/performance regression checks.
4. Remove unused assets only after confirming no external references.

## Exact recommended edits

1. Server configuration: redirect all port-80 requests to the equivalent `https://izumiit.com$request_uri` with 301/308; do not redirect only the home page.
2. Header configuration after testing: begin with `X-Content-Type-Options: nosniff`, a modern frame policy (`frame-ancestors 'none'` in CSP), `Referrer-Policy: strict-origin-when-cross-origin`, and a CSP built from observed resources. Enable HSTS only after all subdomains/resources are HTTPS-ready.
3. Home hero support line: 「スタッフの勤務希望とお客様の予約をLINEで受け付け、店舗側の管理画面で一覧確認。Workforceは月額14,800円、Bookingは月額19,800円から、1サービスずつ導入できます（税別）。」
4. Pricing: add rows for initial fee, included support, response window, minimum term, cancellation deadline, onboarding lead time, export, and overage/extra-store pricing.
5. Security: replace each “必要な範囲” statement with an implemented control and owner/frequency/retention value; otherwise state “導入前に個別確認” without implying a control exists.
6. Contact: add an operationally truthful line such as 「通常［N］営業日以内にメールでご連絡します」 and disclose the external form processor as legally advised.
7. Company: add legal identity/address/representative context and direct evidence URLs where safe.
8. Terms: specify one court, document precedence, suspension notice, data export window, deletion timing, and cancellation mechanics after counsel review.

## What should be fixed now

HTTPS redirect, security-header plan, actual browser matrix, console/network run, and end-to-end form delivery. These are objective launch gates and should precede copy polish.

## What can wait

Industry landing pages, richer animations, page-specific social artwork, long-form case studies, and analytics can wait until the soft launch is stable.

## What requires legal review

特商法 address/phone disclosure, operator/controller identity, Web3Forms and other processor/data-transfer disclosure, clinic/sensitive data, recurring billing/refunds/cancellation, liability cap, jurisdiction, unilateral changes, suspension, data return/deletion, security representations, and precedence across sales/contract documents.

## Final verdict

**BLOCKED today.** The site is close in content architecture and notably careful about prohibited claims, but infrastructure and verification are not optional polish. Fix HTTP/HTTPS behavior, complete real-browser QA, prove lead delivery, add baseline headers, and obtain legal review. With those closed, the current site is suitable for a controlled soft launch; authentic product proof and precise commercial/security terms are still needed before broad active sales.

## Repository safety record

- Starting status: clean (`## main...origin/main`).
- No production file was modified.
- No commit was created.
- The only created file is `FULL_SITE_AUDIT_REPORT.md`.
