/**
 * Created by codemaster on 5/6/15.
 */

'use strict';
angular.module('zyringApp')
    .factory('VisitDataResource', ['$resource', function ($resource) {
        return $resource('http://micky.zyring.com/fullEvents');
    }]);
