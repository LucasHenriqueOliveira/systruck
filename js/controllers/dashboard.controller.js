(function () {
    'use strict';

    angular
        .module('app')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$location'];

    function DashboardController($location) {
        var vm = this;

    }

})();
