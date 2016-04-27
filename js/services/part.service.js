(function () {
    'use strict';

    angular
        .module('app')
        .factory('PartService', PartService);

    PartService.$inject = ['$http', '$rootScope', '$localstorage'];
    function PartService($http, $rootScope, $localstorage) {
        var service = {};
        var currentPart = {};
        var baseURL = 'http://systruck.com.br/api/v1/';

        service.getParts = getParts;
        service.getById = getById;
        service.getAllParts = getAllParts;
        service.create = create;
        service.createMaintenance = createMaintenance;
        service.update = update;
        service.removePart = removePart;
        service.removePartMaintenance = removePartMaintenance;
        service.updateMaintenance = updateMaintenance;
        service.activePart = activePart;
        service.setCurrentPart = setCurrentPart;
        service.getCurrentPart = getCurrentPart;

        return service;

        function getParts() {
            var id = $localstorage.getObject('company');
            return $http.get(baseURL + 'stock-parts/' + id).then(handleSuccess, handleError('Error getting all parts'));
        }

        function getById(id) {
            return $http.get(baseURL + 'part/' + id).then(handleSuccess, handleError('Error getting part by id'));
        }

        function getAllParts() {
            var id = $localstorage.getObject('company');
            return $http.get(baseURL + 'all-parts/' + id).then(handleSuccess, handleError('Error getting all parts'));
        }

        function create(part) {
            return $http.post(baseURL + 'part', part).then(handleSuccess, handleError('Error creating part'));
        }

        function createMaintenance(maintenance) {
            return $http.post(baseURL + 'maintenance', maintenance).then(handleSuccess, handleError('Error creating maintenance'));
        }

        function activePart(id, part) {
            return $http.put(baseURL + 'active-part/' + id, part).then(handleSuccess, handleError('Error active part'));
        }

        function removePart(id, part) {
            return $http.put(baseURL + 'remove-part/' + id, part).then(handleSuccess, handleError('Error remove part'));
        }

        function removePartMaintenance(id, part) {
            return $http.put(baseURL + 'remove-maintenance/' + id, part).then(handleSuccess, handleError('Error remove part maintenance'));
        }

        function updateMaintenance(id, maintenance) {
            return $http.put(baseURL + 'maintenance/' + id, maintenance).then(handleSuccess, handleError('Error update part maintenance'));
        }

        function update(part) {
            return $http.put(baseURL + 'part/' + part.id, part).then(handleSuccess, handleError('Error updating part'));
        }

        function setCurrentPart(part) {
            currentPart = part;
        }

        function getCurrentPart() {
            return currentPart;
        }

        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error, error: true };
            };
        }
    }

})();
