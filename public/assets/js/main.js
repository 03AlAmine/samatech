
(function () {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');

    if (!selectHeader) return; // ✅ correction clé

    if (
      !selectHeader.classList.contains('scroll-up-sticky') &&
      !selectHeader.classList.contains('sticky-top') &&
      !selectHeader.classList.contains('fixed-top')
    ) return;

    window.scrollY > 100
      ? selectBody.classList.add('scrolled')
      : selectBody.classList.remove('scrolled');
  }


  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function (e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function (isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function () {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function (filters) {
      filters.addEventListener('click', function () {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

})();
// Navigation interactive
document.addEventListener('DOMContentLoaded', function () {
  const header = document.querySelector('.site-header');
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNav = document.querySelector('.site-navigation');
  const mobileOverlay = document.querySelector('.mobile-nav-overlay');
  const navLinks = document.querySelectorAll('.nav-link');

  // 1. Détection automatique de la page active
  function setActiveNav() {
    // Récupérer le nom de la page actuelle
    const currentPage = getCurrentPageName();

    // Retirer toutes les classes active
    navLinks.forEach(link => {
      link.classList.remove('active');
    });

    // Trouver et activer le lien correspondant
    navLinks.forEach(link => {
      const pageName = link.getAttribute('data-page');
      if (pageName === currentPage) {
        link.classList.add('active');
      }
    });

    // Fallback si aucune correspondance
    if (!document.querySelector('.nav-link.active') && currentPage === 'index') {
      const homeLink = document.querySelector('[data-page="index"]');
      if (homeLink) homeLink.classList.add('active');
    }
  }

  // 2. Fonction pour extraire le nom de la page
  function getCurrentPageName() {
    const path = window.location.pathname;
    const page = path.split("/").pop();

    // Cas spéciaux
    if (!page || page === '' || page === 'index.html' || page === 'index.htm' || page === 'index.php') {
      return 'index';
    }

    // Extraire le nom sans extension
    const pageName = page.replace('.html', '')
      .replace('.htm', '')
      .replace('.php', '')
      .toLowerCase();

    return pageName;
  }

  // 3. Gestion du scroll pour l'effet de header
  function handleScroll() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  // 4. Gestion du toggle mobile
  function setupMobileNav() {
    mobileToggle.addEventListener('click', function () {
      mobileNav.classList.toggle('active');
      mobileOverlay.classList.toggle('active');
      document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';

      // Animation de l'icône
      const icon = this.querySelector('i');
      if (mobileNav.classList.contains('active')) {
        icon.classList.remove('bi-list');
        icon.classList.add('bi-x');
      } else {
        icon.classList.remove('bi-x');
        icon.classList.add('bi-list');
      }
    });

    // Fermer le menu mobile en cliquant sur l'overlay
    mobileOverlay.addEventListener('click', function () {
      mobileNav.classList.remove('active');
      this.classList.remove('active');
      document.body.style.overflow = '';

      const icon = mobileToggle.querySelector('i');
      icon.classList.remove('bi-x');
      icon.classList.add('bi-list');
    });

    // Fermer le menu mobile en cliquant sur un lien
    navLinks.forEach(link => {
      link.addEventListener('click', function () {
        if (window.innerWidth < 1200) {
          mobileNav.classList.remove('active');
          mobileOverlay.classList.remove('active');
          document.body.style.overflow = '';

          const icon = mobileToggle.querySelector('i');
          icon.classList.remove('bi-x');
          icon.classList.add('bi-list');
        }
      });
    });
  }

  // 5. Animation au survol des liens (desktop seulement)
  function setupHoverEffects() {
    navLinks.forEach(link => {
      link.addEventListener('mouseenter', function () {
        if (window.innerWidth >= 1200) {
          this.style.transform = 'translateY(-5px)';
        }
      });

      link.addEventListener('mouseleave', function () {
        if (window.innerWidth >= 1200) {
          this.style.transform = 'translateY(0)';
        }
      });
    });
  }

  // 6. Initialisation
  function initNavigation() {
    // Définir la page active
    setActiveNav();

    // Configurer les événements de scroll
    window.addEventListener('scroll', handleScroll);

    // Appliquer l'état initial
    handleScroll();

    // Configurer la navigation mobile
    setupMobileNav();

    // Configurer les effets de survol
    setupHoverEffects();
  }

  // Démarrer l'initialisation
  initNavigation();
});
