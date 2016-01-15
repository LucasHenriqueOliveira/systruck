(function () {
    'use strict';

    angular
        .module('app')
        .factory('DataService', DataService);

    DataService.$inject = ['$localstorage'];

    function DataService($localstorage){
        return {
            getFuel: function() {
                var arrFuels = [];
                var fuels = $localstorage.getObject('fuels');

                if(JSON.stringify(fuels) !== '{}'){
                    fuels.forEach(function (fuel) {

                        arrFuels.push({
                            name : fuel.name,
                            qtd : fuel.qtd,
                            price : fuel.price,
                            date: fuel.date
                        });
                    });
                }
                return arrFuels;
            },

            getExpense: function() {
                var arrExpenses = [];
                var expenses = $localstorage.getObject('expenses');

                if(JSON.stringify(expenses) !== '{}'){
                    expenses.forEach(function (expense) {

                        arrExpenses.push({
                            type : expense.type,
                            value : expense.value,
                            date: expense.date
                        });
                    });
                }
                return arrExpenses;
            },

            getTrip: function() {

                var trip = $localstorage.getObject('trip');

                if(JSON.stringify(trip) !== '{}'){

                }
                return trip;
            }
        }
    }
})();