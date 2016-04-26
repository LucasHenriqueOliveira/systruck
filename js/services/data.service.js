(function () {
    'use strict';

    angular
        .module('app')
        .factory('DataService', DataService);

    DataService.$inject = ['$localstorage', '$timeout', '$http', '$q'];

    function DataService($localstorage, $timeout, $http, $q){
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
                            name : expense.name,
                            type : expense.type,
                            value : expense.value,
                            date: expense.date
                        });
                    });
                }
                return arrExpenses;
            },

            getPart: function() {
                var arrParts = [];
                var parts = $localstorage.getObject('parts');

                if(JSON.stringify(parts) !== '{}'){
                    parts.forEach(function (part) {

                        arrParts.push({
                            id_part: part.id_part,
                            name_part : part.name_part,
                            qtd : part.qtd,
                            price : part.price,
                            price_unit: part.price_unit,
                            id_stock: part.id_stock,
                            desc_stock: part.desc_stock
                        });
                    });
                }
                return arrParts;
            },

            getPartTruck: function() {
                var arrParts = [];
                var parts = $localstorage.getObject('truck_parts');

                if(JSON.stringify(parts) !== '{}'){
                    parts.forEach(function (part) {

                        arrParts.push({
                            name : part.name,
                            id : part.id,
                            time : part.time,
                            last: part.last,
                            stock: part.stock,
                            stock_name: part.stock_name
                        });
                    });
                }
                return arrParts;
            },

            getTrip: function() {

                var trip = $localstorage.getObject('trip');

                if(JSON.stringify(trip) !== '{}'){

                }
                return trip;
            },

            getDataDashboard: function() {

                var company = $localstorage.getObject('company');
                var roles = $localstorage.getObject('roles');

                var deferred = $q.defer();

                 $http({
                    method: 'POST',
                    url: 'http://localhost:8081/api/v1/dash',
                    data: {
                        company: company,
                        roles: roles
                    }
                 })
                    .then(function(response) {

                        deferred.resolve(response.data);


                    }, function(error) {
                        console.log(error);
                    });

                return deferred.promise;
            },

            getDataHeader: function() {

                var company = $localstorage.getObject('company');

                var deferred = $q.defer();

                $http({
                    method: 'GET',
                    url: 'http://localhost:8081/api/v1/header/' + company
                })
                    .then(function(response) {

                        deferred.resolve(response.data);


                    }, function(error) {
                        console.log(error);
                    });

                return deferred.promise;
            },

            getTrucksDriversCities: function() {

                var company = $localstorage.getObject('company');

                var deferred = $q.defer();

                $http({
                    method: 'GET',
                    url: 'http://localhost:8081/api/v1/trucks-drivers-cities/' + company
                })
                    .then(function(response) {

                        deferred.resolve(response.data);


                    }, function(error) {
                        console.log(error);
                    });

                return deferred.promise;
            },

            getDriverToTruck: function(truck) {

                var deferred = $q.defer();

                $http({
                    method: 'GET',
                    url: 'http://localhost:8081/api/v1/driver-to-truck/' + truck
                })
                    .then(function(response) {

                        deferred.resolve(response.data);


                    }, function(error) {
                        console.log(error);
                    });

                return deferred.promise;
            },

            submitAddTrip: function(postData) {

                var deferred = $q.defer();

                $http({
                    method: 'POST',
                    url: 'http://localhost:8081/api/v1/add-trip',
                    data: postData
                })
                    .then(function(response) {

                        deferred.resolve(response.data);


                    }, function(error) {
                        console.log(error);
                    });

                return deferred.promise;
            },

            getLastTrip: function() {

                var company = $localstorage.getObject('company');

                var deferred = $q.defer();

                $http({
                    method: 'GET',
                    url: 'http://localhost:8081/api/v1/last-trip/' + company
                })
                    .then(function(response) {

                        deferred.resolve(response.data);


                    }, function(error) {
                        console.log(error);
                    });

                return deferred.promise;
            },

            getSearchTrip: function(postData) {

                var deferred = $q.defer();

                $http({
                    method: 'POST',
                    url: 'http://localhost:8081/api/v1/search-trip/',
                    data: postData
                })
                    .then(function(response) {

                        deferred.resolve(response.data);


                    }, function(error) {
                        console.log(error);
                    });

                return deferred.promise;
            },

            getSearchMaintenance: function(postData) {

                var deferred = $q.defer();

                $http({
                    method: 'POST',
                    url: 'http://localhost:8081/api/v1/search-maintenance/',
                    data: postData
                })
                    .then(function(response) {

                        deferred.resolve(response.data);


                    }, function(error) {
                        console.log(error);
                    });

                return deferred.promise;
            },

            getCompany: function() {

                var company = $localstorage.getObject('company');

                var deferred = $q.defer();

                $http({
                    method: 'GET',
                    url: 'http://localhost:8081/api/v1/company/' + company
                })
                    .then(function(response) {

                        deferred.resolve(response.data);


                    }, function(error) {
                        console.log(error);
                    });

                return deferred.promise;
            },

            getCities: function() {

                var deferred = $q.defer();

                $http({
                    method: 'GET',
                    url: 'http://localhost:8081/api/v1/cities'
                })
                    .then(function(response) {

                        deferred.resolve(response.data);


                    }, function(error) {
                        console.log(error);
                    });

                return deferred.promise;
            },

            getCompanyLocal: function() {

                var company = $localstorage.getObject('companyData');

                if(JSON.stringify(company) !== '{}'){

                }
                return company;
            },

            editCompany: function(dataCompany) {

                var deferred = $q.defer();

                $http({
                    method: 'PUT',
                    url: 'http://localhost:8081/api/v1/edit-company',
                    data: dataCompany
                })
                    .then(function(response) {

                        deferred.resolve(response.data);


                    }, function(error) {
                        console.log(error);
                    });

                return deferred.promise;
            },

            getParts: function() {

                var deferred = $q.defer();

                $http({
                    method: 'GET',
                    url: 'http://localhost:8081/api/v1/parts'
                })
                    .then(function(response) {

                        deferred.resolve(response.data);


                    }, function(error) {
                        console.log(error);
                    });

                return deferred.promise;
            },

            getRealizedMaintenance: function() {

                var company = $localstorage.getObject('company');

                var deferred = $q.defer();

                $http({
                    method: 'GET',
                    url: 'http://localhost:8081/api/v1/realized-maintenance/' + company
                })
                    .then(function(response) {

                        deferred.resolve(response.data);


                    }, function(error) {
                        console.log(error);
                    });

                return deferred.promise;
            },

            getLastMaintenance: function() {

                var company = $localstorage.getObject('company');

                var deferred = $q.defer();

                $http({
                    method: 'GET',
                    url: 'http://localhost:8081/api/v1/last-maintenance/' + company
                })
                    .then(function(response) {

                        deferred.resolve(response.data);


                    }, function(error) {
                        console.log(error);
                    });

                return deferred.promise;
            },

            getMaintenance: function() {

                var maintenance = $localstorage.getObject('maintenance');

                if(JSON.stringify(maintenance) !== '{}'){

                }
                return maintenance;
            },

            getChartProfitTotal: function() {

                var data_chart = [{
                    name: 'Resultado',
                    data: [25311, 35245, 45236, 45234, 45211, 20124, 55111, 35111, 30012, 34912, 34562, 34210]
                }];

                var data_table = [{ month: 'Janeiro', value: 'R$25.311,00'},
                    { month: 'Fevereiro', value: 'R$35.245,00'},
                    { month: 'Março', value: 'R$45.236,00'},
                    { month: 'Abril', value: 'R$45.234,00'},
                    { month: 'Maio', value: 'R$45.211,00'},
                    { month: 'Junho', value: 'R$20.124,00'},
                    { month: 'Julho', value: 'R$55.111,00'},
                    { month: 'Agosto', value: 'R$35.111,00'},
                    { month: 'Setembro', value: 'R$30.012,00'},
                    { month: 'Outubro', value: 'R$34.912,00'},
                    { month: 'Novembro', value: 'R$34.562,00'},
                    { month: 'Dezembro', value: 'R$34.210,00'}];

                var field_table = ['month', 'value'];
                var title_table = ['Mês', 'Valor'];
                var total_table = 458542;

                var data = {
                    data: data_table,
                    title: title_table,
                    field: field_table,
                    total: total_table
                };

                var highchartsNG = {
                    options: {
                        chart: {
                            type: 'line'
                        },
                        tooltip: {
                            valuePrefix: 'R$'
                        }
                    },
                    title: {
                        text: 'Resultado Total'
                    },
                    xAxis: {
                        categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
                    },
                    yAxis: {
                        min: 0,
                        allowDecimals: true,
                        title: {
                            text: 'Resultado (R$)'
                        }
                    },
                    plotOptions: {
                        line: {
                            dataLabels: {
                                enabled: true
                            },
                            enableMouseTracking: false
                        }
                    },
                    series: data_chart,
                    func: function(chart) {
                        $timeout(function() {
                            chart.reflow();
                        }, 0);
                    }
                };

                var chart = {
                    highchartsNG : highchartsNG,
                    data: data
                };

                return chart;
            },

            getChartProfitTruck: function(initial, final) {
                var dataLabels = {
                    enabled: true,
                    color: 'black',
                    formatter: function () {
                        return 'R$ ' + this.y;
                    }
                };
                var subtitle = initial + ' a ' + final;

                var data_chart = [{ name: 'HGL-1909', data: [5311], dataLabels: dataLabels},
                    { name:'HTT-0109', data: [5245], dataLabels: dataLabels},
                    { name:'HHL-2123', data: [5236], dataLabels: dataLabels},
                    { name:'HOL-2338', data: [5234], dataLabels: dataLabels},
                    { name:'HGL-2432', data: [5211], dataLabels: dataLabels},
                    { name:'HGL-1914', data: [5124], dataLabels: dataLabels},
                    { name:'HQR-4234', data: [5111], dataLabels: dataLabels},
                    { name:'HGL-1909', data: [5111], dataLabels: dataLabels},
                    { name:'HGL-6474', data: [5012], dataLabels: dataLabels},
                    { name:'HFB-5758', data: [4912], dataLabels: dataLabels}];

                var data_table = [{ fleet: '20.279', name: 'Scania P310',board: 'HGL-1909', board_semi: 'HGL-1908', value: 'R$5.311,00'},
                    { fleet: '20.280', name: 'Scania P340',board:'HTT-0109', board_semi: 'HTT-0108', value: 'R$5.245,00'},
                    { fleet: '20.314', name: 'Scania P310',board:'HHL-2123', board_semi: 'HHL-2122', value: 'R$5.236,00'},
                    { fleet: '20.654', name: 'Scania P340',board:'HOL-2338', board_semi: 'HOL-2337', value: 'R$5.234,00'},
                    { fleet: '20.323', name: 'Iveco Stralis 420',board:'HGL-2432', board_semi: 'HGL-2431', value: 'R$5.211,00'},
                    { fleet: '20.259', name: 'Scania P310',board:'HGL-1914', board_semi: 'HGL-1913', value: 'R$5.124,00'},
                    { fleet: '23.423', name: 'Iveco Stralis 420',board:'HQR-4234', board_semi: 'HQR-4233', value: 'R$5.111,00'},
                    { fleet: '20.675', name: 'Scania P310',board:'HGL-1909', board_semi: 'HGL-1908', value: 'R$5.111,00'},
                    { fleet: '20.876', name: 'Scania P340',board:'HGL-6474', board_semi: 'HGL-6473', value: 'R$5.012,00'},
                    { fleet: '20.856', name: 'Scania P340',board:'HFB-5758', board_semi: 'HFB-5757', value: 'R$4.912,00'}];

                var field_table = ['fleet', 'name', 'board', 'board_semi', 'value'];
                var title_table = ['Frota', 'Caminhão', 'Placa', 'Placa semi-reboque', 'Valor'];
                var total_table = 58542;

                var data = {
                    data: data_table,
                    title: title_table,
                    field: field_table,
                    total: total_table
                };

                var highchartsNG = {
                    options: {
                        chart: {
                            type: 'bar'
                        },
                        tooltip: {
                            valuePrefix: 'R$'
                        }
                    },
                    title: {
                        text: 'Resultado x Caminhão'
                    },
                    subtitle: {
                        text: subtitle
                    },
                    xAxis: {
                        categories: [
                            'Caminhão'
                        ]
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Resultado (R$)'
                        }
                    },
                    series: data_chart,
                    func: function(chart) {
                        $timeout(function() {
                            chart.reflow();
                        }, 0);
                    }
                };

                var chart = {
                    highchartsNG : highchartsNG,
                    data: data
                };

                return chart;
            },

            getChartProfitDriver: function(initial, final) {
                var dataLabels = {
                    enabled: true,
                    color: 'black',
                    formatter: function () {
                        return 'R$ ' + this.y;
                    }
                };
                var subtitle = initial + ' a ' + final;

                var data_chart = [{ name: 'Ruy Arruda Cassiano', data: [5311], dataLabels: dataLabels},
                    { name:'Matheus André da Silva', data: [5245], dataLabels: dataLabels},
                    { name:'Paulo Holanda Ribeiro Netto', data: [5236], dataLabels: dataLabels},
                    { name:'José Lucas Ferreira e Silva', data: [5234], dataLabels: dataLabels},
                    { name:'Guilherme Azevedo Reis', data: [5211], dataLabels: dataLabels},
                    { name:'Gilberto Oliveira', data: [5211], dataLabels: dataLabels},
                    { name:'Arthur Felipe R. Costa', data: [5124], dataLabels: dataLabels},
                    { name:'Lucas Henrique de Oliveira', data: [5111], dataLabels: dataLabels}];

                var data_table = [{ name: 'Ruy Arruda Cassiano', value: 'R$5.311,00'},
                    { name: 'Matheus André da Silva', value: 'R$5.245,00'},
                    { name: 'Paulo Holanda Ribeiro Netto', value: 'R$5.236,00'},
                    { name: 'José Lucas Ferreira e Silva', value: 'R$5.234,00'},
                    { name: 'Guilherme Azevedo Reis', value: 'R$5.211,00'},
                    { name: 'Gilberto Oliveira', value: 'R$5.211,00'},
                    { name: 'Arthur Felipe R. Costa', value: 'R$5.124,00'},
                    { name: 'Lucas Henrique de Oliveira', value: 'R$5.111,00'}];

                var field_table = ['name', 'value'];
                var title_table = ['Motorista', 'Valor'];
                var total_table = 58542;

                var data = {
                    data: data_table,
                    title: title_table,
                    field: field_table,
                    total: total_table
                };

                var highchartsNG = {
                    options: {
                        chart: {
                            type: 'bar'
                        },
                        tooltip: {
                            valuePrefix: 'R$'
                        }
                    },
                    title: {
                        text: 'Resultado x Motorista'
                    },
                    subtitle: {
                        text: subtitle
                    },
                    xAxis: {
                        categories: [
                            'Motorista'
                        ]
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Resultado (R$)'
                        }
                    },
                    series: data_chart,
                    func: function(chart) {
                        $timeout(function() {
                            chart.reflow();
                        }, 0);
                    }
                };

                var chart = {
                    highchartsNG : highchartsNG,
                    data: data
                };

                return chart;
            },

            getChartExpenseTotal: function() {

                var data_chart = [{
                    name: 'Despesa',
                    data: [25311, 35245, 45236, 45234, 45211, 20124, 55111, 35111, 30012, 34912, 34562, 34210]
                }];

                var data_table = [{ month: 'Janeiro', value: 'R$25.311,00'},
                    { month: 'Fevereiro', value: 'R$35.245,00'},
                    { month: 'Março', value: 'R$45.236,00'},
                    { month: 'Abril', value: 'R$45.234,00'},
                    { month: 'Maio', value: 'R$45.211,00'},
                    { month: 'Junho', value: 'R$20.124,00'},
                    { month: 'Julho', value: 'R$55.111,00'},
                    { month: 'Agosto', value: 'R$35.111,00'},
                    { month: 'Setembro', value: 'R$30.012,00'},
                    { month: 'Outubro', value: 'R$34.912,00'},
                    { month: 'Novembro', value: 'R$34.562,00'},
                    { month: 'Dezembro', value: 'R$34.210,00'}];

                var field_table = ['month', 'value'];
                var title_table = ['Mês', 'Valor'];
                var total_table = 458542;

                var data = {
                    data: data_table,
                    title: title_table,
                    field: field_table,
                    total: total_table
                };

                var highchartsNG = {
                    options: {
                        chart: {
                            type: 'line'
                        },
                        tooltip: {
                            valuePrefix: 'R$'
                        }
                    },
                    title: {
                        text: 'Despesa Total'
                    },
                    xAxis: {
                        categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
                    },
                    yAxis: {
                        min: 0,
                        allowDecimals: true,
                        title: {
                            text: 'Despesa (R$)'
                        }
                    },
                    plotOptions: {
                        line: {
                            dataLabels: {
                                enabled: true
                            },
                            enableMouseTracking: false
                        }
                    },
                    series: data_chart,
                    func: function(chart) {
                        $timeout(function() {
                            chart.reflow();
                        }, 0);
                    }
                };

                var chart = {
                    highchartsNG : highchartsNG,
                    data: data
                };

                return chart;
            },

            getChartExpenseTruck: function(initial, final) {
                var dataLabels = {
                    enabled: true,
                    color: 'black',
                    formatter: function () {
                        return 'R$ ' + this.y;
                    }
                };
                var subtitle = initial + ' a ' + final;

                var data_chart = [{ name: 'HGL-1909', data: [5311], dataLabels: dataLabels},
                    { name:'HTT-0109', data: [5245], dataLabels: dataLabels},
                    { name:'HHL-2123', data: [5236], dataLabels: dataLabels},
                    { name:'HOL-2338', data: [5234], dataLabels: dataLabels},
                    { name:'HGL-2432', data: [5211], dataLabels: dataLabels},
                    { name:'HGL-1914', data: [5124], dataLabels: dataLabels},
                    { name:'HQR-4234', data: [5111], dataLabels: dataLabels},
                    { name:'HGL-1909', data: [5111], dataLabels: dataLabels},
                    { name:'HGL-6474', data: [5012], dataLabels: dataLabels},
                    { name:'HFB-5758', data: [4912], dataLabels: dataLabels}];

                var data_table = [{ fleet: '20.279', name: 'Scania P310',board: 'HGL-1909', board_semi: 'HGL-1908', value: 'R$5.311,00'},
                    { fleet: '20.280', name: 'Scania P340',board:'HTT-0109', board_semi: 'HTT-0108', value: 'R$5.245,00'},
                    { fleet: '20.314', name: 'Scania P310',board:'HHL-2123', board_semi: 'HHL-2122', value: 'R$5.236,00'},
                    { fleet: '20.654', name: 'Scania P340',board:'HOL-2338', board_semi: 'HOL-2337', value: 'R$5.234,00'},
                    { fleet: '20.323', name: 'Iveco Stralis 420',board:'HGL-2432', board_semi: 'HGL-2431', value: 'R$5.211,00'},
                    { fleet: '20.259', name: 'Scania P310',board:'HGL-1914', board_semi: 'HGL-1913', value: 'R$5.124,00'},
                    { fleet: '23.423', name: 'Iveco Stralis 420',board:'HQR-4234', board_semi: 'HQR-4233', value: 'R$5.111,00'},
                    { fleet: '20.675', name: 'Scania P310',board:'HGL-1909', board_semi: 'HGL-1908', value: 'R$5.111,00'},
                    { fleet: '20.876', name: 'Scania P340',board:'HGL-6474', board_semi: 'HGL-6473', value: 'R$5.012,00'},
                    { fleet: '20.856', name: 'Scania P340',board:'HFB-5758', board_semi: 'HFB-5757', value: 'R$4.912,00'}];

                var field_table = ['fleet', 'name', 'board', 'board_semi', 'value'];
                var title_table = ['Frota', 'Caminhão', 'Placa', 'Placa semi-reboque', 'Valor'];
                var total_table = 58542;

                var data = {
                    data: data_table,
                    title: title_table,
                    field: field_table,
                    total: total_table
                };

                var highchartsNG = {
                    options: {
                        chart: {
                            type: 'bar'
                        },
                        tooltip: {
                            valuePrefix: 'R$'
                        }
                    },
                    title: {
                        text: 'Despesa x Caminhão'
                    },
                    subtitle: {
                        text: subtitle
                    },
                    xAxis: {
                        categories: [
                            'Despesa'
                        ]
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Despesa (R$)'
                        }
                    },
                    series: data_chart,
                    func: function(chart) {
                        $timeout(function() {
                            chart.reflow();
                        }, 0);
                    }
                };

                var chart = {
                    highchartsNG : highchartsNG,
                    data: data
                };

                return chart;
            },

            getChartExpenseDriver: function(initial, final) {
                var dataLabels = {
                    enabled: true,
                    color: 'black',
                    formatter: function () {
                        return 'R$ ' + this.y;
                    }
                };
                var subtitle = initial + ' a ' + final;

                var data_chart = [{ name: 'Ruy Arruda Cassiano', data: [5311], dataLabels: dataLabels},
                    { name:'Matheus André da Silva', data: [5245], dataLabels: dataLabels},
                    { name:'Paulo Holanda Ribeiro Netto', data: [5236], dataLabels: dataLabels},
                    { name:'José Lucas Ferreira e Silva', data: [5234], dataLabels: dataLabels},
                    { name:'Guilherme Azevedo Reis', data: [5211], dataLabels: dataLabels},
                    { name:'Gilberto Oliveira', data: [5211], dataLabels: dataLabels},
                    { name:'Arthur Felipe R. Costa', data: [5124], dataLabels: dataLabels},
                    { name:'Lucas Henrique de Oliveira', data: [5111], dataLabels: dataLabels}];

                var data_table = [{ name: 'Ruy Arruda Cassiano', value: 'R$5.311,00'},
                    { name: 'Matheus André da Silva', value: 'R$5.245,00'},
                    { name: 'Paulo Holanda Ribeiro Netto', value: 'R$5.236,00'},
                    { name: 'José Lucas Ferreira e Silva', value: 'R$5.234,00'},
                    { name: 'Guilherme Azevedo Reis', value: 'R$5.211,00'},
                    { name: 'Gilberto Oliveira', value: 'R$5.211,00'},
                    { name: 'Arthur Felipe R. Costa', value: 'R$5.124,00'},
                    { name: 'Lucas Henrique de Oliveira', value: 'R$5.111,00'}];

                var field_table = ['name', 'value'];
                var title_table = ['Motorista', 'Valor'];
                var total_table = 58542;

                var data = {
                    data: data_table,
                    title: title_table,
                    field: field_table,
                    total: total_table
                };

                var highchartsNG = {
                    options: {
                        chart: {
                            type: 'bar'
                        },
                        tooltip: {
                            valuePrefix: 'R$'
                        }
                    },
                    title: {
                        text: 'Despesa x Motorista'
                    },
                    subtitle: {
                        text: subtitle
                    },
                    xAxis: {
                        categories: [
                            'Despesa'
                        ]
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Despesa (R$)'
                        }
                    },
                    series: data_chart,
                    func: function(chart) {
                        $timeout(function() {
                            chart.reflow();
                        }, 0);
                    }
                };

                var chart = {
                    highchartsNG : highchartsNG,
                    data: data
                };

                return chart;
            },

            getChartMaintenanceTotal: function() {

                var data_chart = [{
                    name: 'Manutenção',
                    data: [25311, 35245, 45236, 45234, 45211, 20124, 55111, 35111, 30012, 34912, 34562, 34210]
                }];

                var data_table = [{ month: 'Janeiro', value: 'R$25.311,00'},
                    { month: 'Fevereiro', value: 'R$35.245,00'},
                    { month: 'Março', value: 'R$45.236,00'},
                    { month: 'Abril', value: 'R$45.234,00'},
                    { month: 'Maio', value: 'R$45.211,00'},
                    { month: 'Junho', value: 'R$20.124,00'},
                    { month: 'Julho', value: 'R$55.111,00'},
                    { month: 'Agosto', value: 'R$35.111,00'},
                    { month: 'Setembro', value: 'R$30.012,00'},
                    { month: 'Outubro', value: 'R$34.912,00'},
                    { month: 'Novembro', value: 'R$34.562,00'},
                    { month: 'Dezembro', value: 'R$34.210,00'}];

                var field_table = ['month', 'value'];
                var title_table = ['Mês', 'Valor'];
                var total_table = 458542;

                var data = {
                    data: data_table,
                    title: title_table,
                    field: field_table,
                    total: total_table
                };

                var highchartsNG = {
                    options: {
                        chart: {
                            type: 'line'
                        },
                        tooltip: {
                            valuePrefix: 'R$'
                        }
                    },
                    title: {
                        text: 'Manutenção Total'
                    },
                    xAxis: {
                        categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
                    },
                    yAxis: {
                        min: 0,
                        allowDecimals: true,
                        title: {
                            text: 'Manutenção (R$)'
                        }
                    },
                    plotOptions: {
                        line: {
                            dataLabels: {
                                enabled: true
                            },
                            enableMouseTracking: false
                        }
                    },
                    series: data_chart,
                    func: function(chart) {
                        $timeout(function() {
                            chart.reflow();
                        }, 0);
                    }
                };

                var chart = {
                    highchartsNG : highchartsNG,
                    data: data
                };

                return chart;
            },

            getChartMaintenanceTruck: function(initial, final) {
                var dataLabels = {
                    enabled: true,
                    color: 'black',
                    formatter: function () {
                        return 'R$ ' + this.y;
                    }
                };
                var subtitle = initial + ' a ' + final;

                var data_chart = [{ name: 'HGL-1909', data: [5311], dataLabels: dataLabels},
                    { name:'HTT-0109', data: [5245], dataLabels: dataLabels},
                    { name:'HHL-2123', data: [5236], dataLabels: dataLabels},
                    { name:'HOL-2338', data: [5234], dataLabels: dataLabels},
                    { name:'HGL-2432', data: [5211], dataLabels: dataLabels},
                    { name:'HGL-1914', data: [5124], dataLabels: dataLabels},
                    { name:'HQR-4234', data: [5111], dataLabels: dataLabels},
                    { name:'HGL-1909', data: [5111], dataLabels: dataLabels},
                    { name:'HGL-6474', data: [5012], dataLabels: dataLabels},
                    { name:'HFB-5758', data: [4912], dataLabels: dataLabels}];

                var data_table = [{ fleet: '20.279', name: 'Scania P310',board: 'HGL-1909', board_semi: 'HGL-1908', value: 'R$5.311,00'},
                    { fleet: '20.280', name: 'Scania P340',board:'HTT-0109', board_semi: 'HTT-0108', value: 'R$5.245,00'},
                    { fleet: '20.314', name: 'Scania P310',board:'HHL-2123', board_semi: 'HHL-2122', value: 'R$5.236,00'},
                    { fleet: '20.654', name: 'Scania P340',board:'HOL-2338', board_semi: 'HOL-2337', value: 'R$5.234,00'},
                    { fleet: '20.323', name: 'Iveco Stralis 420',board:'HGL-2432', board_semi: 'HGL-2431', value: 'R$5.211,00'},
                    { fleet: '20.259', name: 'Scania P310',board:'HGL-1914', board_semi: 'HGL-1913', value: 'R$5.124,00'},
                    { fleet: '23.423', name: 'Iveco Stralis 420',board:'HQR-4234', board_semi: 'HQR-4233', value: 'R$5.111,00'},
                    { fleet: '20.675', name: 'Scania P310',board:'HGL-1909', board_semi: 'HGL-1908', value: 'R$5.111,00'},
                    { fleet: '20.876', name: 'Scania P340',board:'HGL-6474', board_semi: 'HGL-6473', value: 'R$5.012,00'},
                    { fleet: '20.856', name: 'Scania P340',board:'HFB-5758', board_semi: 'HFB-5757', value: 'R$4.912,00'}];

                var field_table = ['fleet', 'name', 'board', 'board_semi', 'value'];
                var title_table = ['Frota', 'Caminhão', 'Placa', 'Placa semi-reboque', 'Valor'];
                var total_table = 58542;

                var data = {
                    data: data_table,
                    title: title_table,
                    field: field_table,
                    total: total_table
                };

                var highchartsNG = {
                    options: {
                        chart: {
                            type: 'bar'
                        },
                        tooltip: {
                            valuePrefix: 'R$'
                        }
                    },
                    title: {
                        text: 'Manutenção x Caminhão'
                    },
                    subtitle: {
                        text: subtitle
                    },
                    xAxis: {
                        categories: [
                            'Manutenção'
                        ]
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Manutenção (R$)'
                        }
                    },
                    series: data_chart,
                    func: function(chart) {
                        $timeout(function() {
                            chart.reflow();
                        }, 0);
                    }
                };

                var chart = {
                    highchartsNG : highchartsNG,
                    data: data
                };

                return chart;
            },

            getChartMaintenancePart: function(initial, final) {
                var dataLabels = {
                    enabled: true,
                    color: 'black'
                };

                var subtitle = initial + ' a ' + final;

                var data_chart = [{ name: 'Óleo', data: [15], dataLabels: dataLabels},
                    { name:'Pneu', data: [8], dataLabels: dataLabels},
                    { name:'Amortecedores', data: [2], dataLabels: dataLabels},
                    { name:'Freio', data: [3], dataLabels: dataLabels},
                    { name:'Rolamento de roda', data: [2], dataLabels: dataLabels}];

                var data_table = [{ name: 'Óleo', value: 15},
                    { name:'Pneu', value: 8},
                    { name:'Amortecedores', value: 2},
                    { name:'Freio', value: 3},
                    { name:'Rolamento de roda', value: 2}];

                var field_table = ['name', 'value'];
                var title_table = ['Peça', 'Quantidade'];

                var data = {
                    data: data_table,
                    title: title_table,
                    field: field_table
                };

                var highchartsNG = {
                    options: {
                        chart: {
                            type: 'column'
                        }
                    },
                    title: {
                        text: 'Manutenção x Peça'
                    },
                    subtitle: {
                        text: subtitle
                    },
                    xAxis: {
                        categories: [
                            'Peça'
                        ]
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Quantidade (unid.)'
                        }
                    },
                    series: data_chart,
                    func: function(chart) {
                        $timeout(function() {
                            chart.reflow();
                        }, 0);
                    }
                };

                var chart = {
                    highchartsNG : highchartsNG,
                    data: data
                };

                return chart;
            },

            getChartTruckAverage: function(initial, final) {
                var dataLabels = {
                    enabled: true,
                    color: 'black'
                };

                var subtitle = initial + ' a ' + final;

                var data_chart = [{ name: 'HGL-1909', data: [3.64], dataLabels: dataLabels},
                    { name:'HTT-0109', data: [3.48], dataLabels: dataLabels},
                    { name:'HHL-2123', data: [2.93], dataLabels: dataLabels},
                    { name:'HOL-2338', data: [3.13], dataLabels: dataLabels},
                    { name:'HGL-2432', data: [2.93], dataLabels: dataLabels},
                    { name:'HGL-1914', data: [3.82], dataLabels: dataLabels},
                    { name:'HQR-4234', data: [2.59], dataLabels: dataLabels},
                    { name:'HGL-1909', data: [3.44], dataLabels: dataLabels},
                    { name:'HGL-6474', data: [3.08], dataLabels: dataLabels},
                    { name:'HFB-5758', data: [3.22], dataLabels: dataLabels}];

                var data_table = [{ fleet: '20.279', name: 'Scania P310',board: 'HGL-1909', board_semi: 'HGL-1908', value: 3.64},
                    { fleet: '20.280', name: 'Scania P340',board:'HTT-0109', board_semi: 'HTT-0108', value: 3.48},
                    { fleet: '20.314', name: 'Scania P310',board:'HHL-2123', board_semi: 'HHL-2122', value: 2.93},
                    { fleet: '20.654', name: 'Scania P340',board:'HOL-2338', board_semi: 'HOL-2337', value: 3.13},
                    { fleet: '20.323', name: 'Iveco Stralis 420',board:'HGL-2432', board_semi: 'HGL-2431', value: 2.93},
                    { fleet: '20.259', name: 'Scania P310',board:'HGL-1914', board_semi: 'HGL-1913', value: 3.82},
                    { fleet: '23.423', name: 'Iveco Stralis 420',board:'HQR-4234', board_semi: 'HQR-4233', value: 2.59},
                    { fleet: '20.675', name: 'Scania P310',board:'HGL-1909', board_semi: 'HGL-1908', value: 3.44},
                    { fleet: '20.876', name: 'Scania P340',board:'HGL-6474', board_semi: 'HGL-6473', value: 3.08},
                    { fleet: '20.856', name: 'Scania P340',board:'HFB-5758', board_semi: 'HFB-5757', value: 3.22}];

                var field_table = ['fleet', 'name', 'board', 'board_semi', 'value'];
                var title_table = ['Frota', 'Caminhão', 'Placa', 'Placa semi-reboque', 'Média'];

                var data = {
                    data: data_table,
                    title: title_table,
                    field: field_table
                };

                var highchartsNG = {
                    options: {
                        chart: {
                            type: 'column'
                        }
                    },
                    title: {
                        text: 'Caminhão x Média'
                    },
                    subtitle: {
                        text: subtitle
                    },
                    xAxis: {
                        categories: [
                            'Caminhão'
                        ]
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Média (km/l)'
                        }
                    },
                    series: data_chart,
                    func: function(chart) {
                        $timeout(function() {
                            chart.reflow();
                        }, 0);
                    }
                };

                var chart = {
                    highchartsNG : highchartsNG,
                    data: data
                };

                return chart;
            },

            getChartTruckKm: function(initial, final) {
                var dataLabels = {
                    enabled: true,
                    color: 'black',
                    formatter: function () {
                        return this.y + ' km';
                    }
                };
                var subtitle = initial + ' a ' + final;

                var data_chart = [{ name: 'HGL-1909', data: [5311], dataLabels: dataLabels},
                    { name:'HTT-0109', data: [5245], dataLabels: dataLabels},
                    { name:'HHL-2123', data: [5236], dataLabels: dataLabels},
                    { name:'HOL-2338', data: [5234], dataLabels: dataLabels},
                    { name:'HGL-2432', data: [5211], dataLabels: dataLabels},
                    { name:'HGL-1914', data: [5124], dataLabels: dataLabels},
                    { name:'HQR-4234', data: [5111], dataLabels: dataLabels},
                    { name:'HGL-1909', data: [5111], dataLabels: dataLabels},
                    { name:'HGL-6474', data: [5012], dataLabels: dataLabels},
                    { name:'HFB-5758', data: [4912], dataLabels: dataLabels}];

                var data_table = [{ fleet: '20.279', name: 'Scania P310',board: 'HGL-1909', board_semi: 'HGL-1908', value: '5.311 km'},
                    { fleet: '20.280', name: 'Scania P340',board:'HTT-0109', board_semi: 'HTT-0108', value: '5.245 km'},
                    { fleet: '20.314', name: 'Scania P310',board:'HHL-2123', board_semi: 'HHL-2122', value: '5.236 km'},
                    { fleet: '20.654', name: 'Scania P340',board:'HOL-2338', board_semi: 'HOL-2337', value: '5.234 km'},
                    { fleet: '20.323', name: 'Iveco Stralis 420',board:'HGL-2432', board_semi: 'HGL-2431', value: '5.211 km'},
                    { fleet: '20.259', name: 'Scania P310',board:'HGL-1914', board_semi: 'HGL-1913', value: '5.124 km'},
                    { fleet: '23.423', name: 'Iveco Stralis 420',board:'HQR-4234', board_semi: 'HQR-4233', value: '5.111 km'},
                    { fleet: '20.675', name: 'Scania P310',board:'HGL-1909', board_semi: 'HGL-1908', value: '5.111 km'},
                    { fleet: '20.876', name: 'Scania P340',board:'HGL-6474', board_semi: 'HGL-6473', value: '5.012 km'},
                    { fleet: '20.856', name: 'Scania P340',board:'HFB-5758', board_semi: 'HFB-5757', value: '4.912 km'}];

                var field_table = ['fleet', 'name', 'board', 'board_semi', 'value'];
                var title_table = ['Frota', 'Caminhão', 'Placa', 'Placa semi-reboque', 'km rodado'];

                var data = {
                    data: data_table,
                    title: title_table,
                    field: field_table
                };

                var highchartsNG = {
                    options: {
                        chart: {
                            type: 'bar'
                        },
                        tooltip: {
                            valueSuffix: ' km'
                        }
                    },
                    title: {
                        text: 'Caminhão x km rodado'
                    },
                    subtitle: {
                        text: subtitle
                    },
                    xAxis: {
                        categories: [
                            'Caminhão'
                        ]
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'km rodado (km)'
                        }
                    },
                    series: data_chart,
                    func: function(chart) {
                        $timeout(function() {
                            chart.reflow();
                        }, 0);
                    }
                };

                var chart = {
                    highchartsNG : highchartsNG,
                    data: data
                };

                return chart;
            },

            getChartTruckTravel: function(initial, final) {
                var dataLabels = {
                    enabled: true,
                    color: 'black'
                };

                var subtitle = initial + ' a ' + final;

                var data_chart = [{ name: 'HGL-1909', data: [12], dataLabels: dataLabels},
                    { name:'HTT-0109', data: [8], dataLabels: dataLabels},
                    { name:'HHL-2123', data: [10], dataLabels: dataLabels},
                    { name:'HOL-2338', data: [8], dataLabels: dataLabels},
                    { name:'HGL-2432', data: [7], dataLabels: dataLabels},
                    { name:'HGL-1914', data: [11], dataLabels: dataLabels},
                    { name:'HQR-4234', data: [10], dataLabels: dataLabels},
                    { name:'HGL-1909', data: [4], dataLabels: dataLabels},
                    { name:'HGL-6474', data: [12], dataLabels: dataLabels},
                    { name:'HFB-5758', data: [10], dataLabels: dataLabels}];

                var data_table = [{ fleet: '20.279', name: 'Scania P310',board: 'HGL-1909', board_semi: 'HGL-1908', value: 12},
                    { fleet: '20.280', name: 'Scania P340',board:'HTT-0109', board_semi: 'HTT-0108', value: 8},
                    { fleet: '20.314', name: 'Scania P310',board:'HHL-2123', board_semi: 'HHL-2122', value: 10},
                    { fleet: '20.654', name: 'Scania P340',board:'HOL-2338', board_semi: 'HOL-2337', value: 8},
                    { fleet: '20.323', name: 'Iveco Stralis 420',board:'HGL-2432', board_semi: 'HGL-2431', value: 7},
                    { fleet: '20.259', name: 'Scania P310',board:'HGL-1914', board_semi: 'HGL-1913', value: 11},
                    { fleet: '23.423', name: 'Iveco Stralis 420',board:'HQR-4234', board_semi: 'HQR-4233', value: 10},
                    { fleet: '20.675', name: 'Scania P310',board:'HGL-1909', board_semi: 'HGL-1908', value: 4},
                    { fleet: '20.876', name: 'Scania P340',board:'HGL-6474', board_semi: 'HGL-6473', value: 12},
                    { fleet: '20.856', name: 'Scania P340',board:'HFB-5758', board_semi: 'HFB-5757', value: 10}];

                var field_table = ['fleet', 'name', 'board', 'board_semi', 'value'];
                var title_table = ['Frota', 'Caminhão', 'Placa', 'Placa semi-reboque', 'Qtd. Viagens'];

                var data = {
                    data: data_table,
                    title: title_table,
                    field: field_table
                };

                var highchartsNG = {
                    options: {
                        chart: {
                            type: 'column'
                        }
                    },
                    title: {
                        text: 'Caminhão x Viagem'
                    },
                    subtitle: {
                        text: subtitle
                    },
                    xAxis: {
                        categories: [
                            'Caminhão'
                        ]
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Viagem (unid.)'
                        }
                    },
                    series: data_chart,
                    func: function(chart) {
                        $timeout(function() {
                            chart.reflow();
                        }, 0);
                    }
                };

                var chart = {
                    highchartsNG : highchartsNG,
                    data: data
                };

                return chart;
            },

            getChartDriverTravel: function(initial, final) {
                var dataLabels = {
                    enabled: true,
                    color: 'black'
                };
                var subtitle = initial + ' a ' + final;

                var data_chart = [{ name: 'Ruy Arruda Cassiano', data: [12], dataLabels: dataLabels},
                    { name:'Matheus André da Silva', data: [10], dataLabels: dataLabels},
                    { name:'Paulo Holanda Ribeiro Netto', data: [11], dataLabels: dataLabels},
                    { name:'José Lucas Ferreira e Silva', data: [14], dataLabels: dataLabels},
                    { name:'Guilherme Azevedo Reis', data: [13], dataLabels: dataLabels},
                    { name:'Gilberto Oliveira', data: [13], dataLabels: dataLabels},
                    { name:'Arthur Felipe R. Costa', data: [12], dataLabels: dataLabels},
                    { name:'Lucas Henrique de Oliveira', data: [12], dataLabels: dataLabels}];

                var data_table = [{ name: 'Ruy Arruda Cassiano', value: 12},
                    { name: 'Matheus André da Silva', value: 10},
                    { name: 'Paulo Holanda Ribeiro Netto', value: 11},
                    { name: 'José Lucas Ferreira e Silva', value: 14},
                    { name: 'Guilherme Azevedo Reis', value: 13},
                    { name: 'Gilberto Oliveira', value: 13},
                    { name: 'Arthur Felipe R. Costa', value: 12},
                    { name: 'Lucas Henrique de Oliveira', value: 12}];

                var field_table = ['name', 'value'];
                var title_table = ['Motorista', 'Qtd. Viagens'];

                var data = {
                    data: data_table,
                    title: title_table,
                    field: field_table
                };

                var highchartsNG = {
                    options: {
                        chart: {
                            type: 'column'
                        }
                    },
                    title: {
                        text: 'Motorista x Qtd. Viagens'
                    },
                    subtitle: {
                        text: subtitle
                    },
                    xAxis: {
                        categories: [
                            'Motorista'
                        ]
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Qtd. Viagens (unid.)'
                        }
                    },
                    series: data_chart,
                    func: function(chart) {
                        $timeout(function() {
                            chart.reflow();
                        }, 0);
                    }
                };

                var chart = {
                    highchartsNG : highchartsNG,
                    data: data
                };

                return chart;
            },

            getChartDriverKm: function(initial, final) {
                var dataLabels = {
                    enabled: true,
                    color: 'black',
                    formatter: function () {
                        return this.y + ' km';
                    }
                };
                var subtitle = initial + ' a ' + final;

                var data_chart = [{ name: 'Ruy Arruda Cassiano', data: [4912], dataLabels: dataLabels},
                    { name:'Matheus André da Silva', data: [5412], dataLabels: dataLabels},
                    { name:'Paulo Holanda Ribeiro Netto', data: [4320], dataLabels: dataLabels},
                    { name:'José Lucas Ferreira e Silva', data: [4856], dataLabels: dataLabels},
                    { name:'Guilherme Azevedo Reis', data: [5122], dataLabels: dataLabels},
                    { name:'Gilberto Oliveira', data: [5120], dataLabels: dataLabels},
                    { name:'Arthur Felipe R. Costa', data: [5290], dataLabels: dataLabels},
                    { name:'Lucas Henrique de Oliveira', data: [5103], dataLabels: dataLabels}];

                var data_table = [{ name: 'Ruy Arruda Cassiano', value: '4.912 km'},
                    { name: 'Matheus André da Silva', value: '5.412 km'},
                    { name: 'Paulo Holanda Ribeiro Netto', value: '4.320 km'},
                    { name: 'José Lucas Ferreira e Silva', value: '4.856 km'},
                    { name: 'Guilherme Azevedo Reis', value: '5.122 km'},
                    { name: 'Gilberto Oliveira', value: '5.120 km'},
                    { name: 'Arthur Felipe R. Costa', value: '5.290 km'},
                    { name: 'Lucas Henrique de Oliveira', value: '5.103 km'}];

                var field_table = ['name', 'value'];
                var title_table = ['Motorista', 'Km rodado'];

                var data = {
                    data: data_table,
                    title: title_table,
                    field: field_table
                };

                var highchartsNG = {
                    options: {
                        chart: {
                            type: 'bar'
                        },
                        tooltip: {
                            valueSuffix: ' km'
                        }
                    },
                    title: {
                        text: 'Motorista x Km rodado'
                    },
                    subtitle: {
                        text: subtitle
                    },
                    xAxis: {
                        categories: [
                            'Motorista'
                        ]
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Km rodado (km)'
                        }
                    },
                    series: data_chart,
                    func: function(chart) {
                        $timeout(function() {
                            chart.reflow();
                        }, 0);
                    }
                };

                var chart = {
                    highchartsNG : highchartsNG,
                    data: data
                };

                return chart;
            },

            getChartTravelTotal: function() {

                var data_chart = [{
                    name: 'Viagem',
                    data: [30, 42, 39, 28, 48, 59, 62, 38, 40, 41, 50, 48]
                }];

                var data_table = [{ month: 'Janeiro', value: 30},
                    { month: 'Fevereiro', value: 42},
                    { month: 'Março', value: 39},
                    { month: 'Abril', value: 28},
                    { month: 'Maio', value: 48},
                    { month: 'Junho', value: 59},
                    { month: 'Julho', value: 62},
                    { month: 'Agosto', value: 38},
                    { month: 'Setembro', value: 40},
                    { month: 'Outubro', value: 41},
                    { month: 'Novembro', value: 50},
                    { month: 'Dezembro', value: 48}];

                var field_table = ['month', 'value'];
                var title_table = ['Mês', 'Qtd. Viagens'];

                var data = {
                    data: data_table,
                    title: title_table,
                    field: field_table
                };

                var highchartsNG = {
                    options: {
                        chart: {
                            type: 'line'
                        }
                    },
                    title: {
                        text: 'Viagem x Total'
                    },
                    xAxis: {
                        categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
                    },
                    yAxis: {
                        min: 0,
                        allowDecimals: true,
                        title: {
                            text: 'Qtd. Viagens (unid.)'
                        }
                    },
                    plotOptions: {
                        line: {
                            dataLabels: {
                                enabled: true
                            },
                            enableMouseTracking: false
                        }
                    },
                    series: data_chart,
                    func: function(chart) {
                        $timeout(function() {
                            chart.reflow();
                        }, 0);
                    }
                };

                var chart = {
                    highchartsNG : highchartsNG,
                    data: data
                };

                return chart;
            },

            getChartPart: function() {
                var date_add = new Date();
                var date_today = date_add.getDate() + '/' + (date_add.getMonth() + 1) + '/' +  date_add.getFullYear();

                var dataLabels = {
                    enabled: true,
                    color: 'black'
                };

                var data = [{ name: 'Óleo', data: [15], dataLabels: dataLabels},
                    { name:'Pneu', data: [8], dataLabels: dataLabels},
                    { name:'Amortecedores', data: [2], dataLabels: dataLabels},
                    { name:'Freio', data: [3], dataLabels: dataLabels},
                    { name:'Rolamento de roda', data: [2], dataLabels: dataLabels}];

                var highchartsNG = {
                    options: {
                        chart: {
                            type: 'column'
                        }
                    },
                    title: {
                        text: 'Estoque de Peças'
                    },
                    subtitle: {
                        text: date_today
                    },
                    xAxis: {
                        categories: [
                            'Peça'
                        ]
                    },
                    yAxis: {
                        min: 0,
                        allowDecimals: true,
                        title: {
                            text: 'Quantidade'
                        }
                    },
                    series: data,
                    func: function(chart) {
                        $timeout(function() {
                            chart.reflow();
                        }, 0);
                    }
                };

                return highchartsNG;
            }
        }
    }
})();