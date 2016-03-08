(function () {
    'use strict';

    angular
        .module('app')
        .controller('CompanyController', CompanyController);

    CompanyController.$inject = ['$location', 'DataService', '$localstorage'];

    function CompanyController($location, DataService, $localstorage) {
        var vm = this;
        vm.company = '';

        vm.editCompany = function(){
            $location.path('/edit-company');
        };

        DataService.getCompany().then(function (data) {
            vm.company = data.getCompany;
            $localstorage.setObject('companyData', vm.company);
            vm.initialize(vm.company.empresa_latitude, vm.company.empresa_longitude);
        });

        vm.initialize = function(lat, long){
            var myLatlng = new google.maps.LatLng(lat, long);
            var mapOptions = {
                zoom: 15,
                scrollwheel: false,
                center: myLatlng,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
            var marker = new google.maps.Marker({
                position: myLatlng,
                map: map,
                title: 'Hello World!'
            });
        };
    }

})();


