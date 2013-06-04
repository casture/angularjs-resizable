'use strict';

var Demo = angular.module('component', []);

var myNamespace = (function(ng, app) {

	app.controller('MyController', function($scope){
		$scope.silly = 'silly face';
        //$scope.cook = $cookies;
	})

	app.directive('helloWorld', function() {
        return {
            restrict: 'E',
            templateUrl: 'helloWorld.html'
        }
    })

    var myPrivateVar, myPrivateMethod;

	// A private counter variable
	myPrivateVar = 0;

	// A private function which logs any arguments
	myPrivateMethod = function( foo ) {
	  console.log( foo );
	};

	return {

		// A public variable
		myPublicVar: "foo",

		// A public function utilizing privates
		myPublicFunction: function() {

			// Increment our private counter
			myPrivateVar++;

			// Call our private method using bar
			myPrivateMethod( myPrivateVar );

		},

        testFunction: function(argument) {
            console.log( angular.version.codeName );
        }
	};

})(angular, Demo);

///////////////////////////////////////////////////////////////////////////////// 

var app = angular.module("myApp", [])

var myNamespace2 = (function(ng, app) {

    app.directive('mwMarkdown', function() {
        var converter = new Showdown.converter();
        var editTemplate = '<textarea ng-show="isEditMode" ng-dblclick="switchToPreview()" ng-model="markdown" rows="10" cols="30"></textarea>';
        var previewTemplate = '<div ng-hide="isEditMode" ng-dblclick="switchToEdit()">Preview</div>';
        return {
            restrict: 'A',
            scope: {},
            compile: function (tElement, tAttrs, transclude) {
                var markdown = tElement.text();

                tElement.html(editTemplate);
                var previewElement = angular.element(previewTemplate);
                tElement.append(previewElement);

                return function(scope, element, attrs) {
                    scope.isEditMode = true;
                    scope.markdown = markdown;

                    scope.switchToPreview = function() {
                        var makeHtml = converter.makeHtml(scope.markdown);
                        previewElement.html(makeHtml);
                        scope.isEditMode = false;
                    };
                    scope.switchToEdit = function() {
                        scope.isEditMode = true;
                    };
                }          
            }
        }
    });

    app.directive('superman', function() {
            return {
                template: "<div>I'm superman!</div>"
            }
        })
        
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
        
    })   

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

var numApp = angular.module('NumberApp', []);

var numNameSpace = (function(ng, app) {

    app.config(function ($routeProvider) {
        $routeProvider
            .when('/number', {
                templateUrl:"myNumber.html",
                controller:"NumberController"
            })
    })

    app.controller('NumberController', ['$scope', function($scope) {
    }])

    app.filter('sigFormat', function() {
        return function(number, sig) {

            var toBeAdded = '';
            var tempSig = parseInt(sig);
            var segments = number.toString().split('.');
            if (sig > 0) {
                // Add zeroes after decimal

                if (number > 0 && number < 1) {
                    if (segments.length > 1) {
                        // Number is of format 0.**

                        if (segments[1].length > sig) {
                            toBeAdded = segments[1].substring(0, tempSig);
                        } else {
                            for (var i = 0; i < sig; i++) {
                                if (segments[1][i])
                                    toBeAdded += segments[1][i];
                                else
                                    toBeAdded += '0';
                            };
                        }
                        return segments[0] + '.' + toBeAdded;

                    } else {
                        // Number is of format .**

                        if (segments[0].length > sig) {
                            toBeAdded = segments[0].substring(0, tempSig);
                        } else {
                            for (var i = 0; i < sig; i++) {
                                if (segments[0][i])
                                    toBeAdded += segments[0][i];
                                else
                                    toBeAdded += '0';
                            };
                        }
                        return '.' + toBeAdded;
                    }
                    

                } else {
                    if (segments.length > 1) {
                        // Number is of format **.**

                        if (segments[1].length >= sig) {
                            toBeAdded = segments[1].substring(0, tempSig);
                        } else {
                            for (var i = 0; i < sig; i++) {
                                if (segments[1][i])
                                    toBeAdded += segments[1][i];
                                else
                                    toBeAdded += '0';
                            };
                        }

                    } else {
                        // Number is of format **

                        for (var i = 0; i < sig; i++)
                            toBeAdded += '0';
                    }
                    return segments[0] + '.' + toBeAdded;
                }

            } else if (sig < 0) {
                // Add zeroes before whole numbers
//console.log('tempSig: '+tempSig+"  end: "+segments[0].length);
                sig = tempSig * -1;
                if (segments[0].length > sig) {
                    return segments[0].substring(segments[0].length-sig, segments[0].length);
                } else {
                    var diff = sig - segments[0].length;
                    for (var i = 0; i < diff; i++) {
                            toBeAdded += '0';
                    };
                    return toBeAdded + segments[0];
                }
            } else {
                return number;
            }
        };
    })

    app.directive('mynum', ['$filter', function($filter) {

        var upArrowElement = angular.element('<i class="icon-chevron-up icon-2x icon-border"></i>'),
            numberElement = angular.element('<input type="text" class="input-small" style="text-align:center" data-ng-model="curval" />'),
            downArrowElement = angular.element('<i class="icon-chevron-down icon-2x icon-border"></i>');

        return {
            restrict: 'EA',
            replace: true,
            template: '<div id="numapp-wrapper"></div>',
            scope: {
                ngModel: '=',
                max: '@',
                min: '@',
                step: '@',
                sig: '@',
                maxDelay: '@',
                minDelay: '@',
                delayDuration: '@'
            },
            compile: function( tElement ) {

                tElement.append(upArrowElement).append('<br>').append(numberElement).append(downArrowElement);

                return function(scope, element, attrs) {

                    // Setup default values for options
                    var defaults = {
                        curval:         '0',
                        min:            '-100',
                        max:            '100',
                        step:           '1',
                        sig:            '0',
                        maxDelay:       '500',
                        minDelay:       '50',
                        delayDuration:  '3000'
                    };

                    scope = $.extend(scope, defaults);

                    if (attrs.ngModel) scope.curval = attrs.ngModel;
                    if (attrs.min) scope.min = attrs.min;
                    if (attrs.max) scope.max = attrs.max;
                    if (attrs.step) scope.step = attrs.step;
                    if (attrs.sig) scope.sig = attrs.sig;
                    if (attrs.minDelay) scope.minDelay = attrs.minDelay;
                    if (attrs.maxDelay) scope.maxDelay = attrs.maxDelay;
                    if (attrs.delayDuration) scope.delayDuration = attrs.delayDuration;

                    // Configuration Checks
                    try {
                        // min-max
                        if (scope.min && scope.max && parseInt(scope.min) > parseInt(scope.max))
                            throw new Error("Min value cannot be greater than Max value.");
                        if (scope.min && scope.max && (scope.curval > scope.max || scope.curval < scope.min))
                            throw new Error("Default main value must be within Min-Max range.");
                        
                        // step
                        if (scope.step && parseInt(scope.step) <= 0)
                            throw new Error("Step value cannot be zero or lower.");
                            
                        // sig
                        if (scope.sig && (parseInt(scope.sig) % 1) != 0)
                            throw new Error("Sig value cannot be a decimal.");

                        // maxDelay
                        if (scope.maxDelay && scope.maxDelay < 0)
                            throw new Error("MaxDelay value cannot be negative.");

                        // minDelay
                        if (scope.minDelay && scope.minDelay < 0)
                            throw new Error("MinDelay value cannot be negative.");

                        // delayDuration
                        if (scope.delayDuration && scope.delayDuration <= 0)
                            throw new Error("DelayDuration value cannot be less than or equal to zero.")

                        if (scope.min && scope.max && scope.step && parseInt(scope.max) - parseInt(scope.min) < scope.step)
                            throw new Error("Step value cannot be greater than the difference between Max and Min values.");
                        if (scope.min && scope.max && scope.curval && (parseFloat(scope.min) > parseFloat(scope.curval) || parseFloat(scope.max) < parseFloat(scope.curval)))
                            throw new Error("Starting number value must be within Max and Min values.");

                    } catch(e) {
                        console.error(e);
                    }

                    scope.curval = $filter('sigFormat')(scope.curval, scope.sig);

                    var local = {
                        curval: parseFloat(scope.curval),
                        min: parseFloat(scope.min),
                        max: parseFloat(scope.max),
                        step: parseFloat(scope.step),
                        sig: parseInt(scope.sig),
                        minDelay: parseFloat(scope.minDelay),
                        maxDelay: parseFloat(scope.maxDelay),
                        delayDuration: parseFloat(scope.delayDuration)
                    };
                    console.log(scope);
                    console.log(local);

                    // Scope Functions
                    scope.stepUp = function() {
                        scope.curval = local.curval + local.step;
                        if (local.sig > 0)
                            scope.curval = scope.curval.toFixed(local.sig);
                        else
                            scope.curval = $filter('sigFormat')(scope.curval, scope.sig);
                    };
                    scope.stepDown = function() {
                        console.log('local.curval: '+local.curval+'  local.step '+local.step);
                        scope.curval = local.curval - local.step;
                        console.log(scope.curval);
                        if (local.sig > 0)
                            scope.curval = scope.curval.toFixed(local.sig);
                        //console.log(scope.curval);
                        else
                            scope.curval = $filter('sigFormat')(scope.curval, scope.sig);
                        //console.log(scope.curval);
                        console.log("-------------------");
                    };

                    // Watches
                    scope.$watch('curval', function(n, o) {

                        if (n != o) {

                            var nVal = parseFloat(n);

                            //
                            if (nVal % local.step != 0) {
                                scope.curval = o;
                                return;
                            }

                            console.log('$watch value: '+nVal);

                            // Change background color when max/min reached
                            numberElement.css("background-color", "#ffffff");
                            if (nVal == local.max)
                                numberElement.css("background-color", "rgb(116,185,239)");
                            if (nVal == local.min)
                                numberElement.css("background-color", "rgb(116,185,239)");

                            // Stop if has exceeded max or min
                            if (nVal > local.max || 
                                nVal < local.min) {
                                scope.curval = o;
                                
                                console.log("You cannot exceed the max/min numbers: " + local.max + "/" + local.min);
                            } else  local.curval = nVal;
                        }
                    })
                    scope.$watch('min', function(n, o) {
                        if (n != o)
                            local.min = parseFloat(scope.min);
                    })
                    scope.$watch('max', function(n, o) {
                        if (n != o)
                            local.max = parseFloat(scope.max);
                    })
                    scope.$watch('step', function(n, o) {
                        if (n != o)
                            local.step = parseFloat(scope.step);
                    })
                    scope.$watch('sig', function(n, o) {
                        if (n != o)
                            local.sig = parseInt(scope.sig);
                    })
                    scope.$watch('minDelay', function(n, o) {
                        if (n != o)
                            local.minDelay = parseFloat(scope.minDelay);
                    })
                    scope.$watch('maxDelay', function(n, o) {
                        if (n != o)
                            local.maxDelay = parseFloat(scope.maxDelay);
                    })
                    scope.$watch('delayDuration', function(n, o) {
                        if (n != o)
                            local.DelayDuration = parseFloat(scope.delayDuration);
                    })



                    // Event Variables
                        var timeoutId,
                        keyIsDown = false,
                        slope = (local.minDelay - local.maxDelay) / local.delayDuration,

                    // Timeout Functions
                        fKeyboard = function( e, total ) {

                            if (e.keyCode == 38) {
                                // UP arrow
                                scope.stepUp();
                                e.preventDefault();                            
                            }
                            else if (e.keyCode == 40) {
                                // DOWN arrow
                                scope.stepDown();
                                e.preventDefault();
                            }
                            scope.$apply();
                            e.preventDefault();

                            var delay = slope * total + local.maxDelay;
                            total += delay;

                            if (total > local.delayDuration) {
                                total -= delay;
                                delay = local.delayDuration - total;
                            }
                            if(keyIsDown)
                                timeoutId = setTimeout(function() {
                                    fKeyboard(e, total);
                                }, delay);
                        },
                        fMouse = function( action, total ) {
                            if (action == 0) {
                                // UP arrow
                                scope.stepUp();                         
                            }
                            else if (action == 1) {
                                // DOWN arrow
                                scope.stepDown();
                            }
                            scope.$apply();

                            var delay = slope * total + local.maxDelay;
                            total += delay;

                            if (total > local.delayDuration) {
                                total -= delay;
                                delay = local.delayDuration - total;
                            }
                            if(keyIsDown)
                                timeoutId = setTimeout(function() {
                                    fMouse(action, total);
                                }, delay);
                        };

                    // KEYBOARD
                    element.keydown(function(e) {

                        if (e.keyCode == 38 || e.keyCode == 40) {
                                e.preventDefault();
                        }

                        if (!keyIsDown) {
                            keyIsDown = true;
                            if (e.keyCode == 38) {
                                // UP arrow
                                scope.stepUp();                         
                            }
                            else if (e.keyCode == 40) {
                                // DOWN arrow
                                scope.stepDown();
                            }
                            scope.$apply();

                            // Start timeout delays
                            timeoutId = setTimeout(function() {
                                fKeyboard(e, local.maxDelay);
                            }, local.maxDelay);
                        }
                    })
                    element.keyup(function() {
                        clearTimeout(timeoutId);
                        keyIsDown = false;
                    })


                    // MOUSE
                    // Up Arrow
                    upArrowElement.bind('mousedown', function(e) {
                        
                        if (!keyIsDown) {

                            keyIsDown = true;
                            scope.stepUp();                         
                            scope.$apply();

                            timeoutId = setTimeout(function() {
                                fMouse(0, local.maxDelay);
                            }, local.maxDelay);
                        }
                    })
                    upArrowElement.bind('mouseup', function() {
                        clearTimeout(timeoutId);
                        keyIsDown = false;
                    })

                    // Down Arrow
                    downArrowElement.bind('mousedown', function(e) {
                        
                        if (!keyIsDown) {
                            
                            keyIsDown = true;
                            scope.stepDown();                         
                            scope.$apply();

                            timeoutId = setTimeout(function() {
                                fMouse(1, local.maxDelay);
                            }, local.maxDelay);
                        }
                    })
                    downArrowElement.bind('mouseup', function() {
                        clearTimeout(timeoutId);
                        keyIsDown = false;
                    })

                    numberElement.focus();
                };
            } 
        }
    }])

    return {

    };
})(angular, numApp);