//********************************************************************
//
//  NUMBER APP
//
//********************************************************************
angular.module('NumberApp', [])

    .filter('sigFormat', function() {
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

                tempSig = tempSig * -1;
                
                if (number >= 0) {
                    var diff = tempSig - segments[0].length;
                    for (var i = 0; i < diff; i++) {
                            toBeAdded += '0';
                    };
                    return toBeAdded + segments[0];
                } else {
                    var diff = tempSig - segments[0].length+1;
                    for (var i = 0; i < diff; i++) {
                            toBeAdded += '0';
                    };
                    number = parseFloat(number) * -1;
                    return '-' + toBeAdded + number;
                }
                
            } else {
                return number;
            }
        };
    })
    .directive('mynum', ['$filter', function($filter) {

        var upArrowElement = angular.element('<i class="icon-chevron-up icon-2x icon-border numApp-up"></i>'),
            numberElement = angular.element('<input type="text" class="input-small numApp-input" style="text-align:center" />'),
            downArrowElement = angular.element('<i class="icon-chevron-down icon-2x icon-border numApp-down"></i>');

        return {
            restrict: 'EA',
            replace: true,
            template: '<div class="numapp-wrapper"></div>',
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

                tElement.append(upArrowElement).append(numberElement).append(downArrowElement);

                return function(scope, element, attrs) {

                    // Setup default values for options
                    var defaults = {
                        ngModel:         '0',
                        min:            '-100',
                        max:            '100',
                        step:           '1',
                        sig:            '0',
                        maxDelay:       '500',
                        minDelay:       '50',
                        delayDuration:  '3000'
                    };

                    var oldScope = scope;
                    scope = angular.extend(defaults, scope);
                    scope = angular.extend(oldScope, scope);

                    // Configuration Checks
                    try {
                        //min-max
                        if (scope.min && scope.max && parseInt(scope.min) > parseInt(scope.max))
                            throw new Error("Min value cannot be greater than Max value.");
                        if (scope.min && scope.max && (scope.ngModel > scope.max || scope.ngModel < scope.min))
                            throw new Error("Starting main value must be within Min-Max range.");
                        
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
                        if (scope.min && scope.max && scope.ngModel && (parseFloat(scope.min) > parseFloat(scope.ngModel) || parseFloat(scope.max) < parseFloat(scope.ngModel)))
                            throw new Error("Starting number value must be within Max and Min values.");

                    } catch(e) {
                        console.error(e);
                    }

                    // Format initial view value
                    numberElement.val($filter('sigFormat')(scope.ngModel, scope.sig));

                    // Initialize local, already-parsed option values
                    var local = {
                        ngModel: parseFloat(scope.ngModel),
                        min: parseFloat(scope.min),
                        max: parseFloat(scope.max),
                        step: parseFloat(scope.step),
                        sig: parseInt(scope.sig),
                        minDelay: parseFloat(scope.minDelay),
                        maxDelay: parseFloat(scope.maxDelay),
                        delayDuration: parseFloat(scope.delayDuration)
                    };

                    // Scope Functions
                    scope.stepUp = function() {

                        scope.$apply(function() {

                            // Change model
                            var mod = local.ngModel % local.step;
                            if (mod < 0) {
                                scope.ngModel = local.ngModel - mod;
                            } else if (mod > 0) {
                                scope.ngModel = local.ngModel + local.step - mod;
                            } else {
                                scope.ngModel = local.ngModel + local.step;
                            }

                            // Update view w/ formatted data
                            if (local.sig > 0)
                                numberElement.val(scope.ngModel.toFixed(local.sig));
                            else
                                numberElement.val($filter('sigFormat')(scope.ngModel, local.sig));
                        })
                    };
                    scope.stepDown = function() {
                        
                        scope.$apply(function() {

                            // Change model
                            var mod = local.ngModel % local.step;
                            if (mod < 0) {
                                scope.ngModel = local.ngModel - local.step - mod;
                            } else if (mod > 0) {
                                scope.ngModel = local.ngModel - mod;
                            } else {
                                scope.ngModel = local.ngModel - local.step;
                            }
                            
                            // Update view w/ formatted data
                            if (local.sig > 0)
                                numberElement.val(scope.ngModel.toFixed(local.sig));
                            else
                                numberElement.val($filter('sigFormat')(scope.ngModel, local.sig));
                        })
                    };

                    // Watches
                        scope.$watch(function() {
                                return numberElement.val();
                            }, function(n, o) {

                            if (n != o) {

                                var nVal = parseFloat(n);

                                // Revert to old view value if new value cannot be parsed
                                if (isNaN(nVal)) {
                                    scope.ngModel = o;
                                    numberElement.val(scope.ngModel);
                                }

                                // Change background color when max/min reached
                                numberElement.css("background-color", "#ffffff");
                                if (nVal == local.max)
                                    numberElement.css("background-color", "rgb(255,93,56)");
                                if (nVal == local.min)
                                    numberElement.css("background-color", "rgb(116,185,239)");

                                // Stop if has exceeded max or min
                                if (nVal > local.max || nVal < local.min) {

                                    // Revert model and view to older value
                                    scope.ngModel = o;
                                    numberElement.val(scope.ngModel);
                                    console.log("You cannot exceed the max/min numbers: " + local.max + "/" + local.min);

                                } else  local.ngModel = nVal;
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

                                scope.$apply();
                                scope.stepUp();

                                //upArrowElement.css('background-color', '#aaa').css('color', '#fff');
                            }
                            else if (e.keyCode == 40) {
                                // DOWN arrow

                                scope.$apply();
                                scope.stepDown();

                                //downArrowElement.css('background-color', '#aaa').css('color', '#fff');
                            }

                            // Start timeout delays
                            timeoutId = setTimeout(function() {
                                fKeyboard(e, local.maxDelay);
                            }, local.maxDelay);
                        }
                    })
                    element.keyup(function() {
                        clearTimeout(timeoutId);
                        keyIsDown = false;
                        //upArrowElement.css('background-color', '#fff').css('color', '#000');
                        //downArrowElement.css('background-color', '#fff').css('color', '#000');
                    })


                    // MOUSE
                    // Up Arrow
                    upArrowElement.bind('mousedown', function(e) {
                        
                        if (!keyIsDown) {

                            keyIsDown = true;

                            scope.$apply();
                            scope.stepUp();

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

                            scope.$apply();
                            scope.stepDown();

                            timeoutId = setTimeout(function() {
                                fMouse(1, local.maxDelay);
                            }, local.maxDelay);
                        }
                    })
                    downArrowElement.bind('mouseup', function() {
                        clearTimeout(timeoutId);
                        keyIsDown = false;
                    })

                    // NumberElement Events
                    numberElement.bind('blur', function(e) {

                        scope.$apply();
                        var mod = Math.abs(local.ngModel % local.step);
                        
                        if (mod != 0) {

                            var diff = local.step - mod;

                            if (mod < diff) {

                                if (local.ngModel < 0)
                                    mod = mod * -1;
                                scope.ngModel = local.ngModel - mod;

                            } else {

                                if (local.ngModel > 0)
                                    diff = diff * -1;
                                scope.ngModel = local.ngModel - diff;
                            }

                            if (local.sig > 0)
                                numberElement.val(scope.ngModel.toFixed(local.sig));
                            else
                                numberElement.val($filter('sigFormat')(scope.ngModel, local.sig));

                            scope.$apply();
                        }
                    })
                    numberElement.focus();
                };
            } 
        }
    }])