/**
 * Trang chủ: popup khuyến mãi + ảnh partner → đăng ký vay step1
 */
(function () {
    'use strict';

    var STEP1_URL = 'pages/step1.html';
    var PROMO_IMAGE = 'image/promo-loan.svg';
    var PROMO_IMAGE_FALLBACK = 'image/content-fallback.svg';

    function goToStep1(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        window.location.href = STEP1_URL;
    }

    function injectPromoPopupStyles() {
        if (document.getElementById('mcredit-promo-popup-styles')) {
            return;
        }

        var style = document.createElement('style');
        style.id = 'mcredit-promo-popup-styles';
        style.textContent = [
            '#mcreditPromoPopup {',
            '  position: fixed;',
            '  inset: 0;',
            '  z-index: 100000;',
            '  display: flex;',
            '  align-items: center;',
            '  justify-content: center;',
            '  padding: 16px;',
            '  background: rgba(0, 0, 0, 0.65);',
            '  opacity: 0;',
            '  visibility: hidden;',
            '  transition: opacity 0.25s ease, visibility 0.25s ease;',
            '}',
            '#mcreditPromoPopup.is-visible {',
            '  opacity: 1;',
            '  visibility: visible;',
            '}',
            '#mcreditPromoPopup .promo-popup-panel {',
            '  position: relative;',
            '  max-width: min(92vw, 520px);',
            '  width: 100%;',
            '}',
            '#mcreditPromoPopup .promo-popup-link {',
            '  display: block;',
            '  cursor: pointer;',
            '  border-radius: 12px;',
            '  overflow: hidden;',
            '  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);',
            '}',
            '#mcreditPromoPopup .promo-popup-link img {',
            '  display: block;',
            '  width: 100%;',
            '  height: auto;',
            '}',
            '#mcreditPromoPopup .promo-popup-close {',
            '  position: absolute;',
            '  top: -12px;',
            '  right: -12px;',
            '  width: 36px;',
            '  height: 36px;',
            '  border: 0;',
            '  border-radius: 50%;',
            '  background: #fff;',
            '  color: #333;',
            '  font-size: 24px;',
            '  line-height: 1;',
            '  cursor: pointer;',
            '  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);',
            '}'
        ].join('\n');
        document.head.appendChild(style);
    }

    function closePromoPopup() {
        var popup = document.getElementById('mcreditPromoPopup');
        if (!popup) {
            return;
        }
        popup.classList.remove('is-visible');
        document.body.style.overflow = '';
    }

    function showPromoPopup() {
        injectPromoPopupStyles();

        var popup = document.getElementById('mcreditPromoPopup');
        if (!popup) {
            popup = document.createElement('div');
            popup.id = 'mcreditPromoPopup';
            popup.setAttribute('role', 'dialog');
            popup.setAttribute('aria-modal', 'true');
            popup.setAttribute('aria-label', 'Khuyến mãi Mcredit MoMo');
            popup.innerHTML = [
                '<div class="promo-popup-panel">',
                '  <button type="button" class="promo-popup-close" aria-label="Đóng">&times;</button>',
                '  <a class="promo-popup-link" href="' + STEP1_URL + '">',
                '    <img src="' + PROMO_IMAGE + '" data-fallback="' + PROMO_IMAGE_FALLBACK + '" alt="Khuyến mãi Mcredit - Đăng ký vay">',
                '  </a>',
                '</div>'
            ].join('');
            document.body.appendChild(popup);

            popup.querySelector('.promo-popup-close').addEventListener('click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                closePromoPopup();
            });

            popup.querySelector('.promo-popup-link').addEventListener('click', goToStep1);

            var promoImg = popup.querySelector('.promo-popup-link img');
            if (promoImg) {
                promoImg.addEventListener('error', function () {
                    var fallback = promoImg.getAttribute('data-fallback');
                    if (fallback && promoImg.getAttribute('src') !== fallback) {
                        promoImg.src = typeof resolveMcreditAsset === 'function'
                            ? resolveMcreditAsset(fallback)
                            : fallback;
                    }
                });
            }

            popup.addEventListener('click', function (event) {
                if (event.target === popup) {
                    closePromoPopup();
                }
            });

            document.addEventListener('keydown', function (event) {
                if (event.key === 'Escape') {
                    closePromoPopup();
                }
            });
        }

        document.body.style.overflow = 'hidden';
        popup.classList.add('is-visible');
    }

    function bindPromoCards() {
        document.querySelectorAll('.home-partner .btn-more').forEach(function (btn) {
            btn.removeAttribute('onclick');
            btn.addEventListener('click', goToStep1);
        });

        document.querySelectorAll(
            '.home-partner .position-relative > a.image-inner, .home-partner .brand-title a.image-inner'
        ).forEach(function (link) {
            link.setAttribute('href', STEP1_URL);
            link.addEventListener('click', goToStep1);
        });

        document.querySelectorAll('.home-partner .image-brand').forEach(function (img) {
            var card = img.closest('.position-relative');
            if (!card || card.dataset.step1Bound === '1') {
                return;
            }
            card.dataset.step1Bound = '1';
            card.style.cursor = 'pointer';
            card.addEventListener('click', function (event) {
                if (event.target.closest('.btn-more')) {
                    return;
                }
                goToStep1(event);
            });
        });
    }

    function init() {
        bindPromoCards();
        showPromoPopup();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
