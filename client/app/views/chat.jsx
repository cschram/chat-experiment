import React from 'react';
import {connect} from 'react-redux';
import {sendMessage} from '../actions';

class Chat extends React.Component {
    render() {
        return (
            <div className="chat">
                <div className="users">
                    <ul>{this.renderUsers(this.props.users)}</ul>
                </div>
                <div className="messages">
                    <ul>{this.renderMessages(this.props.messages)}</ul>
                </div>
                <form className="message-input" onSubmit={e => this.handleMessage(e)}>
                    <input type="text" ref="message" />
                    <button onClick={e => this.handleMessage(e)}>Send</button>
                </form>
            </div>
        );
    }

    renderUsers(users) {
        return users.map((user, index) => {
            return <li className="user" key={index}>{user}</li>;
        });
    }

    renderMessages(messages) {
        return messages.map((message, index) => {
            return (<li className="message" key={index}>
                <strong>{message.username}:</strong>
                <span>{message.text}</span>
            </li>);
        });
    }

    handleMessage(e) {
        e.preventDefault();
        const node = this.refs.message;
        const text = node.value.trim();
        this.props.dispatch(sendMessage(text));
        node.value = '';
    }
}

export default connect(state => state)(Chat);
