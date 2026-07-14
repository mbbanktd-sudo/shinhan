var userModalAppCheckMobile = new Vue({
    el: '#menu-mobile-login-profile',
    data: {
        user: null
    },
    created: function () {
        this.user = JSON.parse(localStorage.getItem("auth_info"));
    },
    methods: {
    }
})