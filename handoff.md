# Handoff

## Цель

Создать SaaS-first сайт IZUMI IT COMPANY для японского рынка, где LINE Business OS — основной продуктовый umbrella brand, а Workforce и Booking — отдельные SaaS-продукты.

## План реализации Phase 1.5

1. Обновить позиционирование и SEO на главных продуктовых страницах.
2. Привести header, footer, CTA, карточки, тарифы и FAQ к единой mobile-first системе.
3. Уточнить тексты о безопасности, контактах и юридических документах без неподтверждённых обещаний.
4. Проверить локальные ссылки, запрещённые формулировки и статическую структуру, затем закоммитить и отправить изменения.

## Текущее состояние

- Стек: статические HTML/CSS/JS без фреймворка, сборщика и backend.
- Ветка: `main`.
- Remote: `origin https://github.com/tantik/iic-sass.git`.
- Основные страницы: `index.html`, `products.html`, `pricing.html`, `security.html`, `company.html`, `contact.html`.
- Юридические страницы: `privacy.html`, `terms.html`, `commercial-transaction.html`, `security-policy.html`, `data-handling-policy.html`, `support-policy.html`, `billing-policy.html`.
- Папка `/old` отсутствует. Она не требуется и не должна восстанавливаться.
- Старый сайт используется только как внешняя справка: https://izumiit.com/
- Юридические страницы являются черновиками.
- Форма обратной связи статическая; контакт выполняется через `mailto:izumi@izumiit.com`.

## Файлы, над которыми работали

- `README.md`
- `handoff.md`
- `index.html`
- `products.html`
- `pricing.html`
- `security.html`
- `company.html`
- `contact.html`
- `privacy.html`
- `terms.html`
- `commercial-transaction.html`
- `security-policy.html`
- `data-handling-policy.html`
- `support-policy.html`
- `billing-policy.html`
- `assets/css/style.css`

## Что изменилось

- Главная страница расширена до полного SaaS-first лендинга с проблемами, решением, продуктами, тарифами, доверием, пилотом, FAQ и CTA.
- Workforce и Booking оформлены как самостоятельные продукты; Custom Automation оставлен вторичным направлением.
- Добавлены раздельные тарифы Workforce и Booking и обязательные пояснения.
- Обновлены страницы безопасности, компании и контакта с осторожными формулировками.
- Все юридические страницы помечены как черновики.
- Введены единые mobile-first стили, адаптивные карточки, читаемая японская типографика и видимые юридические ссылки.
- Обновлены title и description основных страниц.

## Что пробовали и не сработало

- В предыдущей итерации `git push -u origin main` через SSH завершился ошибкой: `git@github.com: Permission denied (publickey). fatal: Could not read from remote repository.` Позже remote был настроен на HTTPS.
- В предыдущей итерации был обнаружен вложенный git-репозиторий `old/about`, который попал в индекс как mode 160000. Тогда был создан backup, вложенный `.git` удалён, а содержимое добавлено как обычные файлы. В текущем состоянии mode 160000 отсутствует, как и папка `/old`.
- В этой итерации до реализации не выявлено ошибок, блокирующих работу.
- Финальный `git add` / `git commit` не выполнен: sandbox вернул `fatal: Unable to create 'D:/project/iic-sass/.git/index.lock': Permission denied`. Запрос на расширенное разрешение не был подтверждён в доступное время, поэтому push не запускался.

## Commit / Push

- Phase 1.5 зафиксирован и отправлен: `eeba930 Polish SaaS-first website phase 1.5`.
- Изменения Phase 1.6 намеренно не закоммичены и не отправлены: ожидается подтверждение пользователя.

## Phase 1.6 — Visual UI/UX Polish

Выполнена визуальная полировка без изменения позиционирования, стека, тарифной логики или юридических формулировок.

Файлы, изменённые в Phase 1.6:

- `assets/css/style.css`
- `index.html`
- `handoff.md`

Изменения дизайн-системы:

- расширены CSS variables для цветов, отступов, радиусов, теней и анимаций;
- усилена японская типографика, иерархия заголовков и ритм секций;
- улучшены sticky header, навигация, hero, CTA и footer;
- переработаны карточки проблем, продуктов, функций и информационные блоки;
- улучшена визуальная иерархия тарифов, выделение рекомендуемого плана и читаемость примечаний;
- улучшены FAQ, формы, legal/disclaimer blocks, focus states и reduced-motion режим;
- добавлены mobile-first ограничения, внутренний горизонтальный scroll навигации и безопасные grid-колонки без переполнения страницы.

Ограничения и оставшиеся риски:

- browser visual QA не удалось выполнить из-за недоступности локального browser connection; рекомендуется проверить desktop и mobile rendering вручную;
- backend и framework не добавлялись;
- production deployment не проверен;
- юридическая проверка production-версии не проводилась, legal pages остаются черновиками.

## Phase 1.7 — Premium Brand / UI Polish

Phase 1.7 продолжает незакоммиченные изменения Phase 1.6. Позиционирование, тарифная логика и юридические формулировки не изменялись.

Файлы, изменённые в Phase 1.7:

- `index.html`
- `products.html`
- `pricing.html`
- `security.html`
- `company.html`
- `contact.html`
- `assets/css/style.css`
- `assets/js/main.js`
- `handoff.md`

Brand assets:

- Использован существующий локальный wordmark `assets/images/logo_01.svg` в header всех основных страниц.
- Использован существующий локальный wordmark `assets/images/logo_02.svg` в footer всех основных страниц.
- Эти SVG ранее были перенесены из материалов старого сайта и обеспечивают визуальную преемственность бренда.
- Новые assets не скачивались: автоматический доступ к `https://izumiit.com/` был заблокирован, а необходимые logo assets уже присутствовали локально.
- Hotlink отсутствует; все ссылки на изображения относительные и локальные.

Что улучшено:

- Добавлено доступное mobile hamburger menu с `aria-expanded`, `aria-controls`, закрытием по повторному нажатию, ссылке, Escape и desktop resize.
- Hero дополнен компактными product badges и CSS-схемой `LINE → Staff / Customer → Dashboard → Operation` без фальшивых screenshots или client logos.
- Header переведён на единый glass/sticky layout, footer основных страниц — на единый brand/navigation layout.
- Добавлены лёгкие entrance/reveal animations на CSS и IntersectionObserver. Контент остаётся видимым при отказе JS; `prefers-reduced-motion` учитывается.
- Уплотнена mobile-композиция, устранена горизонтальная навигационная лента и добавлено управление overflow.

Ограничения и безопасность:

- Framework, backend, build tools, CDN и внешние библиотеки не добавлялись.
- Новые legal/security claims не добавлялись; legal draft disclaimers сохранены.
- Browser visual QA выполнить не удалось из-за недоступности browser connection. Рекомендуется ручная проверка desktop/mobile перед commit.
- Изменения Phase 1.7 не закоммичены и не отправлены.

## Риски

- Юридические страницы — черновики и требуют юридической проверки.
- Backend формы обратной связи пока отсутствует.
- Production deployment пока не проверен.
- Так как `/old` отсутствует, старые assets и portfolio полностью не мигрированы; старый сайт остаётся внешней справкой.
- Нельзя заявлять:導入実績多数, LINE公式認定, ISO/Pマーク, 法定勤怠対応, 給与計算対応.
- Тексты на японском требуют финальной редакторской проверки перед публикацией.

## Следующий шаг

- Финальная визуальная полировка в реальных браузерах и на мобильных устройствах.
- Настроить и проверить deploy через Vercel или GitHub Pages.
- Провести редакторскую проверку японских текстов.
- Реализовать production contact form после выбора backend/форм-провайдера.
- Перед production use провести юридическую проверку всех policy pages.
