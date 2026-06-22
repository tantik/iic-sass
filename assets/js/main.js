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
    var submitButton = document.getElementById('contactSubmit');
    var submitDefaultLabel = submitButton ? submitButton.textContent : '送信する';
    var startedAtField = contactForm.elements['started_at'];
    var MESSAGE_MAX = 1200;
    var SUCCESS_TEXT = 'お問い合わせありがとうございます。\n内容を確認のうえ、ご連絡いたします。';
    var ERROR_TEXT = '送信できませんでした。時間をおいて再度お試しいただくか、izumi@izumiit.com まで直接ご連絡ください。';

    if (startedAtField) startedAtField.value = String(Date.now());

    function setFormMessage(text, kind) {
      if (!formMessage) return;
      formMessage.textContent = text;
      formMessage.hidden = false;
      formMessage.classList.toggle('is-error', kind === 'error');
      formMessage.classList.toggle('is-success', kind === 'success');
      formMessage.classList.toggle('is-info', kind === 'info');
      if (typeof formMessage.focus === 'function') formMessage.focus();
    }

    function fieldValue(name) {
      var el = contactForm.elements[name];
      if (!el) return '';
      return (el.value || '').toString().trim();
    }

    function setSending(isSending) {
      if (!submitButton) return;
      submitButton.disabled = isSending;
      submitButton.classList.toggle('is-loading', isSending);
      submitButton.textContent = isSending ? '送信中…' : submitDefaultLabel;
    }

    var requiredFields = [
      { name: 'name', label: 'お名前' },
      { name: 'company', label: '会社名・店舗名' },
      { name: 'email', label: 'メールアドレス' },
      { name: 'message', label: '現在の課題・相談内容' }
    ];

    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();

      var missing = [];
      var firstMissingEl = null;
      requiredFields.forEach(function (field) {
        if (!fieldValue(field.name)) {
          missing.push(field.label);
          if (!firstMissingEl) firstMissingEl = contactForm.elements[field.name];
        }
      });

      if (missing.length) {
        setFormMessage('次の必須項目をご入力ください：' + missing.join('、'), 'error');
        if (firstMissingEl && typeof firstMissingEl.focus === 'function') firstMissingEl.focus();
        return;
      }

      var email = fieldValue('email');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setFormMessage('メールアドレスの形式をご確認ください。', 'error');
        if (contactForm.elements.email) contactForm.elements.email.focus();
        return;
      }

      if (fieldValue('message').length > MESSAGE_MAX) {
        setFormMessage('相談内容は' + MESSAGE_MAX + '文字以内でご入力ください。', 'error');
        if (contactForm.elements.message) contactForm.elements.message.focus();
        return;
      }

      var consent = contactForm.elements['privacy_consent'];
      if (!consent || !consent.checked) {
        setFormMessage('プライバシーポリシーへの同意が必要です。', 'error');
        if (consent && typeof consent.focus === 'function') consent.focus();
        return;
      }

      setSending(true);
      setFormMessage('送信しています。少々お待ちください。', 'info');

      var payload = new FormData(contactForm);
      if (!payload.get('access_key')) {
        var accessKeyField = contactForm.elements['access_key'];
        if (accessKeyField && accessKeyField.value) payload.append('access_key', accessKeyField.value);
      }
      var hasService = contactForm.querySelectorAll('input[name="service[]"]:checked').length > 0;
      if (!hasService) {
        payload.append('service', '未選択');
      }

      var isWeb3Forms = /(^|\.)web3forms\.com/i.test(contactForm.action);

      fetch(contactForm.action, {
        method: 'POST',
        body: payload,
        headers: { 'Accept': 'application/json' }
      }).then(function (response) {
        var contentType = response.headers.get('content-type') || '';
        if (contentType.indexOf('application/json') !== -1) {
          return response.json().then(function (data) {
            return { ok: response.ok, status: response.status, data: data };
          }, function () {
            return { ok: response.ok, status: response.status, data: null };
          });
        }
        return { ok: response.ok, status: response.status, data: null };
      }).then(function (result) {
        var data = result.data;
        var explicitSuccess = result.ok && data && (data.success === true || data.ok === true);
        var explicitFailure = !result.ok || (data && data.success === false);
        // Web3Forms can deliver successfully while returning a non-JSON/empty
        // body, so an OK response without an explicit failure counts as success.
        var web3FormsSoftSuccess = isWeb3Forms && result.ok && !data;

        if (explicitSuccess || (web3FormsSoftSuccess && !explicitFailure)) {
          contactForm.reset();
          if (startedAtField) startedAtField.value = String(Date.now());
          setFormMessage(SUCCESS_TEXT, 'success');
        } else {
          console.warn('Contact form submission failed', { status: result.status, success: data && data.success });
          setFormMessage(ERROR_TEXT, 'error');
        }
      }, function () {
        console.warn('Contact form submission failed', { status: 0, success: undefined });
        setFormMessage(ERROR_TEXT, 'error');
      }).then(function () {
        setSending(false);
      });
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
