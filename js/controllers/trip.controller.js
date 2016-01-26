(function () {
    'use strict';

    angular
        .module('app')
        .controller('TripController', TripController);

    TripController.$inject = ['$location', '$localstorage', 'DataService', '$timeout', '$window'];

    function TripController($location, $localstorage, DataService, $timeout, $window) {
        var vm = this;
        vm.loading = true;

        $timeout(function() {
            vm.loading = false;
        }, 2000);

        vm.trip = DataService.getTrip();
        vm.truck = vm.trip.trucks[vm.trip.truckSelect].name;
        vm.trip.traveled = vm.trip.kmArrival - vm.trip.kmOutput;
        vm.trip.diffTraveled = vm.trip.traveled - (2 * vm.trip.kmPaid);

        var sumLts = 0;
        var sumPriceFuel = 0;
        vm.trip.fuels.forEach(function(fuel) {
            sumLts = sumLts + parseFloat(fuel.qtd);
            sumPriceFuel = sumPriceFuel + parseFloat(fuel.price);
        });

        var sumPriceExpenses = 0;
        vm.trip.expenses.forEach(function(expense) {
            sumPriceExpenses = sumPriceExpenses + parseFloat(expense.value);
        });

        vm.trip.sumLts = sumLts;
        vm.trip.sumPriceFuel = sumPriceFuel;
        vm.trip.sumPriceExpenses = sumPriceExpenses;
        vm.trip.average = (vm.trip.traveled/sumLts).toFixed(2);
        vm.trip.advance = parseInt(vm.trip.moneyCompany) + parseInt(vm.trip.moneyComplement);
        vm.trip.result = (vm.trip.sumPriceExpenses + vm.trip.sumPriceFuel) - vm.trip.advance;

        vm.back = function(){
            $window.history.back();
        };
    }

})();