import React from 'react';
import {connect} from 'react-redux';
import {login} from '../actions';
import history from '../history';

class Login extends React.Component {
    render() {
        return (
            <form id="login" onSubmit={e => this.handleSubmit(e)}>
                <p>Please enter a username:</p>
                <input type="text" ref="username" />
                <button onClick={e => this.handleSubmit(e)}>Login</button>
            </form>
        );
    }

    handleSubmit(e) {
        e.preventDefault();
        const username = this.refs.username.value.trim();
        this.props.dispatch(login(username));
        history.push('/');
    }
}

export default connect(state => state)(Login);
