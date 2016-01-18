(function () {
    'use strict';

    angular
        .module('app')
        .controller('AddTripConfirmController', AddTripConfirmController);

    AddTripConfirmController.$inject = ['$location', '$localstorage', 'DataService'];

    function AddTripConfirmController($location, $localstorage, DataService) {
        var vm = this;

        vm.trip = DataService.getTrip();
        vm.truck = vm.trip.trucks[vm.trip.truckSelect].name;
        vm.trip.traveled = vm.trip.kmArrival - vm.trip.kmOutput;
        vm.trip.diffTraveled = vm.trip.traveled - (2 * vm.trip.kmPaid);

        var sumLts = 0;
        var sumPriceFuel = 0;
        vm.trip.fuels.forEach(function(fuel) {
            sumLts = sumLts + parseInt(fuel.qtd);
            sumPriceFuel = sumPriceFuel + parseInt(fuel.price);
        });

        var sumPriceExpenses = 0;
        vm.trip.expenses.forEach(function(expense) {
            sumPriceExpenses = sumPriceExpenses + parseInt(expense.value);
        });

        vm.trip.sumLts = sumLts;
        vm.trip.sumPriceFuel = sumPriceFuel;
        vm.trip.sumPriceExpenses = sumPriceExpenses;
        vm.trip.average = (vm.trip.traveled/sumLts).toFixed(2);
        vm.trip.advance = parseInt(vm.trip.moneyCompany) + parseInt(vm.trip.moneyComplement);

        $localstorage.remove('fuels');
        $localstorage.remove('expenses');

    }

})();
