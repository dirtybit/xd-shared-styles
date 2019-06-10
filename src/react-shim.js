function empty() {
    // Empty function
}

if (window.setTimeout === null) {
    window.setTimeout = function (fn) {
        fn();
    };
}

if (window.clearTimeout === null) {
    window.clearTimeout = empty;
}

if (window.cancelAnimationFrame === null) {
    window.cancelAnimationFrame = empty;
}
if (window.requestAnimationFrame === null) {
    window.requestAnimationFrame = function () {
        console.log("requestAnimationFrame is not supported yet");
    };
}
if (window.HTMLIFrameElement === null) {
    window.HTMLIFrameElement = class HTMLIFrameElement { };
}