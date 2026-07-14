/**
 * Trang chủ: form "Gửi yêu cầu" (tỉnh/thành phố) → pages/step1.html
 */
(function () {
    'use strict';

    var STEP1_URL = 'pages/step1.html';

    function clearErrors() {
        document.querySelectorAll('#loan_req_form .auth-error').forEach(function (el) {
            el.textContent = '';
        });
    }

    function setError(id, message) {
        var el = document.getElementById(id);
        if (el) {
            el.textContent = message;
        }
    }

    function validateHomeLoanForm() {
        clearErrors();

        var form = document.getElementById('loan_req_form');
        if (!form) {
            return true;
        }

        if (typeof validateLoanReqForm === 'function') {
            var ok = validateLoanReqForm();
            var agree = document.getElementById('cb_Agree_home');
            if (!agree || !agree.checked) {
                ok = false;
            }
            return ok;
        }

        var name = form.querySelector('input[name="name"]');
        var phone = form.querySelector('input[name="phone"]');
        var idcard = form.querySelector('input[name="idcard"]');
        var city = document.getElementById('city_select');
        var agree = document.getElementById('cb_Agree_home');
        var valid = true;

        if (!name || !name.value.trim()) {
            setError('regi-name-err', 'Họ tên không được để trống');
            valid = false;
        }

        if (!phone || !phone.value.trim()) {
            setError('regi-phone-err', 'Số điện thoại không được để trống');
            valid = false;
        }

        if (!idcard || !idcard.value.trim()) {
            setError('regi-idcard-err', 'CMND/CCCD không được để trống');
            valid = false;
        }

        if (!city || !city.value) {
            setError('regi-city-err', 'Tỉnh/Thành phố không được để trống');
            valid = false;
        }

        if (!agree || !agree.checked) {
            valid = false;
        }

        return valid;
    }

    function saveHomeLoanDraft() {
        var form = document.getElementById('loan_req_form');
        if (!form) {
            return;
        }

        var payload = {
            fullName: (form.querySelector('input[name="name"]') || {}).value || '',
            phoneNumber: (form.querySelector('input[name="phone"]') || {}).value || '',
            email: (form.querySelector('input[name="email"]') || {}).value || '',
            idCard: (form.querySelector('input[name="idcard"]') || {}).value || '',
            city: (document.getElementById('city_select') || {}).value || '',
            callReceiveAt: Number((document.getElementById('call_receive_select') || {}).value || 0),
            source: 'index-home'
        };

        try {
            localStorage.setItem('loanRequestHome', JSON.stringify(payload));
        } catch (e) {
            /* ignore quota errors */
        }
    }

    function goToStep1() {
        if (!validateHomeLoanForm()) {
            return;
        }

        saveHomeLoanDraft();
        window.location.href = STEP1_URL;
    }

    window.loanRequest = goToStep1;

    function bindHomeLoanButton() {
        var btn = document.getElementById('home_loan_req');
        if (!btn || btn.dataset.step1Bound === '1') {
            return;
        }

        btn.dataset.step1Bound = '1';
        btn.addEventListener('click', function (event) {
            event.preventDefault();
            goToStep1();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bindHomeLoanButton);
    } else {
        bindHomeLoanButton();
    }
})();
