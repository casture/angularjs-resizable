'use strict';

angular.module('ApplyTester', [])
	.config(function($routeProvider) {
		$routeProvider
			.when('/', {
                templateUrl:"applyTemplate.html",
                controller:"ApplyCtrl"
            })
	})

	.controller('ApplyCtrl', function($scope) {

	    })

	.directive('myapp', function() {
	        return {
	            restrict: 'AE',
	            link: function(scope, element) {

	            	scope.first = 0,
	            	scope.second = -1;

		        	scope.eatPie = function() {
		        		scope.first++;
		        	};

		        	scope.$watch('first', function() {
		        		scope.second++;
		        	})

		        	element.keydown(function(e) {
		        		//scope.$apply(scope.eatPie);
		        		scope.eatPie();
		        		//scope.$apply();
		        	})
		        	element.blur(function() {
		        		scope.$apply();
		        	})

		        	element.focus();
	            }
	        }
	    })