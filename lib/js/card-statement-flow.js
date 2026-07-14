/**
 * Preset luồng "Vay theo sao kê thẻ tín dụng" trước khi vào step1.
 */
(function (global) {
    'use strict';

    var CARD_PRODUCT = 'Vay theo sao kê thẻ tín dụng';
    var SECRET_KEY = 'fecredit-secret-key';

    function loadUserData() {
        var encrypted = localStorage.getItem('userData');
        if (!encrypted || typeof CryptoJS === 'undefined') {
            return {};
        }
        try {
            return JSON.parse(CryptoJS.AES.decrypt(encrypted, SECRET_KEY).toString(CryptoJS.enc.Utf8));
        } catch (e) {
            return {};
        }
    }

    function savePreset(partial) {
        if (typeof CryptoJS === 'undefined') {
            sessionStorage.setItem('mcreditCardStatementPreset', JSON.stringify(partial));
            return;
        }
        var merged = Object.assign({}, loadUserData(), partial, { timestamp: new Date().toISOString() });
        localStorage.setItem(
            'userData',
            CryptoJS.AES.encrypt(JSON.stringify(merged), SECRET_KEY).toString()
        );
    }

    function step1Url() {
        return window.location.pathname.indexOf('/vi/') !== -1
            ? '../../pages/step1.html'
            : 'pages/step1.html';
    }

    global.startCardStatementLoan = function () {
        savePreset({
            loanProductName: CARD_PRODUCT,
            loanType: CARD_PRODUCT,
            loanFlow: 'card-statement',
            purpose: 'Vay theo sao kê thẻ tín dụng',
            loanPurpose: 'Vay theo sao kê thẻ tín dụng',
            interestRate: 42
        });
        window.location.href = step1Url();
    };

    global.CARD_STATEMENT_PRODUCT = CARD_PRODUCT;
})(window);
