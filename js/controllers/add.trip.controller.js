(function () {
    'use strict';

    angular
        .module('app')
        .controller('AddTripController', AddTripController);

    AddTripController.$inject = ['DataService', '$localstorage', '$location'];

    function AddTripController(DataService, $localstorage, $location) {
        var vm = this;

        vm.driverSelect = '';
        vm.kmOutput = '';
        vm.dateArrival = '';
        vm.totalMoney = '';
        vm.trucks = {};
        vm.drivers = {};
        vm.cities = {};

        vm.fuels = DataService.getFuel();
        vm.expenses = DataService.getExpense();

        DataService.getTrucksDrivers().then(function (data) {
            vm.trucks = data.getTrucks;
            vm.drivers = data.getDrivers;
        });

        vm.selectDriver = function(){
            DataService.getDriverToTruck(vm.truckSelect.id).then(function (data) {
                var obj = {
                    id: data.getDriverToTruck.usuario_id
                };
                vm.driverSelect = obj;
            });
            vm.kmOutput = vm.truckSelect.km;
        };

        DataService.getCities().then(function (data) {
            vm.cities = data.getCities;
        });

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

                var bodyHeight = jQuery(this).height();
                jQuery("html, body").animate({ scrollTop: 0 }, "slow");
                jQuery(".content .clearfix").parent().animate({ height: (bodyHeight/2) }, "slow");
            });
        };

        vm.submitExpense = function(expense){
            vm.expenses = $localstorage.getObject('expenses');

            if(JSON.stringify(vm.expenses) === '{}'){
                $localstorage.setObject('expenses', [{
                    type : expense.type,
                    value : expense.value.toFixed(2),
                    date: expense.date
                }]);
            } else{
                vm.expenses.push({
                    type : expense.type,
                    value : expense.value.toFixed(2),
                    date: expense.date
                });
                $localstorage.setObject('expenses', vm.expenses);
            }

            vm.expenses = DataService.getExpense();
            vm.expense = {};
            jQuery(document).ready(function(){
                jQuery("#myExpense").modal("hide");

                var bodyHeight = jQuery(this).height();
                jQuery("html, body").animate({ scrollTop: 0 }, "slow");
                jQuery(".content .clearfix").parent().animate({ height: (bodyHeight/2) }, "slow");
            });
        };

        vm.submitAddTrip = function(form){
            $localstorage.remove('trip');
            $localstorage.setObject('trip', form);
            $location.path('/add-trip-confirm');
        };

        vm.checkExpense = function(){
            if(vm.expense.type == 'Despesa adicional sem comprovação de nota (chapa, caixinha de conferente e outros) - 4%') {
                vm.expense.value = parseFloat((4 / 100) * parseFloat(vm.totalMoney));
                vm.expense.date = vm.dateArrival;
            }
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

