(function () {
    'use strict';

    angular
        .module('app', ['ngRoute', 'ngCookies', 'ui.utils.masks', 'ui.mask', 'ngAnimate', 'highcharts-ng'])
        .config(config)
        .run(run);

    config.$inject = ['$routeProvider'];
    function config($routeProvider) {
        $routeProvider
            .when('/', {
                controller: 'DashboardController',
                templateUrl: 'templates/dashboard.html',
                controllerAs: 'vm'
            })

            .when('/login', {
                controller: 'LoginController',
                templateUrl: 'templates/login.html',
                controllerAs: 'vm'
            })

            .when('/register', {
                controller: 'RegisterController',
                templateUrl: 'templates/register.html',
                controllerAs: 'vm'
            })

            .when('/profile', {
                controller: 'ProfileController',
                templateUrl: 'templates/profile.html',
                controllerAs: 'vm'
            })

            .when('/users', {
                controller: 'UsersController',
                templateUrl: 'templates/users.html',
                controllerAs: 'vm'
            })

            .when('/user/:id', {
                controller: 'UserController',
                templateUrl: 'templates/user.html',
                controllerAs: 'vm'
            })

            .when('/trucks', {
                controller: 'TrucksController',
                templateUrl: 'templates/trucks.html',
                controllerAs: 'vm'
            })

            .when('/truck/:id', {
                controller: 'TruckController',
                templateUrl: 'templates/truck.html',
                controllerAs: 'vm'
            })

            .when('/parts', {
                controller: 'PartsController',
                templateUrl: 'templates/parts.html',
                controllerAs: 'vm'
            })

            .when('/company', {
                controller: 'CompanyController',
                templateUrl: 'templates/company.html',
                controllerAs: 'vm'
            })

            .when('/edit-company', {
                controller: 'EditCompanyController',
                templateUrl: 'templates/edit-company.html',
                controllerAs: 'vm'
            })

            .when('/trip/:id', {
                controller: 'TripController',
                templateUrl: 'templates/trip.html',
                controllerAs: 'vm'
            })

            .when('/add-trip', {
                controller: 'AddTripController',
                templateUrl: 'templates/add-trip.html',
                controllerAs: 'vm'
            })

            .when('/add-trip-confirm', {
                controller: 'AddTripConfirmController',
                templateUrl: 'templates/add-trip-confirm.html',
                controllerAs: 'vm'
            })

            .when('/search-trip', {
                controller: 'SearchTripController',
                templateUrl: 'templates/search-trip.html',
                controllerAs: 'vm'
            })

            .when('/research-trip', {
                controller: 'ResearchTripController',
                templateUrl: 'templates/research-trip.html',
                controllerAs: 'vm'
            })

            .when('/last-trip', {
                controller: 'LastTripController',
                templateUrl: 'templates/last-trip.html',
                controllerAs: 'vm'
            })

            .when('/maintenance/:id', {
                controller: 'MaintenanceController',
                templateUrl: 'templates/maintenance.html',
                controllerAs: 'vm'
            })

            .when('/add-maintenance', {
                controller: 'AddMaintenanceController',
                templateUrl: 'templates/add-maintenance.html',
                controllerAs: 'vm'
            })

            .when('/add-maintenance-confirm', {
                controller: 'AddMaintenanceConfirmController',
                templateUrl: 'templates/add-maintenance-confirm.html',
                controllerAs: 'vm'
            })

            .when('/search-maintenance', {
                controller: 'SearchMaintenanceController',
                templateUrl: 'templates/search-maintenance.html',
                controllerAs: 'vm'
            })

            .when('/research-maintenance', {
                controller: 'ResearchMaintenanceController',
                templateUrl: 'templates/research-maintenance.html',
                controllerAs: 'vm'
            })

            .when('/last-maintenance', {
                controller: 'LastMaintenanceController',
                templateUrl: 'templates/last-maintenance.html',
                controllerAs: 'vm'
            })

            .when('/realized-maintenance', {
                controller: 'RealizedMaintenanceController',
                templateUrl: 'templates/realized-maintenance.html',
                controllerAs: 'vm'
            })

            .when('/all-periodics', {
                controller: 'AllPeriodicsController',
                templateUrl: 'templates/all-periodics.html',
                controllerAs: 'vm'
            })

            .when('/report-profit', {
                controller: 'ReportProfitController',
                templateUrl: 'templates/reports/profit.html',
                controllerAs: 'vm'
            })

            .when('/report-expense', {
                controller: 'ReportExpenseController',
                templateUrl: 'templates/reports/expense.html',
                controllerAs: 'vm'
            })

            .when('/report-maintenance', {
                controller: 'ReportMaintenanceController',
                templateUrl: 'templates/reports/maintenance.html',
                controllerAs: 'vm'
            })

            .when('/report-truck', {
                controller: 'ReportTruckController',
                templateUrl: 'templates/reports/truck.html',
                controllerAs: 'vm'
            })

            .when('/report-driver', {
                controller: 'ReportDriverController',
                templateUrl: 'templates/reports/driver.html',
                controllerAs: 'vm'
            })

            .when('/report-travel', {
                controller: 'ReportTravelController',
                templateUrl: 'templates/reports/travel.html',
                controllerAs: 'vm'
            })

            .when('/report-part', {
                controller: 'ReportPartController',
                templateUrl: 'templates/reports/part.html',
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
            $rootScope.location = $location;
            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $rootScope.login;
            var loggedIn = $rootScope.globals.currentUser;
            if (!restrictedPage && !loggedIn) {
                $location.path('/login');
            }
        });
    }

})();
