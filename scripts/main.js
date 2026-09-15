/* ============================================================
   LUXURY DUO CLEANING LLC — Main Script
   Handles: mobile nav, scroll reveal, page transitions,
   form validation, quote form conditional fields.
   ============================================================ */

(function () {
  'use strict';

  /* ============================================================
     MOBILE NAV TOGGLE
     ============================================================ */

  function initMobileNav() {
    const toggle = document.querySelector('.nav__toggle');
    const links = document.querySelector('.nav__links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', function () {
      const isOpen = links.classList.toggle('nav__links--open');
      toggle.classList.toggle('nav__toggle--open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    links.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        links.classList.remove('nav__links--open');
        toggle.classList.remove('nav__toggle--open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on click outside
    document.addEventListener('click', function (e) {
      if (!links.contains(e.target) && !toggle.contains(e.target)) {
        links.classList.remove('nav__links--open');
        toggle.classList.remove('nav__toggle--open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ============================================================
     NAV SCROLL STATE
     ============================================================ */

  function initNavScroll() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          nav.classList.toggle('nav--scrolled', window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  /* ============================================================
     SCROLL REVEAL (Intersection Observer)
     ============================================================ */

  function initScrollReveal() {
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var elements = document.querySelectorAll('[data-reveal]');
    if (!elements.length) return;

    if (prefersReduced) {
      elements.forEach(function (el) { el.classList.add('revealed'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    elements.forEach(function (el) { observer.observe(el); });
  }

  /* ============================================================
     PAGE TRANSITIONS (fetch + pushState)
     ============================================================ */

  var isTransitioning = false;

  function initPageTransitions() {
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var content = document.getElementById('page-content');
    if (!content) return;

    document.addEventListener('click', function (e) {
      var link = e.target.closest('a');
      if (!link || isTransitioning) return;

      var href = link.getAttribute('href');
      if (!href) return;

      // Skip external links, anchors, mailto, tel, javascript
      if (href.startsWith('http') || href.startsWith('mailto:') ||
          href.startsWith('tel:') || href.startsWith('#') ||
          href.startsWith('javascript:')) return;

      // Skip if same page anchor
      if (href.includes('#') && href.split('#')[0] === window.location.pathname.split('/').pop()) return;

      e.preventDefault();
      navigateTo(href, content, prefersReduced);
    });

    // Handle back/forward
    window.addEventListener('popstate', function () {
      navigateTo(window.location.pathname, content, prefersReduced, true);
    });
  }

  function navigateTo(url, content, prefersReduced, isPop) {
    if (isTransitioning) return;
    isTransitioning = true;

    var duration = prefersReduced ? 0 : 300;

    // Fade out
    content.classList.add('transitioning-out');

    setTimeout(function () {
      fetch(url)
        .then(function (res) {
          if (!res.ok) throw new Error('Navigation failed');
          return res.text();
        })
        .then(function (html) {
          var parser = new DOMParser();
          var doc = parser.parseFromString(html, 'text/html');

          // Extract content
          var newContent = doc.getElementById('page-content');
          var newTitle = doc.querySelector('title');

          if (newContent) {
            content.innerHTML = newContent.innerHTML;
          }
          if (newTitle) {
            document.title = newTitle.textContent;
          }

          // Update active nav link
          updateActiveNavLink(url);

          // Re-init components for new content
          initScrollReveal();
          initQuoteFormConditional();

          // Scroll to top
          window.scrollTo(0, 0);

          // Update URL
          if (!isPop) {
            history.pushState({}, '', url);
          }

          // Fade in
          content.classList.remove('transitioning-out');
          content.classList.add('transitioning-in');

          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              content.classList.remove('transitioning-in');
              isTransitioning = false;
            });
          });
        })
        .catch(function () {
          // Fallback: normal navigation
          window.location.href = url;
          isTransitioning = false;
        });
    }, duration);
  }

  function updateActiveNavLink(url) {
    var filename = url.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav__link').forEach(function (link) {
      var linkHref = link.getAttribute('href');
      var linkFilename = linkHref.split('/').pop();
      link.classList.toggle('nav__link--active', linkFilename === filename);
    });
  }

  /* ============================================================
     FORM VALIDATION
     ============================================================ */

  function initFormValidation() {
    document.querySelectorAll('form[data-validate]').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        var valid = true;

        // Clear previous errors
        form.querySelectorAll('.form-group--error').forEach(function (g) {
          g.classList.remove('form-group--error');
        });

        // Check required fields
        form.querySelectorAll('[required]').forEach(function (field) {
          if (!field.value.trim()) {
            valid = false;
            field.closest('.form-group').classList.add('form-group--error');
          }
        });

        // Check email format
        form.querySelectorAll('input[type="email"]').forEach(function (field) {
          if (field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
            valid = false;
            field.closest('.form-group').classList.add('form-group--error');
          }
        });

        // Check phone format (basic)
        form.querySelectorAll('input[type="tel"]').forEach(function (field) {
          if (field.value && !/^[\d\s\-\+\(\)]{7,}$/.test(field.value)) {
            valid = false;
            field.closest('.form-group').classList.add('form-group--error');
          }
        });

        if (!valid) {
          e.preventDefault();
          // Scroll to first error
          var firstError = form.querySelector('.form-group--error');
          if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      });
    });
  }

  /* ============================================================
     QUOTE FORM — CONDITIONAL FIELDS
     ============================================================ */

  function initQuoteFormConditional() {
    var serviceSelect = document.getElementById('service-type');
    var constructionFields = document.getElementById('construction-fields');
    if (!serviceSelect || !constructionFields) return;

    function toggleFields() {
      var isConstruction = serviceSelect.value === 'pre-post-construction';
      constructionFields.classList.toggle('form-hidden', !isConstruction);
      // Make construction fields required only when visible
      constructionFields.querySelectorAll('input').forEach(function (input) {
        input.required = isConstruction;
      });
    }

    serviceSelect.addEventListener('change', toggleFields);
    toggleFields(); // Init on load
  }

  /* ============================================================
     SMOOTH SCROLL FOR ANCHOR LINKS
     ============================================================ */

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;

        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          var navHeight = document.querySelector('.nav') ? document.querySelector('.nav').offsetHeight : 0;
          var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
          window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
      });
    });
  }

  /* ============================================================
     TESTIMONIAL CAROUSEL
     ============================================================ */

  function initTestimonialCarousel() {
    var carousels = document.querySelectorAll('.testimonial-carousel');

    carousels.forEach(function (carousel) {
      var groups = carousel.querySelectorAll('.testimonial-carousel__group');
      var dots = carousel.querySelectorAll('.testimonial-carousel__dot');
      var nextBtn = carousel.querySelector('.testimonial-carousel__arrow--next');
      var prevBtn = carousel.querySelector('.testimonial-carousel__arrow--prev');
      var current = 0;
      var total = groups.length;
      var isAnimating = false;

      function goTo(index) {
        if (isAnimating || index === current) return;
        isAnimating = true;

        groups[current].classList.remove('testimonial-carousel__group--active');
        dots[current].classList.remove('testimonial-carousel__dot--active');

        current = ((index % total) + total) % total;

        groups[current].classList.add('testimonial-carousel__group--active');
        dots[current].classList.add('testimonial-carousel__dot--active');

        setTimeout(function () {
          isAnimating = false;
        }, 400);
      }

      function next() {
        goTo(current + 1);
      }

      function prev() {
        goTo(current - 1);
      }

      if (nextBtn) nextBtn.addEventListener('click', next);
      if (prevBtn) prevBtn.addEventListener('click', prev);

      dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () {
          goTo(i);
        });
      });
    });
  }

  /* ============================================================
     ROUND CAROUSEL (3D rotating disc)
     ============================================================ */

  function initRoundCarousel() {
    var carousel = document.querySelector('[data-carousel-round]');
    if (!carousel) return;

    var disc = carousel.querySelector('.round-carousel__disc');
    var items = carousel.querySelectorAll('.round-carousel__item');
    var dots = carousel.querySelectorAll('.round-carousel__dot');
    var prevBtn = carousel.querySelector('.round-carousel__prev');
    var nextBtn = carousel.querySelector('.round-carousel__next');
    var total = items.length;
    var angleStep = 360 / total;
    var current = 0;
    var isAnimating = false;

    // Position items in a circle
    items.forEach(function (item, i) {
      var angle = i * angleStep;
      item.style.transform = 'rotateY(' + angle + 'deg) translateZ(200px)';
    });

    function updateActive() {
      items.forEach(function (item, i) {
        var itemAngle = (i * angleStep - current * angleStep) % 360;
        if (itemAngle < -180) itemAngle += 360;
        if (itemAngle > 180) itemAngle -= 360;

        var isCenter = Math.abs(itemAngle) < 1;
        var isNeighbor = Math.abs(Math.abs(itemAngle) - angleStep) < 1;

        item.classList.toggle('round-carousel__item--active', isCenter);
        item.classList.toggle('round-carousel__item--neighbor', isNeighbor);
        item.classList.toggle('round-carousel__item--hidden', !isCenter && !isNeighbor);
      });

      dots.forEach(function (dot, i) {
        dot.classList.toggle('round-carousel__dot--active', i === current);
      });
    }

    function rotateTo(index) {
      if (isAnimating) return;
      isAnimating = true;
      current = ((index % total) + total) % total;

      disc.style.transform = 'rotateY(' + (-current * angleStep) + 'deg)';
      updateActive();

      setTimeout(function () {
        isAnimating = false;
      }, 600);
    }

    function next() {
      rotateTo(current + 1);
    }

    function prev() {
      rotateTo(current - 1);
    }

    if (nextBtn) nextBtn.addEventListener('click', next);
    if (prevBtn) prevBtn.addEventListener('click', prev);

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        rotateTo(i);
      });
    });

    // Set initial state
    updateActive();
  }

  /* ============================================================
     INIT
     ============================================================ */

  function init() {
    initMobileNav();
    initNavScroll();
    initScrollReveal();
    initPageTransitions();
    initFormValidation();
    initQuoteFormConditional();
    initSmoothScroll();
    initTestimonialCarousel();
    initRoundCarousel();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
