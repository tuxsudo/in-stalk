export default function (element) {
    var bounds = element.getBoundingClientRect();

    return element.offsetParent!==null &&
    	bounds.bottom >= 0 && bounds.top<=window.innerHeight &&
    	bounds.right >= 0 && bounds.left <= window.innerWidth;
}
