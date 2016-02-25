(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$location', 'AuthenticationService', 'FlashService'];

    function LoginController($location, AuthenticationService, FlashService) {
        var vm = this;
        vm.login = login;
        vm.message = '';

        (function initController() {
            // reset login status
            AuthenticationService.ClearCredentials();
        })();

        function login() {
            vm.dataLoading = true;
            AuthenticationService.Login(vm.email, vm.password, function (response) {

                if(!response.data.error) {
                    AuthenticationService.SetCredentials(response.data);

                    if(response.data.user.qtd > 1){
                        $location.path('/select-profile');
                    } else {
                        $location.path('/');
                    }

                } else {
                    vm.message = response.data.message;
                    vm.dataLoading = false;
                }
            });
        };

        jQuery(document).ready(function(){
            jQuery("html").css('background-image', 'url("./images/slide.jpg")');
            jQuery("html").css('background-repeat', 'no-repeat');
            jQuery("html").css('background-position', 'center center');
            jQuery("html").css('background-attachment', 'fixed');
        });
    }

})();
