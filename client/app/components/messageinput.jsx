import React from 'react';
import {RaisedButton,TextField} from 'material-ui';
import {newMessage} from '../actions';
import {sendMessage} from '../connection';

export default class MessageInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = { error: '' };
    }

    render() {
        let styles = this.getStyles();
        return (
            <div>
                <TextField hintText="Message"
                           style={styles.input}
                           ref="message"
                           onEnterKeyDown={e => this.handleSubmit(e)} />
            </div>
        );
    }

    getStyles() {
        return Object.assign({
            input: {
                display: 'block',
                width: '100%'
            }
        }, this.props.style);
    }

    handleSubmit(e) {
        e.preventDefault();
        const message = this.refs.message.getValue();
        this.setState({ error: '' });
        if (message.length) {
            sendMessage(message)
                .then(() => this.refs.message.clearValue())
                .catch(err => this.setState({ error: err }));
        }
    }
}