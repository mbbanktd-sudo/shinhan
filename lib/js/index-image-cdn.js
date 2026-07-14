/**
 * Trang chủ offline: ánh xạ ảnh local (CDN Mcredit thường bị chặn khi chạy localhost).
 */
(function (global) {
    'use strict';

    var LOCAL_OK = {
        'image/bell.svg': true,
        'image/search.svg': true,
        'image/user.svg': true,
        'image/icon-check.svg': true,
        'image/logo-mcredit.svg': true,
        'image/promo-loan.svg': true,
        'image/content-fallback.svg': true,
        'image/qr-loan.svg': true,
        'image/Placeholder.svg': true,
        'image/doc.svg': true,
        'image/care.svg': true,
        'image/money.svg': true,
        'image/mbbank/imgi_1_icons-login.svg': true,
        'image/mbbank/imgi_3_logo-blue.svg': true
    };

    var LOCAL_MAP = {
        'content/132838575177542222_b099aacca88b62d53b9a.jpg': 'image/logo-mcredit.svg',
        'image/Placeholder.png': 'image/Placeholder.svg',
        'image/home-page.png': 'image/qr-loan.svg',
        'image/download-app.png': 'image/qr-loan.svg',
        'image/lead-form.png': 'image/qr-loan.svg',
        'image/qr-mcredit.png': 'image/qr-loan.svg',
        'image/doc.png': 'image/doc.svg',
        'image/care.png': 'image/care.svg',
        'image/money.png': 'image/money.svg',
        'image/promo-momo-mcredit.png': 'image/promo-loan.svg',
        'image/default_image.png': 'image/Placeholder.svg',
        'image/six-up1.png': 'image/content-fallback.svg',
        'image/six-up2.png': 'image/content-fallback.svg',
        'image/search1.png': 'image/search.svg',
        'image/search2.png': 'image/search.svg',
        'image/search3.png': 'image/search.svg',
        'image/googlePlay.png': 'https://play.google.com/intl/vi_vn/badges/static/images/badges/vi_badge_web_generic.png',
        'image/appStore.png': 'https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg'
    };

    var PLACEHOLDER = 'image/Placeholder.svg';
    var CONTENT_FALLBACK = 'image/content-fallback.svg';

    function normalizePath(url) {
        if (!url) {
            return '';
        }

        var path = String(url).trim().replace(/^\.\//, '');

        if (/^https?:\/\//i.test(path) || /^data:/i.test(path)) {
            return path;
        }

        if (path.charAt(0) === '/') {
            path = path.slice(1);
        }

        return path.split('?')[0].split('#')[0];
    }

    function resolveMcreditAsset(url) {
        var path = normalizePath(url);

        if (!path || /^https?:\/\//i.test(path) || /^data:/i.test(path)) {
            return url;
        }

        if (LOCAL_OK[path]) {
            return path;
        }

        if (LOCAL_MAP[path]) {
            return LOCAL_MAP[path];
        }

        if (path.indexOf('content/') === 0) {
            return CONTENT_FALLBACK;
        }

        if (path.indexOf('image/') === 0) {
            if (/\.(png|jpe?g|webp|gif)$/i.test(path)) {
                return PLACEHOLDER;
            }
        }

        return url;
    }

    function patchStyleBackground(el) {
        var style = el.getAttribute('style');
        if (!style || style.indexOf('url(') === -1) {
            return;
        }

        var next = style.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/gi, function (_, quote, rawUrl) {
            return 'url("' + resolveMcreditAsset(rawUrl) + '")';
        });

        if (next !== style) {
            el.setAttribute('style', next);
        }
    }

    function attachErrorFallback(img, originalPath) {
        if (img.dataset.localFallbackBound === '1') {
            return;
        }

        img.dataset.localFallbackBound = '1';
        img.dataset.originalAsset = originalPath || normalizePath(img.getAttribute('src') || '');

        img.addEventListener('error', function onImgError() {
            var original = normalizePath(img.dataset.originalAsset || '');
            var fallback = resolveMcreditAsset(original);

            if (fallback === original || img.getAttribute('src') === fallback) {
                if (img.getAttribute('src') !== PLACEHOLDER) {
                    img.src = PLACEHOLDER;
                } else {
                    img.removeEventListener('error', onImgError);
                }
                return;
            }

            img.src = fallback;
        });
    }

    function patchImage(img) {
        ['src', 'data-src'].forEach(function (attr) {
            var value = img.getAttribute(attr);
            if (!value) {
                return;
            }

            var resolved = resolveMcreditAsset(value);
            if (resolved !== value) {
                img.setAttribute(attr, resolved);
            }
        });

        attachErrorFallback(img, normalizePath(img.getAttribute('data-src') || img.getAttribute('src') || ''));
    }

    function patchAllImages(root) {
        (root || document).querySelectorAll('img').forEach(patchImage);
        (root || document).querySelectorAll('[style*="url("]').forEach(patchStyleBackground);
    }

    function observeNewImages() {
        if (!global.MutationObserver) {
            return;
        }

        var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                mutation.addedNodes.forEach(function (node) {
                    if (node.nodeType !== 1) {
                        return;
                    }

                    if (node.tagName === 'IMG') {
                        patchImage(node);
                    }

                    if (node.querySelectorAll) {
                        patchAllImages(node);
                    }
                });
            });
        });

        observer.observe(document.documentElement, { childList: true, subtree: true });
    }

    function init() {
        patchAllImages(document);
        observeNewImages();
    }

    global.resolveMcreditAsset = resolveMcreditAsset;
    global.MCREDIT_PLACEHOLDER_IMAGE = PLACEHOLDER;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})(window);
