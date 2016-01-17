(function () {
    'use strict';

    angular
        .module('app')
        .controller('AddTripConfirmController', AddTripConfirmController);

    AddTripConfirmController.$inject = ['$location', '$localstorage', 'DataService'];

    function AddTripConfirmController($location, $localstorage, DataService) {
        var vm = this;

        vm.trip = DataService.getTrip();

    }

})();
