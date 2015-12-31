import React from 'react';
import {LeftNav,List,ListItem,CardTitle} from 'material-ui';

export default function (props) {
    return (
        <List style={props.style}>
            <CardTitle title="Users" />
            {props.users.map((user, index) =>
                <ListItem primaryText={user} key={index} />
            )}
        </List>
    );
}