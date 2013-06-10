//********************************************************************
//
//  RESIZABLE APP
//
//********************************************************************
angular.module('ResizableApp', ['PositionApp'])

    .directive('mwResizable', function(Position) {
        return {
            restrict: 'AE',
            scope: {
                minWidth: '@',
                maxWidth: '@',
                minHeight: '@',
                maxHeight: '@'
            },
            link: function(scope, element, attrs) {

                var iconElement = angular.element('<i class="icon-arrow-down resizable-arrow" disabled></i>');
                element.append(iconElement);

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

                var eMove,
                    sMove,
                    seMove,
                    elemWidth = parseInt(element.css('width')),
                    elemHeight = parseInt(element.css('height')),
                    prevPosition = {x:0, y:0},
                    elemPosition = Position.ofElement(element[0], 0),
                    doc = angular.element(document),
                    local = {
                        minWidth: parseInt(scope.minWidth),
                        maxWidth: parseInt(scope.maxWidth),
                        minHeight: parseInt(scope.minHeight),
                        maxHeight: parseInt(scope.maxHeight)
                    },
                    changeCursor = function( e ) {

                        // Get current cursor position
                        var mouse = Position.mouseInElement( e, elemPosition );

                        eMove = false;
                        sMove = false;
                        seMove = false;

                        // Update cursor style based on position
                        if (mouse.x <= elemWidth && mouse.y <= elemHeight) {

                            // Bottom-right Corner
                            if (mouse.y >= elemHeight-13 && mouse.x >= elemWidth-13) {
                                seMove = true;
                                element.css('cursor', 'se-resize');

                            // Right Border
                            } else if (mouse.x >= elemWidth-5) {
                                eMove = true;
                                element.css('cursor', 'e-resize');

                            // Bottom Border
                            } else if (mouse.y >= elemHeight-5) {
                                sMove = true;
                                element.css('cursor', 's-resize');

                            // Anywhere else
                            } else element.css('cursor', 'auto');

                        } else element.css('cursor', 'auto');
                    },
                    startResize = function( e ) {

                        // Get current cursor position
                        var mouse = Position.mouseInElement( e, elemPosition ),

                            // Calculate new dimensions post-resize
                            newWidth = elemWidth + (mouse.x - prevPosition.x),
                            newHeight = elemHeight + (mouse.y - prevPosition.y);

                        // Resize element based on cursor position if it's within min-max range
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

                        // Update prevPosition for calculations next time through
                        prevPosition.x = mouse.x;
                        prevPosition.y = mouse.y;
                    },
                    stopResize = function() {
                        doc.unbind('mouseup', stopResize);
                        doc.unbind('mousemove', startResize);
                        element.bind('mousemove', changeCursor);
                    };

                // Element-specific css / event listeners
                element
                    .css('position', 'relative')

                    .bind('mouseenter', function() {
                        elemPosition = Position.ofElement(element[0], 0);
                    })

                    .bind('mousemove', changeCursor)

                    .bind('mousedown', function( e ) {

                        if ( eMove || sMove || seMove ) {

                            // Get current cursor position
                            var mouse = Position.mouseInElement( e, elemPosition );

                            // Update prevPosition for calculations in startResize
                            prevPosition.x = mouse.x;
                            prevPosition.y = mouse.y;

                            // Update bindings
                            element.unbind('mousemove', changeCursor);               
                            doc.bind('mousemove', startResize);
                            doc.bind('mouseup', stopResize);
                        }
                    })

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
            }
        }
    })