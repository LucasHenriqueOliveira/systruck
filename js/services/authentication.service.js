(function () {
    'use strict';

    angular
        .module('app')
        .factory('AuthenticationService', AuthenticationService);

    AuthenticationService.$inject = ['$http', '$rootScope', '$localstorage', 'CONFIG'];
    function AuthenticationService($http, $rootScope, $localstorage, CONFIG) {
        var service = {};

        service.Login = Login;
        service.SetCredentials = SetCredentials;
        service.ClearCredentials = ClearCredentials;
        service.IsLogged = IsLogged;
        service.GetEmail = GetEmail;
        service.GetName = GetName;
        service.GetRoles = GetRoles;
        service.IsLoginDefault = IsLoginDefault;

        return service;

        function Login(email, password, callback) {

            /* Use this for real authentication
             ----------------------------------------------*/
            $http.post(CONFIG.login, { username: email, password: password })
                .then(function(response) {
                        callback(response);
                    }, function(error) {
                        console.log(error);
                    });
        }

        function SetCredentials(data) {

            $localstorage.set('id', data.user.id);
            $localstorage.set('email', data.user.email);
            $localstorage.set('name', data.user.nome);
            $localstorage.set('token', data.token);
            $localstorage.set('company', data.user.empresa);
            $localstorage.set('roles', data.user.perfil);
            $localstorage.set('login_default', data.user.primeiro_acesso);

            $rootScope.$broadcast("login-done");

        }

        function ClearCredentials() {
            $localstorage.remove('id');
            $localstorage.remove('email');
            $localstorage.remove('name');
            $localstorage.remove('token');
            $localstorage.remove('company');
            $localstorage.remove('roles');
            $localstorage.remove('companyData');
            $localstorage.remove('trip');
            $localstorage.remove('login_default');
            $localstorage.remove('profile');
        }

        function IsLogged() {
            return ($localstorage.get('email') && $localstorage.get('token') && $localstorage.get('name'));
        }

        function GetEmail() {
            return $localstorage.get('email');
        }

        function GetName() {
            return $localstorage.get('name');
        }

        function GetRoles() {
            return $localstorage.get('roles');
        }

        function IsLoginDefault() {
            return ($localstorage.get('login_default') == 1) ? true : false;
        }

    }

    // Base64 encoding service used by AuthenticationService
    var Base64 = {

        keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    this.keyStr.charAt(enc1) +
                    this.keyStr.charAt(enc2) +
                    this.keyStr.charAt(enc3) +
                    this.keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);

            return output;
        },

        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                window.alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = this.keyStr.indexOf(input.charAt(i++));
                enc2 = this.keyStr.indexOf(input.charAt(i++));
                enc3 = this.keyStr.indexOf(input.charAt(i++));
                enc4 = this.keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return output;
        }
    };

})();
