(function () {
    'use strict';

    angular
        .module('app')
        .controller('UserController', UserController);

    UserController.$inject = ['$location'];

    function UserController($location) {
        var vm = this;

    }

})();
