import React from 'react';
import {RaisedButton,TextField} from 'material-ui';
import {sendMessage} from '../actions';

export default class MessageInput extends React.Component {
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
        if (message.length) {
            this.props.dispatch(sendMessage(message));
            this.refs.message.clearValue();
        }
    }
}