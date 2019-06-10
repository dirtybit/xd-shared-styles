const React = require("react");

class AddStyleForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { name: "" };
        this.onInputChange = e => {
            this.setState({ name: e.target.value });
        };
        this.onDoneClick = () => {
            const { selection, onSaveClick } = this.props;
            const { name } = this.state;

            this.setState({
                name: ""
            });

            onSaveClick(name, selection);

            props.dialog.close();
        };
    }

    render() {
        return (
            <form style={{ width: 300 }} onSubmit={this.onDoneClick}>
                <h1>Add Shared Style</h1>
                <label>
                    <span>Enter a name for the style</span>
                    <input onChange={this.onInputChange} value={this.state.name} />
                </label>
                <footer>
                    <button disabled={this.state.name.length === 0} type="submit" uxp-variant="cta">Save</button>
                </footer>
            </form>
        );
    }
}

module.exports = AddStyleForm;