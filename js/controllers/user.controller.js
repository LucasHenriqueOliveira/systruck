(function () {
    'use strict';

    angular
        .module('app')
        .controller('UserController', UserController);

    UserController.$inject = ['$window', 'UserService', '$location'];

    function UserController($window, UserService, $location) {
        var vm = this;
        vm.user = {};

        vm.back = function(){
            $window.history.back();
        };

        vm.user = UserService.getCurrentUser();

        if(!vm.user) {
            alert('Erro ao consultar usuário.');
            $location.path('/users');
        }

        vm.editUser = function() {
            UserService.setCurrentUser(vm.user);
            $location.path('/edit-user');
        };
    }

})();