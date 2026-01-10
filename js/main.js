/**
 * Bluenode Website - Main JavaScript
 * Handles mobile navigation and smooth scrolling
 */

document.addEventListener('DOMContentLoaded', function() {
    // ===== Mobile Menu Toggle =====
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;

    if (mobileMenuToggle && navMenu) {
        // Toggle menu on button click
        mobileMenuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMenu();
        });

        // Close menu when clicking on a nav link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach((link) => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    closeMenu();
                }
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target);
            const isClickOnToggle = mobileMenuToggle.contains(event.target);

            if (!isClickInsideNav && !isClickOnToggle && navMenu.classList.contains('active')) {
                closeMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMenu();
            }
        });

        // Prevent menu from staying open on resize to desktop
        window.addEventListener('resize', function() {
            if (window.innerWidth >= 1024 && navMenu.classList.contains('active')) {
                closeMenu();
            }
        });
    }

    function toggleMenu() {
        navMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
        body.classList.toggle('menu-open');

        // Update aria-expanded for accessibility
        const isExpanded = navMenu.classList.contains('active');
        mobileMenuToggle.setAttribute('aria-expanded', isExpanded);
    }

    function closeMenu() {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        body.classList.remove('menu-open');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
    }

    // ===== Smooth Scroll for Anchor Links =====
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach((link) => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Skip if href is just "#"
            if (href === '#') {
                e.preventDefault();
                return;
            }

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();

                // Calculate offset for sticky header
                const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Update URL without jumping
                if (history.pushState) {
                    history.pushState(null, null, href);
                } else {
                    window.location.hash = href;
                }

                // Focus the target for accessibility
                target.focus();
                if (target !== document.activeElement) {
                    target.setAttribute('tabindex', '-1');
                    target.focus();
                }
            }
        });
    });

    // ===== Active Navigation Highlighting =====
    // Highlight the current page in navigation
    const pathname = window.location.pathname;
    const currentPage = pathname.split('/').pop() || 'index.html';
    const navMenuLinks = document.querySelectorAll('.nav-menu a');

    // Normalize: treat empty string, '/', and 'index.html' as home page
    const isHomePage = currentPage === '' || currentPage === 'index.html' || pathname === '/' || pathname.endsWith('/');

    navMenuLinks.forEach((link) => {
        const linkPath = link.getAttribute('href');

        // Skip external links or anchor-only links
        if (!linkPath || linkPath.startsWith('http') || linkPath.startsWith('#')) {
            return;
        }

        // Check for home page matches
        if (isHomePage && (linkPath === 'index.html' || linkPath === '/' || linkPath === './')) {
            link.classList.add('active');
            return;
        }

        // Check if this is the current page
        if (linkPath === currentPage) {
            link.classList.add('active');
        }
    });

    // ===== Form Enhancement (if contact forms are added later) =====
    // Placeholder for future form handling
    const forms = document.querySelectorAll('form');
    forms.forEach((form) => {
        form.addEventListener('submit', (e) => {
            // Future: Add form validation or handling here
        });
    });

    // ===== Scroll to Top Behavior =====
    // Add smooth scroll to top for any element with class "scroll-to-top"
    const scrollToTopElements = document.querySelectorAll('.scroll-to-top');

    scrollToTopElements.forEach((element) => {
        element.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    });

    // ===== Accessibility Enhancements =====
    // Set initial aria-expanded state
    if (mobileMenuToggle) {
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
    }

    // Add aria-current to active nav link
    navMenuLinks.forEach((link) => {
        if (link.classList.contains('active')) {
            link.setAttribute('aria-current', 'page');
        }
    });

    // ===== Dark Mode Toggle =====
    const themeSwitch = document.querySelector('.theme-switch__input');
    const html = document.documentElement;

    // Remove no-transition class after initial load
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            html.classList.remove('no-transition');
        });
    });

    // Get preferred theme from localStorage or system preference
    function getPreferredTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme;
        }
        // Check system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    // Apply theme to document
    function applyTheme(theme) {
        html.setAttribute('data-theme', theme);
        if (themeSwitch) {
            themeSwitch.checked = theme === 'dark';
        }
    }

    // Initialize theme (in case inline script didn't run)
    const initialTheme = getPreferredTheme();
    applyTheme(initialTheme);

    // Toggle theme on switch change
    if (themeSwitch) {
        themeSwitch.addEventListener('change', function() {
            const newTheme = this.checked ? 'dark' : 'light';
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        // Only update if user hasn't set a preference
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });

    // ===== Scroll Reveal Animations =====
    // Simple, fast reveal animation for cards and sections
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -30px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe cards and sections for reveal animation
    const revealElements = document.querySelectorAll('.value-card, .pricing-card, .card, .feature-card, .process-step, .trust-stat');
    revealElements.forEach((element, index) => {
        element.classList.add('reveal');
        // Add staggered delay for items in same row
        const delay = (index % 3) * 50;
        element.style.transitionDelay = delay + 'ms';
        observer.observe(element);
    });

    // ===== Mobile Bottom Navigation - More Menu =====
    const moreButton = document.querySelector('.bottom-nav-more');
    const moreMenu = document.getElementById('moreMenu');

    if (moreButton && moreMenu) {
        moreButton.addEventListener('click', function(e) {
            e.stopPropagation();
            const isOpen = moreMenu.classList.contains('active');

            if (isOpen) {
                closeMoreMenu();
            } else {
                openMoreMenu();
            }
        });

        // Close when clicking outside
        document.addEventListener('click', function(event) {
            if (moreMenu && !moreMenu.contains(event.target) && !moreButton.contains(event.target)) {
                closeMoreMenu();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && moreMenu.classList.contains('active')) {
                closeMoreMenu();
            }
        });
    }

    function openMoreMenu() {
        if (moreMenu && moreButton) {
            moreMenu.classList.add('active');
            moreMenu.setAttribute('aria-hidden', 'false');
            moreButton.setAttribute('aria-expanded', 'true');
        }
    }

    function closeMoreMenu() {
        if (moreMenu && moreButton) {
            moreMenu.classList.remove('active');
            moreMenu.setAttribute('aria-hidden', 'true');
            moreButton.setAttribute('aria-expanded', 'false');
        }
    }

    // ===== Active Bottom Nav Highlighting =====
    const bottomNavItems = document.querySelectorAll('.bottom-nav-item:not(.bottom-nav-more)');
    bottomNavItems.forEach((item) => {
        const href = item.getAttribute('href');
        if (href && (href === currentPage || (isHomePage && (href === 'index.html' || href === '/')))) {
            item.classList.add('active');
        }
    });

});
