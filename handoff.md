# Handoff

## Цель

Создать продающий SaaS-first сайт IZUMI IT COMPANY для японского рынка, где LINE Business OS — основная продуктовая линейка, а Workforce и Booking — отдельные SaaS-продукты.

## Текущее состояние

- Стек: static HTML/CSS/JS, без framework, build system и backend.
- Текущая ветка: `main`. Phase 1.9E (`18bf0f4 Polish Phase 1.9E company and contact pages`) был закоммичен на `main`, но **не запушен** в `origin` (origin/main оставался на `486d496`). В Phase 1.9F это противоречие разрешено: `18bf0f4` запушен в `origin/main`, затем поверх добавлен commit Phase 1.9F. `main` синхронизирован с `origin/main`.
- Remote: `origin https://github.com/tantik/iic-sass.git`.
- Основные страницы: `index.html`, `products.html`, `pricing.html`, `security.html`, `company.html`, `contact.html`.
- Legal pages (Phase 2.2, консолидированы): `privacy.html`, `terms.html`, `commercial-disclosure.html`, `disclaimer.html`. Старые draft-страницы `commercial-transaction.html` / `security-policy.html` / `data-handling-policy.html` / `support-policy.html` / `billing-policy.html` **удалены** (контент покрыт новыми comprehensive legal-страницами; footer-legal больше на них не ссылается). Восстановимы через git history при необходимости.
- `/old` отсутствует и не требуется.
- Старый сайт используется только как external reference: https://izumiit.com/
- Legal pages — публичный launch (Phase 2.3): публичное draft-предупреждение удалено; внутренний legal-risk note хранится только здесь в handoff.
- Contact form: **Phase 2.4** — `api/form.php` теперь серверный **Web3Forms-прокси** (`contact.html` → `api/form.php` → `https://api.web3forms.com/submit`), без PHP `mail()`/`mb_send_mail`, без backend-framework/зависимостей/БД. Access key загружается только из `api/form-provider.local.php` (gitignored) или env `WEB3FORMS_ACCESS_KEY`; в commit ключ никогда не попадает. Подробности — в разделе «Phase 2.4» ниже.
- Live root: https://izumiit.com/ (форма `POST` → `api/form.php`). Старый сайт только на `/old21062026/`.
- Текущий этап: Phase 2.7 — launch readiness cleanup (P0/P1). См. секцию ниже.

## Phase 2.7 — Launch readiness cleanup (P0/P1) (2026-06-22)

Подготовка к active-sales readiness. Сайт НЕ редизайнился, цены/legal/claims НЕ менялись, форма остаётся client-side Web3Forms (`contact.html` → `https://api.web3forms.com/submit`), PHP-прокси НЕ реактивирован.

### Repo↔deploy image drift (resolved)

- Все live-required ассеты уже трекаются в git (`git ls-files assets/images`): `favicon.ico`, `favicon.svg`, `apple-touch-icon.png`, `og-image.png`, `logo_01.svg`, `logo_02.svg`, `biz_partner_type2.png`, `team-main.jpg`, `team-work.jpg`, `team-office.jpg`, `icon-16.png`, `icon-32.png`, `ogp.png`, `01.png`. Дрейфа нет — добавлять/удалять ничего не потребовалось.
- WebP-версий (`team-*.webp`) в репозитории и локально НЕТ. Не выдуманы, не добавлялись.
- `git status` по `assets/` чистый: удалённых/изменённых ассетов нет.

### Personal Gmail removed from committed source

- Персональный Gmail (`konstantin.chvykov@…`) удалён из всех **трекаемых** файлов: `api/form-provider.example.php` (теперь placeholder `admin@example.com` / `backup@example.com`), `api/form.php` (`BACKUP_EMAIL` → `izumi@izumiit.com`, неактивный fallback), и из исторических заметок в `handoff.md` (заменён на `<バックアップ用メール（非公開・サーバ側設定）>`).
- `api/form-provider.local.php` НЕ трогался (gitignored, server-local).
- Проверка: `git grep -n "konstantin"` → 0 совпадений в трекаемых файлах.

### Old site de-index (`/old21062026/`)

- `/old21062026/` файлы **не в репозитории** (server-only), поэтому meta-noindex из репо проставить нельзя.
- Repo-level: `robots.txt` обновлён — добавлен `Disallow: /old21062026/` (+ сохранён `Sitemap`).
- **ВАЖНО (server-side, предпочтительно):** robots `Disallow` сам по себе НЕ удаляет уже проиндексированные URL быстро. Для надёжной деиндексации добавить на сервере для `/old21062026/`:
  - HTTP-заголовок `X-Robots-Tag: noindex, nofollow` (nginx/apache), **или**
  - вручную `<meta name="robots" content="noindex, nofollow">` в `<head>` старых HTML-файлов на сервере.
- После деиндексации можно дополнительно запросить удаление URL через Google Search Console.

### Web3Forms access key rotation (HANDOFF — выполняет оператор)

Текущий ключ в `contact.html` (`access_key`): `c9571528-a71a-431f-9b72-973d4cc73824`. Он был раскрыт при настройке — рекомендуется ротация. Агент новый ключ НЕ генерирует. Шаги для оператора:

1. Перегенерировать access key в дашборде Web3Forms.
2. Если Web3Forms поддерживает domain restriction / allowed domains — ограничить доменами: `izumiit.com` (и `www.izumiit.com`, если используется).
3. Заменить hidden `access_key` в `contact.html` на новый ключ.
4. Загрузить `contact.html` на сервер.
5. Отправить реальную заявку через браузерную форму (НЕ curl — free plan client-side).
6. Подтвердить: success-сообщение появляется; submission записан в Web3Forms dashboard; письмо пришло; проверена папка спам.

Когда оператор даст новый ключ — обновить `access_key` в `contact.html` и закоммитить. Ключ НЕ дублировать в `api/form.php` и нигде кроме `contact.html`.

### Contact form a11y (honeypot) — проверено

- Визуальный honeypot `website`: обёртка `.form-hp` имеет `aria-hidden="true"`, input — `tabindex="-1"` + `autocomplete="off"`. Уже соответствует требованиям (изменений не потребовалось).
- `botcheck`: `display:none` + `tabindex="-1"` + `autocomplete="off"` + `aria-hidden="true"` — скрыт. Web3Forms spam-поведение не тронуто.

### Server-side tasks remaining (NOT from repo — конфиг сервера nginx/apache)

Эти задачи выполняются на сервере, из репозитория НЕ конфигурируются:

1. **HTTP→HTTPS 301 redirect**: `http://izumiit.com/*` → `https://izumiit.com/*`.
2. После подтверждения редиректа — baseline security headers:
   - `X-Content-Type-Options: nosniff`
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - `X-Frame-Options: SAMEORIGIN`
   - `Strict-Transport-Security` (HSTS) — **только после** стабильного HTTPS.
3. Для `/old21062026/`: добавить `X-Robots-Tag: noindex, nofollow` (если доступна серверная конфигурация).

nginx из репозитория НЕ менялся — это server-only handoff.

## Phase 2.6 — Fix Web3Forms success state handling (2026-06-22)

### Root cause

- Web3Forms доставлял письмо (запрос проходил, email приходил), но сайт показывал общий error.
- Причина в `assets/js/main.js`: success засчитывался **только** если `response.json()` успешно распарсился И `data.success === true || data.ok === true`. Если Web3Forms возвращал ответ с не-JSON / пустым телом (или `response.json()` падал по любой причине), `data` становился `null`, и при `response.ok === true` код всё равно уходил в error-ветку. Т.е. UI неверно интерпретировал успешную доставку как ошибку.

### Fix (изменён только `assets/js/main.js`)

- JSON парсится **только** если `content-type` ответа содержит `application/json` (иначе `data = null`, без падения на `response.json()`).
- Success-условие: `response.ok && (data.success === true || data.ok === true)`.
- **Web3Forms soft-success**: для эндпоинта `*.web3forms.com` — если `response.ok` и тело не-JSON/пустое (`data === null`) и нет явного failure, считаем success (письмо могло уйти).
- Failure: `!response.ok` ИЛИ распарсенный `data.success === false`.
- `access_key` гарантированно включается из hidden-инпута (добавляется в `FormData`, если по какой-то причине отсутствует).
- Если `service[]` не выбран → в payload добавляется `service = "未選択"` (как и было).
- При успехе: inline success UI (без alert), `form.reset()`, сброс `started_at`, очистка error-состояния. Submit-кнопка всегда снова включается в `finally`.
- Debug без PII: `console.warn('Contact form submission failed', { status, success })` только при ошибке. В консоль НЕ пишутся name/email/message/company/access_key. Технические детали провайдера пользователю не показываются.

### Browser QA (локальный http.server, fetch замокан, без реальной отправки)

| Сценарий | Ожидание | Результат |
|----------|----------|-----------|
| Пустые required-поля | Блок до submit, fetch не вызывается | PASS (`__fetchCalled=false`, текст с `必須`) |
| Валидный submit + JSON `{success:true}` | Success UI + reset | PASS (`is-success`, форма очищена; `service` есть в payload) |
| `response.ok` + пустое/не-JSON тело | Soft-success | PASS (`is-success`) |
| `400` + `{success:false}` | Generic error, без PII в консоли | PASS (`is-error`, в консоли только `{status, success}`) |

- FormData-ключи (Scenario B): `access_key, subject, from_name, page, name, company, email, phone, business_type, store_count, staff_count, line_official, timeline, message, website, started_at, privacy_consent, service`.
- Реальную доставку (письмо на `izumi@izumiit.com`) подтвердить вручную одной отправкой с live-сайта после загрузки + проверить Web3Forms dashboard/inbox/spam.

### Manual upload list (после push)

- `assets/js/main.js`
- `contact.html` — НЕ менялся в этой фазе (уже корректен: action=web3forms, method=post, hidden `access_key`, required name/company/email/message/privacy_consent, `service[]` опционально). Перезаливать не обязательно.
- `handoff.md` — repo-only.

## Phase 2.5 — Web3Forms client-side contact submission (2026-06-22)

### Root cause (почему сменили архитектуру)

- Web3Forms **free plan** отклоняет server-side / API запросы из PHP/curl:
  - HTTP **403** «This method is not allowed. Use our API in client side or contact support with server IP address (Pro plan is required)».
- Значит прежняя архитектура `contact.html → api/form.php → Web3Forms` **не работает** на free plan (требуется Pro / whitelisting server IP).

### Решение

- Перешли на официальный free-plan-совместимый поток **Web3Forms client-side mode**:
  - `contact.html` / `assets/js/main.js` (браузер) → `https://api.web3forms.com/submit`.
- PHP `mail()` НЕ используется. Server-side Web3Forms-прокси больше НЕ используется как активный поток.
- Без framework / build system. Стек остаётся static HTML/CSS/JS + PHP.

### Активный поток

- `contact.html`: `<form action="https://api.web3forms.com/submit" method="post">`.
- Hidden-поля в форме: `access_key` (client-side ключ Web3Forms — для free client-side mode допустимо его наличие в HTML), `subject`=`【LINE Business OS】導入相談フォーム`, `from_name`=`IZUMI IT COMPANY`, `page`=`https://izumiit.com/contact.html`.
- Honeypot: визуальный `website` (сохранён) + Web3Forms `botcheck` (скрытый checkbox `display:none`).
- `assets/js/main.js`: frontend-валидация (name/company/email/message/privacy_consent) сохранена; `service[]` опционально — если ничего не выбрано, в payload добавляется `service = "未選択"`; остальные optional-поля могут быть пустыми. Success-условие: `response.ok && (data.ok === true || data.success === true)`. При ошибке — общий японский текст (без технических деталей провайдера, без логирования PII). Submit-кнопка снова включается в finally. После успеха — inline success UI, `form.reset()`, сброс `started_at`.

### api/form.php

- **НЕ удалён.** В начало файла добавлен комментарий, что endpoint — неактивный fallback/reference (Web3Forms free plan отклоняет server-side PHP/curl).
- `contact.html` больше НЕ маршрутизируется на `api/form.php`.
- `api/form-provider.local.php` остаётся **gitignored** (реальный ключ); реальный ключ НЕ дублируется в `api/form.php` как активный поток.

### Тестирование (ВАЖНО)

- Тест выполняется **через браузерную форму**, НЕ через curl из PowerShell/сервера.
- Прямой `curl https://api.web3forms.com/submit` может вернуть **403** — это ожидаемо (free plan разрешает client-side/browser, не server/curl).
- После browser-submit проверить **Web3Forms Dashboard** + inbox/spam получателя.
- Так как access key был раскрыт во время настройки, после финальной проверки **перегенерировать ключ** в Web3Forms и заменить его в `contact.html`.

### Manual upload list (после push)

- `contact.html`
- `assets/js/main.js`
- `handoff.md` — repo-only (на сервер заливать не обязательно).
- `api/form.php` — опционально (остаётся как inactive fallback).

## Phase 2.4 — Web3Forms contact backend + conversion copy cleanup (2026-06-22)

### TASK 0 — Git preflight

- На `main`; `main` синхронизирован с `origin/main` (`git status` → up to date). Перед редактированием в working tree были незакоммиченные правки от подготовки этой фазы (`.gitignore`, `api/form.php`) + untracked `api/form-provider.example.php`, `COPY_AUDIT_REPORT.md`, `QA_FULL_AUDIT_REPORT.md`, `api/form-provider.local.php`.
- QA-отчёты (`COPY_AUDIT_REPORT.md`, `QA_FULL_AUDIT_REPORT.md`) **НЕ коммитятся** (если не запрошено явно). `api/form-provider.local.php` **НЕ коммитится** (содержит реальный access key, gitignored).

### TASK 1 — Web3Forms backend (`api/form.php`)

- `api/form.php` — серверный прокси к Web3Forms. Поток: `contact.html` (POST) → `api/form.php` → `https://api.web3forms.com/submit`.
- Access key **никогда** не присутствует в `contact.html` / `assets/js/main.js` / любом коммиченном файле.
- Config priority: (1) `api/form-provider.local.php`, (2) env `WEB3FORMS_ACCESS_KEY`, (3) если нет → HTTP 500 `{"ok":false,"message":"config_missing"}`.
- `api/form-provider.local.php` — **gitignored** (запись `api/form-provider.local.php` в `.gitignore`), создаётся вручную на сервере с реальным ключом. В репозитории — только `api/form-provider.example.php` (placeholder `PASTE_ACCESS_KEY_HERE`).
- Отправка: cURL при наличии, fallback `stream_context_create`. Поля в Web3Forms: `access_key`, `subject`=`【LINE Business OS】導入相談フォーム`, `from_name`=`IZUMI IT COMPANY`, `name`, `email`, `company`, `phone`, `business_type`, `store_count`, `staff_count`, `service`, `line_official`, `timeline`, `message`, `page`=`https://izumiit.com/contact.html`, `backup_email`=`<バックアップ用メール（非公開・サーバ側設定）>`.
- Responses (JSON, `X-Content-Type-Options: nosniff`): success → 200 `{"ok":true}`; Web3Forms fail → 500 `send_failed`; validation fail → 422 `validation_error`; config missing → 500 `config_missing`; GET/не-POST → 405 `method_not_allowed`. Honeypot `website` заполнен → 200 `{"ok":true}` без отправки. PII в файлы/логи не пишется; детальные ошибки провайдера пользователю не показываются.

### TASK 2 — Reduced contact-form friction

- **Required** теперь только: お名前 (`name`), 会社名・店舗名 (`company`), メールアドレス (`email`), 現在の課題・相談内容 (`message`), プライバシー同意 (`privacy_consent`).
- **Optional (`任意`)**: 電話番号, 業種, 店舗数, スタッフ数, LINE公式アカウントの有無, 希望する導入時期, 興味のあるサービス (чекбоксы). `required`-атрибуты сняты с этих полей в `contact.html`; бейджи `必須`→`任意`.
- Service-группа опциональна; submit не блокируется без выбора; если `service[]` пуст, в Web3Forms уходит `未選択` (логика в `api/form.php`). Опция `まだ決まっていない` оставлена.
- `assets/js/main.js`: `requiredFields` сокращён до name/company/email/message; убрана обязательная проверка service; сохранены формат email, maxlength message (1200), проверка consent; PII не логируется.
- `api/form.php`: server-side требует только name/company/email/message/consent; остальные поля принимаются пустыми; email-формат и длина message проверяются.
- Copy у формы усилен: «フォームは、分かる範囲だけで送信できます。詳しい店舗数・スタッフ数・LINE公式アカウントの状況は、初回相談で確認します。フォーム送信で問題がある場合は、izumi@izumiit.com まで直接ご連絡ください。»

### TASK 3 — index 500社 (Web実績 vs SaaS実績)

- Заголовок trust-карточки: `500社以上の支援実績` → `Web制作・開発領域で500社以上の支援実績`.
- Тело сохранено + добавлен micro-disclaimer внутри карточки: «LINE Business OSの導入実績を示すものではありません。». `500社` не удалён, как SaaS-результат не подан, новых метрик нет.

### TASK 4/5 — Copy cleanup + dedup (index/products/security/company)

- Снижено хеджирование: `LINE 業務システム`→`LINE業務システム`, `小規模店舗 DX`→`小規模店舗DX`, `確認しやすい形へ`→`確認できる形へ`, `来店忘れリスクを軽減しやすくします`→`来店忘れ対策に役立つ導線を整えます`, `連絡漏れや誤操作を減らしやすくします`→`連絡漏れや誤操作を減らすための導線を整えます`, `現場に定着しやすい形を目指します`→`現場で使い続けられる形に整えます`, разнообразлены `配慮して設計しています` в `security.html` (`分けて管理します` / `権限を整理します` / `必要な範囲で取り扱います`). Новых технических контролей (шифрование/бэкапы/логи) НЕ добавлено; cert-disclaimer сохранён.
- Дедупликация product lead: index Workforce/Booking — короткие benefit-формулировки; products Workforce/Booking — детальные feature-формулировки. Позиционирование и цены не менялись. Все дисклеймеры сохранены.
- Запрещённые слова (給与計算/法定勤怠/税務/労務管理) остаются только в exclusion/disclaimer контексте.

### TASK 6 — Technical polish

- `contact.html`: header logo получил `aria-label="IZUMI IT COMPANY ホーム"` (консистентно с остальными страницами).
- `index.html`: `main.js` перенесён из конца `<body>` (без defer) в `<head>` с `defer` — консистентно с products/security/company/contact.
- `sitemap.xml`: к каждому public URL добавлен `<lastmod>2026-06-22</lastmod>`.

### Server-side tasks (НЕ из репозитория — конфиг сервера)

- **HTTP→HTTPS**: настроить nginx 301-редирект http→https (это серверная конфигурация, из репо не делается).
- **HSTS**: включить `Strict-Transport-Security` **только после** подтверждения, что HTTPS работает корректно.
- **Optional security headers**: `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `X-Frame-Options`/`Content-Security-Policy frame-ancestors` — по желанию на уровне nginx.
- nginx из репозитория НЕ конфигурируется.

### Manual upload list (после push)

Загрузить на сервер в root:

- `contact.html`
- `assets/js/main.js`
- `api/form.php`
- `api/form-provider.example.php`
- `index.html`
- `products.html`
- `security.html`
- `company.html` (изменён)
- `sitemap.xml`
- `pricing.html` — только если менялся (в этой фазе НЕ менялся).
- `handoff.md` — repo-only (на сервер заливать не обязательно).

**НЕ загружать / НЕ коммитить:**

- `api/form-provider.local.php` из репо — он создаётся **вручную на сервере** с реальным ключом (gitignored). Подтвердить, что файл уже существует на сервере с правильным `web3forms_access_key`.
- QA-отчёты (`COPY_AUDIT_REPORT.md`, `QA_FULL_AUDIT_REPORT.md`) — если не нужны на сервере.

### Live test command (после ручной загрузки)

```bash
# 1. GET → 405 JSON
curl -i https://izumiit.com/api/form.php

# 2. Валидный POST → 200 {"ok":true} (+ submission в Web3Forms dashboard, письмо на izumi@izumiit.com)
curl -i -X POST https://izumiit.com/api/form.php \
  -d "name=テスト太郎" \
  -d "company=テスト店舗" \
  -d "email=test@example.com" \
  -d "message=導入相談のテストです" \
  -d "privacy_consent=on"

# 3. Невалидный POST (нет name/email/message) → 422 validation_error
curl -i -X POST https://izumiit.com/api/form.php -d "company=テスト店舗"

# 4. Honeypot заполнен → 200 {"ok":true}, но без реальной отправки
curl -i -X POST https://izumiit.com/api/form.php \
  -d "name=テスト太郎" -d "company=テスト店舗" \
  -d "email=test@example.com" -d "message=テスト" \
  -d "privacy_consent=on" -d "website=spam"
```

После: проверить Web3Forms dashboard (submission появился) и inbox/spam получателя (`izumi@izumiit.com`).

### Forbidden claims check (Phase 2.4)

- Grep по `*.html`/`*.php`/`*.xml` (`LINE公式認定 / ISO27001 / Pマーク / 法定勤怠対応 / 給与計算対応 / 税務対応 / 労務管理対応 / 売上保証 / no-show完全防止 / SaaS導入500社 / LINE Business OS 導入500社 / 1200+ / 99% / 4.8/5 / 削減工数 / 導入店舗数`): **0**.
- `給与計算 / 法定勤怠 / 税務 / 労務管理` — только exclusion/disclaimer. `500社` — только Web制作・開発領域 + явный disclaimer на index и company. `/new/` ссылок нет. `ドラフト` / `法的助言` отсутствуют. `勤怠報告` как позитивная фича не используется (используется `勤務報告`).
- Реальный Web3Forms access key в коммиченных файлах **отсутствует** (только в gitignored `api/form-provider.local.php`).

### Остаточные риски / legal review (Phase 2.4)

- **HTTP→HTTPS redirect + HSTS** остаются серверной задачей (nginx) — не выполнено из репо.
- **Legal pages существенно не менялись** в этой фазе; остаются launch-draft и требуют сверки японским юристом до полного коммерческого масштаба (правовая форма «IZUMI IT COMPANY» в 特商法, достаточность 特商法 раскрытия адреса/телефона, ответственность за персональные данные стаффа/клиентов, условия LINE/внешних сервисов, потолок ответственности).
- Доставляемость письма теперь зависит от Web3Forms (а не PHP `mail()`); подтвердить получение на `izumi@izumiit.com` после live-теста.
- Live e2e (405/200/422/honeypot) и финальный mobile QA нужно повторить после ручной загрузки.

## Phase 2.3 — Public launch final hotfix (legal text / email / OGP)

### Внутренний legal-risk note (НЕ публиковать на сайте)

- **Legal pages are public launch drafts and should be reviewed by a qualified Japanese legal professional before full commercial scale.**

### TASK 0 — Git preflight

- На `main`; `git status` clean перед редактированием; `main` == `origin/main` == `c5c2311 Finalize root launch QA metadata and favicon` (`git fetch origin`; оба rev-parse → `c5c2311`). Скриншотов/temp/debug-файлов в трекинге нет.

### TASK 1 — Публичный draft-warning удалён

- Из `privacy.html`, `terms.html`, `commercial-disclosure.html`, `disclaimer.html` удалён публичный блок `<p class="legal-notice">本ページはドラフトです。…法的助言を構成するものではありません。</p>`.
- Слово **「ドラフト」** больше не встречается ни в одной публичной странице (`grep ドラフト` по `*.html/*.php/*.xml/*.txt` → 0).
- `（ドラフト）` убрано из `<meta name="description">` всех 4 страниц.
- Вместо большого warning-box рядом с `最終更新日` (`.legal-meta`) добавлена мягкая нота: «本ページの内容は、必要に応じて見直し・更新される場合があります。»
- `security.html` warning не имел; его `mockup-caption` (не-draft дисклеймер) сохранён.

### TASK 2 — Contact email reliability (`api/form.php`)

- Убран `Cc:` на Gmail. Теперь шлются **2 отдельных admin-письма**:
  1. To `izumi@izumiit.com`, Subject `【LINE Business OS】導入相談フォーム`.
  2. To `<バックアップ用メール（非公開・サーバ側設定）>`, Subject `【LINE Business OS】導入相談フォーム（コピー）`.
- `{ok:true}` возвращается только если **оба** `mail()` вернули `true` (иначе HTTP 500 `send_failed`).
- Client auto-reply (Subject `お問い合わせを承りました｜IZUMI IT COMPANY`) — best-effort, его провал не блокирует success (PII в файлы не пишется; отмечено комментарием в коде).
- `Reply-To` обоих admin-писем = email клиента; `From: IZUMI IT COMPANY <izumi@izumiit.com>`; header-sanitization (`clean_header`) сохранён; внутренние ошибки пользователю не показываются.
- **Важно:** если после этого Gmail всё ещё не получает письма — проблема доставляемости PHP `mail()` (SPF/DKIM/DMARC/репутация). Потребуется SMTP/API-отправитель (напр. SendGrid/Mailgun/SES) — НЕ добавлялось в этой фазе по требованию.

### TASK 3 — favicon / OGP / robots / sitemap

- В репозитории присутствуют и закоммичены (`git ls-files`): `favicon.ico`, `favicon.svg`, `apple-touch-icon.png`, `robots.txt`, `sitemap.xml`, `assets/images/og-image.png`.
- OG-image: реальный логотип IZUMI (ласточка) + текст `IZUMI IT COMPANY` / `LINE Business OS` / `LINE連携で店舗運営をわかりやすく`; без fake-метрик/сертификаций/AI-людей; широкий 1.91:1 баннер (1200×630).
- Все 10 публичных страниц содержат favicon links, apple-touch-icon, og:image, canonical, страничные title/description/og:title/og:description/og:url и twitter card (проверено grep; `contact.html` минифицирован, но содержит весь набор).

### TASK 4 — Live upload checklist (nginx / manual upload, git push недостаточно)

Загрузить в root после push:

- HTML: `index.html`, `products.html`, `pricing.html`, `security.html`, `company.html`, `contact.html`, `privacy.html`, `terms.html`, `commercial-disclosure.html`, `disclaimer.html`.
- PHP: `api/form.php`.
- Assets: `assets/css/style.css`, `assets/js/main.js`, `assets/images/og-image.png`, `favicon.ico`, `favicon.svg`, `apple-touch-icon.png`, `robots.txt`, `sitemap.xml`.

### TASK 4/6 — Live статус (на момент работы, ДО загрузки этого хотфикса)

| URL | статус |
|-----|--------|
| `/favicon.ico` | 200 ✓ |
| `/favicon.svg` | 200 ✓ |
| `/apple-touch-icon.png` | 200 ✓ |
| `/assets/images/og-image.png` | 200 ✓ |
| `/robots.txt` | **404 — нужно залить** |
| `/sitemap.xml` | **404 — нужно залить** |
| `/api/form.php` (GET) | 405 JSON `{ok:false,method_not_allowed}` ✓ |
| `/old21062026/index.html` | 200 ✓ (бэкап на месте) |
| `/privacy.html` | живой всё ещё **показывает「ドラфト」** → требуется загрузка обновлённых HTML |

- Root отдаёт новый LINE Business OS сайт; старый только на `/old21062026/`.
- Forbidden grep (`LINE公式認定 / ISO27001 / Pマーク / 法定勤怠対応 / 給与計算対応 / 税務対応 / 労務管理対応 / 売上保証 / no-show完全防止 / SaaS導入500社 / 導入500社 / 1200+ / 99% / 4.8/5 / 削減工数 / 導入店舗数`) по `*.html/*.php/*.xml/*.txt` → 0. `給与計算 / 法定勤怠 / 税務 / 労務管理` — только exclusion/disclaimer контекст. `/new/` ссылок нет.

### TASK 5 — Live form test

- **НЕ выполнен агентом** (нет доступа к серверу для загрузки и нельзя слать реальные письма). Выполнить вручную после загрузки `api/form.php`:
  1. POST с реального тестового email → ожидать HTTP 200 + `{ok:true}`.
  2. Проверить приход на `izumi@izumiit.com`, отдельной копии на `<バックアップ用メール（非公開・サーバ側設定）>`, auto-reply на тестовый email, включая папки спама.
  3. Если `{ok:true}`, но Gmail не получает — зафиксировать: izumi получил? / Gmail получил? / auto-reply получил? — и переходить на SMTP/API-отправитель.

### Остаточные риски Phase 2.3

- **Доставляемость PHP `mail()` в Gmail** не гарантирована даже с отдельным письмом — вероятная причина прошлой пропажи: SPF/DKIM/DMARC/репутация отправителя. Рекомендация: перейти на SMTP/API-отправитель (отдельная фаза).
- **Legal pages остаются launch-draft** (внутренне) и требуют сверки японским юристом до полного коммерческого масштаба; публичный warning при этом снят по требованию.
- `robots.txt` / `sitemap.xml` на live дают 404 — обязательно залить.
- Финальный live-QA (200 на favicon/OGP/robots/sitemap, отсутствие「ドラフト」, console errors, overflow на 320–1920, mobile-меню) нужно повторить **после** ручной загрузки.

## Phase 2.2 — Legal pages for LINE Business OS

### Branch / deploy status (preflight, TASK 0)

- Работа на `main`. Перед редактированием `git status` clean. `main` = `origin/main` = `bbd9e4f Fix contact form CTA and deployment readiness` (`git fetch origin`; `git log -1 main` и `git log -1 origin/main` → оба `bbd9e4f`). Phase 2.1 / contact hotfix уже закоммичены и запушены — незавершённого form-fix нет, можно безопасно делать legal-страницы.
- `.cursor/` ignored и не трекается; `design-test/` / `design-test-a/` в `.gitignore`; временных скриншотов/debug-файлов в трекинге нет (`git ls-files` — только production-файлы).
- Remote: `origin https://github.com/tantik/iic-sass.git` (HTTPS).

### Важное решение по структуре

- В репозитории **нет** каталога `/new/` — production-сайт лежит в **корне** репозитория (`index.html`, `products.html`, … в корне; `git ls-files` подтвердил). Поэтому legal-страницы созданы/обновлены **в корне**, а не в `/new/`. (Live-деплой ранее упоминался как `/new/`, но это деплой-префикс хостинга, а не каталог в репо.)

### Legal pages созданы / обновлены (TASK 1–5)

- `privacy.html` — **перезаписан** из минимального draft в полноценную プライバシーポリシー (11 разделов) с полным site header/footer/nav. Текст из ТЗ дословно (取得する情報 / 利用目的 / 第三者提供 / 業務委託 / 外部サービス連携 / 安全管理措置 / Cookie / 開示・訂正 / 保存期間 / お問い合わせ窓口 / 改定). Title: `プライバシーポリシー｜LINE Business OS｜IZUMI IT COMPANY`. Hero subcopy из ТЗ.
- `terms.html` — **перезаписан** из минимального draft в полноценное 利用規約 (20 разделов) с site chrome. Раздел 3 «本サービスが対象としない業務» (給与計算/法定勤怠/税務/労務管理 как исключение), раздел 13 保証の否認, 15 損害賠償の制限 (cap = последний 1 мес). Title: `利用規約｜LINE Business OS｜IZUMI IT COMPANY`.
- `commercial-disclosure.html` — **новая** страница 特定商取引法に基づく表記 (формат `<dl class="legal-dl">` — на mobile стекается, на ≥640px 2 колонки). 運営責任者: Roman Siedovolosyi. 所在地 / 電話番号: `請求があった場合、遅滞なく開示いたします。` (реальные адрес/телефон на сайте не публиковались — старый `commercial-transaction.html` тоже имел только email; данные регистрации НЕ выдуманы). Title: `特定商取引法に基づく表記｜IZUMI IT COMPANY`.
- `disclaimer.html` — **новая** страница 免責事項 (8 разделов) с site chrome. Раздел 2 成果の非保証 (売上向上/予約キャンセル防止/来店忘れ防止 НЕ гарантируются). Title: `免責事項｜LINE Business OS｜IZUMI IT COMPANY`.
- Все 4 страницы содержат `legal-notice`: «本ページはドラフトです。正式な内容は専門家による法務確認後に更新します。本ページは法的助言を構成するものではありません。»
- CSS: добавлен блок «Legal pages» в конец `style.css` (`.legal-hero`, `.legal-section`, `.legal-doc` + h2/h3/ul/a, `.legal-intro`, `.legal-dl` (responsive dt/dd grid), `.legal-meta`). Mint/green/navy + soft cards + readable, mobile-first. Custom cursor / framework / build / dependencies НЕ добавлялись.

### Footer links updated (TASK 7)

- `footer-legal` приведён к единым 6 ссылкам на **всех** страницах (`index / products / pricing / security / company / contact` + 4 новые legal): プライバシーポリシー→privacy.html, 利用規約→terms.html, 特定商取引法に基づく表記→commercial-disclosure.html, 免責事項→disclaimer.html, セキュリティ→security.html, お問い合わせ→contact.html.
- Старые 7-ссылочные footer-legal (со ссылками на удалённые policy-страницы) заменены везде. Битых ссылок на удалённые файлы не осталось (grep `commercial-transaction|security-policy|data-handling-policy|support-policy|billing-policy` по `*.html`/`*.php` → 0). Footer переносится на mobile (`flex-wrap`), горизонтального скролла нет.

### Privacy / contact consent link result (TASK 6)

- `contact.html` consent-чекбокс уже имел правильный текст и ссылку: `<a href="privacy.html">プライバシーポリシー</a>に同意して送信します。` — изменений не потребовалось. В браузере подтверждено: checkbox `required`, ссылка ведёт на `privacy.html` (относительный путь, резолвится из той же папки). Footer contact.html обновлён до 6 ссылок.

### Forbidden claims grep result (TASK 9)

- Grep по `*.html`/`*.php` (`LINE公式認定 / ISO27001 / Pマーク / 法定勤怠対応 / 給与計算対応 / 税務対応 / 労務管理対応 / 売上保証 / no-show完全防止 / SaaS導入500社 / LINE Business OS 導入500社 / 1200+ / 99% / 4.8/5 / 削減工数 / 導入店舗数`): **0 совпадений**.
- `給与計算 / 法定勤怠 / 税務 / 労務管理` — **только** exclusion/disclaimer контекст: terms §3, disclaimer §1, commercial-disclosure 注意事項, products L73, pricing L202, index (向いていないケース / Workforce notice / FAQ). Позитивных claim нет.
- `500社以上` — только Web制作・開発領域 (index hero chip + index trust card + company trust card с дисклеймером). SaaS導入 контекста нет.

### Mobile / overflow QA result (TASK 9, CDP Emulation + локальный py http.server :8787)

`document.documentElement.scrollWidth > innerWidth` → `false` (горизонтального скролла нет):

| width | privacy | terms | commercial-disclosure | disclaimer | contact | index |
|------|------|------|------|------|------|------|
| 320 | ok (320=320) | ok (320=320) | ok (320=320) | ok (320=320) | ok (320=320) | — |
| 768 | — | — | ok (753<768) | — | — | — |
| 1440 | — | — | — | — | — | ok (1425<1440) |

- Все 4 новые страницы рендерятся корректно (snapshot подтвердил все разделы, mailto-ссылки, footer-legal из 6 ссылок). Mobile-меню работает (`menu-toggle`, collapsed/expanded, `main.js` подключён). FAQ-аккордеон на index не затронут. CTA/footer/legal-текст не переполняются. Pricing values не менялись. Custom cursor нет.
- PHP CLI на dev-машине отсутствует (`php` not found) — статику сервировали через Python `http.server` (`file://` заблокирован браузером MCP). Скриншоты заблокированы auto-review; overflow подтверждён программно (точнее визуального).

### Остаточные риски Phase 2.2

- **Legal-страницы — draft и требуют профессиональной юридической сверки до полноценного коммерческого запуска.** Содержат обязательный дисклеймер.
- **特商法 (commercial-disclosure)**: формулировка 所在地/電話番号 «請求があった場合、遅滞なく開示いたします。» должна быть проверена на соответствие реальной модели продаж (для B2C/部分的 disclosure может потребоваться полное раскрытие адреса/телефона).
- **PHP mail delivery** всё ещё требует live e2e теста (admin/Cc/auto-reply, спам, `{ ok:true }`), если он ещё не выполнен после деплоя; PHP локально недоступен.
- Удаление старых policy-страниц — продуктовое решение (консолидация). Если какие-то из них (например `support-policy` / `billing-policy`) нужны как отдельные страницы — восстановить из git и вернуть в footer.
- Browser QA выполнен через Chromium CDP emulation; финальную проверку на реальном iOS Safari желательно повторить после деплоя.

### Следующий рекомендуемый этап

- Phase 2.3 — юридическая сверка всех legal-страниц специалистом + уточнение 特商法 раскрытия под реальную модель продаж; live e2e тест PHP-формы (если ещё не сделан) с проверкой доставляемости (SPF/DKIM/DMARC); финальный mobile QA на реальном iOS-устройстве после деплоя.

## Phase 2.1 — Homepage onboarding flow + privacy page

### Branch / deploy status (preflight, TASK 0)

- Работа на `main`. Перед редактированием `git status` clean. `main` = `origin/main` (оба включают `2fdabbc Add PHP contact form for LINE Business OS`; `git fetch origin` + `git log -1 origin/main` → `2fdabbc`).
- `.cursor/` ignored и не трекается; `design-test/` и `design-test-a/` в `.gitignore` и не трекаются (`git ls-files` показывает только production-файлы). Временных скриншотов/debug-файлов в трекинге нет.
- Remote: `origin https://github.com/tantik/iic-sass.git` (HTTPS).

### Homepage onboarding flow (TASK 1)

- Добавлен блок **`導入までの流れ`** на главной (`index.html`), отдельная страница flow НЕ создавалась; старый `flow.html` в навигацию НЕ добавлялся; Web制作-формулировки (発注 / 着手金 / 納品 / 残金 / 制作費の50%) НЕ использовались — текст 100% про LINE Business OS / SaaS導入.
- **Точное размещение**: новая секция `<section class="section onboarding-section" id="onboarding">` стоит **после** `pilot-section` («まずはデモで、自店舗に合うか確認できます。») и **перед** FAQ-секцией («導入前に確認したいこと»).
- Структура: eyebrow `導入ステップ`, h2 `導入までの流れ`, subcopy `はじめての導入でも、現在の運用を確認しながら、必要なサービスだけを小さく始められます。`, затем `<ol class="onboarding-steps">` из 6 шагов (1 導入相談 / 2 運用確認 / 3 サービス選定 / 4 デモ・見積り確認 / 5 初期設定・テスト運用 / 6 正式運用・改善) с точными текстами из ТЗ.
- Заметка: `正式な料金・契約条件は、個別のお見積りおよび利用規約をご確認いただきます。` + CTA-ряд: `導入相談する` → contact.html, `料金を見る` → pricing.html.
- CSS (новый блок «Home onboarding flow (Phase 2.1)» в конце `style.css`): `.onboarding-steps` (1 col → 2 col ≥560px → 3 col ≥820px), `.onboarding-step` (soft card, navy number badge `.onboarding-num`, тонкий green→navy top-accent через `::before`), `.onboarding-note`. Mint/green/navy, copper не использован, fake-метрик/логотипов/скриншотов нет. Reveal-анимация секции работает через существующий `.section`-observer.

### Privacy / legal link safety (TASK 2)

- `/new/privacy.html` **уже существовал** (tracked) — новая страница не дублировалась. Существующая draft-страница **дополнена** до требуемой структуры (она же — цель consent-ссылки формы): intro, `取得する情報` (お名前 / 会社名・店舗名 / メールアドレス / 電話番号 / 業種・店舗数・スタッフ数 / お問い合わせ内容 / LINE Business OS導入相談に関する情報), `利用目的`, `第三者提供`, `管理`, `お問い合わせ窓口` (`mailto:izumi@izumiit.com`), `改定`. Сохранён осторожный тон + 2 заметки: «ドラフト…法務確認後に更新» и «正式な法的確認が必要な場合は、専門家にご確認ください。». Title → `プライバシーポリシー`.
- Все ссылки на privacy резолвятся (относительный путь `privacy.html` → `/new/privacy.html`): footer-legal на index/products/pricing/security/company/contact + consent-чекбокс формы (`<a href="privacy.html">`). Рендер privacy.html подтверждён в браузере (все секции на месте, mailto и «← ホームへ戻る» работают, overflow 0 @320px).

### Contact PHP form readiness (TASK 3)

- `contact.html` form `action="api/form.php"` ✓; `api/form.php` существует (резолвится в `/new/api/form.php`) ✓; JS `fetch(contactForm.action)` использует относительный путь ✓; success показывается **только** при `status 200 && data.ok === true` ✓; error при провале ✓; прямой fallback `izumi@izumiit.com` виден (intro + lead + заметка под формой) ✓; `privacy_consent` required (HTML `required` + JS-проверка + PHP-проверка) ✓; mailto-only главного поведения нет (форма постит в PHP) ✓. PHP-логика НЕ менялась (багов не найдено).
- **`php -l` локально НЕ выполнен: PHP не установлен** (`where.exe php` → not found). PHP-runtime/синтаксис нужно проверить на сервере.

### Mobile / overflow QA (TASK 6, CDP Emulation + локальный http.server :8771)

`document.documentElement.scrollWidth === clientWidth`, горизонтального скролла нет:

| width | index.html | privacy.html |
|------|------|------|
| 320 | 0 (320=320) | 0 (320=320) |
| 375 | 0 (375=375) | — |
| 390 | 0 (390=390) | — |
| 430 | 0 (430=430) | — |
| 768 | 0 (753=753) | — |
| 1440 | 0 (1425=1425) | — |

- Новый flow-блок на мобиле (390px, скриншот) стекается в одну колонку чисто, карточки full-width, не переполняются; на desktop (скриншот) — аккуратная сетка 3×2 с navy-бейджами и green→navy акцентом. CTA-кнопки/footer/контент не переполняются. Mobile-меню и contact-форма не менялись (поведение Phase 2.0 сохранено). Custom cursor нет; framework/build/dependencies не добавлялись.

### Forbidden claims grep (TASK 5)

- Grep по `*.html`/`*.php` (`LINE公式認定 / ISO27001 / Pマーク / 法定勤怠対応 / 給与計算対応 / 税務対応 / 労務管理対応 / 売上保証 / no-show完全防止 / SaaS導入500社 / LINE Business OS 導入500社 / 1200+ / 99% / 4.8/5 / 削減工数 / 導入店舗数`): **0 совпадений**.
- `給与計算 / 法定勤怠 / 税務 / 労務管理` — только exclusion/disclaimer контекст (index L96 «向いていないケース», index L112 notice, index FAQ L223, products L73, pricing L202). Позитивных claim нет.
- `500社以上` — только Web制作・開発領域 (index hero chip + index trust card + company trust card с дисклеймером). Security сертификаций не заявляет.

### Live email test результат

- **НЕ выполнен** (требует live deploy `/new/` + реальный почтовый сервер; PHP локально недоступен). После push нужно: отправить тестовую заявку с live `/new/contact.html`; подтвердить получение на `izumi@izumiit.com` + Cc `<バックアップ用メール（非公開・サーバ側設定）>`; подтвердить auto-reply на тестовый email; проверить спам; убедиться, что success только при `{ ok:true }`.

### Остаточные риски Phase 2.1

- Доставляемость PHP `mail()` не проверена (SPF/DKIM/DMARC, From на внешнем домене) — возможен спам/отклонение; при проблемах сменить `FROM_EMAIL`.
- PHP-синтаксис не линтован локально (нет PHP) — проверить на сервере.
- `privacy.html` и прочие legal-страницы остаются draft и требуют юридической сверки.
- Browser QA выполнен через Chromium CDP emulation; финальную проверку на реальном iOS Safari желательно повторить после deploy.

### Следующий рекомендуемый этап

- Phase 2.2 — live deploy `/new/` + реальный e2e тест отправки писем (admin/Cc/auto-reply, спам-проверка), `php -l` / runtime-проверка на сервере, при необходимости донастройка From/SPF/DKIM; юридическая сверка legal-страниц; опционально усиление анти-спама.

## Phase 2.0 — Real PHP contact form for LINE Business OS

### Branch / deploy status (preflight, TASK 0)

- Работа на `main`. Перед редактированием: `git status` clean; `main` = `origin/main` = `afdae37` (Phase 1.9F `Add contact mailto form and cleanup test artifacts`). `git fetch origin` — up to date.
- `.cursor/` ignored и не трекается (подтверждено `git ls-files --error-unmatch .cursor` → not tracked). `design-test/` и `design-test-a/` в `.gitignore` и не трекаются. Временных скриншотов/debug-файлов в трекинге нет.
- Remote: `origin https://github.com/tantik/iic-sass.git` (HTTPS).

### PHP form implementation summary

- Mailto-only поведение заменено на реальную отправку: форма `#contactInquiryForm` теперь `method="post" action="api/form.php"`; JS делает `fetch` и показывает success **только** после `{ ok: true }` от PHP. Новый дизайн SaaS-страницы сохранён (старый дизайн НЕ возвращался).
- Старый bundled JS и старый `form.php` НЕ переиспользовались — написан новый безопасный обработчик.

### Endpoint path

- `api/form.php` (относительно `/new/contact.html` резолвится в `/new/api/form.php`).
- Только `POST`; не-POST → HTTP 405 `{ ok:false, message:"method_not_allowed" }`. Ответ всегда JSON (`Content-Type: application/json; charset=utf-8`).

### Email recipients / cc / auto-reply behavior

- Admin **To**: `izumi@izumiit.com`; **Cc**: `<バックアップ用メール（非公開・サーバ側設定）>`; **Reply-To**: email отправителя; **Subject**: `【LINE Business OS】導入相談フォーム`.
- Client **auto-reply**: только на email пользователя (Gmail в копию НЕ ставится); **Reply-To**: `izumi@izumiit.com`; **Subject**: `お問い合わせを承りました｜IZUMI IT COMPANY`.
- **From**: `IZUMI IT COMPANY <izumi@izumiit.com>` (если хостинг отклонит — поменять `FROM_EMAIL` на разрешённый домен-адрес, Reply-To оставить `izumi@izumiit.com`; в файле есть комментарий).
- Письма plain-text (UTF-8, 8bit); subject через `mb_encode_mimeheader`. Admin-тело содержит все поля + 送信日時 + IP. Auto-reply провал НЕ блокирует admin-success.
- `mail()`: admin успех → `{ ok:true }`; admin провал → HTTP 500 `{ ok:false, message:"send_failed" }`.

### Validation summary

- **Client (JS)**: required (name / company / email / business_type / store_count / staff_count / line_official / timeline / message), формат email, ≥1 `service[]`, согласие `privacy_consent`, длина message ≤ 1200. Submit-кнопка disabled на время отправки; персональные данные НЕ логируются; нет localStorage/sessionStorage.
- **Server (PHP)**: те же required server-side, `filter_var(FILTER_VALIDATE_EMAIL)` (без deprecated `FILTER_SANITIZE_STRING`), `mb_strlen(message) ≤ 1200`, ≥1 service. Невалидно → HTTP 422 `{ ok:false, message:"invalid_input" }`. Header-injection защита: CR/LF/NUL вырезаются из header-значений (`clean_header`).

### Anti-spam summary

- **Honeypot** `website` (скрыт через visually-hidden clip, `tabindex=-1`, `aria-hidden`): если заполнен → `{ ok:true }` без отправки писем.
- **Time-trap** `started_at` (JS ставит `Date.now()` при загрузке): если прошло < 3000 мс → `{ ok:true }` без отправки. Пустой `started_at` допускается (JS недоступен).
- Защита базовая, не enterprise (нет CAPTCHA / rate-limit / репутации IP).

### Accessibility

- `#contactFormMessage`: `role="status" aria-live="polite" tabindex="-1"`; после результата получает focus. Success/error — видимый текст + иконка (не только цвет). Success-текст переносится (`white-space: pre-line`). Прямой email fallback виден (lead + заметка под формой).

### CSS polish

- Добавлены: `.form-message.is-success`, `white-space:pre-line` для form-message, `.form-full-label`, `.consent-option`, honeypot `.form-hp` (visually-hidden clip — не создаёт горизонтальный скролл), `:disabled`/`.is-loading` для submit. Принятые страницы НЕ редизайнились.

### Local QA результат

- `*.html`/`*.php` forbidden-claims grep (`LINE公式認定 / ISO27001 / Pマーク / 法定勤怠対応 / 給与計算対応 / 税務対応 / 労務管理対応 / 売上保証 / no-show完全防止 / SaaS導入500社 / LINE Business OS 導入500社 / 1200+ / 99% / 4.8/5 / 削減工数 / 導入店舗数`): **0 совпадений**. `500社以上` — только Web制作・開発領域 (index/company). Стале mailto/«送信完了»/«メールアプリ» копий в форме нет (grep 0).
- Статическая проверка PHP/JS логики выполнена. **PHP-runtime QA локально НЕ выполнялся: PHP не установлен на dev-машине** (`where.exe php` → not found), поэтому `php -S` / `php -l` недоступны. Полный функциональный тест отправки писем нужно провести на live-сервере (см. ниже).

### Mobile / overflow результат

- Раскладка формы: single-column по умолчанию (320px), full-width инпуты; `.form-grid`/`.checkbox-grid` → 2 колонки от ≥640px; honeypot скрыт clip-методом (исключает горизонтальный скролл). Принятая mobile-инфраструктура Phase 1.9E/1.9F не менялась. Финальный browser/overflow прогон рекомендуется после deploy.

### Live QA результат

- **НЕ выполнен** (требует deploy на `/new/` и реального почтового сервера). После push нужно: отправить тестовую заявку с live `/new/contact.html`; подтвердить получение на `izumi@izumiit.com` и `<バックアップ用メール（非公開・サーバ側設定）>`; подтвердить auto-reply на тестовый email; проверить папку спам; убедиться, что success показывается только после `{ ok:true }`; проверить отсутствие персональных данных в console.

### Остаточные риски Phase 2.0

- Доставляемость PHP `mail()` зависит от сервера/DNS/SPF/DKIM/DMARC — письма могут уходить в спам или отклоняться (особенно From на внешнем домене). При проблемах сменить `FROM_EMAIL` на адрес, разрешённый хостингом.
- Анти-спам базовый, не enterprise-grade.
- Нет БД / истории заявок (по требованию): отправленные данные нигде не сохраняются.
- `privacy.html` ссылка в consent ведёт на ещё не созданную страницу (как и существующие footer legal-ссылки) — нужно создать legal-страницы.

### Следующий рекомендуемый этап

- Phase 2.1 — live deploy + реальный e2e тест отправки (admin/cc/auto-reply, спам-проверка); при необходимости донастройка From/SPF/DKIM; создание legal-страниц (`privacy.html` и др.); опционально усиление анти-спама.

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
- `to=izumi@izumiit.com`, `cc=<バックアップ用メール（非公開・サーバ側設定）>`, `subject=LINE Business OS 導入相談`, body — форматированный японский текст (お名前 / 会社名・店舗名 / メールアドレス / 電話番号 / 業種 / 店舗数 / スタッフ数 / 興味のあるサービス / LINE公式アカウント / 希望する導入時期 / 現在の課題・相談内容). Незаполненные select → `未選択`, пустой телефон → `未記入`.
- Если итоговый mailto-URL слишком длинный (> ~1900 симв.), показывается понятное предупреждение с просьбой сократить текст (навигация НЕ происходит).
- Безопасность: НЕ показывается «送信完了しました»; НЕ имитируется серверная отправка; нет backend/API/serverless/dependencies; данные НЕ пишутся в localStorage/sessionStorage; персональные данные НЕ логируются в console; данные не отправляются third-party.
- НЕ показывается ложное подтверждение отправки — текст явно говорит, что откроется почтовое приложение и письмо нужно подтвердить/отправить вручную.

### Mailto QA результат

- Сгенерированный mailto проверен (заполненная форма, demo-данные): `len=1466` (< safe limit 1900), `to=izumi@izumiit.com`, `cc=<バックアップ用メール（非公開・サーバ側設定）>`, `subject=LINE%20Business%20OS%20導入相談`, body корректно закодирован (`%0A` переносы) и при декодировании точно соответствует требуемому формату.
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
