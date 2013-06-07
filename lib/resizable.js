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
            compile: function(tElement) {

                //tElement.append(iconElement);

                return function(scope, element, attrs) {

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

                    var curElem = { element: {}, position: {} };

                    document.onmousemove = function( e ) {

                        var myX, myY;

                        if ( !mouseIsDown ) {

                            if ( e.target != curElem.element ) {
                                curElem.element = e.target;
                                curElem.position = Position.ofElement(e.target, 0);
                                //console.log('Changed element to '+e.target.nodeName+'#'+e.target.id);
                            }
                        }

                        if ( e.clientX && curElem.position ) {
                            myX = e.clientX - curElem.position.left;
                            myY = e.clientY - curElem.position.top;
                        }
                        
                        if ( mouseIsDown ) {
                            // Change dimensions of element

                            var newWidth = elemWidth + (myX - prevPosition.x),
                                newHeight = elemHeight + (myY - prevPosition.y);

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

                            prevPosition.x = myX;
                            prevPosition.y = myY;

                        } else {
                            // Update cursor style based on position

                            eMove = false;
                            sMove = false;
                            seMove = false;

                            if (myX <= elemWidth && myY <= elemHeight) {

                                if (myY >= elemHeight-13 && myX >= elemWidth-13) {
                                    seMove = true;
                                    element.css('cursor', 'se-resize');

                                } else if (myX >= elemWidth-5) {
                                    eMove = true;
                                    element.css('cursor', 'e-resize');

                                } else if (myY >= elemHeight-5) {
                                    sMove = true;
                                    element.css('cursor', 's-resize');

                                } else element.css('cursor', 'auto');

                            } else element.css('cursor', 'auto');
                        }
                    }

                    document.onmousedown = function(e) {

                        // Get position of the element the cursor is hovering over
                        if ( e.target != curElem ) {
                            curElem.element = e.target;
                            curElem.position = Position.ofElement(e.target, 0);
                            //console.log('Changed element to '+e.target.nodeName+'#'+e.target.id);
                        }

                        if ( e.clientX && curElem.position ) {
                            myX = e.clientX - curElem.position.left;
                            myY = e.clientY - curElem.position.top;
                        }

                        prevPosition.x = myX;
                        prevPosition.y = myY;
                        mouseIsDown = true;
                        
console.log(Position.ofElement(e.target, 0));
                    }
                    document.onmouseup = function(e) {
                        mouseIsDown = false;
                    }
                }
            }
        }
    })