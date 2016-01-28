(function () {
    'use strict';

    angular
        .module('app')
        .controller('SearchTripController', SearchTripController);

    SearchTripController.$inject = ['$location'];

    function SearchTripController($location) {
        var vm = this;

        vm.submitSearchTrip = function(form){

            if (typeof form.numberTrip !== "undefined"){
                $location.path('/research-trip');
            } else{
                $location.path('/last-trip');
            }
        }

    }

})();