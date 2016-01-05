(function () {
    'use strict';

    angular
        .module('app')
        .controller('LastTripController', LastTripController);

    LastTripController.$inject = ['$location'];

    function LastTripController($location) {
        var vm = this;

    }

})();
