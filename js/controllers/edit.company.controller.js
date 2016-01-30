(function () {
    'use strict';

    angular
        .module('app')
        .controller('EditCompanyController', EditCompanyController);

    EditCompanyController.$inject = ['$location', '$window'];

    function EditCompanyController($location, $window) {
        var vm = this;

        vm.back = function(){
            $window.history.back();
        };

    }

})();