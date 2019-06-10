const { Shadow } = require("scenegraph");
const colorSerializer = require("./color");

function fromJSON({ data }) {
    const {
        x,
        y,
        blur,
        color,
        visible
    } = data;

    return new Shadow(x, y, blur, colorSerializer.fromJSON(color), visible);
}

function toJSON(shadow) {
    return {
        type: "shadow",
        data: {
            x: shadow.x,
            y: shadow.y,
            blur: shadow.blur,
            color: colorSerializer.toJSON(shadow.color),
            visible: shadow.visible
        }
    };
}

module.exports = {
    fromJSON,
    toJSON
};