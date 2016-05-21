(function () {
    'use strict';

    angular
        .module('app')
        .controller('TripController', TripController);

    TripController.$inject = ['$location', '$localstorage', 'DataService', '$timeout', '$window', '$routeParams'];

    function TripController($location, $localstorage, DataService, $timeout, $window, $routeParams) {
        var vm = this;
        vm.trip = {};
        vm.connections = [];
        vm.fuels = [];
        vm.expenses = [];
        vm.loading = true;

        $timeout(function() {
            vm.loading = false;
        }, 2000);

        DataService.getTripServer($routeParams.id).then(function (data) {
            vm.trip = data.getTrip;
            vm.trip.id = $routeParams.id;

            vm.trip.dateOutput = vm.trip.viagem_data_saida;
            vm.trip.dateArrival = vm.trip.viagem_data_chegada;
            vm.trip.kmOutput = vm.trip.viagem_km_saida;
            vm.trip.kmArrival = vm.trip.viagem_km_chegada;
            vm.trip.kmPaid = vm.trip.viagem_valor_km;
            vm.trip.totalMoney = vm.trip.viagem_frete;
            vm.trip.moneyCompany = vm.trip.viagem_adiantamento;
            vm.trip.moneyComplement = vm.trip.viagem_complemento;
            vm.trip.comments = vm.trip.viagem_observacao;

            vm.trip.truckSelect = {
                id: vm.trip.viagem_carro_id,
                name: vm.trip.carro_placa + ' - ' + vm.trip.carro_nome,
                carro_nome: vm.trip.carro_nome,
                placa: vm.trip.carro_placa,
                frota: vm.trip.carro_frota,
                placa_semi_reboque: vm.trip.carro_placa_semi_reboque
            };

            vm.trip.driverSelect = {
                id: vm.trip.viagem_usuario_id,
                name: vm.trip.usuario_nome
            };

            vm.trip.cityHome = {
                id: vm.trip.viagem_cidade_origem_id,
                name: vm.trip.cidade_origem
            };

            vm.trip.cityDestination = {
                id: vm.trip.viagem_cidade_destino_id,
                name: vm.trip.cidade_destino
            };

            vm.trip.traveled = vm.trip.kmArrival - vm.trip.kmOutput;
            vm.trip.diffTraveled = vm.trip.traveled - (2 * vm.trip.kmPaid);

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
            vm.trip.connections = vm.connections;

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
            vm.trip.fuels = vm.fuels;

            for(var i = 0; i < data.getExpense.length; i++) {

                vm.expenses.push({
                    id: data.getExpense[i].despesa_id,
                    name: data.getExpense[i].despesa_nome,
                    type: data.getExpense[i].despesa_tipo,
                    value: data.getExpense[i].despesa_valor,
                    date: data.getExpense[i].despesa_data
                });
            }
            vm.trip.expenses = vm.expenses;

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
        });

        $localstorage.remove('fuels');
        $localstorage.remove('expenses');
        $localstorage.remove('connections');

        vm.printIt = function(){
            var table = document.getElementById('print').innerHTML;
            var myWindow = $window.open('', '', 'width=800, height=600');
            myWindow.document.write(table);
            myWindow.print();
        };

        vm.editTrip = function(id){
            $location.path('/edit-trip/' + id);
        };

        vm.back = function(){
            $window.history.back();
        };
    }

})();