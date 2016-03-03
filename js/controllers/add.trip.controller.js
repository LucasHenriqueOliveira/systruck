(function () {
    'use strict';

    angular
        .module('app')
        .controller('AddTripController', AddTripController);

    AddTripController.$inject = ['DataService', '$localstorage', '$location', '$rootScope'];

    function AddTripController(DataService, $localstorage, $location, $rootScope) {
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

        DataService.getTrucksDriversCities().then(function (data) {
            vm.trucks = data.getTrucks;
            vm.drivers = data.getDrivers;
            vm.cities = data.getCities;
        });

        vm.selectDriver = function(){
            DataService.getDriverToTruck(vm.truckSelect.id).then(function (data) {
                var obj = {
                    id: data.getDriverToTruck.usuario_id,
                    name: data.getDriverToTruck.usuario_nome
                };
                vm.driverSelect = obj;
            });
            vm.kmOutput = vm.truckSelect.km;
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

                var bodyHeight = jQuery(this).height();
                jQuery("html, body").animate({ scrollTop: 0 }, "slow");
                jQuery(".content .clearfix").parent().animate({ height: (bodyHeight/2) }, "slow");
            });
        };

        vm.submitExpense = function(expense){
            vm.expenses = $localstorage.getObject('expenses');

            var elt = document.getElementById('expenseType');
            var name = elt.options[elt.selectedIndex].text;

            if(JSON.stringify(vm.expenses) === '{}'){
                $localstorage.setObject('expenses', [{
                    name : name,
                    type : expense.type,
                    value : expense.value.toFixed(2),
                    date: expense.date
                }]);
            } else{
                vm.expenses.push({
                    name : name,
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

            var postData = {
                cityDestinationId: form.cityDestination.id,
                cityHomeId: form.cityHome.id,
                comments: form.comments,
                dateArrival: form.dateArrival,
                dateOutput: form.dateOutput,
                driverSelect: form.driverSelect.id,
                kmArrival: form.kmArrival,
                kmOutput: form.kmOutput,
                kmPaid: form.kmPaid,
                moneyCompany: form.moneyCompany,
                moneyComplement: form.moneyComplement,
                totalMoney: form.totalMoney,
                truckSelect: form.truckSelect.id,
                fuelsNumber: form.fuels.length,
                expensesNumber: form.expenses.length,
                company: $localstorage.getObject('company'),
                id_user: $localstorage.getObject('id')
            };

            for(var i = 0; i < form.fuels.length; i++) {
                postData['date_fuel_' + i] = form.fuels[i].date;
                postData['name_fuel_' + i] = form.fuels[i].name;
                postData['price_fuel_' + i] = form.fuels[i].price;
                postData['qtd_fuel_' + i] = form.fuels[i].qtd;
            }

            for(i = 0; i < form.expenses.length; i++) {
                postData['name_expense_' + i] = form.expenses[i].name;
                postData['date_expense_' + i] = form.expenses[i].date;
                postData['type_expense_' + i] = form.expenses[i].type;
                postData['value_expense_' + i] = form.expenses[i].value;
            }

            DataService.submitAddTrip(postData).then(function(response) {

                if(response.error === false) {
                    $rootScope.$broadcast("login-done");

                    form.id = response.viagem_id;
                    $localstorage.remove('trip');
                    $localstorage.setObject('trip', form);
                    $location.path('/add-trip-confirm');

                } else {
                    alert(response.message);
                }
            });
        };

        vm.checkExpense = function(){
            if(vm.expense.type == 7) {
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

