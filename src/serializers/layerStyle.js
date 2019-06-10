const { Color, LinearGradient } = require("scenegraph");
const blurSerializer = require("./blur");
const colorSerializer = require("./color");
const gradientSerializer = require("./gradient");
const shadowSerializer = require("./shadow");

function fromJSON({ data }) {
    const {
        fill,
        fillEnabled,
        stroke,
        strokeEnabled,
        strokeEndCaps,
        strokeWidth,
        strokePosition,
        strokeJoins,
        strokeMiterLimit,
        strokeDashArray,
        strokeDashOffset,
        blur,
        shadow
    } = data;

    let fillObject;

    if (fill && fill.type === "color") {
        fillObject = colorSerializer.fromJSON(fill);
    } else if (fill && fill.type === "gradient") {
        fillObject = gradientSerializer.fromJSON(fill);
    }

    return {
        fill: fillObject,
        fillEnabled,
        stroke: stroke && colorSerializer.fromJSON(stroke),
        strokeEnabled,
        strokeEndCaps,
        strokeWidth,
        strokePosition,
        strokeJoins,
        strokeMiterLimit,
        strokeDashArray,
        strokeDashOffset,
        blur: blur && blurSerializer.fromJSON(blur),
        shadow: shadow && shadowSerializer.fromJSON(shadow)
    };
}

function toJSON(layer) {
    const jsonObject = {};

    if (layer.fill instanceof Color) {
        jsonObject.fill = colorSerializer.toJSON(layer.fill);
        jsonObject.fillEnabled = layer.fillEnabled;
    } else if (layer.fill instanceof LinearGradient) {
        jsonObject.fill = gradientSerializer.toJSON(layer.fill);
        jsonObject.fillEnabled = layer.fillEnabled;
    }

    if (layer.stroke) {
        jsonObject.stroke = colorSerializer.toJSON(layer.stroke);
        jsonObject.strokeEnabled = layer.strokeEnabled;
        jsonObject.strokeWidth = layer.strokeWidth;
        jsonObject.strokeEndCaps = layer.strokeEndCaps;
        jsonObject.strokePosition = layer.strokePosition;
        jsonObject.strokeJoins = layer.strokeJoins;
        jsonObject.strokeMiterLimit = layer.strokeMiterLimit;
        jsonObject.strokeDashArray = layer.strokeDashArray;
        jsonObject.strokeDashOffset = layer.strokeDashOffset;
    }

    if (layer.blur) {
        jsonObject.blur = blurSerializer.toJSON(layer.blur);
    }

    if (layer.shadow) {
        jsonObject.shadow = shadowSerializer.toJSON(layer.shadow);
    }

    return {
        type: "layerStyle",
        data: jsonObject
    };
}

module.exports = {
    fromJSON,
    toJSON
};