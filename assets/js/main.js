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
