(function () {
    'use strict';

    angular
        .module('app')
        .controller('LastTripController', LastTripController);

    LastTripController.$inject = ['$location', 'DataService'];

    function LastTripController($location, DataService) {
        var vm = this;
        vm.lastTrip = {};

        DataService.getLastTrip().then(function (data) {
            vm.lastTrip = data.getLastTrip;
        });
    }

})();
