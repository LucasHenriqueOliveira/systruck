(function () {
    'use strict';

    angular
        .module('app')
        .controller('EditUserController', EditUserController);

    EditUserController.$inject = ['$window', 'UserService', '$location'];

    function EditUserController($window, UserService, $location) {
        var vm = this;
        vm.show_driver = false;
        vm.user = UserService.getCurrentUser();

        if(vm.user.tipo_perfil_id == 3) {
            vm.show_driver = true;
        }

        vm.getFunction = function(function_user) {
            if(function_user == 3){
                vm.show_driver = true;
            } else {
                vm.show_driver = false;
            }
        };

        vm.back = function(){
            $window.history.back();
        };

        vm.editUser = function(data) {

            var dataUser = {
                id: data.user.usuario_id,
                nome: data.user.usuario_nome,
                id_perfil: data.user.perfil_id,
                tipo_perfil: data.user.tipo_perfil_id,
                email: data.user.usuario_email,
                cnh: data.user.usuario_cnh,
                data_exame: data.user.usuario_data_exame,
                telefone1: data.user.usuario_telefone1,
                telefone2: data.user.usuario_telefone2
            };

            UserService.update(dataUser).then(function (data) {
                if(data.error) {
                    toastr.error(data.message, 'Usuário', {timeOut: 3000});
                } else {
                    toastr.success(data.message, 'Usuário', {timeOut: 3000});
                    $location.path('/users');
                }
            });
        };

        jQuery(document).ready(function(){
            jQuery('.popovers').popover();

            jQuery('.default-date-picker').datepicker({
                format: 'dd/mm/yyyy',
                autoclose: true,
                language: 'pt-BR'
            });
        });
    }

})();