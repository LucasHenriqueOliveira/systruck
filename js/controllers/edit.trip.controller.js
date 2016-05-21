(function () {
    'use strict';

    angular
        .module('app')
        .controller('EditTripController', EditTripController);

    EditTripController.$inject = ['$location', '$localstorage', 'DataService', '$timeout', '$window', '$routeParams', '$scope', '$filter', '$rootScope'];

    function EditTripController($location, $localstorage, DataService, $timeout, $window, $routeParams, $scope, $filter, $rootScope) {
        var vm = this;
        vm.connections = [];
        vm.fuels = [];
        vm.expenses = [];
        vm.connection_edit = {};
        vm.fuel_edit = {};
        vm.expense_edit = {};
        vm.connection_edit.city = {};
        vm.loading = true;

        $timeout(function() {
            vm.loading = false;
        }, 2000);

        DataService.getTrucksDriversCities().then(function (data) {
            vm.trucks = data.getTrucks;
            vm.drivers = data.getDrivers;
            vm.cities = data.getCities;
        });

        DataService.getTripServer($routeParams.id).then(function (data) {
            vm.trip = data.getTrip;

            vm.truckSelect = {
                id: vm.trip.viagem_carro_id,
                name: vm.trip.carro_placa + ' - ' + vm.trip.carro_nome,
                carro_nome: vm.trip.carro_nome,
                placa: vm.trip.carro_placa,
                frota: vm.trip.carro_frota,
                placa_semi_reboque: vm.trip.carro_placa_semi_reboque
            };

            vm.driverSelect = {
                id: vm.trip.viagem_usuario_id,
                name: vm.trip.usuario_nome
            };

            vm.cityHome = {
                id: vm.trip.viagem_cidade_origem_id,
                name: vm.trip.cidade_origem
            };

            vm.cityDestination = {
                id: vm.trip.viagem_cidade_destino_id,
                name: vm.trip.cidade_destino
            };

            vm.dateOutput = vm.trip.viagem_data_saida;
            vm.dateArrival = vm.trip.viagem_data_chegada;
            vm.kmOutput = vm.trip.viagem_km_saida;
            vm.kmArrival = vm.trip.viagem_km_chegada;
            vm.kmPaid = vm.trip.viagem_valor_km;
            vm.totalMoney = vm.trip.viagem_frete;
            vm.moneyCompany = vm.trip.viagem_adiantamento;
            vm.moneyComplement = vm.trip.viagem_complemento;
            vm.comments = vm.trip.viagem_observacao;

            for(var i = 0; i < data.getConnection.length; i++) {

                vm.connections.push({
                    id: data.getConnection[i].conexao_id,
                    cityHome: {
                        id: data.getConnection[i].conexao_cidade_origem_id,
                        name: data.getConnection[i].cidade_origem
                    },
                    cityDestination: {
                        id: data.getConnection[i].conexao_cidade_destino_id,
                        name: data.getConnection[i].cidade_destino
                    },
                    dateArrival: data.getConnection[i].conexao_data_chegada,
                    dateOutput: data.getConnection[i].conexao_data_saida,
                    kmArrival: data.getConnection[i].conexao_km_chegada,
                    kmOutput: data.getConnection[i].conexao_km_saida,
                    kmPaid: data.getConnection[i].conexao_valor_km,
                    moneyCompany: data.getConnection[i].conexao_adiantamento,
                    moneyComplement: data.getConnection[i].conexao_complemento,
                    totalMoney: data.getConnection[i].conexao_frete
                });
            }

            for(var i = 0; i < data.getFuel.length; i++) {

                vm.fuels.push({
                    id: data.getFuel[i].abastecimento_id,
                    name: data.getFuel[i].abastecimento_nome,
                    qtd: data.getFuel[i].abastecimento_litros,
                    price: data.getFuel[i].abastecimento_valor,
                    date: data.getFuel[i].abastecimento_data,
                    km: data.getFuel[i].abastecimento_km,
                    tanque: data.getFuel[i].abastecimento_tanque_cheio
                });
            }

            for(var i = 0; i < data.getExpense.length; i++) {

                vm.expenses.push({
                    id: data.getExpense[i].despesa_id,
                    name: data.getExpense[i].despesa_nome,
                    type: data.getExpense[i].despesa_tipo,
                    value: data.getExpense[i].despesa_valor,
                    date: data.getExpense[i].despesa_data
                });
            }

            $localstorage.setObject('fuels', vm.fuels);
            $localstorage.setObject('expenses', vm.expenses);
            $localstorage.setObject('connections', vm.connections);

        });


        vm.submitFuel = function(fuel){
            vm.fuels = $localstorage.getObject('fuels');

            if(JSON.stringify(vm.fuels) === '{}'){
                $localstorage.setObject('fuels', [{
                    id: null,
                    name: fuel.name,
                    qtd: fuel.qtd,
                    price: fuel.price,
                    date: fuel.date,
                    km: fuel.km,
                    tanque: fuel.tanque
                }]);
            } else{
                vm.fuels.push({
                    id: null,
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
            vm.fuel_edit.id = fuel.id;
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
                fuels[fuel.index]['id'] = fuel.id;
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

            var isConfirm = confirm('Confirma a exclusão?');

            if(isConfirm != true){
                return false;
            }

            var fuels = $localstorage.getObject('fuels');

            var found = $filter('filter')(fuels, fuel, true);

            if (found.length) {

                if(fuel.id){
                    var data = {
                        id: $localstorage.getObject('id')
                    };
                    DataService.removeTripFuel(fuel.id, data).then(function (data) {
                        if(data.error) {
                            toastr.error('Erro ao excluir o abastecimento', 'Exclusão de abastecimento', {timeOut: 3000});
                            return false;
                        } else {
                            toastr.success(data.message, 'Exclusão de abastecimento', {timeOut: 3000});
                        }
                    });
                }

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
                    id: null,
                    name : name,
                    type : expense.type,
                    value : expense.value,
                    date: expense.date
                }]);
            } else{
                vm.expenses.push({
                    id: null,
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
            vm.expense_edit.id = expense.id;
            vm.expense_edit.name = expense.name;
            vm.expense_edit.type = (expense.type).toString();
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
                expenses[expense.index]['id'] = expense.id;
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

            var isConfirm = confirm('Confirma a exclusão?');

            if(isConfirm != true){
                return false;
            }

            var expenses = $localstorage.getObject('expenses');

            var found = $filter('filter')(expenses, expense, true);

            if (found.length) {

                if(expense.id){
                    var data = {
                        id: $localstorage.getObject('id')
                    };
                    DataService.removeTripExpense(expense.id, data).then(function (data) {
                        if(data.error) {
                            toastr.error('Erro ao excluir a despesa', 'Exclusão de despesa', {timeOut: 3000});
                            return false;
                        } else {
                            toastr.success(data.message, 'Exclusão de despesa', {timeOut: 3000});
                        }
                    });
                }
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
                    id: null,
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
                    id: null,
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
            vm.connection_edit.id = connection.id;

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
                connections[connection.index]['id'] = connection.id;
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

            var isConfirm = confirm('Confirma a exclusão?');

            if(isConfirm != true){
                return false;
            }

            var connections = $localstorage.getObject('connections');

            var found = $filter('filter')(connections, connection, true);

            if (found.length) {
                if(connection.id){
                    var data = {
                        id: $localstorage.getObject('id')
                    };
                    DataService.removeTripConnection(connection.id, data).then(function (data) {
                        if(data.error) {
                            toastr.error('Erro ao excluir a conexão', 'Exclusão de conexão', {timeOut: 3000});
                            return false;
                        } else {
                            toastr.success(data.message, 'Exclusão de conexão', {timeOut: 3000});
                        }
                    });
                }

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

        vm.submitEditTrip = function(form){

            var postData = {
                idTrip: $routeParams.id,
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
                postData['id_connection_' + i] = form.connections[i].id;
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
                postData['id_fuel_' + i] = form.fuels[i].id;
                postData['date_fuel_' + i] = form.fuels[i].date;
                postData['name_fuel_' + i] = form.fuels[i].name;
                postData['price_fuel_' + i] = form.fuels[i].price;
                postData['qtd_fuel_' + i] = form.fuels[i].qtd;
                postData['km_' + i] = form.fuels[i].km;
                postData['tank_' + i] = form.fuels[i].tanque;
            }

            for(i = 0; i < form.expenses.length; i++) {
                postData['id_expense_' + i] = form.expenses[i].id;
                postData['name_expense_' + i] = form.expenses[i].name;
                postData['date_expense_' + i] = form.expenses[i].date;
                postData['type_expense_' + i] = form.expenses[i].type;
                postData['value_expense_' + i] = form.expenses[i].value;
            }

            DataService.submitEditTrip(postData, $routeParams.id).then(function(response) {

                if(response.error === false) {
                    $rootScope.$broadcast("login-done");

                    form.id = $routeParams.id;
                    $localstorage.remove('trip');
                    $localstorage.setObject('trip', form);
                    $location.path('/add-trip-confirm');

                } else {
                    toastr.error(response.message, 'Alteração de viagem', {timeOut: 3000});
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