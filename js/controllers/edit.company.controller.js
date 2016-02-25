(function () {
    'use strict';

    angular
        .module('app')
        .controller('EditCompanyController', EditCompanyController);

    EditCompanyController.$inject = ['$location', '$window'];

    function EditCompanyController($location, $window) {
        var vm = this;
        vm.company = {};
        vm.company.address = 'Rua São José';
        vm.company.number = '165';
        vm.company.complement = '';
        vm.company.neighboorhod = 'Sítios Guarani';
        vm.company.zip = '32.600-000';
        vm.company.phone1 = '3135948229';

        vm.back = function(){
            $window.history.back();
        };

    }

})();