(function () {
    'use strict';

    angular
        .module('app')
        .controller('TrucksController', TrucksController);

    TrucksController.$inject = ['$location'];

    function TrucksController($location) {
        var vm = this;

    }

})();

