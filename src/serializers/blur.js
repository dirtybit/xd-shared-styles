const { Blur } = require("scenegraph");

function fromJSON({ data }) {
    const {
        blurAmount,
        brightnessAmount,
        fillOpacity,
        visible,
        isBackgroundEffect
    } = data;

    return new Blur(blurAmount, brightnessAmount, fillOpacity, visible, isBackgroundEffect);
}

function toJSON(blur) {
    return {
        type: "blur",
        data: {
            blurAmount: blur.blurAmount,
            brightnessAmount: blur.brightnessAmount,
            fillOpacity: blur.fillOpacity,
            isBackgroundEffect: blur.isBackgroundEffect,
            visible: blur.visible
        }
    };
}

module.exports = {
    fromJSON,
    toJSON
};