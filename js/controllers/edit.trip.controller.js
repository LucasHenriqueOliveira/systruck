(function () {
    'use strict';

    angular
        .module('app')
        .controller('EditTripController', EditTripController);

    EditTripController.$inject = ['$location', '$localstorage', 'DataService', '$timeout', '$window', '$stateParams'];

    function EditTripController($location, $localstorage, DataService, $timeout, $window, $stateParams) {
        var vm = this;

        vm.trip = DataService.getTripServer($stateParams);

    }

})();