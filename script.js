/* ============================================
   Uplands Spelmansförbund — Shared JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Hamburger menu ---
  const hamburger = document.querySelector('.hamburger');
  const navList = document.querySelector('.nav-list');

  if (hamburger && navList) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      navList.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu on link click
    navList.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navList.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navList.classList.contains('open')) {
        hamburger.classList.remove('open');
        navList.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        hamburger.focus();
      }
    });
  }

  // --- Header scroll effect ---
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // --- Scroll reveal ---
  const revealElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-stagger');
  if (revealElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  }

  // --- Calendar: upcoming vs past ---
  // Each .event-item carries data-date="YYYY-MM-DD". Upcoming events are sorted
  // soonest first; events are moved to "Tidigare evenemang" the day after they
  // happen, newest first. For testing, ?idag=YYYY-MM-DD overrides today's date.
  const upcomingList = document.getElementById('events-upcoming');
  const pastBox = document.querySelector('.events-past');
  const pastList = document.querySelector('.events-past-list');
  const pastCount = document.querySelector('.events-past-count');
  const emptyMsg = document.querySelector('.events-empty');
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];

  const parseLocalDate = (str) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(str || '');
    return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
  };

  const refreshCalendarState = () => {
    if (!upcomingList) return;
    const isShown = (el) => el.style.display !== 'none';
    const visibleUpcoming = [...upcomingList.querySelectorAll('.event-item')].filter(isShown).length;
    const allPast = pastList ? [...pastList.querySelectorAll('.event-item')] : [];
    const visiblePast = allPast.filter(isShown).length;
    if (emptyMsg) emptyMsg.hidden = visibleUpcoming > 0;
    if (pastCount) pastCount.textContent = visiblePast;
    if (pastBox) pastBox.hidden = visiblePast === 0;
  };

  if (upcomingList) {
    const today = parseLocalDate(new URLSearchParams(location.search).get('idag')) || new Date();
    today.setHours(0, 0, 0, 0);

    const dated = [...document.querySelectorAll('.event-item[data-date]')]
      .map(el => ({ el, date: parseLocalDate(el.dataset.date) }))
      .filter(e => e.date);

    dated.forEach(({ el, date }) => {
      const badge = el.querySelector('.event-date-badge');
      if (!badge) return;
      const set = (cls, text) => {
        let span = badge.querySelector('.' + cls);
        if (!span) {
          span = document.createElement('span');
          span.className = cls;
          badge.appendChild(span);
        }
        span.textContent = text;
      };
      set('day', date.getDate());
      set('month', MONTHS[date.getMonth()]);
      set('year', date.getFullYear());
    });

    const upcoming = dated.filter(e => e.date >= today).sort((a, b) => a.date - b.date);
    const past = dated.filter(e => e.date < today).sort((a, b) => b.date - a.date);

    upcoming.forEach(({ el }) => upcomingList.appendChild(el));
    if (pastList) past.forEach(({ el }) => pastList.appendChild(el));

    refreshCalendarState();

    // Links like kalendarium.html#oktoberstamman-2027: the browser jumps before
    // the list is reordered, so jump again (opening the history if needed).
    const target = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target && target.classList.contains('event-item')) {
      if (pastBox && pastBox.contains(target)) pastBox.open = true;
      requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
    }
  }

  // --- Calendar filter ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const eventItems = document.querySelectorAll('.event-item');

  if (filterBtns.length > 0 && eventItems.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        eventItems.forEach(item => {
          if (filter === 'alla' || item.dataset.category === filter) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
        refreshCalendarState();
      });
    });
  }

  // --- Lightbox ---
  const lightbox = document.querySelector('.lightbox');
  const lightboxContent = document.querySelector('.lightbox-content');
  const lightboxClose = document.querySelector('.lightbox-close');
  const galleryItems = document.querySelectorAll('.masonry-item');

  if (lightbox && galleryItems.length > 0) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const placeholder = item.querySelector('.gallery-placeholder');
        if (placeholder) {
          // Clone the placeholder content into lightbox
          lightboxContent.innerHTML = '';
          const clone = placeholder.cloneNode(true);
          clone.style.width = '600px';
          clone.style.maxWidth = '90vw';
          clone.style.borderRadius = '8px';
          lightboxContent.appendChild(clone);
        }
        const img = item.querySelector('img');
        if (img) {
          lightboxContent.innerHTML = '';
          const imgClone = img.cloneNode(true);
          imgClone.style.maxWidth = '90vw';
          imgClone.style.maxHeight = '85vh';
          imgClone.style.borderRadius = '8px';
          lightboxContent.appendChild(imgClone);
        }
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
        lightboxClose.focus();
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    };

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) {
        closeLightbox();
      }
    });
  }

  // --- Active nav link ---
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-list a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
      // Highlight the parent menu (e.g. "Medlemskap") when on one of its pages
      const parentToggle = link.closest('.has-submenu')?.querySelector('.submenu-toggle');
      if (parentToggle) parentToggle.classList.add('active');
    }
  });

  // --- Submenus (e.g. Medlemskap) ---
  document.querySelectorAll('.has-submenu').forEach(item => {
    const toggle = item.querySelector('.submenu-toggle');
    if (!toggle) return;

    const setOpen = (open) => {
      item.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open);
    };

    toggle.addEventListener('click', () => setOpen(!item.classList.contains('open')));

    document.addEventListener('click', (e) => {
      if (!item.contains(e.target)) setOpen(false);
    });

    item.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && item.classList.contains('open')) {
        e.stopPropagation();
        setOpen(false);
        toggle.focus();
      }
    });

    item.addEventListener('focusout', (e) => {
      if (!item.contains(e.relatedTarget)) setOpen(false);
    });
  });

});
