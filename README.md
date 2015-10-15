# In-Stalk

Event notifications when elements enter and exit the view port.



## Event Notification Names

### in-stalk.in
Element entered the viewport

### in-stalk.out
Element exited the viewport


### in-stalk.in.bottom
Element entered the viewport from bottom (ie: scrolling down on page)


### in-stalk.out.bottom
Element exited the viewport from bottom (ie: scrolling up on page)


### in-stalk.in.top
Element entered the viewport from top (ie: scrolling up on page)

### in-stalk.out.top
Element exited the viewport from top (ie: scrolling down on page)




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


