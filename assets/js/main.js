document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.nav');
  var backdrop;
  var scrollLockY = 0;

  function lockBodyScroll() {
    scrollLockY = window.scrollY || window.pageYOffset || 0;
    document.body.style.top = (-scrollLockY) + 'px';
    document.body.classList.add('menu-open');
  }

  function unlockBodyScroll() {
    if (!document.body.classList.contains('menu-open')) return;
    document.body.classList.remove('menu-open');
    document.body.style.top = '';
    window.scrollTo(0, scrollLockY);
  }

  function closeMenu() {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'メニューを開く');
    nav.classList.remove('is-open');
    if (backdrop) backdrop.classList.remove('is-visible');
    unlockBodyScroll();
    if (document.activeElement && nav.contains(document.activeElement)) toggle.focus();
  }

  if (toggle && nav) {
    backdrop = document.createElement('button');
    backdrop.type = 'button';
    backdrop.className = 'nav-backdrop';
    backdrop.tabIndex = -1;
    backdrop.setAttribute('aria-label', 'メニューを閉じる');
    document.body.appendChild(backdrop);

    toggle.addEventListener('click', function () {
      var isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'メニューを開く' : 'メニューを閉じる');
      nav.classList.toggle('is-open', !isOpen);
      backdrop.classList.toggle('is-visible', !isOpen);
      if (!isOpen) {
        lockBodyScroll();
        var firstLink = nav.querySelector('a');
        if (firstLink) firstLink.focus();
      } else {
        unlockBodyScroll();
      }
    });

    backdrop.addEventListener('click', closeMenu);
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeMenu();
      if (event.key === 'Tab' && toggle.getAttribute('aria-expanded') === 'true' && window.innerWidth < 820) {
        var focusable = [toggle].concat(Array.from(nav.querySelectorAll('a[href]')));
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 820) closeMenu();
    });
  }

  var contactForm = document.getElementById('contactInquiryForm');
  if (contactForm) {
    var formMessage = document.getElementById('contactFormMessage');
    var MAILTO_SAFE_LENGTH = 1900;
    var MAIL_TO = 'izumi@izumiit.com';
    var MAIL_CC = 'konstantin.chvykov@gmail.com';
    var MAIL_SUBJECT = 'LINE Business OS 導入相談';

    function setFormMessage(text, kind) {
      if (!formMessage) return;
      formMessage.textContent = text;
      formMessage.hidden = false;
      formMessage.classList.toggle('is-error', kind === 'error');
      formMessage.classList.toggle('is-info', kind !== 'error');
    }

    function fieldValue(name) {
      var el = contactForm.elements[name];
      if (!el) return '';
      return (el.value || '').toString().trim();
    }

    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();

      var name = fieldValue('name');
      var company = fieldValue('company');
      var email = fieldValue('email');
      var message = fieldValue('message');

      var missing = [];
      if (!name) missing.push('お名前');
      if (!company) missing.push('会社名・店舗名');
      if (!email) missing.push('メールアドレス');
      if (!message) missing.push('現在の課題・相談内容');

      if (missing.length) {
        setFormMessage('次の必須項目をご入力ください：' + missing.join('、'), 'error');
        var firstMissing = contactForm.elements[
          !name ? 'name' : !company ? 'company' : !email ? 'email' : 'message'
        ];
        if (firstMissing && typeof firstMissing.focus === 'function') firstMissing.focus();
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setFormMessage('メールアドレスの形式をご確認ください。', 'error');
        if (contactForm.elements.email) contactForm.elements.email.focus();
        return;
      }

      var services = [];
      var serviceInputs = contactForm.querySelectorAll('input[name="service"]:checked');
      serviceInputs.forEach(function (input) { services.push(input.value); });

      function orUnselected(value) { return value ? value : '未選択'; }

      var bodyLines = [
        'LINE Business OS 導入相談',
        '',
        'お名前: ' + name,
        '会社名・店舗名: ' + company,
        'メールアドレス: ' + email,
        '電話番号: ' + (fieldValue('phone') || '未記入'),
        '業種: ' + orUnselected(fieldValue('business_type')),
        '店舗数: ' + orUnselected(fieldValue('store_count')),
        'スタッフ数: ' + orUnselected(fieldValue('staff_count')),
        '興味のあるサービス: ' + (services.length ? services.join('、') : '未選択'),
        'LINE公式アカウント: ' + orUnselected(fieldValue('line_official')),
        '希望する導入時期: ' + orUnselected(fieldValue('timeline')),
        '',
        '現在の課題・相談内容:',
        message
      ];

      var mailto = 'mailto:' + MAIL_TO +
        '?cc=' + encodeURIComponent(MAIL_CC) +
        '&subject=' + encodeURIComponent(MAIL_SUBJECT) +
        '&body=' + encodeURIComponent(bodyLines.join('\n'));

      if (mailto.length > MAILTO_SAFE_LENGTH) {
        setFormMessage('相談内容が長いため、メールアプリを開けない場合があります。お手数ですが内容を少し短くしてからお試しください。', 'error');
        if (contactForm.elements.message) contactForm.elements.message.focus();
        return;
      }

      setFormMessage('メールアプリを開きます。内容をご確認のうえ送信してください。開かない場合は ' + MAIL_TO + ' まで直接ご連絡ください。', 'info');
      window.location.href = mailto;
    });
  }

  document.querySelectorAll('.faq').forEach(function (faq) {
    faq.classList.add('faq-ready');
  });

  document.querySelectorAll('.faq-question').forEach(function (question) {
    question.addEventListener('click', function () {
      var item = question.closest('.faq-item');
      var icon = question.querySelector('.faq-icon');
      var isOpen = question.getAttribute('aria-expanded') === 'true';
      question.setAttribute('aria-expanded', String(!isOpen));
      item.classList.toggle('is-open', !isOpen);
      if (icon) icon.textContent = isOpen ? '＋' : '×';
    });
  });

  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var revealItems = document.querySelectorAll('.section, .card, .price-card, .trust-card, .workflow-card, .compare-card, .mockup-card, .hero-panel');

    function revealAll() {
      revealItems.forEach(function (item) {
        item.classList.add('is-visible');
      });
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -36px' });

    revealItems.forEach(function (item, index) {
      item.classList.add('reveal', 'reveal-pending');
      item.style.setProperty('--reveal-delay', Math.min(index % 4, 3) * 70 + 'ms');
      observer.observe(item);
    });

    // Safety fallback: never leave any section hidden (e.g. full-page
    // screenshot tools that don't scroll, or a stalled observer).
    window.setTimeout(revealAll, 2600);
  }
});
