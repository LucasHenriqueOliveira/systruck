(function () {
    'use strict';

    angular
        .module('app')
        .controller('UsersController', UsersController);

    UsersController.$inject = ['$location', 'UserService', '$localstorage'];

    function UsersController($location, UserService, $localstorage) {
        var vm = this;
        vm.show_driver = false;

        vm.getFunction = function(function_user) {
            if(function_user == 3){
                vm.show_driver = true;
            } else {
                vm.show_driver = false;
            }
        };

        vm.getUsers = function() {
            UserService.getUsers().then(function (data) {
                vm.usersAvailable = data.getUsersAvailable;
                vm.usersUnavailable = data.getUsersUnavailable;
            });
        };

        vm.getUsers();

        vm.getUser = function(user) {
            UserService.setCurrentUser(user);
            $location.path('/user');
        };

        vm.editUser = function(user) {
            UserService.setCurrentUser(user);
            $location.path('/edit-user');
        };

        vm.removeUser = function(user) {
            var userRemove = {
                id: $localstorage.getObject('id')
            };
            UserService.removeUser(user.perfil_id, userRemove).then(function (data) {
                if(data.error) {
                    toastr.error(data.message, 'Usuário', {timeOut: 3000});
                } else {
                    toastr.success(data.message, 'Usuário', {timeOut: 3000});
                }
                vm.getUsers();
            });
        };

        vm.activeUser = function(user) {
            var userActive = {
                id: $localstorage.getObject('id')
            };
            UserService.activeUser(user.perfil_id, userActive).then(function (data) {
                if(data.error) {
                    toastr.error(data.message, 'Usuário', {timeOut: 3000});
                } else {
                    toastr.success(data.message, 'Usuário', {timeOut: 3000});
                }
                vm.getUsers();
            });
        };

        vm.submitUser = function(form) {
            var dataUser = {
                nome: form.user.name,
                tipo_perfil: form.user.function,
                email: form.user.email,
                cnh: form.user.cnh,
                data_exame: form.user.date_periodic,
                telefone1: form.user.phone1,
                telefone2: form.user.phone2,
                usuario_ativacao: $localstorage.getObject('id'),
                empresa: $localstorage.getObject('company')
            };

            UserService.create(dataUser).then(function (data) {
                if(data.error) {
                    toastr.error(data.message, 'Usuário', {timeOut: 3000});
                } else {
                    toastr.success(data.message, 'Usuário', {timeOut: 3000});
                    vm.user = {};

                    jQuery(document).ready(function(){
                        jQuery("#myModal").modal("hide");
                    });

                    vm.getUsers();
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