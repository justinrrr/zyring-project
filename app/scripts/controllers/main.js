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



            var currentYear = new Date().getFullYear();
            $scope.startDate = new Date(currentYear,0,1);
            $scope.endDate = new Date().toDateString();

            function calculateData() {
                calculateCityData();
                calculateWeeklyCounts();
            }

            function calculateCityData() {
                var cityData = _.countBy($scope.currentData, function (elem) {
                    return elem.country;

                });

                $scope.cityLabels = _.keys(cityData);
                $scope.cityData = _.values(cityData);
            }

            var weeklEpoch = 604800;
            function calculateWeeklyCounts() {

                $scope.weeklySeries = ['Visits'];
                var startEpoch = new Date($scope.startDate).getTime() / 1000;
                var endEpoch = new Date($scope.endDate).getTime() / 1000;
                var numOfWeek = Math.ceil((endEpoch - startEpoch) / weeklEpoch);

                $scope.weeklyLabels = [];
                for(var i = 1 ; i <= numOfWeek; i++) {
                    $scope.weeklyLabels.push('Week ' + i);
                }

                var weeklyCounts = [];
                for (var k = 0 ; k < numOfWeek; k++) {
                    weeklyCounts.push(0);
                }

                _.each($scope.currentData, function(data) {
                    var timeStamp = data.timestamp;
                    //if the timestamp falls between the start and end date
                    if (timeStamp >= startEpoch && timeStamp <= endEpoch) {
                        //calculate the week
                        var weekNo = Math.floor((timeStamp - startEpoch) / weeklEpoch);
                        weeklyCounts[weekNo] += 1;
                    }
                });
                $scope.weeklyCounts = [weeklyCounts];
            }


            VisitDataResource.query().$promise.then(function (result) {
                $scope.allData = result;
                $scope.currentData = $scope.allData;
                calculateData();

            });


            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };

            $scope.openStart = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.openedStart = true;
            };

            $scope.openEnd = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.openedEnd = true;
            };

            $scope.$watch('endDate', function (newEnd) {

                if ($scope.allData) {
                    var newEndTimestamp = new Date(newEnd).getTime() / 1000;
                    $scope.currentData = _.filter($scope.allData, function (elem) {
                        return elem.timestamp <= newEndTimestamp;
                    });
                    calculateData();
                }

            });
            $scope.$watch('startDate', function (newStart) {
                if ($scope.allData) {
                    var newStartTimeStamp = new Date(newStart).getTime() / 1000;
                    $scope.currentData = _.filter($scope.allData, function (elem) {
                        return elem.timestamp >= newStartTimeStamp;
                    });
                    calculateData();
                }
            });

        }
    ]
);
