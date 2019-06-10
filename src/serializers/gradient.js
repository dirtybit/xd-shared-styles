const { LinearGradient } = require("scenegraph");
const colorSerializer = require("./color");

function fromJSON({ data }) {
    const {
        colorStops,
        startX,
        startY,
        endX,
        endY
    } = data;

    const gradient = new LinearGradient();

    gradient.setEndPoints(startX, startY, endX, endY);
    gradient.colorStops = colorStops.map(cs => ({
        stop: cs.stop,
        color: colorSerializer.fromJSON(cs.color)
    }));

    return gradient;
}

function toJSON(gradient) {
    const [startX, startY, endX, endY] = gradient.getEndPoints();
    const colorStops = gradient.colorStops.map(cs => ({
        stop: cs.stop,
        color: colorSerializer.toJSON(cs.color)
    }));

    return {
        type: "gradient",
        data: {
            colorStops,
            startX,
            startY,
            endX,
            endY
        }
    };
}

module.exports = {
    fromJSON,
    toJSON
};