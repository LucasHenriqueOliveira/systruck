(function () {
    'use strict';

    angular
        .module('app')
        .factory('UserService', UserService);

    UserService.$inject = ['$http', '$localstorage', 'CONFIG'];
    function UserService($http, $localstorage, CONFIG) {
        var service = {};
        var currentUser = {};
        var baseURL = CONFIG.url;

        service.getUsers = getUsers;
        service.getById = getById;
        service.getProfileById = getProfileById;
        service.create = create;
        service.update = update;
        service.removeUser = removeUser;
        service.activeUser = activeUser;
        service.setCurrentUser = setCurrentUser;
        service.getCurrentUser = getCurrentUser;
        service.changePassword = changePassword;

        return service;

        function getUsers() {
            var id = $localstorage.getObject('company');
            return $http.get(baseURL + 'users/' + id).then(handleSuccess, handleError('Error getting all users'));
        }

        function getById(id) {
            return $http.get(baseURL + 'user/' + id).then(handleSuccess, handleError('Error getting user by id'));
        }

        function getProfileById(id) {
            return $http.get(baseURL +'profile/' + id).then(handleSuccess, handleError('Error getting user by id'));
        }

        function create(user) {
            return $http.post(baseURL + 'user', user).then(handleSuccess, handleError('Error creating user'));
        }

        function activeUser(id, user) {
            return $http.put(baseURL + 'active-user/' + id, user).then(handleSuccess, handleError('Error active user'));
        }

        function removeUser(id, user) {
            return $http.put(baseURL + 'remove-user/' + id, user).then(handleSuccess, handleError('Error remove user'));
        }

        function update(user) {
            return $http.put(baseURL + 'user/' + user.id, user).then(handleSuccess, handleError('Error updating user'));
        }

        function changePassword(user) {
            return $http.put(baseURL + 'change-password/', user).then(handleSuccess, handleError('Error updating password'));
        }

        function setCurrentUser(user) {
            currentUser = user;
        }

        function getCurrentUser() {
            return currentUser;
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
