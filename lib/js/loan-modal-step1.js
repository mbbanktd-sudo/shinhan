/**
 * Offline site: modal "Gửi yêu cầu" → pages/step1.html
 * Nếu chọn "Vay theo sao kê thẻ tín dụng" → preset luồng sao kê.
 */
(function () {
    'use strict';

    if (typeof loanModalApp === 'undefined') {
        return;
    }

    var CARD_LOAN_ID = 'cardsaoke';

    loanModalApp.loanRequest = function () {
        this.errors = {};
        this.validateForm();

        if (!this.loanReqData.isCheckedAgree) {
            return;
        }

        if (Object.keys(this.errors).length !== 0) {
            return;
        }

        if (this.selectedLoanId === CARD_LOAN_ID && typeof startCardStatementLoan === 'function') {
            startCardStatementLoan();
            return;
        }

        try {
            localStorage.setItem('loanRequestHome', JSON.stringify({
                fullName: this.loanReqData.fullName || '',
                phoneNumber: this.loanReqData.phoneNumber || '',
                email: this.loanReqData.email || '',
                idCard: this.loanReqData.idCard || '',
                city: this.loanReqData.city || '',
                callReceiveAt: Number(this.loanReqData.callReceiveAt || 0),
                source: 'index-modal'
            }));
        } catch (e) {
            /* ignore */
        }

        window.location.href = 'pages/step1.html';
    };
})();
