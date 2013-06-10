//********************************************************************
//
//  Position Service
//
//********************************************************************
angular.module('PositionApp', [])

    .service('Position', function() {


        //***********************************************************
        //
        //      @id - the id of the element whose position will be given
        //      @relativeTo - the location of the specified element will be given relative to ...
        //
        //      returns - position object w/ the top-left coordinates of the element
        //
        this.ofElement = function( elem, relativeTo ) {

                var parent,
                    win,
                    totalTop,
                    totalLeft,
                    count = 1;

                totalTop = elem.offsetTop;
                totalLeft = elem.offsetLeft;

                // Navigate the element's hierarchical tree, summing up the offsets
                while ((elem = elem.offsetParent) &&
                        elem !== document.body &&
                        elem !== document.documentElement &&
                        count != relativeTo) {
                    totalTop += elem.offsetTop;
                    totalLeft += elem.offsetLeft;
                    count++;
                }

                // Give position relative to what's on the screen
                if (relativeTo == -1 && (win = elem.ownerDocument.defaultView)) {
                    totalTop -= win.scrollY;
                    totalLeft -= win.scrollX;
                }

                return { top: totalTop, left: totalLeft };
        };

        this.mouseInElement = function( event, elemPosition) {

            var myX, myY;

            if ( event.clientX && elemPosition ) {      // Chrome, Firefox
                myX = event.pageX - elemPosition.left;
                myY = event.pageY - elemPosition.top;
            } else if ( event.x ) {                     // IE
                myX = event.x - elemPosition.left;
                myY = event.y - elemPosition.top;
            }

            return { x: myX, y: myY };
        };
    })