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
//console.log(id.offsetTop);
            //if (typeof id === 'string') {

                var parent,
                    win,
                    totalTop,
                    totalLeft,
                    count = 1;

                //if (!(elem = document.getElementById(id)))
                //    return null;
                totalTop = elem.offsetTop;
                totalLeft = elem.offsetLeft;

                // Navigate the element's hierarchical tree
                while ((elem = elem.offsetParent) &&
                        elem !== document.body && 
                        elem !== document.documentElement &&
                        count != relativeTo) {
                    console.log(elem.offsetTop);
                    totalTop += elem.offsetTop;
                    totalLeft += elem.offsetLeft;
                    count++;
                    //console.log(elem.offsetParent);
                }

                if (relativeTo == -1 && (win = elem.ownerDocument.defaultView)) {
                    totalTop -= win.scrollY;
                    totalLeft -= win.scrollX;
                }
                //console.log(totalTop+'  '+totalLeft);
                return { top: totalTop, left: totalLeft };

            //} else {
            //    return { top: id.offsetTop, left: id.offsetLeft }
            //}
        };
    })