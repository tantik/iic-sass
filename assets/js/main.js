document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.nav');
  var backdrop;

  function closeMenu() {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'メニューを開く');
    nav.classList.remove('is-open');
    if (backdrop) backdrop.classList.remove('is-visible');
    document.body.classList.remove('menu-open');
  }

  if (toggle && nav) {
    backdrop = document.createElement('button');
    backdrop.type = 'button';
    backdrop.className = 'nav-backdrop';
    backdrop.setAttribute('aria-label', 'メニューを閉じる');
    document.body.appendChild(backdrop);

    toggle.addEventListener('click', function () {
      var isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'メニューを開く' : 'メニューを閉じる');
      nav.classList.toggle('is-open', !isOpen);
      backdrop.classList.toggle('is-visible', !isOpen);
      document.body.classList.toggle('menu-open', !isOpen);
    });

    backdrop.addEventListener('click', closeMenu);
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeMenu();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 820) closeMenu();
    });
  }

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
    var revealItems = document.querySelectorAll('.section, .card, .price-card, .trust-card, .hero-panel');
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
  }
});
