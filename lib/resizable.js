//********************************************************************
//
//  RESIZABLE APP
//
//********************************************************************
angular.module('ResizableApp', [])

    .directive('mwResizable', function() {

        var iconElement = angular.element('<i class="icon-arrow-down resizable-arrow" disabled></i>');
        //iconElement.css({'position':'absolute', 'bottom':'0px', 'right':'3px', 'z-axis':'-1'});

        return {
            restrict: 'AE',
            scope: {
                minWidth: '@',
                maxWidth: '@',
                minHeight: '@',
                maxHeight: '@'
            },
            compile: function(tElement) {

                //tElement.append(iconElement);

                return function(scope, element, attrs) {
//console.log(window);
                    element.append('<i class="icon-arrow-down resizable-arrow" disabled></i>');

                    // Setup default values for options
                    var defaults = {
                        minWidth:   0,
                        maxWidth:   1000,
                        minHeight:  0,
                        maxHeight:  1000
                    };

                    var oldScope = scope;
                    scope = angular.extend(defaults, scope);
                    scope = angular.extend(oldScope, scope);

                     // Configuration Checks
                    try {
                        //min-max Width
                        if (scope.minWidth && scope.minWidth < 0)
                            throw new Error("MinWidth value cannot be a negative number.");
                        if (scope.maxWidth && scope.maxWidth < 0)
                            throw new Error("MaxWidth value cannot be a negative number.");
                        if (scope.minHeight && scope.minHeight < 0)
                            throw new Error("MinHeight value cannot be a negative number.");
                        if (scope.maxHeight && scope.maxHeight < 0)
                            throw new Error("MaxHeight value cannot be a negative number.");

                        if(scope.minWidth && scope.maxWidth && scope.minWidth > scope.maxWidth)
                            throw new Error("MinWidth value cannot be greater than maxWidth value.");
                        if(scope.minHeight && scope.maxHeight && scope.minHeight > scope.maxHeight)
                            throw new Error("MinHeight value cannot be greater than maxHeight value.");
                    } catch(e) {
                        console.error(e);
                    }

                    var eMove = false,
                        sMove = false,
                        seMove = false,
                        mouseIsDown = false,
                        elemWidth = parseInt(element.css('width')),
                        elemHeight = parseInt(element.css('height')),
                        prevPosition = {x:0, y:0},
                        local = {
                            minWidth: parseInt(scope.minWidth),
                            maxWidth: parseInt(scope.maxWidth),
                            minHeight: parseInt(scope.minHeight),
                            maxHeight: parseInt(scope.maxHeight)
                        };

                    element.css('position', 'relative');

                    scope.$watch(function() {
                        return element.css('width');
                        }, function() {
                            elemWidth = parseInt(element.css('width'));
                        }
                    )
                    scope.$watch(function() {
                        return element.css('height');
                        }, function() {
                            elemHeight = parseInt(element.css('height'));
                        }
                    )
                    scope.$watch('minWidth', function(n, o) {
                        if (n != o)
                            local.minWidth = parseInt(scope.minWidth);
                    })
                    scope.$watch('maxWidth', function(n, o) {
                        if (n != o)
                            local.maxWidth = parseInt(scope.maxWidth);
                    })
                    scope.$watch('minHeight', function(n, o) {
                        if (n != o)
                            local.minHeight = parseInt(scope.minHeight);
                    })
                    scope.$watch('maxHeight', function(n, o) {
                        if (n != o)
                            local.maxHeight = parseInt(scope.maxHeight);
                    })

                    document.onmousemove = function(e) {
//console.log('x: '+e.offsetX+'  y: '+e.offsetY);
                        if (mouseIsDown) {
                            // Change dimensions of element
//console.log(e);
                            var newWidth = elemWidth+(e.x-prevPosition.x),
                                newHeight = elemHeight+(e.y-prevPosition.y);

                            if (seMove) {
                                scope.$apply(function() {

                                    if (newWidth >= local.minWidth && newWidth <= local.maxWidth)
                                        element.css('width', newWidth +'px');
                                    if (newHeight >= local.minHeight && newHeight <= local.maxHeight)
                                        element.css('height', newHeight +'px');
                                })

                            } else if (eMove && newWidth >= local.minWidth && newWidth <= local.maxWidth) {
                                    scope.$apply(element.css('width', newWidth +'px'));

                            } else if (sMove && newHeight >= local.minHeight && newHeight <= local.maxHeight) {
                                    scope.$apply(element.css('height', newHeight +'px'));
                            }

                            prevPosition.x = e.x;
                            prevPosition.y = e.y;

                        } else {
                            // Update cursor style based on position

                            eMove = false;
                            sMove = false;
                            seMove = false;

                            if (e.offsetX <= elemWidth && e.offsetY <= elemHeight) {

                                if (e.offsetY >= elemHeight-13 && e.offsetX >= elemWidth-13) {
                                    seMove = true;
                                    element.css('cursor', 'se-resize');

                                } else if (e.offsetX >= elemWidth-5) {
                                    eMove = true;
                                    element.css('cursor', 'e-resize');

                                } else if (e.offsetY >= elemHeight-5) {
                                    sMove = true;
                                    element.css('cursor', 's-resize');

                                } else element.css('cursor', 'auto');

                            } else element.css('cursor', 'auto');
                        }
                    }

                    document.onmousedown = function(e) {
                        //console.log('east: '+eMove+'  south: '+sMove+'  se: '+seMove);
                        prevPosition.x = e.x;
                        prevPosition.y = e.y;
                        mouseIsDown = true;
                    }
                    document.onmouseup = function(e) {
                        mouseIsDown = false;
                    }
                }
            }
        }
    })