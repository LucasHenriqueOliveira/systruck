(function () {
    'use strict';

    angular
        .module('app')
        .controller('AddTripController', AddTripController);

    AddTripController.$inject = ['$scope', 'DataService', '$localstorage', '$location'];

    function AddTripController($scope, DataService, $localstorage, $location) {
        var vm = this;

        vm.truckSelect = '';
        vm.driverSelect = '';
        vm.kmOutput = '';
        vm.dateArrival = '';
        vm.totalMoney = '';
        vm.fuels = DataService.getFuel();
        vm.expenses = DataService.getExpense();
        vm.trucks = [
            {
                id: 1,
                name: "20.279 - Scania P310"
            },
            {
                id: 2,
                name: "20.280 - Scania P340"
            },
            {
                id: 3,
                name: "20.314 - Scania P310"
            },
            {
                id: 4,
                name: "20.654 - Scania P340"
            },
            {
                id: 5,
                name: "20.323 - Iveco Stralis 420"
            },
            {
                id: 6,
                name: "20.279 - Scania P310"
            },
            {
                id: 7,
                name: "23.423 - Iveco Stralis 420"
            },
            {
                id: 8,
                name: "20.675 - Scania P310"
            },
            {
                id: 9,
                name: "20.876 - Scania P340"
            },
            {
                id: 10,
                name: "20.856 - Scania P340"
            }
        ];

        vm.selectDriver = function(){
            vm.drivers = [
                {
                    id: 1,
                    name: "Lucas Henrique de Oliveira"
                },
                {
                    id: 2,
                    name: "Arthur Felipe R. Costa"
                },
                {
                    id: 3,
                    name: "Gilberto Oliveira"
                },
                {
                    id: 4,
                    name: "Guilherme Azevedo Reis"
                },
                {
                    id: 5,
                    name: "José Lucas Ferreira e Silva"
                },
                {
                    id: 6,
                    name: "Paulo Holanda Ribeiro Netto"
                },
                {
                    id: 7,
                    name: "Matheus André da Silva"
                },
                {
                    id: 8,
                    name: "Ruy Arruda Cassiano"
                }
            ];

            vm.driverSelect = vm.drivers[1];
            vm.kmOutput = '788592';
        };

        vm.submitFuel = function(fuel){
            vm.fuels = $localstorage.getObject('fuels');

            if(JSON.stringify(vm.fuels) === '{}'){
                $localstorage.setObject('fuels', [{
                    name: fuel.name,
                    qtd: fuel.qtd,
                    price: fuel.price,
                    date: fuel.date
                }]);
            } else{
                vm.fuels.push({
                    name: fuel.name,
                    qtd: fuel.qtd,
                    price: fuel.price,
                    date: fuel.date
                });
                $localstorage.setObject('fuels', vm.fuels);
            }

            vm.fuels = DataService.getFuel();
            vm.fuel = {};
            jQuery(document).ready(function(){
                jQuery("#myFuel").modal("hide");
            });
        };

        vm.submitExpense = function(expense){
            vm.expenses = $localstorage.getObject('expenses');

            if(JSON.stringify(vm.expenses) === '{}'){
                $localstorage.setObject('expenses', [{
                    type : expense.type,
                    value : expense.value,
                    date: expense.date
                }]);
            } else{
                vm.expenses.push({
                    type : expense.type,
                    value : expense.value,
                    date: expense.date
                });
                $localstorage.setObject('expenses', vm.expenses);
            }

            vm.expenses = DataService.getExpense();
            vm.expense = {};
            jQuery(document).ready(function(){
                jQuery("#myExpense").modal("hide");
            });
        };

        vm.submitAddTrip = function(form){
            $localstorage.remove('trip');
            $localstorage.setObject('trip', form);
            $location.path('/add-trip-confirm');
        };

        vm.checkExpense = function(){
            if(vm.expense.type == 'Despesa adicional sem comprovação de nota (chapa, caixinha de conferente e outros) - 4%') {
                vm.expense.value = parseFloat((4 / 100) * parseFloat(vm.totalMoney)).toFixed(2);
                vm.expense.date = vm.dateArrival;
            }
        };
    }

})();

