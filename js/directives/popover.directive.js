(function () {
    'use strict';

    angular
        .module('app')
        .directive('popover', function($compile, $timeout) {
            return {
                restrict: 'A',
                link:function(scope, el, attrs){
                    var content = attrs.content;
                    var elm = angular.element('<div />');
                    elm.append(attrs.content);
                    $compile(elm)(scope);
                    $timeout(function() {
                        el.removeAttr('popover').attr('data-content',elm.html());
                        el.popover();
                    });
                }
            }
        });
})();