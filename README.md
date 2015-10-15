# Element In-Viewport

Fire events when elements enter and exit the view port.


## Usage -- Source ES6 Module


	import inStalk from 'in-stalk';

	var img = document.querySelector('.my-element');

	img.addEventListener('in-stalk.in', function(){
	          img.classList.add('active');
	      });

	      img.addEventListener('in-stalk.out', function(){
	          img.classList.remove('active');
	      });

	inStalk.add( img );




## Usage (as a global var)


### Add listeners to viewport in/out.


	// Grab an element
	var element = document.querySelector('.some-selector');

	// react when element enters viewport
	element.addEventListener('in-stalk.in', function() {
	    element.setAttribute('data-inviewport', 1);
	});

	// react when element leaves viewport
	element.addEventListener('in-stalk.out', function() {
	    element.setAttribute('data-inviewport', 0);
	});


### Start watching an element


	inStalk.add(element);


### Stop watching an element


	inStalk.remove(element);


