(function () {
    'use strict';

    angular
        .module('app')
        .controller('ChangePasswordController', ChangePasswordController);

    ChangePasswordController.$inject = ['$location', 'UserService', '$localstorage'];

    function ChangePasswordController($location, UserService, $localstorage) {
        var vm = this;
        vm.user = {};

        vm.savePassword = function(form) {
            if (form.user.new_password !== form.user.confirm_password) {
                toastr.error('Nova senha não corresponde a senha confirmada', 'Troca senha', {timeOut: 4000});
                vm.user.confirm_password = '';
            } else {
                var dataUser = {
                    id: $localstorage.getObject('id'),
                    password: form.user.password,
                    new_password: form.user.new_password,
                    confirm_password: form.user.confirm_password
                };

                UserService.changePassword(dataUser).then(function (data) {
                    if(data.error) {
                        toastr.error(data.message, 'Troca senha', {timeOut: 4000});
                    } else {
                        toastr.success(data.message, 'Troca senha', {timeOut: 3000});
                        $localstorage.set('login_default', 0);
                        $location.path('/');
                    }
                });
            }
        };

        jQuery(document).ready(function(){

            jQuery("html").css('background-image', 'none');
        });
    }

})();