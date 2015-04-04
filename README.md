# Element In-Viewport

Fire events when elements enter and exit the view port.


## Usage


### Add listeners to viewport in/out.

```
// Grab an element
var element = document.querySelector('.some-selector');

// react when element enters viewport
element.addEventListener('viewport:in', function() {
    element.setAttribute('data-inviewport', 1);
});

// react when element leaves viewport
element.addEventListener('viewport:out', function() {
    element.setAttribute('data-inviewport', 0);
});
```

### Start watching an element

```
viewportwatcher.add(element);
```

### Stop watching an element

```
viewportwatcher.remove(element);

```


## Common Pitfalls

For accurate position detection on _page load_, attach the instantiation of elements to `window.onload`:


```
window.addEventListener('load', function() {
    var element = document.querySelector('.some-selector');

    // react when element enters viewport
    element.addEventListener('viewport:in', function() {
        element.setAttribute('data-inviewport', 1);
        viewportwatcher.remove( element );
    });

    // watch the element
    viewportwatcher.add(element);
});
```

## Dependencies

[Modern browsers](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent#Browser_compatibility) and IE9+ with [Polyfill for CustomEvent constructor](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill).