(function () {
    'use strict';

    angular
        .module('app')
        .controller('EditCompanyController', EditCompanyController);

    EditCompanyController.$inject = ['$window', 'DataService', '$location'];

    function EditCompanyController($window, DataService, $location) {
        var vm = this;
        vm.cities = {};
        vm.company = DataService.getCompanyLocal();
        vm.company.empresa_telefone_1 = (vm.company.empresa_telefone_1).replace(/\D+/g, '');
        vm.company.empresa_telefone_2 = (vm.company.empresa_telefone_2).replace(/\D+/g, '');
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

        vm.editCompany = function(data) {
            var dataCompany = {
                id: data.company.empresa_id,
                logradouro: data.company.empresa_logradouro,
                numero: data.company.empresa_numero,
                complemento: data.company.empresa_complemento,
                bairro: data.company.empresa_bairro,
                cidade_id: data.cidade_id.id,
                cidade_nome: data.cidade_id.name,
                cep: data.company.empresa_cep.replace(/\D+/g, ''),
                telefone1: data.company.empresa_telefone_1,
                telefone2: data.company.empresa_telefone_2
            };

            DataService.editCompany(dataCompany).then(function (data) {
                if(data.error) {
                    toastr.error(data.message, 'Empresa', {timeOut: 3000});
                } else {
                    toastr.success(data.message, 'Empresa', {timeOut: 3000});
                    $location.path('/company');
                }
            });
        };
    }

})();