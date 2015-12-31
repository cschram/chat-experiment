import React from 'react';
import {connect} from 'react-redux';
import {Card,CardTitle,RaisedButton,TextField} from 'material-ui';
import {login} from '../actions';
import history from '../history';

class Login extends React.Component {
    render() {
        let styles = this.getStyles();
        return (
            <Card style={styles.loginForm}>
                <TextField hintText="Username"
                           style={styles.input}
                           ref="username"
                           onEnterKeyDown={e => this.handleSubmit(e)} />
                <RaisedButton label="Login"
                              primary={true}
                              style={styles.input}
                              onClick={e => this.handleSubmit(e)} />
            </Card>
        );
    }

    getStyles() {
        return Object.assign({
            loginForm: {
                margin: '2em auto',
                padding: '2em',
                width: 600
            },
            input: {
                display: 'block',
                width: '100%'
            }
        }, this.props.style);
    }

    handleSubmit(e) {
        e.preventDefault();
        const username = this.refs.username.getValue();
        this.props.dispatch(login(username));
        history.push('/');
    }
}

export default connect(state => state)(Login);
