(function () {
    'use strict';

    angular
        .module('app')
        .controller('EditCompanyController', EditCompanyController);

    EditCompanyController.$inject = ['$window', 'DataService'];

    function EditCompanyController($window, DataService) {
        var vm = this;
        vm.cities = {};
        vm.company = DataService.getCompanyLocal();
        vm.cidade_id = {
            id: vm.company.empresa_cidade_id,
            name: vm.company.cidade_nome
        };

        DataService.getCities().then(function (data) {
            vm.cities = data;
        });

        vm.back = function(){
            $window.history.back();
        };
    }

})();