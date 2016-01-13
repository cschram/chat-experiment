import React from 'react';
import {connect} from 'react-redux';
import {LeftNav,Divider,Styles} from 'material-ui';
import UserList from '../components/userlist.jsx';
import MessageList from '../components/messagelist.jsx';
import MessageInput from '../components/messageinput.jsx';

class Chat extends React.Component {
    render() {
        let styles = this.getStyles();
        return (
            <div style={styles.root}>
                <div style={styles.content}>
                    <MessageList messages={this.props.messages}
                                 style={styles.messageList} />
                    <Divider />
                    <MessageInput currentUser={this.props.currentUser}
                                  dispatch={this.props.dispatch} />
                </div>
                <LeftNav docked={true} open={true}>
                    <UserList users={this.props.users} />
                </LeftNav>
            </div>
        );
    }

    getStyles() {
        let padding = Styles.Spacing.desktopGutter;
        return Object.assign({
            root: {
                height: '100%',
                overflow: 'hidden'
            },
            content: {
                height: '100%',
                margin: padding,
                overflow: 'hidden',
                paddingLeft: 256
            },
            messageList: {
                height: 'calc(100% - 78px - ' + padding + 'px)',
                overflowY: 'auto'
            }
        }, this.props.style);
    }
}

export default connect(state => state)(Chat);
