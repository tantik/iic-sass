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
- Текущий этап: Phase 1.6 visual/copy/trust polish.

## Файлы, над которыми работали

- `index.html`
- `products.html`
- `pricing.html`
- `assets/css/style.css`
- `assets/js/main.js`
- `handoff.md`

## Что изменилось

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

## Что пробовали и не сработало

- Визуальная проверка через встроенный browser не запустилась: `codex/sandbox-state-meta: missing field sandboxPolicy`. Поэтому browser visual QA остаётся ручным следующим шагом.
- В предыдущей истории SSH push завершался ошибкой `git@github.com: Permission denied (publickey)`. Текущий remote использует HTTPS.
- Build не требуется: сайт остаётся статическим.
- Запрошенный commit не создан: `git add -A` завершился ошибкой `fatal: Unable to create 'D:/project/iic-sass/.git/index.lock': Permission denied`. Запрос расширенного разрешения не был подтверждён в доступное время. Push не запускался, поскольку нового commit нет.

## Риски

- Legal pages are draft and require legal review.
- Backend contact form отсутствует; используется static/mailto.
- Production deployment не проверен.
- Нельзя заявлять `SaaS導入実績500社` или связывать 500社以上 с LINE Business OS.
- Нельзя заявлять `LINE公式認定`, `ISO27001`, `Pマーク`, `法定勤怠対応`, `給与計算対応`.
- `500社以上` относится только к Web制作・開発領域, не к LINE Business OS.
- Факты о наградах и認定 следует повторно сверить перед production publication.
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

- Проверить сайт визуально в браузере.
- Проверить mobile navigation, backdrop, focus и scroll lock на реальном устройстве.
- Подключить и проверить deploy.
- Провести review японского текста.
- Выполнить юридическую проверку legal pages.
- Реализовать production contact form.
