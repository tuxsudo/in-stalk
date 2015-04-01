function viewportwatcher() {

    var _isWatching = false,

        // elements currently in viewport
        _listVPIn = [], 

        // elements out of viewport
        _listVPOut = [],

        // true if element in viewport      
        _isInView = function(element) {

            var bounds = element.getBoundingClientRect();

            return (
                bounds.top >= 0 &&
                // bounds.left >= 0 &&
                // bounds.right <= window.innerWidth &&
                bounds.bottom <= window.innerHeight
            );

        },

        // true if already watching element
        _listHasElement = element => _listVPIn.concat(_listVPOut).filter(elm=>elm!==element).length>0,


        // add element to elements in-view
        _addToIn = function(element){
            _listVPIn.push( element );
            _broadcastElementIn( element );
            _registerWatchListChange();
            return true;
        },

        // add element to elements
        _addToOut = function(element){
            _listVPOut.push( element );
            _broadcastElementOut( element );
            _registerWatchListChange();
            return true;
        },

        // tell errrbodoy the element entered the viewport
        _broadcastElementIn = element => element.dispatchEvent( new CustomEvent("inview:entered", { bubbles: true } )),

        // tell errrbodoy the element left the viewport
        _broadcastElementOut = element => element.dispatchEvent(new CustomEvent("inview:exited", { bubbles: true } )),


        // stop watching scroll and stuff if there are no elements to watch
        _registerWatchListChange = function() {

            if(_listVPIn.length + _listVPOut.length > 0 && !_isWatching) {
                _attach();
            }

            else if(_listVPIn.length + _listVPOut.length === 0 && _isWatching) {
                _detach();
            }

        },

        // add event listeners to the likes of window scroll
        _attach = function(){
            _isWatching = true;
            ['scroll', 'hashchange', 'touchend', 'resize'].forEach( function(ev){
                window.addEventListener(ev, _throttleCheck);
            });
        },

        // remove event listeners to the likes of window scroll
        _detach = function(){
            _isWatching = false;
            ['scroll', 'hashchange', 'touchend', 'resize'].forEach( function(ev){
                window.removeEventListener(ev, _throttleCheck);
            });
        },


        // throttle timer
        _timer = null, 

        // throttle the checking
        _throttleCheck = function() {
            clearTimeout(_timer);
            _timer = setTimeout(_check, 50);
        },


        // what to execute while scrolling / moving viewport location
        _check = function() {

            console.log('checking...');

            var element,
                newin = [],
                newout = [];


            while( _listVPIn.length ) {

                element = _listVPIn.pop();

                if( !_isInView(element) ) {
                    newout.push( element );
                    _broadcastElementOut(element);
                } else {
                    newin.push(element);
                }

            }

            while( _listVPOut.length ) {

                element = _listVPOut.pop();

                if( _isInView(element) ) {
                    newin.push( element );
                    _broadcastElementIn(element);
                } else {
                    newout.push(element);
                }

            }

            _listVPOut = newout;
            _listVPIn = newin;



        };



    return {

        // add element to stalk list
        add: function(element) {
            if( _listHasElement(element) ) return false;

            return _isInView(element) && _addToIn(element) || (_listVPOut.push(element) && _registerWatchListChange() );

        },

        // remove an element from stalk list
        remove: function(element) {
            var newIn = _listVPIn.filter(function(el){ return element!== el; }),
                newOut = _listVPOut.filter(function(el){ return element!== el; });

            if(newIn.length+newOut.length===_listVPIn.length+_listVPOut.length) {
                return false;
            }

            _listVPOut = newOut;
            _listVPIn = newIn;

            _registerWatchListChange();

            return true;



        }

    };


}

window.addEventListener('load', function(){

    [].forEach.call( document.querySelectorAll('img:nth-child(17), img:last-child'), function(img){

        img.addEventListener('inview:entered', function(){
            img.classList.add('active');
            console.log('entered');
        });

        img.addEventListener('inview:exited', function(){
            img.classList.remove('active');
            console.log('exited');
        });


        viewportwatcher().add(img);
        
    });



});

