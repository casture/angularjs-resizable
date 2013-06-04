'use strict';

var app = angular.module("myApp", ["NumberApp", "ResizableApp"])

var myNamespace2 = (function(ng, app) {

    // For use w/ 'ng-view'    
    app.config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl:"messAround.html",
                controller:"ChoreCtrl"
            })
            .when('/customer', {
                templateUrl:"customers.html",
                controller:"CustomerController"
            })
            .when('/number', {
                templateUrl:"myNumber.html",
                controller:"NumberController"
            })
            .when('/resizable', {
                templateUrl:"resizable.html",
                controller:"ResizableController"
            })
    })

    app.controller('ResizableController', function($scope) {
            
        })

    app.controller('NumberController', ['$scope', function($scope) {
            $scope.hello = 5;
            $scope.cheese = 0;
        }])

///-----------------------------------------------------------------------------------------------------

    app.factory('CustomerFactory', function() {

        var factory = {},
            customers = [];

        factory.getCustomers = function() {
            return customers;
        }
        factory.addPerson = function (n, e, c) {
            customers.push({name: n, email: e, city: c});
        }
        factory.deletePerson = function ( name ) {
            var index = factory.getPersonByName( name );
            if(index != -1)
                customers.splice(index, 1);
        }
        factory.getPersonByName = function( name ) {
            for (var i = 0; i < customers.length; i++) {
                if (customers[i].name == name)
                    return i;
            }
            return -1;
        }

        return factory;
    })

    app.controller('CustomerController', ['$scope', 'CustomerFactory', function($scope, CustomerFactory) {
            
            $scope.customers = CustomerFactory.getCustomers();

            $scope.customerExists = function () {
                return (CustomerFactory.getPersonByName($scope.user.name) == -1)
                        ?   false
                        :   true;
            }
            $scope.addCustomer = function () {
                if (!$scope.customerExists()) {
                    CustomerFactory.addPerson($scope.user.name, $scope.user.email, $scope.user.city);
                    $scope.user.name = "";
                    $scope.user.email = "";
                    $scope.user.city = "";
                    $scope.message = "Customer saved successfully!";
                    $("pre:first").addClass("text-success").removeClass("text-error");
                }
                else {
                    $scope.message = "Customer name already exists!";
                    $("pre:first").addClass("text-error").removeClass("text-success");
                }
            }
            $scope.deleteCustomer = function( name ) {
                CustomerFactory.deletePerson(name)
            }
           
            $scope.$watch('user.name', function(n, o) {
                if (n != o)
                    $scope.user.city = $scope.user.name;
            })
    }])

///--------------------------------------------------------------------------------------------- 

    app.directive('superman', function() {
            return {
                template: "<div>I'm superman!</div>"
            }
    })

        
    app.controller("ChoreCtrl", ['$scope', function($scope) {
            $scope.logChore = function (home) {
                alert(home + " is done!");
            }
    }])
    app.directive("kid", function() {
        return{
            restrict: "E",
            scope:{
                done:"&"
            },
            template: '<input type="text" ng-model="chore">'+
            ' <button class="btn" ng-click="done({silly:chore})">I\'m done!</button>'
        }
    })



    app.controller('myForm', ['$scope', function($scope) {

        $scope.users = [];
        $scope.message = "";

        $scope.showLog = function() {
             console.log($scope);
        };

        $scope.cleanFields = function() {
            return ($scope.form1.pword.$modelValue != $scope.form1.pword2.$modelValue)
                ? false
                : true;
        };

        $scope.userExists = function() {
            $scope.exists = false;
            angular.forEach($scope.users, function(value) {
                if (value.username == $scope.user.username) 
                    $scope.exists = true;
            })
        };

        
        $scope.addUser = function() {
            console.log($scope);
            if ($scope.cleanFields()) {

                $scope.userExists();
                if (!$scope.exists) {
                    $scope.users.push({
                        "username":$scope.user.username,
                        "password":$scope.user.password,
                        "email":$scope.user.email
                    })
                    $("#alert").addClass("text-success");
                    $scope.message = "User data saved";
                } else $scope.message = "User data NOT saved";
                
            } else $scope.message = "User data NOT saved";
        };
    }])

    return {

    };

})(angular, app);




//////////////////////////////////////////////////////////////////////////////////////////
//
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//
//////////////////////////////////////////////////////////////////////////////////////////

