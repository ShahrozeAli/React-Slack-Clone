import React from 'react';
import { Comment } from 'semantic-ui-react';
import moment from 'moment';

//for user authetication
const isOwnMessage = (message, user) => {
    return message.user.id === user.uid ? "message__self" : '';
}

const timeFromNow = timestamp => moment(timestamp).fromNow();

// var randomColor = Math.floor(Math.random()*16777215).toString(16); /* for random color avatar */
// var randomTextColor = Math.floor(Math.random()*16777215).toString(16); /* for random color avatar */
// const randomURL = `https://ui-avatars.com/api/?background=${randomColor}&color=${randomTextColor}`;

const Message = ({ message, user }) => (
    <Comment>
        <Comment.Avatar src = {message.user.avatar} />
        {/* <Comment.Avatar src = { randomURL } /> */}
        <Comment.Content className = { isOwnMessage (message, user)}>
            <Comment.Author as = "a"> { message.user.name } </Comment.Author>
            <Comment.Metadata> { timeFromNow(message.timestamp) } </Comment.Metadata>
            <Comment.Text> { message.content } </Comment.Text>
        </Comment.Content>
    </Comment>
)

export default Message;