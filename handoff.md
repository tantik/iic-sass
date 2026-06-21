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
- Текущий этап: Phase 1.9A — Global visual system + Home page visual polish.

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

- Phase 1.9B — pricing page visual polish, только после утверждения home visual direction.
- Проверить сайт визуально в браузере.
- Проверить mobile navigation, backdrop, focus и scroll lock на реальном устройстве.
- Подключить и проверить deploy.
- Провести review японского текста.
- Выполнить юридическую проверку legal pages.
- Реализовать production contact form.
- Заменить HTML/CSS mockups на анонимизированные product screenshots после подготовки безопасных demo data.
- Обновить deploy `/new/` и повторить desktop/mobile visual QA, включая японские переносы и contact CRO layout.
