# Handoff

## Цель

Создать продающий SaaS-first сайт IZUMI IT COMPANY для японского рынка, где LINE Business OS — основная продуктовая линейка, а Workforce и Booking — отдельные SaaS-продукты.

## Текущее состояние

- Стек: static HTML/CSS/JS, без framework, build system и backend.
- Текущая ветка: `main`. Phase 1.9E (`18bf0f4 Polish Phase 1.9E company and contact pages`) был закоммичен на `main`, но **не запушен** в `origin` (origin/main оставался на `486d496`). В Phase 1.9F это противоречие разрешено: `18bf0f4` запушен в `origin/main`, затем поверх добавлен commit Phase 1.9F. `main` синхронизирован с `origin/main`.
- Remote: `origin https://github.com/tantik/iic-sass.git`.
- Основные страницы: `index.html`, `products.html`, `pricing.html`, `security.html`, `company.html`, `contact.html`.
- Legal pages: `privacy.html`, `terms.html`, `commercial-transaction.html`, `security-policy.html`, `data-handling-policy.html`, `support-policy.html`, `billing-policy.html`.
- `/old` отсутствует и не требуется.
- Старый сайт используется только как external reference: https://izumiit.com/
- Legal pages являются draft и содержат обязательное предупреждение.
- Contact form: static, через `mailto:` (progressive enhancement, без backend). To: `izumi@izumiit.com`, CC: `konstantin.chvykov@gmail.com`.
- Live test path: https://izumiit.com/new/
- Текущий этап: Phase 1.9F — Contact form mailto integration + repo cleanup + final QA.

## Phase 1.9F — Contact form (mailto) + repo cleanup + final QA

### Branch / deploy status (preflight + разрешение противоречия)

- Preflight выявил противоречие: пользователь считал, что Phase 1.9E «выгружена/задеплоена», но фактически `18bf0f4 Polish Phase 1.9E company and contact pages` существовал только локально на `main`; `origin/main` оставался на `486d496` (`git ls-remote` подтвердил реальное состояние remote — `486d496`).
- Резолюция (TASK 0): (1) `18bf0f4` НЕ был на `origin/main`; (2) local `main` и `origin/main` НЕ были идентичны (local впереди на 1 коммит); (3) так как Phase 1.9E принята и push/deploy подтверждён, accepted-коммит `18bf0f4` запушен в `origin/main` (`486d496..18bf0f4`).
- Затем поверх добавлен коммит Phase 1.9F (`Add contact mailto form and cleanup test artifacts`) и запушен в `origin/main`.

### Repo cleanup (TASK 1)

- `.gitignore` уже содержал `.cursor/`, `design-test/`, `design-test-a/` (добавлены в 1.9E). Дополнений не потребовалось.
- `.cursor/` **сохранён** на диске и **остаётся ignored** (содержит Cursor skills/settings — НЕ disposable, НЕ удалялся, НЕ коммитился).
- `design-test/` (`uiux-pro-max-test.md`) и `design-test-a/` (`index.html / script.js / styles.css / README.md`) — подтверждены как локальные дизайн-эксперименты, не используются production-страницами (grep `design-test` по `*.html` → 0). **Удалены** с диска.
- Рабочее дерево перед началом было чистым (`git status` clean, кроме ignored-папок); случайных tooling/QA/debug/screenshot файлов в трекинге нет.

### Файлы изменены в Phase 1.9F

- `contact.html` — добавлена практичная inquiry-форма (`#contactInquiryForm`) перед блоком «相談できること»:
  - Поля: お名前 (required), 会社名・店舗名 (required), メールアドレス (email, required), 電話番号 (任意), 業種 (select), 店舗数 (select), スタッフ数 (select), LINE公式アカウントの有無 (select), 希望する導入時期 (select), 興味のあるサービス (6 checkboxes, multiple), 現在の課題・相談内容 (textarea required, maxlength 1200).
  - UX-copy: `入力内容をもとにメールアプリを開きます。内容をご確認のうえ送信してください。`
  - Каждое поле имеет видимый `<label>`; required/任意 помечены текстовыми бейджами `必須`/`任意` (не только цвет); checkbox-группа в `<fieldset><legend>興味のあるサービス`.
  - Контейнер ошибок/статуса `#contactFormMessage` (`role="alert" aria-live="assertive"`) с иконкой + текстом (не только цвет).
  - Fallback: видимый прямой email `izumi@izumiit.com` сохранён (в contact-intro карточке и в заметке под формой).
  - Hero chip `フォーム準備中` → `メールアプリで送信`; contact-intro заголовок/текст обновлён под рабочую форму.
  - Удалён дублирующий блок «メールに記載いただきたい内容» (его поля теперь в форме); «相談できること» и «お問い合わせ後の流れ» сохранены.
- `assets/css/style.css` — добавлены стили формы (переиспользуют существующие `label`/`input`/`select`/`textarea`/`.form-grid`/`.contact-form`): `.contact-form-panel`, `.contact-form-lead`, `.form-label-flag.req/.opt`, `.form-fieldset`/`legend`, `.checkbox-grid` + `.check-option`, `.form-message.is-error/.is-info` (с `::before`-иконкой). В медиа-запросе `min-width:640px` добавлен `.checkbox-grid { 2 cols }` рядом с `.form-grid`.
- `assets/js/main.js` — добавлен scoped-блок обработчика формы (только при наличии `#contactInquiryForm`); существующие mobile menu / FAQ / reveal НЕ затронуты.
- `handoff.md`.

### Contact form behavior (TASK 2/3)

- Progressive enhancement: на submit JS делает `preventDefault`, валидирует required (お名前 / 会社名・店舗名 / メールアドレス / 現在の課題・相談内容) + базовый формат email; при ошибке показывает видимый текст в `#contactFormMessage` и ставит фокус на первое незаполненное поле (навигация НЕ происходит).
- Mailto собирается через `encodeURIComponent` для subject и body; CC также кодируется. Множественный выбор сервисов поддержан (`querySelectorAll('input[name="service"]:checked')`, объединение через `、`).
- `to=izumi@izumiit.com`, `cc=konstantin.chvykov@gmail.com`, `subject=LINE Business OS 導入相談`, body — форматированный японский текст (お名前 / 会社名・店舗名 / メールアドレス / 電話番号 / 業種 / 店舗数 / スタッフ数 / 興味のあるサービス / LINE公式アカウント / 希望する導入時期 / 現在の課題・相談内容). Незаполненные select → `未選択`, пустой телефон → `未記入`.
- Если итоговый mailto-URL слишком длинный (> ~1900 симв.), показывается понятное предупреждение с просьбой сократить текст (навигация НЕ происходит).
- Безопасность: НЕ показывается «送信完了しました»; НЕ имитируется серверная отправка; нет backend/API/serverless/dependencies; данные НЕ пишутся в localStorage/sessionStorage; персональные данные НЕ логируются в console; данные не отправляются third-party.
- НЕ показывается ложное подтверждение отправки — текст явно говорит, что откроется почтовое приложение и письмо нужно подтвердить/отправить вручную.

### Mailto QA результат

- Сгенерированный mailto проверен (заполненная форма, demo-данные): `len=1466` (< safe limit 1900), `to=izumi@izumiit.com`, `cc=konstantin.chvykov%40gmail.com`, `subject=LINE%20Business%20OS%20導入相談`, body корректно закодирован (`%0A` переносы) и при декодировании точно соответствует требуемому формату.
- Validation: при пустых required submit заблокирован, `#contactFormMessage` = `次の必須項目をご入力ください：お名前、メールアドレス` (класс `is-error`), фокус ушёл на お名前, URL не изменился.

### Mobile / overflow QA (CDP Emulation.setDeviceMetricsOverride, локальный http.server)

`document.documentElement.scrollWidth === clientWidth`, горизонтального скролла нет (`overflow = 0`):

| width | index | products | pricing | security | company | contact |
|------|------|------|------|------|------|------|
| 320 | 0 | 0 | 0 | 0 | 0 | 0 |
| 768 | — | — | — | — | — | 0 |

- 320px (contact): форма single-column, инпуты/кнопки/textarea не переполняются, метки видимы. 768px: `.form-grid` и `.checkbox-grid` = 2 колонки (`getComputedStyle` подтвердил), overflow 0. Промежуточные 375/390/430 между протестированными 320 и 768 на той же fluid-раскладке → безопасны.
- Mobile menu (company, 320px): открывается (`aria-expanded`/`is-open`/`body.menu-open`), scroll lock активен, overflow 0, закрывается корректно — поведение не сломано новой формой.

### Forbidden claims grep (TASK 5)

- Grep по `*.html` (`LINE公式認定 / ISO27001 / Pマーク / 法定勤怠対応 / 給与計算対応 / 税務対応 / 労務管理対応 / 売上保証 / no-show完全防止 / SaaS導入500社 / LINE Business OS 導入500社 / 1200+ / 99% / 4.8/5 / 削減工数 / 導入店舗数`): **0 совпадений**.
- `給与計算 / 法定勤怠 / 税務 / 労務管理` — только exclusion/disclaimer контекст (products L73, pricing L202, index FAQ + «向いていないケース»). В новой форме эти слова НЕ используются (взамен — нейтральные `現在の課題・相談内容`).
- `500社以上` — только Web制作・開発領域 (index hero chip + index trust card + company trust card с явным дисклеймером).
- Security НЕ заявляет сертификаций.

### Остаточные риски Phase 1.9F

- Реальная отправка зависит от настроенного почтового клиента на устройстве пользователя (поведение mailto). На устройствах без email-клиента форма не отправит письмо — для этого сохранён видимый прямой email как fallback.
- Финальную проверку на реальном iOS Safari (mailto + fixed-menu) желательно повторить после deploy.
- Contact/company/products — draft японский контент, нужна финальная юридическая сверка.
- Длинные сообщения (близко к 1200 симв. + длинные значения полей) теоретически могут упереться в лимит длины mailto на некоторых клиентах — обрабатывается предупреждением.

### Следующий рекомендуемый этап

- Phase 2.0 — опциональная серверная/serverless contact-форма (если потребуется отказ от mailto), замена HTML/CSS mockups на анонимизированные product screenshots, deploy `/new/` и финальный QA на реальном устройстве, ревью японского текста и юридическая сверка.

## Phase 1.9E — Company / Contact final polish + global QA

### Branch / deploy status (preflight)

- Работа велась на `main` (целевая ветка; preflight: `git status` чисто кроме untracked tooling-папок, `main` = `origin/main` = `486d496`).
- **Phase 1.9D подтверждённо влит в `main`** (`486d496 Polish Phase 1.9D trust pages`); `tools/uiux-pro-max-test` указывает на тот же коммит.
- Untracked (НЕ коммитятся): `.cursor/`, `design-test/`, `design-test-a/`. Они добавлены в `.gitignore`, чтобы исключить случайный commit.
- `cursor.svg` / `assets/images/cursor.svg` — отсутствует. Custom cursor НЕ реализован. Удалять нечего.
- Временных скриншотов / debug-файлов в working tree нет.

### Файлы изменены в Phase 1.9E

- `company.html` — final trust polish: hero chips (`2018年設立 / Web制作・開発領域 / LINE連携SaaS / 小規模店舗向け`); заголовок trust-секции → `Web制作・開発で培った信頼を、店舗向けSaaSへ。`; тексты trust-карточек выровнены под ТЗ (500社以上 явно привязано к Web制作・開発領域 + дисклеймер про LINE Business OS); approach заголовок → `導入しやすい形で、現場に合わせて整える` + короткие названия карточек (`小さく始める` и т.д.); CTA subcopy обновлён.
- `contact.html` — conversion polish: hero chips (`1店舗から相談可能 / サービス選びから相談 / 個別見積り対応 / フォーム準備中`); main contact card теперь с prominent email `izumi@izumiit.com` + CTA `メールで相談する` и честным текстом про準備中 формы; consultation card 05/06 тексты выровнены под ТЗ; добавлена секция `お問い合わせ後の流れ` (3 шага через `.workflow-grid`/`.workflow-card`) + осторожная заметка про見積り/利用規約; bottom CTA получил 2 кнопки (`メールで相談する` + `料金を見る`); header nav CTA унифицирован → `導入相談する` (был `メールする`).
- `assets/css/style.css` — добавлен блок «Company / Contact final polish (Phase 1.9E)»: `.page-chips` (нейтральный центрированный ряд чипов для trust-hero), `.contact-intro-action` + `.contact-mail-address` (prominent email + CTA stack, mobile-safe), `.contact-steps`. Переиспользованы существующие компоненты (`.workflow-grid`, `.trust-card`, `.contact-*`).
- `.gitignore` — добавлены `.cursor/`, `design-test/`, `design-test-a/`.
- `handoff.md`.

### Global consistency polish (Task 4)

- Nav labels идентичны на всех 6 страницах (`サービス / 料金 / セキュリティ / 会社情報 / お問い合わせ` + header CTA `導入相談する` → contact.html). `aria-current="page"` корректно стоит на текущей странице каждой страницы.
- Footer links следуют консистентному паттерну self-exclusion (каждая страница опускает ссылку на саму себя); legal footer (7 ссылок) виден на всех страницах.
- CTA wording консистентен: `導入相談する / 料金を見る / サービスを見る` (+ контекстный `メールで相談する` на contact).
- Page titles: контентные страницы используют `…｜LINE Business OS｜IZUMI IT COMPANY`; company.html сознательно `会社情報｜IZUMI IT COMPANY` (страница о бренде компании, а не только о SaaS).
- Принятые страницы (index/products/pricing/security) НЕ редизайнились.

### Mobile QA (CDP Emulation.setDeviceMetricsOverride, через локальный http.server)

`document.documentElement.scrollWidth === clientWidth` на всех проверенных ширинах. Горизонтального скролла нет (`over = 0`).

| width | index | products | pricing | security | company | contact |
|------|------|------|------|------|------|------|
| 320 | 0 | 0 | 0 | 0 | 0 | 0 |
| 375 | — | — | — | — | 0 | — |
| 390 | — | — | — | — | 0 | — |
| 430 | — | — | — | — | 0 | 0 |
| 768 | 0 | 0 | 0 | 0 | 0 | 0 |
| 1440 | — | — | — | — | 0 (1425=1425) | 0 (1425=1425) |

- Изменённые страницы (company, contact) проверены на всех 6 ширинах; принятые страницы — на 320 и 768 (наиболее overflow-prone).
- Mobile menu (company, 390px): открывается (`aria-expanded=true`, `is-open`, `body.menu-open`), drawer `position:fixed` (прижат к вьюпорту, не уезжает вверх при скролле — body locked), overflow 0, закрывается корректно. Скриншот открытого drawer подтвердил active-state на `会社情報`. Header/nav/main.js общие для всех страниц.
- CTA-кнопки, pricing-карточки, footer-ссылки, header logo/nav не переполняются. Chips переносятся корректно.
- Custom cursor отсутствует. Framework/build/dependencies не добавлялись.

### Forbidden claims grep (Task 5)

- Grep по `*.html` (`LINE公式認定 / ISO27001 / Pマーク / 法定勤怠対応 / 給与計算対応 / 税務対応 / 労務管理対応 / 売上保証 / no-show完全防止 / SaaS導入500社 / LINE Business OS 導入500社 / 1200+ / 99% / 4.8/5 / 削減工数 / 導入店舗数`): **0 совпадений**.
- `給与計算 / 法定勤怠 / 税務 / 労務管理` встречаются только в exclusion/disclaimer контексте (products L73, pricing L202, index FAQ + «向いていないケース»). Позитивных claim нет.
- `500社以上` — только в контексте Web制作・開発領域 (index hero chip + index trust card + company trust card с явным дисклеймером «LINE Business OSの導入実績を示すものではありません»).
- Security НЕ заявляет сертификаций (явный дисклеймер «特定の認証取得や法令への適合を保証するものではありません»).

### Остаточные риски Phase 1.9E

- Browser QA выполнен через Chromium CDP emulation; финальную проверку на реальном iOS Safari желательно повторить после deploy.
- Contact form по-прежнему static/mailto (честно указано «準備中»); production form — будущая работа.
- Company/contact — draft японский контент, требует финального ревью и юридической сверки перед production.
- Commit создан на `main`; push НЕ выполнялся (ожидает явного подтверждения пользователя).

### Следующий рекомендуемый этап

- Phase 2.0 — реальная contact form (backend/serverless) + замена HTML/CSS mockups на анонимизированные product screenshots; deploy `/new/` и финальный mobile QA на реальном устройстве; ревью японского текста и юридическая сверка.

## Phase 1.9D — Trust pages polish (security / company / contact) + safe hero chips

### Branch / deploy status (preflight)

- **Работа велась на ветке `tools/uiux-pro-max-test`** (по явному выбору пользователя: «сделать 1.9D здесь, закоммитить, затем СПРОСИТЬ перед merge в main / push»).
- Commit `1327ab1` «Polish Phase 1.9C products page» находится **только** на `tools/uiux-pro-max-test`. Он **НЕ влит в `main`** и **НЕ запушен** в `origin`.
- `main` и `origin/main` указывают на `2b4ae73` «Polish Phase 1.9B pricing page».
- Untracked (НЕ коммитить): `.cursor/`, `design-test/`, `design-test-a/`. В commit включены только утверждённые файлы проекта.
- `cursor.svg` / `assets/images/cursor.svg` — отсутствует. Custom cursor не реализуется. Удалять нечего.
- Phase 1.9D закоммичен на `tools/uiux-pro-max-test`. Merge в `main` и push НЕ выполнялись — ожидают явного подтверждения пользователя.

### Файлы изменены в Phase 1.9D

- `security.html` — полная переработка в доверительную B2B структуру: hero + safety chips, секция принципов (6 карточек с осторожными формулировками), responsibility split, before-launch checklist, CTA с 利用規約 / プライバシーポリシー.
- `company.html` — переработка: hero, trust foundation (4 карточки, 500社以上 явно привязано к Web制作・開発領域 + дисклеймер), current focus (Workforce/Booking/Custom + Web制作 как технический базис), approach (4 карточки), CTA.
- `contact.html` — hero subcopy обновлён; consultation categories 4→6 (добавлены セキュリティ・データ管理, 個別カスタマイズ); email checklist 7→9 (добавлены LINE公式アカウントの有無, 希望する導入時期); честно сказано, что форма в разработке и связь по email.
- `index.html` — безопасный hero refinement: prose `.trust-line` заменён на компактный ряд trust-chips (только безопасные факты: 2018年設立 / Web制作・開発で500社以上 / 比較ビズ 認定企業 / 導入前に運用確認).
- `assets/css/style.css` — добавлен блок «Trust pages polish (Phase 1.9D)»: `.hero-trust-chips`, `.trust-hero .lead`, `.sec-grid` / `.sec-card` / `.sec-ico`, `.launch-checklist`, `.company-foundation`, `.approach-card`; обновлён hero-анимационный селектор.
- `handoff.md`.

### Safe hero refinement (Task 2)

- Текущий hero уже был стабилен и «serious SaaS». Сделан **малый** refinement, без fake-метрик: prose trust-line → compact trust-chips с теми же безопасными фактами (убрана избыточность, добавлен более структурированный trust-ряд). Mint/green/navy сохранены. Pricing values, fake-метрики, fake-логотипы НЕ добавлялись. 資料ダウンロード НЕ добавлялся (нет файла/страницы).

### Mobile QA (CDP Emulation.setDeviceMetricsOverride)

`document.documentElement.scrollWidth === clientWidth` на всех проверенных ширинах. Горизонтального скролла нет.

| width | index | security | company | contact |
|------|------|------|------|------|
| 320 | overflow 0 | overflow 0 | overflow 0 | overflow 0 |
| 768 | — | overflow 0 (sec-grid 3 cols, checklist 3 cols, CTA 3 кнопки в 1 ряд) | — | — |
| 1440 | overflow 0 (1425=1425, badCount 0) | — | — | — |

- Mobile menu (index, 320px): открывается (`is-open`, `aria-expanded=true`, `body.menu-open`, scroll lock); drawer `position:fixed`, после анимации `left=45, right=320, width=275` — прижат к правому краю в пределах вьюпорта; overflow 0; меню не уезжает вверх при скролле (body locked); закрывается корректно. Поведение меню общее для всех страниц (один header + main.js).
- CTA-кнопки и footer-ссылки не переполняют (security CTA из 3 кнопок помещается в один ряд на 768; на ≤420 кнопки становятся full-width и стекируются).
- Промежуточные ширины 375/390/430 находятся между протестированными 320 и 768 и используют те же одно/переходные раскладки → безопасны. Скриншот security@390 подтвердил визуальное качество карточек.
- Custom cursor отсутствует. Framework/build/dependencies не добавлялись.

### Forbidden claims grep (Task 7)

- Grep по `*.html` для запрещённых утверждений (LINE公式認定, ISO27001, Pマーク, ..., 1200+, 99%, 4.8/5, 削減工数, 導入店舗数, 稼働率, 満足度 и т.д.): совпадения **только в `design-test-a/index.html`** (untracked reference-дизайн, НЕ коммитится). Все production-страницы чисты.
- `給与計算 / 法定勤怠 / 税務 / 労務管理` встречаются только в exclusion/disclaimer контексте (index FAQ + «向いていないケース», products, pricing notes). Позитивных claim нет.
- `500社以上` — только в контексте Web制作・開発領域 (index trust chip + company trust card с явным дисклеймером «SaaS導入実績を示すものではありません»).

## Phase 1.9C — Products page visual polish + Pricing cleanup

### Файлы изменены в Phase 1.9C

- `products.html` — полностью переработана из минифицированного «текстового списка услуг» в полноценную SaaS service-selection страницу.
- `pricing.html` — minor cleanup: списки в cost-cards и plan-guide приведены к формулировкам из ТЗ (pricing values НЕ менялись).
- `assets/css/style.css` — добавлены компоненты products-страницы (Phase 1.9C блок в конце файла).
- `handoff.md`.
- `assets/images/cursor.svg` — отсутствует (untracked не существует; custom cursor не реализуется).

### TASK 0 — Mobile preflight (повторная проверка перед products)

Проверены `index.html` и `pricing.html` через браузер (CDP `Emulation.setDeviceMetricsOverride`):

| width | index overflow | pricing overflow |
|------|------|------|
| 320 | 0 | 0 |
| 375 | 0 | 0 |
| 390 | 0 | 0 |
| 430 | 0 | 0 |
| 768 | 0 | 0 |
| 1440 | 0 (1425=1425) | 0 |

`document.documentElement.scrollWidth === clientWidth` на всех ширинах. Mobile menu (index, 375px) проверено программно: при открытии `navTop=0`, `navHeight=100dvh` (фикс к вьюпорту), `body position:fixed` (scroll lock), горизонтального скролла нет; при попытке скролла меню НЕ уезжает вверх (`navTop=0`); при закрытии `aria-expanded=false`, drawer уходит off-screen, `body position:static`, скролл восстановлен. `cursor.svg` отсутствует.

### TASK 1 — Pricing minor completion cleanup

- Секции `どのプランが向いているか` и `料金に含まれるもの・別途費用になり得るもの` уже присутствовали (Phase 1.9B). В 1.9C их формулировки приведены к примерам из ТЗ:
  - **plan-guide**: `小さく試したい→Starter / 基本運用を整理したい→Standard / 承認・通知・レポートを強めたい→Business / 複数店舗・個別要件がある→Enterprise`.
  - **料金に含まれるもの**: 各プランのサービス利用 / 基本的な導入相談 / 運用確認 / 管理画面の利用 / サポート範囲の確認.
  - **別途費用になり得るもの**: LINE公式アカウントの利用料金 / 個別カスタマイズ / 複数サービスの導入 / 複数店舗・大規模運用 / 特別な設定・運用サポート.
- Точные суммы (setup fee и т.п.) НЕ выдуманы; «всё включено» не утверждается. Финальная формулировка сохранена: `正式な料金・契約条件は、個別のお見積りおよび利用規約をご確認ください。`
- **Pricing values НЕ менялись** (Workforce 14,800/29,800/49,800/98,000〜; Booking 19,800/29,800/49,800/98,000〜; 税別; target sizes). Все 6 legal notes сохранены.

### TASK 2 — Products page visual polish

`products.html` переработан в service-selection страницу со структурой:

1. **Product hero** — eyebrow `サービス`, compact product pills (`Workforce / Booking / Custom Automation`, через `.hero-badges.hero-badges-center`), h1 `LINE Business OS のサービス` (один h1), subcopy из ТЗ.
2. **どのサービスから始めるか** — 3 product-cards (Workforce navy / Booking blue / Custom Automation copper top-border) с label, name, target line, short desc и CTA-ссылками (`Workforceを相談する / Bookingを相談する / 個別相談する`) на anchor-секции.
3. **Workforce detailed** (`#workforce`, section-alt) — product-label `LINE Business OS Workforce`, headline, product-lead, explanation, `.feature-list` (10 функций), под ним `.detail-extra`: `解決できること` (4 mint-bordered `.solve-card`) + `向いている店舗` (`.fit-card` + check-list). Safe note: `本サービスは、給与計算・法定勤怠管理・税務・労務管理を目的としたシステムではありません。`
4. **Booking detailed** (`#booking`) — аналогичная структура, alternating layout (features слева, текст справа — через существующие `.product-detail` reorder-правила). Safe note: `自動リマインドにより、来店忘れリスクを軽減しやすくします。` (НЕ `no-show完全防止`).
5. **Custom Automation** (`#custom`, section-warm) — text + `設計できること（例）` card (check-list: LINEを入口にした申請・報告フロー / 管理画面での確認 / 通知・リマインド整理 / 既存業務に合わせたステップ設計). Note: `対応範囲と料金は、業務内容を確認したうえで個別にお見積りします。`
6. **Future services** — `これらは検討段階であり、現在提供中のサービスではありません。` сохранено; будущие идеи не поданы как доступные услуги.
7. **Bottom CTA** — navy gradient `.cta-section`: `店舗に合うサービスから始めませんか？` + subcopy из ТЗ + primary `導入相談する` (contact.html) + secondary `料金を見る` (pricing.html).

CSS (Phase 1.9C блок): `.hero-badges-center`, `.detail-extra` (2-col ≥820px), `.detail-subhead` (mint accent line), `.solve-grid`/`.solve-card` (mint left-border, hover lift), `.detail-fit`, `.detail-examples`. Всё на существующих токенах (mint/green/navy, soft cards, rounded, subtle shadows). Без stock/AI images, без реальных скриншотов/имён.

### TASK 3/4 — Visual + SEO

- Единый стиль с homepage/pricing: mint/green/navy, copper только точечно (product-label, Custom Automation top-border). Тёмные блоки только в bottom CTA.
- Один `h1` (`LINE Business OS のサービス`), логичная иерархия h2 (секции) → h3 (имена продуктов / sub-headings) → h4 (solve-cards). Японский текст concise, без keyword-stuffing.
- Имена продуктов консистентны: `LINE Business OS Workforce`, `LINE Business OS Booking`, `Custom Automation`.

### TASK 5 — QA результат

- **Horizontal overflow** (CDP, products.html): 320/375/390/430/768/1440 → `scrollWidth - clientWidth = 0` на всех. Index и pricing — также 0 (см. TASK 0).
- **Mobile menu**: идентичная разметка/JS на всех страницах; проверено на index (fixed-to-viewport, scroll lock, не уезжает вверх, закрывается). Products использует тот же header/nav/main.js.
- **CTA buttons**: `.button-row .button` на ≤420px → `width:100%`; CTA не переполняются; product-cards и solve-cards стекаются (1 колонка <560/820px).
- **Heading hierarchy**: логична (1×h1).
- **Pricing values**: не изменены. Legal notes (6×`※`) видимы и не тронуты.
- **`500社以上`**: только `index.html` (2 места) в контексте Web制作・開発領域; в products.html `500社` отсутствует.
- **Forbidden grep** по `*.html` (`LINE公式認定 / ISO27001 / Pマーク / 法定勤怠対応 / 給与計算対応 / 税務対応 / 労務管理対応 / 売上保証 / no-show完全防止 / SaaS導入500社 / LINE Business OS 導入500社 / 導入500社`): **0 совпадений**.
- Custom cursor НЕ реализован; новых framework/build/dependencies нет; стек остаётся static HTML/CSS/JS.

### Остаточные риски Phase 1.9C

- Browser visual QA выполнен через Chromium CDP emulation; финальную проверку mobile (особенно iOS Safari fixed-menu) желательно повторить на реальном устройстве после deploy.
- Products — draft японский контент, требует финального ревью и юридической сверки перед production.
- Screenshot-проверка одного mobile-кадра была заблокирована auto-review; overflow подтверждён программно (CDP measurements), desktop-секции подтверждены скриншотами.

### Следующий рекомендуемый этап

- Phase 1.9D — `contact.html` / `security.html` / `company.html` visual polish в едином стиле + повторный mobile QA на реальном iOS-устройстве; затем подготовка анонимизированных product screenshots на замену HTML/CSS mockups.

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
