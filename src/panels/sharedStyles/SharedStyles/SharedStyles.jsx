const React = require("react");

const itemStyle = {
    boxSizing: "border-box",
    padding: "6px 12px",
    backgroundColor: "#ffffff",
    margin: "3px 0",
    height: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: "2px",
    border: "1px solid #ffffff"
};

const itemStyleSelected = Object.assign({}, itemStyle, {
    borderColor: "#1592E6"
});

const panelStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
};

const panelStyleEmpty = Object.assign({}, panelStyle, {
    alignItems: "center"
});

const footerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
};

class SharedStyles extends React.Component {
    constructor(props) {
        super(props);

        this.handleApplyClick = this.handleApplyClick.bind(this);
        this.handleSingleClick = this.handleSingleClick.bind(this);
        this.handleAddClick = this.handleAddClick.bind(this);
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.deselectIdx = this.deselectIdx.bind(this);
        this.handleRenameClick = this.handleRenameClick.bind(this);

        this.rootRef = React.createRef();

        this.clickHandled = false;
    }

    handleSingleClick(idx) {
        const { onSelect } = this.props;

        onSelect(idx);
    }

    handleRenameClick(idx) {
        const { onRenameClick } = this.props;

        onRenameClick(idx);
    }

    handleApplyClick(idx) {
        const { applyStyle, onSelect } = this.props;

        applyStyle(idx);
        onSelect(null);
    }

    handleAddClick(ev) {
        const { onAddClick, selectedLayer, onSelect } = this.props;

        ev.stopPropagation();

        onSelect(null);

        if (selectedLayer) {
            onAddClick(selectedLayer);
        }
    }

    handleDeleteClick(ev) {
        const { onDeleteClick, onSelect, selectedStyleIdx } = this.props;

        ev.stopPropagation();

        onSelect(null);

        if (selectedStyleIdx !== null) {
            onDeleteClick(selectedStyleIdx);
        }
    }

    deselectIdx() {
        if (this.clickHandled) {
            return;
        }

        const { onSelect } = this.props;

        onSelect(null);
    }

    componentDidCatch(error, info) {
        console.log("ERROR", error, info);
    }

    render() {
        const { savedStyles, selectedLayer, selectedStyleIdx, noDiff } = this.props;

        this.clickHandled = false;

        if (!savedStyles.length) {
            return (
                <div className="styles-panel" style={panelStyleEmpty}>
                    <p>There is no styles added yet!</p>
                    <div style={footerStyle}>
                        <button onClick={this.handleAddClick} disabled={!selectedLayer} uxp-variant="cta">Add</button>
                    </div>
                </div>
            );
        }

        return (
            <div ref={this.rootRef} className="styles-panel" style={panelStyle} onClick={this.deselectIdx}>
                <div className="style-items">
                    {savedStyles.map((style, idx) => (
                        <div
                            key={idx}
                            style={idx === selectedStyleIdx ? itemStyleSelected : itemStyle}
                            className={`style-item item-${idx}`}
                            onClick={() => {
                                this.clickHandled = true;

                                this.handleSingleClick(idx);
                            }}>
                            {style.name}
                            <div>
                                {idx === selectedStyleIdx &&
                                <span
                                    key="rename"
                                    onClick={() => {
                                        this.clickHandled = true;

                                        this.handleRenameClick(idx);
                                    }}
                                    style={{ cursor: "pointer" }}>
                                    ✏️
                                </span>
                                }
                                {selectedLayer && idx === selectedStyleIdx && !noDiff &&
                                <span
                                    key="apply"
                                    onClick={() => {
                                        this.clickHandled = true;

                                        this.handleApplyClick(idx);
                                    }}
                                    style={{ cursor: "pointer", margin: "0 0 0 6px" }}>
                                    💅
                                </span>
                                }
                            </div>
                        </div>
                    ))}
                </div>
                <div style={footerStyle}>
                    <button onClick={this.handleAddClick} disabled={!selectedLayer} uxp-variant="cta">Add</button>
                    <button onClick={this.handleDeleteClick} disabled={selectedStyleIdx === null} uxp-variant="warning">Delete</button>
                </div>
            </div>
        );
    }
}

module.exports = SharedStyles;