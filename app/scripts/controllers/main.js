'use strict';

/**
 * @ngdoc function
 * @name zyringApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the zyringApp
 */
angular.module('zyringApp')
    .controller('MainCtrl', ['$scope', 'VisitDataResource',
        function ($scope, VisitDataResource) {

            VisitDataResource.query().$promise.then(function (result) {
                $scope.currentData = result;
                calculateCityData();
            });

            function calculateCityData() {
                var cityData = _.countBy($scope.currentData, function (elem) {
                    return elem.country;

                });

                $scope.cityLabels = _.keys(cityData);
                $scope.cityData = _.values(cityData);
            }

        }
    ]
);
