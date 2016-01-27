(function () {
    'use strict';

    angular
        .module('app', ['ngRoute', 'ngCookies', 'ui.utils.masks', 'ui.mask', 'ngAnimate'])
        .config(config)
        .run(run);

    config.$inject = ['$routeProvider'];
    function config($routeProvider) {
        $routeProvider
            .when('/', {
                controller: 'DashboardController',
                templateUrl: 'dashboard.html',
                controllerAs: 'vm'
            })

            .when('/login', {
                controller: 'LoginController',
                templateUrl: 'login.html',
                controllerAs: 'vm'
            })

            .when('/register', {
                controller: 'RegisterController',
                templateUrl: 'register.html',
                controllerAs: 'vm'
            })

            .when('/user', {
                controller: 'UserController',
                templateUrl: 'user.html',
                controllerAs: 'vm'
            })

            .when('/truck', {
                controller: 'TruckController',
                templateUrl: 'truck.html',
                controllerAs: 'vm'
            })

            .when('/parts', {
                controller: 'PartsController',
                templateUrl: 'parts.html',
                controllerAs: 'vm'
            })

            .when('/company', {
                controller: 'CompanyController',
                templateUrl: 'company.html',
                controllerAs: 'vm'
            })

            .when('/edit-company', {
                controller: 'EditCompanyController',
                templateUrl: 'edit-company.html',
                controllerAs: 'vm'
            })

            .when('/trip/:id', {
                controller: 'TripController',
                templateUrl: 'trip.html',
                controllerAs: 'vm'
            })

            .when('/add-trip', {
                controller: 'AddTripController',
                templateUrl: 'add-trip.html',
                controllerAs: 'vm'
            })

            .when('/add-trip-confirm', {
                controller: 'AddTripConfirmController',
                templateUrl: 'add-trip-confirm.html',
                controllerAs: 'vm'
            })

            .when('/search-trip', {
                controller: 'SearchTripController',
                templateUrl: 'search-trip.html',
                controllerAs: 'vm'
            })

            .when('/research-trip', {
                controller: 'ResearchTripController',
                templateUrl: 'research-trip.html',
                controllerAs: 'vm'
            })

            .when('/last-trip', {
                controller: 'LastTripController',
                templateUrl: 'last-trip.html',
                controllerAs: 'vm'
            })

            .when('/add-maintenance', {
                controller: 'AddMaintenanceController',
                templateUrl: 'add-maintenance.html',
                controllerAs: 'vm'
            })

            .when('/search-maintenance', {
                controller: 'SearchMaintenanceController',
                templateUrl: 'search-maintenance.html',
                controllerAs: 'vm'
            })

            .when('/last-maintenance', {
                controller: 'LastMaintenanceController',
                templateUrl: 'last-maintenance.html',
                controllerAs: 'vm'
            })

            .when('/realized-maintenance', {
                controller: 'RealizedMaintenanceController',
                templateUrl: 'realized-maintenance.html',
                controllerAs: 'vm'
            })

            .otherwise({ redirectTo: '/login' });
    }

    run.$inject = ['$rootScope', '$location', '$cookieStore', '$http'];
    function run($rootScope, $location, $cookieStore, $http) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            var path = $location.path();
            if(path === '/login'){
                $rootScope.login = true;
            } else {
                $rootScope.login = false;
            }
            // redirect to login page if not logged in and trying to access a restricted page
            //var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
            var loggedIn = $rootScope.globals.currentUser;
            //if (restrictedPage && !loggedIn) {
            if (!loggedIn) {
                $location.path('/login');
            }
        });
    }

})();
