(function () {
    'use strict';

    angular
        .module('app')
        .controller('AddTripController', AddTripController);

    AddTripController.$inject = ['DataService', '$localstorage', '$location', '$rootScope', '$filter', '$scope'];

    function AddTripController(DataService, $localstorage, $location, $rootScope, $filter, $scope) {
        var vm = this;

        vm.driverSelect = '';
        vm.kmOutput = '';
        vm.dateArrival = '';
        vm.totalMoney = '';
        vm.trucks = {};
        vm.drivers = {};
        vm.cities = {};
        vm.connection_edit = {};
        vm.fuel_edit = {};
        vm.expense_edit = {};
        vm.connection_edit.city = {};
        vm.connections = [];

        $localstorage.remove('fuels');
        $localstorage.remove('expenses');
        $localstorage.remove('connections');

        vm.fuels = DataService.getFuel();
        vm.expenses = DataService.getExpense();
        vm.connections = DataService.getConnections();

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
                    date: fuel.date,
                    km: fuel.km,
                    tanque: fuel.tanque
                }]);
            } else{
                vm.fuels.push({
                    name: fuel.name,
                    qtd: fuel.qtd,
                    price: fuel.price,
                    date: fuel.date,
                    km: fuel.km,
                    tanque: fuel.tanque
                });
                $localstorage.setObject('fuels', vm.fuels);
            }

            $scope.formFuel.$setPristine();
            vm.fuels = DataService.getFuel();
            vm.fuel = {};
            jQuery(document).ready(function(){
                jQuery("#myFuel").modal("hide");

                var bodyHeight = jQuery(this).height();
                jQuery("html, body").animate({ scrollTop: 0 }, "slow");
                jQuery(".content .clearfix").parent().animate({ height: (bodyHeight/2) }, "slow");
            });
        };

        vm.editFuel = function(fuel, index) {

            vm.fuel_edit.index = index;
            vm.fuel_edit.name = fuel.name;
            vm.fuel_edit.qtd = fuel.qtd;
            vm.fuel_edit.price = fuel.price;
            vm.fuel_edit.date = fuel.date;
            vm.fuel_edit.km = fuel.km;
            vm.fuel_edit.tanque = fuel.tanque;

            jQuery(document).ready(function(){
                jQuery("#myFuelEdit").modal("show");
            });
        };

        vm.submitEditFuel = function(fuel) {

            var fuels = $localstorage.getObject('fuels');

            if (fuels.index !== -1) {
                fuels[fuel.index]['name'] = fuel.name;
                fuels[fuel.index]['qtd'] = fuel.qtd;
                fuels[fuel.index]['price'] = fuel.price;
                fuels[fuel.index]['date'] = fuel.date;
                fuels[fuel.index]['km'] = fuel.km;
                fuels[fuel.index]['tanque'] = fuel.tanque;

                vm.fuels = fuels;
                $localstorage.setObject('fuels', vm.fuels);
                vm.fuel = {};
                $scope.formFuelEdit.$setPristine();

                jQuery(document).ready(function(){
                    jQuery("#myFuelEdit").modal("hide");
                });
            } else {
                toastr.error('Erro ao alterar o abastecimento. Exclua o abastecimento e inclua novamente.', 'Alteração de abastecimento', {timeOut: 3000});
            }
        };

        vm.removeFuel = function(fuel) {

            var fuels = $localstorage.getObject('fuels');

            var found = $filter('filter')(fuels, fuel, true);

            if (found.length) {
                for(var i = 0; i < fuels.length; i++) {
                    var obj = fuels[i];

                    if(found.indexOf(obj) !== -1) {
                        fuels.splice(i, 1);
                        i--;
                    }
                }
                $localstorage.setObject('fuels', fuels);
                vm.fuels = DataService.getFuel();

            } else {
                toastr.error('Erro ao excluir o abastecimento', 'Exclusão de abastecimento', {timeOut: 3000});
            }
        };

        vm.submitExpense = function(expense){
            vm.expenses = $localstorage.getObject('expenses');

            var elt = document.getElementById('expenseType');
            var name = elt.options[elt.selectedIndex].text;

            if(JSON.stringify(vm.expenses) === '{}'){
                $localstorage.setObject('expenses', [{
                    name : name,
                    type : expense.type,
                    value : expense.value,
                    date: expense.date
                }]);
            } else{
                vm.expenses.push({
                    name : name,
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

                var bodyHeight = jQuery(this).height();
                jQuery("html, body").animate({ scrollTop: 0 }, "slow");
                jQuery(".content .clearfix").parent().animate({ height: (bodyHeight/2) }, "slow");
            });
        };

        vm.editExpense = function(expense, index) {

            vm.expense_edit.index = index;
            vm.expense_edit.name = expense.name;
            vm.expense_edit.type = expense.type;
            vm.expense_edit.value = expense.value;
            vm.expense_edit.date = expense.date;

            jQuery(document).ready(function(){
                jQuery("#myExpenseEdit").modal("show");
            });
        };

        vm.submitEditExpense = function(expense) {

            var expenses = $localstorage.getObject('expenses');
            var elt = document.getElementById('expenseEditType');
            var name = elt.options[elt.selectedIndex].text;

            if (expenses.index !== -1) {
                expenses[expense.index]['name'] = name;
                expenses[expense.index]['type'] = expense.type;
                expenses[expense.index]['value'] = expense.value;
                expenses[expense.index]['date'] = expense.date;

                vm.expenses = expenses;
                $localstorage.setObject('expenses', vm.expenses);
                vm.expense = {};
                $scope.formEditExpense.$setPristine();

                jQuery(document).ready(function(){
                    jQuery("#myExpenseEdit").modal("hide");
                });
            } else {
                toastr.error('Erro ao alterar a despesa. Exclua a despesa e inclua novamente.', 'Alteração de despesa', {timeOut: 3000});
            }
        };

        vm.removeExpense = function(expense) {

            var expenses = $localstorage.getObject('expenses');

            var found = $filter('filter')(expenses, expense, true);

            if (found.length) {
                for(var i = 0; i < expenses.length; i++) {
                    var obj = expenses[i];

                    if(found.indexOf(obj) !== -1) {
                        expenses.splice(i, 1);
                        i--;
                    }
                }
                $localstorage.setObject('expenses', expenses);
                vm.expenses = DataService.getExpense();

            } else {
                toastr.error('Erro ao excluir a despesa', 'Exclusão de despesa', {timeOut: 3000});
            }
        };

        vm.checkExpense = function(){
            if(vm.expense.type == 7) {
                vm.expense.value = parseFloat((4 / 100) * parseFloat(vm.totalMoney));
                vm.expense.date = vm.dateArrival;
            }
        };

        vm.submitConnection = function(form) {
            vm.connections = $localstorage.getObject('connections');

            if(JSON.stringify(vm.connections) === '{}'){
                $localstorage.setObject('connections', [{
                    cityDestination: form.city.destination,
                    cityHome: form.city.home,
                    dateArrival: form.dateArrival,
                    dateOutput: form.dateOutput,
                    kmArrival: form.kmArrival,
                    kmOutput: form.kmOutput,
                    kmPaid: form.kmPaid,
                    moneyCompany: form.moneyCompany,
                    moneyComplement: form.moneyComplement,
                    totalMoney: form.totalMoney
                }]);
            } else{
                vm.connections.push({
                    cityDestination: form.city.destination,
                    cityHome: form.city.home,
                    dateArrival: form.dateArrival,
                    dateOutput: form.dateOutput,
                    kmArrival: form.kmArrival,
                    kmOutput: form.kmOutput,
                    kmPaid: form.kmPaid,
                    moneyCompany: form.moneyCompany,
                    moneyComplement: form.moneyComplement,
                    totalMoney: form.totalMoney
                });
                $localstorage.setObject('connections', vm.connections);
            }

            vm.connections = DataService.getConnections();
            vm.connection = {};
            $scope.formConnection.$setPristine();

            jQuery(document).ready(function(){
                jQuery("#myConnection").modal("hide");

                var bodyHeight = jQuery(this).height();
                jQuery("html, body").animate({ scrollTop: 0 }, "slow");
                jQuery(".content .clearfix").parent().animate({ height: (bodyHeight/2) }, "slow");
            });
        };

        vm.editConnection = function(connection, index) {

            vm.connection_edit.index = index;

            vm.connection_edit.city.home = {
                id: connection.cityHome.id,
                name: connection.cityHome.name
            };

            vm.connection_edit.city.destination = {
                id: connection.cityDestination.id,
                name: connection.cityDestination.name
            };

            vm.connection_edit.dateOutput = connection.dateOutput;
            vm.connection_edit.dateArrival = connection.dateArrival;
            vm.connection_edit.kmOutput = connection.kmOutput;
            vm.connection_edit.kmArrival = connection.kmArrival;
            vm.connection_edit.kmPaid = connection.kmPaid;
            vm.connection_edit.totalMoney = connection.totalMoney;
            vm.connection_edit.moneyCompany = connection.moneyCompany;
            vm.connection_edit.moneyComplement = connection.moneyComplement;

            jQuery(document).ready(function(){
                jQuery("#myConnectionEdit").modal("show");
            });
        };

        vm.submitEditConnection = function(connection) {

            var connections = $localstorage.getObject('connections');

            if (connections.index !== -1) {
                connections[connection.index]['cityHome'] = connection.city.home;
                connections[connection.index]['cityDestination'] = connection.city.destination;
                connections[connection.index]['dateArrival'] = connection.dateArrival;
                connections[connection.index]['dateOutput'] = connection.dateOutput;
                connections[connection.index]['kmArrival'] = connection.kmArrival;
                connections[connection.index]['kmOutput'] = connection.kmOutput;
                connections[connection.index]['kmPaid'] = connection.kmPaid;
                connections[connection.index]['moneyCompany'] = connection.moneyCompany;
                connections[connection.index]['moneyComplement'] = connection.moneyComplement;
                connections[connection.index]['totalMoney'] = connection.totalMoney;

                vm.connections = connections;
                $localstorage.setObject('connections', vm.connections);
                vm.connection = {};
                $scope.formConnectionEdit.$setPristine();

                jQuery(document).ready(function(){
                    jQuery("#myConnectionEdit").modal("hide");
                });
            } else {
                toastr.error('Erro ao alterar a conexão. Exclua a conexão e inclua novamente.', 'Alteração de conexão', {timeOut: 3000});
            }
        };

        vm.removeConnection = function(connection) {

            var connections = $localstorage.getObject('connections');

            var found = $filter('filter')(connections, connection, true);

            if (found.length) {
                for(var i = 0; i < connections.length; i++) {
                    var obj = connections[i];

                    if(found.indexOf(obj) !== -1) {
                        connections.splice(i, 1);
                        i--;
                    }
                }
                $localstorage.setObject('connections', connections);
                vm.connections = DataService.getConnections();

            } else {
                toastr.error('Erro ao excluir a conexão', 'Exclusão de conexão', {timeOut: 3000});
            }
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
                connectionsNumber: form.connections.length,
                company: $localstorage.getObject('company'),
                id_user: $localstorage.getObject('id')
            };

            for(var i = 0; i < form.connections.length; i++) {
                postData['city_destination_' + i] = form.connections[i].cityDestination.id;
                postData['city_home_' + i] = form.connections[i].cityHome.id;
                postData['date_arrival_' + i] = form.connections[i].dateArrival;
                postData['date_output_' + i] = form.connections[i].dateOutput;
                postData['km_arrival_' + i] = form.connections[i].kmArrival;
                postData['km_output_' + i] = form.connections[i].kmOutput;
                postData['km_paid_' + i] = form.connections[i].kmPaid;
                postData['money_company_' + i] = form.connections[i].moneyCompany;
                postData['money_complement_' + i] = form.connections[i].moneyComplement;
                postData['total_money_' + i] = form.connections[i].totalMoney;
            }

            for(var i = 0; i < form.fuels.length; i++) {
                postData['date_fuel_' + i] = form.fuels[i].date;
                postData['name_fuel_' + i] = form.fuels[i].name;
                postData['price_fuel_' + i] = form.fuels[i].price;
                postData['qtd_fuel_' + i] = form.fuels[i].qtd;
                postData['km_' + i] = form.fuels[i].qtd;
                postData['tank_' + i] = form.fuels[i].qtd;
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
                    toastr.error(response.message, 'Cadastro de viagem', {timeOut: 3000});
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

