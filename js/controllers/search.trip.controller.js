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
        vm.truckSelect = 0;
        vm.driverSelect = 0;
        vm.cityHome = 0;
        vm.cityDestination = 0;
        vm.message = '';
        vm.results = '';
        vm.loading = false;

        DataService.getTrucksDriversCities().then(function (data) {
            vm.trucks = data.getTrucks;
            vm.drivers = data.getDrivers;
            vm.cities = data.getCities;
        });

        vm.submitSearchTrip = function(){
            vm.message = '';
            vm.loading = true;

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
                vm.loading = false;
            });
        };

        vm.back = function(){
            vm.results = '';
            $location.path('/search-trip');
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