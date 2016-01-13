import React from 'react';
import {connect} from 'react-redux';
import {Card,CardTitle,RaisedButton,TextField} from 'material-ui';
import connection from '../connection';
import {login, serverState} from '../actions';
import history from '../history';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = { error: '' };
    }

    render() {
        let styles = this.getStyles();
        let buttonStyle = Object.assign({}, styles.input, {
            marginTop: '1em'
        });
        return (
            <Card style={styles.loginForm}>
                {this.renderInput(styles)}
                <RaisedButton label="Login"
                              primary={true}
                              style={buttonStyle}
                              onClick={e => this.handleSubmit(e)} />
                }
            </Card>
        );
    }

    renderInput(styles) {
        if (this.state.error.length) {
            return <TextField hintText="Username"
                              style={styles.input}
                              errorText={this.state.error}
                              ref="username"
                              onEnterKeyDown={e => this.handleSubmit(e)} />
        } else {
            return <TextField hintText="Username"
                              style={styles.input}
                              ref="username"
                              onEnterKeyDown={e => this.handleSubmit(e)} />
        }
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
        this.setState({ error: '' });
        connection.login(username).then((state) => {
            state.users = state.users.map(user => user.username);
            this.props.dispatch(login(username, state));
            history.push('/');
        }).catch(err => this.setState({ error: err }));
    }
}

export default connect(state => state)(Login);
