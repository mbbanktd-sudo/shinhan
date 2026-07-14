/**
 * MCredit Index - Mobile interactions
 */
(function () {
    'use strict';

    var MOBILE_BREAKPOINT = 991;

    function isMobileView() {
        return window.innerWidth <= MOBILE_BREAKPOINT;
    }

    function getMenu() {
        return document.getElementById('collapseMenuMob');
    }

    function setMenuOpen(open) {
        var menu = getMenu();
        var toggle = document.getElementById('mobileMenuToggle');
        if (!menu) return;

        if (open) {
            menu.classList.add('show');
            document.body.classList.add('menu-open');
        } else {
            menu.classList.remove('show');
            document.body.classList.remove('menu-open');
        }

        if (toggle) {
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        }
    }

    function toggleMenu() {
        var menu = getMenu();
        if (!menu) return;
        setMenuOpen(!menu.classList.contains('show'));
    }

    function initMenuToggle() {
        var toggle = document.getElementById('mobileMenuToggle');
        if (!toggle) return;

        toggle.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu();
        });

        document.addEventListener('click', function (e) {
            var menu = getMenu();
            if (!menu || !menu.classList.contains('show')) return;
            if (menu.contains(e.target) || toggle.contains(e.target)) return;
            setMenuOpen(false);
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') setMenuOpen(false);
        });

        menuDropdownLinks();
    }

    function menuDropdownLinks() {
        document.querySelectorAll('#collapseMenuMob .menu-mobile-item > a').forEach(function (link) {
            var icon = link.parentElement.querySelector('.fa-angle-down');
            if (!icon) return;

            icon.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var target = icon.getAttribute('href');
                if (!target) return;
                var panel = document.querySelector(target);
                if (panel) {
                    panel.classList.toggle('show');
                    icon.setAttribute('aria-expanded', panel.classList.contains('show') ? 'true' : 'false');
                }
            });
        });
    }

    function initMobileSearch() {
        var btn = document.getElementById('mobileSearchBtn');
        var wrap = document.querySelector('.header-mobile .hd-search');
        var input = document.getElementById('search-box-mobile');

        if (btn && wrap) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                wrap.classList.toggle('is-open');
                if (wrap.classList.contains('is-open') && input) {
                    input.focus();
                }
            });
        }

        if (input) {
            input.addEventListener('keyup', function (event) {
                if (event.key === 'Enter') {
                    var value = event.target.value.trim();
                    if (value) {
                        window.location.href = 'https://mcredit.com.vn/vi/tim-kiem?key=' + encodeURIComponent(value);
                    }
                }
            });
        }
    }

    function fixViewportHeight() {
        var setVH = function () {
            document.documentElement.style.setProperty('--vh', (window.innerHeight * 0.01) + 'px');
        };
        setVH();
        window.addEventListener('resize', setVH);
        window.addEventListener('orientationchange', setVH);
    }

    function patchMobileMenuLinks() {
        var menu = getMenu();
        if (!menu) return;

        var localLinks = {
            'san-pham': 'vi/vay-tien-mat/index.html',
            'https://mcredit.com.vn/vi/vay-tien-mat': 'vi/vay-tien-mat/index.html',
            'https://mcredit.com.vn/vi/vay-tra-gop': 'vi/vay-tra-gop/index.html',
            'https://mcredit.com.vn/vi/the-tin-dung': 'vi/the-tin-dung/index.html'
        };

        menu.querySelectorAll('a[href]').forEach(function (a) {
            var href = a.getAttribute('href');
            if (localLinks[href]) {
                a.setAttribute('href', localLinks[href]);
            }
        });

        var productsItem = menu.querySelector('.menu-mobile-item a[href="san-pham"], .menu-mobile-item a[href="vi/vay-tien-mat/index.html"]');
        if (productsItem && !menu.querySelector('.menu-mobile-item a[href="pages/step1.html"]')) {
            var li = document.createElement('li');
            li.className = 'menu-mobile-item current';
            li.innerHTML = '<a href="pages/step1.html">Đăng ký vay</a>';
            var ul = menu.querySelector('.menu-mobile > ul');
            if (ul) ul.insertBefore(li, ul.firstChild);
        }
    }

    function onResize() {
        if (!isMobileView()) {
            setMenuOpen(false);
            var wrap = document.querySelector('.header-mobile .hd-search');
            if (wrap) wrap.classList.remove('is-open');
        }
    }

    function init() {
        fixViewportHeight();
        initMenuToggle();
        initMobileSearch();
        patchMobileMenuLinks();
        window.addEventListener('resize', onResize);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
