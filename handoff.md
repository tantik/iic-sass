# Handoff

## Цель

Создать продающий SaaS-first сайт IZUMI IT COMPANY для японского рынка, где LINE Business OS — основная продуктовая линейка, а Workforce и Booking — отдельные SaaS-продукты.

## Текущее состояние

- Стек: static HTML/CSS/JS, без framework, build system и backend.
- Текущая ветка: `main`.
- Remote: `origin https://github.com/tantik/iic-sass.git`.
- Основные страницы: `index.html`, `products.html`, `pricing.html`, `security.html`, `company.html`, `contact.html`.
- Legal pages: `privacy.html`, `terms.html`, `commercial-transaction.html`, `security-policy.html`, `data-handling-policy.html`, `support-policy.html`, `billing-policy.html`.
- `/old` отсутствует и не требуется.
- Старый сайт используется только как external reference: https://izumiit.com/
- Legal pages являются draft и содержат обязательное предупреждение.
- Contact form остаётся static/mailto: `izumi@izumiit.com`.
- Live test path: https://izumiit.com/new/
- Текущий этап: Phase 1.9B — Mobile preflight fix + Pricing page visual polish (после Phase 1.9A-2).

## Phase 1.9B — Mobile preflight fix + Pricing page visual polish

### Файлы изменены в Phase 1.9B

- `pricing.html` — полностью переработана в полноценную SaaS pricing-страницу.
- `assets/css/style.css` — фикс horizontal overflow + scroll lock + новые pricing-компоненты.
- `assets/js/main.js` — iOS-safe фикс mobile nav (position:fixed scroll lock).
- `index.html` — только TASK 1 a11y (aria-hidden на декоративные `.flow-icon`).
- `handoff.md`.
- `assets/images/cursor.svg` — **удалён** (untracked, не использовался; custom cursor не реализуется).

### TASK 0 — Mobile preflight (horizontal overflow + fixed menu)

**Root cause горизонтального скролла (Problem A):**
Mobile nav drawer `.nav` — `position: fixed; right: 0; transform: translateX(104%)` — в закрытом состоянии уезжает за правый край вьюпорта (его правый край оказывался на `scrollWidth ≈ 710px` при `clientWidth = 375px`; именно белая панель drawer создавала «пустую белую зону справа» на скриншоте). `body { overflow-x: hidden }` НЕ обрезал его, потому что:
1) `.nav` — `position: fixed`, а fixed-элементы в Chrome дают scrollable overflow на уровне корня, который body не клипит;
2) `.site-header` имеет `backdrop-filter`, из-за чего header становится containing block для fixed `.nav` (подтверждено через DevTools).

**Как исправлено (Problem A):**
- Добавлен `overflow-x: clip` (с fallback `overflow-x: hidden`) на **`html`** — это клипит off-screen fixed drawer на уровне корня (проверено: scrollWidth 710 → 375). `clip` предпочтён, т.к. не создаёт scroll-container и не ломает sticky-header. Тот же `clip` fallback добавлен и на `body`.
- Симптом не маскировался: источник (off-screen fixed drawer) найден и обработан на корне; сам drawer оставлен анимированным (translateX), но теперь надёжно обрезается.

**Root cause «меню уезжает вверх при скролле» (Problem B, iOS Safari):**
`.site-header { backdrop-filter }` делает header containing block для fixed `.nav`, поэтому на iOS drawer ведёт себя как `absolute` относительно header и скроллится со страницей; плюс `overflow: hidden` на body на iOS не блокирует фоновый скролл.

**Как исправлено (Problem B):**
- CSS: `.menu-open .site-header { backdrop-filter: none }` — пока меню открыто, header перестаёт быть containing block, и `.nav` снова fixed относительно вьюпорта (проверено: `navTop=0`, `navHeight=100dvh`).
- JS: вместо простого `overflow: hidden` реализован iOS-safe scroll lock — при открытии запоминается `scrollY`, на `body` ставится `position: fixed; top: -scrollY; width: 100%` (класс `.menu-open`), при закрытии стиль снимается и `window.scrollTo(0, scrollY)` восстанавливает позицию (проверено: позиция 742 сохранена и восстановлена, фоновый скролл заблокирован).
- Поведение закрытия не изменено: backdrop / Escape / клик по ссылке / resize ≥820 по-прежнему закрывают меню; focus-trap сохранён; nav-ссылки работают.

**QA scrollWidth/clientWidth (после фикса), pricing.html и index.html:**

| width | до (pricing) | после (pricing) | после (index) |
|------|------|------|------|
| 320 | 710* | 320 = 320 | 320 = 320 |
| 375 | 710 vs 375 | 375 = 375 | 375 = 375 |
| 390 | 710* | 390 = 390 | 390 = 390 |
| 430 | 710* | 430 = 430 | 430 = 430 |
| 768 | — | 768 = 768 | 768 = 768 |
| 1440 (desktop) | — | 1425 = 1425 | 1425 = 1425 |

`*` — drawer-overflow проявлялся одинаково на всех mobile-ширинах. После фикса `scrollWidth === clientWidth` на всех проверенных ширинах; `document.scrollingElement` не имеет горизонтального скролла (`scrollLeftMax = 0`).

### TASK 1 — Accessibility / cleanup

- Декоративные буквы-иконки в hero `index.html` (`<span class="flow-icon">L / 人 / ▦ / ✓`) получили `aria-hidden="true"` (смысл несут соседние `<small>`/`<strong>`). Прочие декоративные символы (`!`, `✓`, `↓`, `→`, `＋`) уже реализованы через CSS `::before`/`content` или уже имели `aria-hidden`. Без переусложнения a11y.

### TASK 2 — Pricing page visual polish

- `pricing.html` переработан из плоских карточек в серьёзную SaaS pricing-страницу со структурой:
  1. **Pricing hero** — h1 `必要なサービスだけを選べる料金プラン`, subcopy, trust/safety-row из 3 чипов (`1店舗から相談可能 / 必要なサービスだけ導入 / 個別見積り対応`), helper.
  2. **Workforce** и **Booking** — раздельные секции, каждая с product-label, use-case lead, сеткой планов.
  3. **Plan cards** — улучшена иерархия: plan-name → price → tax note → target size (boxed) → short description → `向いているケース` строка → CTA.
  4. **どのプランが向いているか** — секция-гид (小さく試したい→Starter / 基本運用を整理したい→Standard / 承認・レポート・優先対応→Business / 複数店舗・個別要件→Enterprise).
  5. **Cost transparency** — две карточки `料金に含まれるもの` (mint, ✓) и `別途費用になり得るもの` (warm, copper ＋): 初期設定/導入相談/運用確認 (зависит от плана/見積り), LINE公式アカウント利用料金 (別途), カスタマイズ・複数サービス (別途お見積り) + строка о финальных условиях по見積り/利用規約. Точные суммы НЕ выдуманы.
  6. **Bottom CTA** — `自店舗に合うプランを確認する` + `人数、店舗数、現在の運用をもとにご案内します。` + primary CTA на contact + secondary link на products.
  7. **Legal notes** — все 6 `※` заметок сохранены без изменений.
- **Pricing values НЕ менялись** (Workforce 14,800/29,800/49,800/98,000〜; Booking 19,800/29,800/49,800/98,000〜; 税別; target sizes), бизнес-логика/legal/disclaimers не тронуты.
- **Recommended badge** оставлен на **Standard** (Workforce и Booking) — как и было; логика не менялась. Standard визуально усилен (copper-рамка, badge, приподнят), что естественно делает его main recommended.
- Визуал в едином стиле с homepage: mint/green/navy, мягкие карточки, тени, скругления; copper только точечно (featured-рамка, `＋` в extra-card). Без stock/AI images. Тёмные блоки только в CTA.
- Mobile: карточки стекаются (featured Standard поднят наверх `order:-1`), нет таблиц с горизонтальным скроллом, CTA не переполняются, текст переносится корректно; нет горизонтального скролла на 320/375/390/430/768.
- SEO/иерархия: h1 остаётся pricing-focused, h2/h3 логичны, текст concise, без keyword-stuffing, без запрещённых claim'ов.

### TASK 3 — QA выполнено

- Visual QA: index.html и pricing.html на 320/375/390/430/768 и desktop 1440 (browser DevTools emulation).
- Horizontal overflow: `scrollWidth === clientWidth` на всех ширинах обеих страниц (см. таблицу выше).
- Mobile menu: открытие (drawer fixed к вьюпорту, `top=0`, `height=100dvh`), скролл при открытом меню заблокирован, позиция сохранена/восстановлена, закрытие по backdrop работает, ссылки работают.
- Legal grep по `*.html`: `LINE公式認定 / ISO27001 / Pマーク / 法定勤怠対応 / 給与計算対応 / 税務対応 / 労務管理対応 / 売上保証 / no-show完全防止 / SaaS導入500社 / LINE Business OS 導入500社 / 導入500社 / 500社が利用` — совпадений нет.
- `500社以上` встречается только в `index.html` в контексте Web制作・開発領域 (2 места), не связан с SaaS / LINE Business OS.
- Pricing values не изменены; все 6 legal notes видимы; custom cursor не реализован; новых framework/build/dependencies нет; `assets/images/cursor.svg` удалён.

### Остаточные риски Phase 1.9B

- Problem B (iOS fixed-menu) воспроизводился именно на iPhone SE/iOS Safari; в Chromium emulation он не повторялся (там scroll lock и так держал). Фикс (position:fixed body + снятие backdrop-filter) корректен по спецификации, но финальную проверку желательно сделать на реальном iOS-устройстве после deploy.
- `overflow-x: clip` поддерживается современными браузерами; для старых остаётся fallback `overflow-x: hidden`.
- Pricing — draft контент, требует финального ревью японского текста и юридической сверки перед production.

## Phase 1.9A-2 — Product mockup / 操作イメージ polish

### Файлы изменены в Phase 1.9A-2

- `index.html`
- `assets/css/style.css`
- `handoff.md`
- `assets/js/main.js` НЕ менялся (reveal/JS изменений не требовалось).

### Что изменилось в Phase 1.9A-2

- Approved color direction остаётся **mint/green/navy** (LINE green = LINE-first/SMB, navy = trust/management, copper только точечно). Тёмная/luxury тема НЕ возвращалась.
- Блок 操作イメージ переработан из четырёх одинаковых wireframe-карточек (`.mockup-grid` / `.mockup-card`) в единый **product-system preview** (`.product-system`): теперь читается как одна операционная система, а не галерея плейсхолдеров.
- Добавлен flow-header внутри блока: **LINE入力 → 管理画面で確認 → 通知・リマインド整理 → 店舗運営をシンプルに** (LINE-нода зелёная, operation-нода navy).
- Двухколоночная композиция: слева **LINE側** (phone-моки: Workforce スタッフ画面 + Booking お客様画面 с chat bubbles, кнопками, выбором услуги), справа более крупный **管理画面 / 店舗側** (Workforce 管理者画面 dashboard с counters/progress bar/status chips + Booking 店舗側管理 booking-rows + блок 通知・リマインд notification cards).
- Четыре use case сохранены, но интегрированы как mini-панели внутри одного product-system: Workforce スタッフ画面 / Workforce 管理者画面 / Booking お客様画面 / Booking 店舗側管理.
- Реализм добавлен только через HTML/CSS: app header bars, LINE chat bubbles, dashboard cards, status chips (確認済み/修正依頼/予約/確認済み/空き), progress bar, reminder/通知 cards, booking time rows, shift/request counters, demo-метки.
- Данные только вымышленные/demo: `Staff A`, `Staff B`, `Demo User`, `Demo Salon`, `DEMO`, `（デモ）`. Без логотипа Mame To Cha, реальных имён, фото, телефонов, email, скриншотов, stock/AI images.
- Section title сохранён (`実際の操作イメージ`), пояснительный текст и safe note (`画面は説明用のイメージです。実際の導入内容は店舗ごとに確認します。`) сохранены. Запрещённые фразы (現在開発中 / HTML/CSSモックアップ / 未完成 / テスト中) НЕ добавлялись.
- Визуальный стиль: white cards, soft mint/blue фоны, navy management accent, restrained copper только в `修正依頼` chip; блок не тёмный, без перегруза зелёным/золотом.
- Mobile stacking: `.ps-grid` и `.ps-dash-row` стекаются в одну колонку <820px; на desktop management-колонка шире (`.82fr / 1.18fr`). Проверено отсутствие горизонтального скролла (375/390/430/768/desktop).
- Hover/reveal regression: hover у `.ps-phone/.ps-dash/.ps-notify` спокойный (`translateY(-2px)` + box-shadow, без смены фона → без мерцания); кнопки не трогались; reveal через `.section` сохранён (`.mockup-card` в reveal-списке main.js теперь не находит элементов — безвредно); `prefers-reduced-motion` соблюдён.
- Custom cursor НЕ реализован; `assets/images/cursor.svg` остаётся untracked и НЕ коммитится.
- Pricing / business logic / legal / public тексты НЕ менялись. Проверка запрещённых формулировок выполнена: `500社以上` встречается только в Web制作・開発領域 контексте; LINE公式認定 / ISO27001 / Pマーク / セキュリティ完全保証 / 100%安全 / 法定勤怠対応 / 給与計算対応 / 税務対応 / 労務管理対応 / 売上保証 / no-show完全防止 / SaaS導入500社 / 導入500社 / 500社が利用中 — не найдены в публичных страницах.

## Phase 1.9A-Fix — Home visual stabilization

### Файлы изменены в Phase 1.9A-Fix

- `assets/css/style.css`
- `assets/js/main.js`
- `handoff.md`
- `index.html` НЕ менялся — усиление hero достигнуто полностью через CSS.

### Что изменилось в Phase 1.9A-Fix

- Button hover blinking исправлен: причина мерцания — `transition` фона между `linear-gradient` и сплошным цветом (gradient → solid не интерполируется и «блымает» на Windows Chrome). Теперь `.button` имеет постоянный `background-image: var(--gradient-navy)` + сплошной `background-color` fallback, а hover больше НЕ меняет фон. Обратная связь только через `box-shadow`, `border-color` и `transform: translateY(-1px)`. Transition сокращён до safe-свойств: `transform / box-shadow / border-color / color / background-color` по .18s ease.
- Hover-эффекты сделаны спокойнее/премиальнее: `.card`, `.trust-card`, `.mockup-card` подъём уменьшен с `translateY(-3px)` до `-2px`; primary button с `-2px` до `-1px`; убран резкий repaint фона.
- Hero visual усилен без перестройки: на desktop колонки `.hero-grid` отданы панели больше места (`minmax(0,1.05fr) minmax(420px,.95fr)`), увеличены padding `.hero-panel` и `.flow-stage`, укрупнены `.flow-node` (текст/иконки), `.flow-summary`, `.status-chip` и `.hero-panel-head h2` — панель читается как более «настоящий» SaaS-dashboard. HTML hero и controlled 2-line headline сохранены.
- CTA hierarchy стабилизирована: primary `.button` чуть массивнее (`padding: 12px 24px`) и остаётся доминирующим navy; secondary спокойный белый outline; добавлен читаемый `focus-visible` (светлый outline) для кнопок на тёмных секциях `.cta-section / .contact-final / .stat-box`.
- Readability/иерархия карточек: укрупнены `.workflow-card h3` и `.mockup-card h3`, чуть увеличены отступы — меньше однообразной «мелочи».
- Reveal/no-JS fallback проверен и усилен: контент по умолчанию видим (скрывает только JS-класс `reveal-pending`), `prefers-reduced-motion` соблюдён; в `main.js` добавлен safety `setTimeout(revealAll, 2600)`, чтобы ни одна секция не оставалась невидимой навсегда и full-page screenshots не имели пустых зон (например, инструменты без скролла).
- Custom cursor намеренно НЕ реализован (B2B SaaS, usability/accessibility). В репозитории есть untracked `assets/images/cursor.svg` — он НЕ используется как system cursor и НЕ коммитился.
- Pricing / business logic / legal / public тексты НЕ менялись. `pricing.html`, `index.html`, legal pages не затронуты. Проверка запрещённых формулировок (LINE公式認定, ISO27001, Pマーク, セキュリティ完全保証, 100%安全, 法定勤怠対応, 給与計算対応, 税務対応, 労務管理対応, 売上保証, no-show完全防止, SaaS導入500社, 導入500社, 500社が利用中) — совпадений в публичных страницах нет; `500社以上` относится только к Web制作・開発領域.

## Phase 1.9A — Global visual system + Home page visual polish

### Файлы изменены в Phase 1.9A

- `assets/css/style.css`
- `index.html`
- `handoff.md`

### Что изменилось в Phase 1.9A

- Введена premium SaaS color system через упорядоченные CSS variables / design tokens: core navy (`#071827`, `#0b1220`), text (`#102033`), surfaces (clean white, `#f7f8fa`, `#f6f4ef`), borders (`#e4e8ef`), restrained copper/gold accent (`#b98245`–`#c6a15b`), LINE green (`#06c755`) только для LINE-related акцентов.
- Визуальное направление: deep navy + clean white + restrained copper accent + точечный LINE green; без luxury/кожи/монограмм/тяжёлого золота.
- Обновлены shadow system (navy-tinted: `--shadow-sm/md/lg/brand/accent`), gradients (`--gradient-hero/navy/navy-deep/card-soft`), radius и transition tokens.
- Legacy имена брендовых токенов (`--color-brand`, `--color-brand-dark`, `--color-brand-deep`, `--color-brand-soft`, `--color-brand-pale`) сохранены, чтобы не ломать остальные страницы.
- Hero polish: премиальный SaaS-фон (`--gradient-hero`), мягкие navy/copper декоративные слои, copper trust dot, LINE green status chip, усиленная тень панели (`--shadow-lg`), structured «product header» с тонким разделителем в `.hero-panel-head`.
- CTA hierarchy: primary `.button` — navy gradient (заметный), secondary `.button-secondary` — спокойный белый outline.
- Hero/product visual (flow-stage): LINE-нода в зелёном (`--color-line`), operation-нода в navy gradient — показывает LINE → 管理画面 → 店舗運営 как систему.
- Home card/section consistency: единый radius/shadow, copper-акценты в trust numbers/badges, navy gradient в workflow steps / stat-box / pricing-preview / contact-final / cta-section, мягкие borders.
- Mockup polish: добавлены явно вымышленные demo-метки `Staff A`, `Staff B` и пометки «（デモ）» в management-панелях; без реальных имён, логотипов, телефонов, email и персональных данных.
- Japanese typography/wrapping polish: `text-wrap: balance/pretty`, `line-break: strict`, `word-break: keep-all` для коротких заголовков карточек/секций с mobile fallback (`max-width: 480px` → normal) во избежание горизонтального overflow; hero headline сохранён в две строки через block spans.
- Mobile home polish: проверены 375/390/430/768px, hero-title `clamp(28px, 6.6vw, 60px)`, flow-stage в колонку на узких экранах, отсутствие горизонтального скролла (`overflow-x: hidden`).
- Pricing / legal / business logic / тексты НЕ менялись (кроме demo-меток mockup); `pricing.html` не затронут.

## Файлы, над которыми работали ранее (Phase 1.8)

- `pricing.html`
- `assets/css/style.css`
- `handoff.md`
- (ранее в этой фазе: `index.html`, `products.html`, `contact.html`)

## Что изменилось (Phase 1.8 и ранее)

- Hero получил более конкретный текст о勤務希望・予約連絡・報告 и product-like визуальную схему работы.
- Добавлен блок `信頼の背景` с осторожно квалифицированными фактами: 2018年設立, 500社以上 только в Web制作・開発領域, ランサーズ 2021年上期 MVL賞, 比較ビズ 認定企業.
- Усилены problem/solution тексты и outcome-first copy для Workforce, Booking и Custom Automation.
- Workforce и Booking получили отдельные lead-тексты о снижении нагрузки на店長 и ручной работы.
- Pilot framing заменён на спокойный блок導入前の確認 и демонстрацию до正式導入.
- В pricing добавлены видимые `おすすめ` badges и пояснение о начале с одной店舗 без изменения цен.
- Mobile navigation заменена на правый drawer с backdrop, scroll lock, закрытием по backdrop, Escape, ссылке и resize.
- FAQ переведён на доступные button-based accordion items с `aria-expanded`, плавным раскрытием и независимым открытием нескольких ответов.
- Добавлены спокойные staged/reveal/hover animations с поддержкой `prefers-reduced-motion`.
- Meta description главной страницы обновлён под конкретную ценность продукта.
- В trust section добавлен локальный Biz Partner badge `assets/images/biz_partner_type2.png` со ссылкой на `https://www.biz.ne.jp/company/izumi-it/`.
- Lancers award оставлен текстовой карточкой: отдельного подтверждённого Lancers logo asset в репозитории нет.
- Добавлены секции `LINE Business OSで変わること`, `導入前と導入後の違い`, `こんな店舗に向いています`, `向いていないケース`.
- Добавлены четыре безопасных HTML/CSS mockups для Workforce/Booking без реальных имён, логотипов клиентов и персональных данных.
- Custom Automation расширен до формулировки для разных事業, а не только店舗.
- Hero primary CTA уточнён до `デモ・導入相談をする`.
- Fit/not-fit copy конкретизирован для LINE運用, small-start и случаев, где нужен専用システム.
- Mobile drawer получил focus management и keyboard focus loop; невидимый backdrop исключён из tab order.
- FAQ получил progressive fallback: при отключённом JS ответы остаются видимыми, а при включённом работает accordion.
- Основная навигация pricing/security/company/contact переведена на японские labels.
- Проверено, что `おすすめ` в локальном `pricing.html` стоит только на Standard для Workforce и Booking; Starter badges отсутствуют. Live `/new/` требует повторного deploy.
- Hero headline зафиксирован в две строки через отдельные block spans.
- Добавлены Japanese wrapping rules: balanced headings, strict line breaking и точечный nowrap только для коротких безопасных фраз.
- Booking copy усилен вокруг 24時間LINE予約, 予約確認・キャンセル導線 и自動リマインド без гарантий результата.
- Pricing recommended badge подтверждён только на Standard (Workforce и Booking); Starter/Business/Enterprise без `おすすめ`.
- Booking Business wording изменён на безопасное `リマインド強化` (без `no-show対策` / небезопасных формулировок).
- Hero controlled 2-line headline сохранён через block spans, desktop max font-size доведён до 60px через `.hero-title { clamp(42px, 5vw, 60px); }`.
- `.problem-card` текст уменьшен до 15px без уменьшения заголовков.
- `.price-card::before` (верхняя линия карточки) скорректирован на `left: 3px; right: 3px;`.
- Добавлены utility-классы `.text-balance` и `.text-nowrap-desktop` (с mobile fallback ≤640px) для аккуратных японских переносов.
- 操作イメージ получил более доверительную формулировку и визуально более глубокие HTML/CSS cards.
- Contact page переработан в B2B SaaS inquiry layout: consultation cards, checklist, responsive-safe `以下の項目` и явные mailto CTA.
- Legal/trust safety и утверждённые pricing notes проверены.

## Что пробовали и не сработало

- Визуальная проверка через встроенный browser не запустилась: `codex/sandbox-state-meta: missing field sandboxPolicy`. Поэтому browser visual QA остаётся ручным следующим шагом.
- В предыдущей истории SSH push завершался ошибкой `git@github.com: Permission denied (publickey)`. Текущий remote использует HTTPS.
- Build не требуется: сайт остаётся статическим.
- Запрошенный commit не создан: `git add -A` завершился ошибкой `fatal: Unable to create 'D:/project/iic-sass/.git/index.lock': Permission denied`. Запрос расширенного разрешения не был подтверждён в доступное время. Push не запускался, поскольку нового commit нет.
- В Phase 1.8 первая попытка `git add .` вернула `fatal: Unable to create 'D:/project/iic-sass/.git/index.lock': Permission denied`; после подтверждения разрешения staging был успешно повторён.
- Создание Phase 1.8 commit заблокировано той же политикой записи в `.git`: `git commit -m "Polish Phase 1.8 visual QA and booking copy"` вернул `fatal: Unable to create 'D:/project/iic-sass/.git/index.lock': Permission denied`. Запрос расширенного разрешения не был подтверждён в доступное время; push не запускался.

## Риски

- Legal pages are draft and require legal review.
- Backend contact form отсутствует; используется static/mailto.
- Production deployment не проверен.
- После push необходимо проверить, что `/new/` обновился и больше не показывает `おすすめ` на Starter.
- Нельзя заявлять `SaaS導入実績500社` или связывать 500社以上 с LINE Business OS.
- Нельзя заявлять `LINE公式認定`, `ISO27001`, `Pマーク`, `法定勤怠対応`, `給与計算対応`.
- `500社以上` относится только к Web制作・開発領域, не к LINE Business OS.
- Факты о наградах и認定 следует повторно сверить перед production publication.
- После push: `/new/` deployment must be verified; visual QA still required на реальном mobile/desktop после deploy.
- Screenshots need anonymization before public use (mockups сейчас — HTML/CSS с вымышленными demo-данными).
- TODO: Replace mockups with anonymized real screenshots.

Professional screenshot requirements:

- Use anonymized demo data.
- Remove Mame To Cha logo and real company names before public use.
- Replace personal names with neutral names: `Staff A`, `Staff B`, `Manager Demo`, `Demo User`, либо явно вымышленные нейтральные японские имена.
- Remove phone numbers, emails and personal photos.
- Use consistent browser/device frames and crop to the product area.
- Export at 2x resolution; prefer WebP, use PNG when simpler.
- Recommended captures: Workforce staff, Workforce manager, Booking service selection, date/time selection, confirmation and LINE notification.

## Следующий шаг

- Phase 1.9B завершён (mobile preflight + pricing polish). Рекомендуемый следующий этап: Phase 1.9C — products.html / contact.html / security.html visual polish в едином стиле + повторный mobile QA на реальном iOS-устройстве (особенно фикс fixed-menu).
- Проверить сайт визуально в браузере.
- Проверить mobile navigation, backdrop, focus и scroll lock на реальном устройстве (iPhone SE / iOS Safari).
- Подключить и проверить deploy.
- Провести review японского текста.
- Выполнить юридическую проверку legal pages.
- Реализовать production contact form.
- Заменить HTML/CSS mockups на анонимизированные product screenshots после подготовки безопасных demo data.
- Обновить deploy `/new/` и повторить desktop/mobile visual QA, включая японские переносы и contact CRO layout.
