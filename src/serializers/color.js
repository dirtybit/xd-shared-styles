const { Color } = require("scenegraph");

function fromJSON({ data }) {
    const {
        r,
        g,
        b,
        a
    } = data;

    return new Color({ r, g, b, a });
}

function toJSON(color) {
    return {
        type: "color",
        data: {
            r: color.r,
            g: color.g,
            b: color.b,
            a: color.a
        }
    };
}

module.exports = {
    fromJSON,
    toJSON
};