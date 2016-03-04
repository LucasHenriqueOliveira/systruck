(function () {
    'use strict';

    angular
        .module('app')
        .controller('SearchTripController', SearchTripController);

    SearchTripController.$inject = ['$location', 'DataService', '$localstorage'];

    function SearchTripController($location, DataService, $localstorage) {
        var vm = this;
        vm.numberTrip = '';
        vm.from = '';
        vm.to = '';
        vm.truckSelect = {};
        vm.driverSelect = {};
        vm.cityHome = {};
        vm.cityDestination = {};
        vm.message = '';
        vm.results = {};

        DataService.getTrucksDriversCities().then(function (data) {
            vm.trucks = data.getTrucks;
            vm.drivers = data.getDrivers;
            vm.cities = data.getCities;
        });

        vm.submitSearchTrip = function(){
            vm.message = '';

            var postData = {
                numberTrip: vm.numberTrip,
                dateInitial: vm.from,
                dateFinal: vm.to,
                truckSelect: vm.truckSelect.id,
                driverSelect: vm.driverSelect.id,
                cityDestinationId: vm.cityDestination.id,
                cityHomeId: vm.cityHome.id,
                company: $localstorage.getObject('company')
            };

            DataService.getSearchTrip(postData).then(function(response) {

                if(response.error === false) {
                    vm.results = response.trip;
                } else {
                    vm.message = response.message;
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