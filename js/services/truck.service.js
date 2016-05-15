(function () {
    'use strict';

    angular
        .module('app')
        .factory('TruckService', TruckService);

    TruckService.$inject = ['$http', '$rootScope', '$localstorage', 'CONFIG'];
    function TruckService($http, $rootScope, $localstorage, CONFIG) {
        var service = {};
        var currentTruck = {};
        var baseURL = CONFIG.url;

        service.getTrucks = getTrucks;
        service.getById = getById;
        service.getTruckPart = getTruckPart;
        service.removeTruckPart = removeTruckPart;
        service.create = create;
        service.update = update;
        service.removeTruck = removeTruck;
        service.activeTruck = activeTruck;
        service.setCurrentTruck = setCurrentTruck;
        service.getCurrentTruck = getCurrentTruck;

        return service;

        function getTrucks() {
            var id = $localstorage.getObject('company');
            return $http.get(baseURL + 'trucks/' + id).then(handleSuccess, handleError('Error getting all trucks'));
        }

        function getById(id) {
            return $http.get(baseURL + 'truck/' + id).then(handleSuccess, handleError('Error getting truck by id'));
        }

        function getTruckPart(id) {
            return $http.get(baseURL + 'truck-part/' + id).then(handleSuccess, handleError('Error getting truck part by id'));
        }

        function removeTruckPart(id, truck) {
            return $http.put(baseURL + 'remove-truck-part/' + id, truck).then(handleSuccess, handleError('Error remove truck part'));
        }

        function create(truck) {
            return $http.post(baseURL + 'truck', truck).then(handleSuccess, handleError('Error creating truck'));
        }

        function activeTruck(id, truck) {
            return $http.put(baseURL + 'active-truck/' + id, truck).then(handleSuccess, handleError('Error active truck'));
        }

        function removeTruck(id, truck) {
            return $http.put(baseURL + 'remove-truck/' + id, truck).then(handleSuccess, handleError('Error remove truck'));
        }

        function update(truck) {
            return $http.put(baseURL + 'truck/' + truck.id, truck).then(handleSuccess, handleError('Error updating truck'));
        }

        function setCurrentTruck(truck) {
            currentTruck = truck;
        }

        function getCurrentTruck() {
            return currentTruck;
        }

        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }
    }

})();
