const React = require("react");
const ReactDOM = require("react-dom");

const { GraphicNode, Path } = require("scenegraph");

const SharedStyles = require("./SharedStyles/SharedStyles.jsx");
const AddStyleForm = require("./SharedStyles/AddStyleForm.jsx");
const RenameStyleForm = require("./SharedStyles/RenameStyleForm.jsx");
const layerStyleSerializer = require("../../serializers/layerStyle");

const pluginState = {
    savedStyles: [],
    selectedLayer: null,
    selectedStyleIdx: null
};

const STYLE_PROPS = [
    "fill",
    "fillEnabled",
    "stroke",
    "strokeEnabled",
    "strokeEndCaps",
    "strokeWidth",
    "strokePosition",
    "strokeJoins",
    "strokeMiterLimit",
    "strokeDashArray",
    "strokeDashOffset",
    "blur",
    "shadow"
];

function compareLayerStyle(layer, { data: style }) {
    if (!layer || !style) {
        return true;
    }

    const { data: layerStyle } = layerStyleSerializer.toJSON(layer);

    return STYLE_PROPS.every(prop => JSON.stringify(layerStyle[prop]) === JSON.stringify(style[prop]));
}

const { editDocument } = require("application");
function applyLayerStyle(idx) {
    const styleData = pluginState.savedStyles[idx];

    if (!styleData) {
        return;
    }

    editDocument({ editLabel: "Apply shared style" }, selection => {
        const [layer] = selection.items;

        const style = layerStyleSerializer.fromJSON(styleData.style);

        STYLE_PROPS.forEach(prop => {
            if (prop in style) {
                layer[prop] = style[prop];
            } else {
                delete layer[prop];
            }
        });
    });
}

function saveStyle(name, selectedNode) {
    const savedStyle = layerStyleSerializer.toJSON(selectedNode);

    pluginState.savedStyles.push({
        name,
        style: savedStyle
    });

    renderPanel();
}

function renameStyle(name) {
    const style = pluginState.savedStyles[pluginState.selectedStyleIdx];

    if (!style) {
        return;
    }

    style.name = name;

    renderPanel();
}

function isShapeLayer(node) {
    return node && (node instanceof GraphicNode || node instanceof Path);
}

let addStyleDialog;
function showAddStyleDialog(selection) {
    function getDialog() {
        if (typeof addStyleDialog === "undefined") {
            addStyleDialog = document.createElement("dialog");
        }

        ReactDOM.render(
            <AddStyleForm
                dialog={addStyleDialog}
                selection={selection}
                onSaveClick={saveStyle}/>,
            addStyleDialog
        );

        return addStyleDialog;
    }

    return document.body.appendChild(getDialog()).showModal();
}

let renameStyleDialog;
function showRenameStyleDialog() {
    function getDialog() {
        if (typeof renameStyleDialog === "undefined") {
            renameStyleDialog = document.createElement("dialog");
        }

        ReactDOM.render(
            <RenameStyleForm
                dialog={renameStyleDialog}
                onSaveClick={renameStyle}
                currentName={pluginState.savedStyles[pluginState.selectedStyleIdx].name}/>,
            renameStyleDialog
        );
        return renameStyleDialog;
    }

    return document.body.appendChild(getDialog()).showModal();
}

function deleteLayerStyle(idx) {
    pluginState.savedStyles.splice(idx, 1);

    renderPanel();
}

function updateSelectedStyleIdx(idx) {
    pluginState.selectedStyleIdx = idx;

    renderPanel();
}

function renderPanel() {
    const rootNode = document.querySelector("#rootNode");
    let noDiff = true;

    if (pluginState.selectedLayer !== null && pluginState.selectedStyleIdx !== null) {
        const selected = pluginState.savedStyles[pluginState.selectedStyleIdx];
        noDiff = compareLayerStyle(pluginState.selectedLayer, selected && selected.style);
    }

    ReactDOM.render(
        <SharedStyles
            noDiff={noDiff}
            savedStyles={pluginState.savedStyles}
            applyStyle={applyLayerStyle}
            selectedLayer={pluginState.selectedLayer}
            selectedStyleIdx={pluginState.selectedStyleIdx}
            onAddClick={showAddStyleDialog}
            onRenameClick={showRenameStyleDialog}
            onDeleteClick={deleteLayerStyle}
            onSelect={updateSelectedStyleIdx}/>,
        rootNode
    );
}

function update(selection) {
    let dirty = false;

    if (pluginState.selectedStyleIdx !== null) {
        pluginState.selectedStyleIdx = null;
        dirty = true;
    }

    if (selection && selection.items.length === 1 && isShapeLayer(selection.items[0])) {
        const [selectedLayer] = selection.items;

        pluginState.selectedLayer = selectedLayer;
        dirty = true;
    } else if (pluginState.selectedLayer !== null) {
        pluginState.selectedLayer = null;
        dirty = true;
    }

    if (dirty) {
        renderPanel();
    }
}

function show(event) {
    const rootNode = document.createElement("panel");
    rootNode.id = "rootNode";

    event.node.appendChild(rootNode);

    renderPanel();
}

function hide(event) {
    event.node.firstChild.remove();
}

module.exports = {
    show,
    hide,
    update
};