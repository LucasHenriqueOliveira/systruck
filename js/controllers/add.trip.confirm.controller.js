(function () {
    'use strict';

    angular
        .module('app')
        .controller('AddTripConfirmController', AddTripConfirmController);

    AddTripConfirmController.$inject = ['$location', '$localstorage', 'DataService', '$timeout', '$window'];

    function AddTripConfirmController($location, $localstorage, DataService, $timeout, $window) {
        var vm = this;
        vm.loading = true;

        $timeout(function() {
            vm.loading = false;
        }, 2000);

        vm.trip = DataService.getTrip();

        if(JSON.stringify(vm.trip) === '{}'){
            $location.path('/add-trip');
            return false;
        }
        vm.trip.traveled = vm.trip.kmArrival - vm.trip.kmOutput;
        vm.trip.diffTraveled = vm.trip.traveled - (2 * vm.trip.kmPaid);

        var sumLts = 0;
        var sumPriceFuel = 0;
        var sumKm = 0;
        var sumLtsKm = 0;
        var lastFuelTankFull = vm.trip.kmOutput;
        vm.trip.fuels.forEach(function(fuel, index) {
            sumLts = sumLts + parseFloat(fuel.qtd);
            sumLtsKm = sumLtsKm + parseFloat(fuel.qtd);
            sumPriceFuel = sumPriceFuel + parseFloat(fuel.price);
            sumKm = sumKm + fuel.km;
            if(fuel.tanque == 1) {
                vm.trip.fuels[index].media = (sumKm - lastFuelTankFull/sumLtsKm).toFixed(2);
                lastFuelTankFull = fuel.km;
                sumKm = 0;
                sumLtsKm = 0;
            }
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

        $localstorage.remove('fuels');
        $localstorage.remove('expenses');
        $localstorage.remove('connections');

        vm.printIt = function(){
            var table = document.getElementById('print').innerHTML;
            var myWindow = $window.open('', '', 'width=800, height=600');
            myWindow.document.write(table);
            myWindow.print();
        };

    }

})();
