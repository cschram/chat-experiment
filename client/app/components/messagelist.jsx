import React from 'react';
import ReactDOM from 'react-dom';
import {LeftNav,List,ListItem} from 'material-ui';

export default class MessageList extends React.Component {
    render() {
        return (
            <List style={this.props.style}>
                {this.props.messages.map((msg, index) =>
                    <ListItem primaryText={msg.username}
                              secondaryText={msg.text}
                              key={index} />
                )}
            </List>
        );
    }

    componentDidUpdate() {
        let node = ReactDOM.findDOMNode(this);
        node.scrollTop = node.scrollHeight;
    }
}