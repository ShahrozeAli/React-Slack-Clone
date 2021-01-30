import React from 'react';

import { Segment, Button, Input } from 'semantic-ui-react';
import FileModal from './FileModal';

import firebase from '../../../firebase';

class MessageForm extends React.Component {

    state = {
        message: '',
        loading: false,
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        errors: [],
        modal: false,
    }

    handleChange = event => {
        this.setState ({ [event.target.name]: event.target.value })
    }

    createMessage = () => {
        const message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: this.state.user.uid,
                name: this.state.user.displayName,
                avatar: this.state.user.photoURL
            },
            content: this.state.message
        }
        return message
    }

    sendMessage = () => {
        const { messagesRef } = this.props;
        const { message, channel } = this.state;

        if (message) {
            this.setState ({ loading: true});
            messagesRef
                .child(channel.id)
                .push()
                .set(this.createMessage())
                .then(() => {
                    this.setState ({ loading: false, message: '', errors: [] });
                })
                .catch(err => {
                    console.log(err);
                    this.setState ({
                        loading: false,
                        errors: this.state.errors.concat(err)
                    })
                })
        } else {
            this.setState ({ 
                errors: this.state.errors.concat({ message: "Add a message.." })
            })
        }
    }

    closeModal = () => {
        this.setState ({ modal: false });
    }
    openModal = () => { 
        this.setState ({ modal: true });
    }

    uploadFile = (file, metadata) => {
        console.log(file, metadata);
    }
    
    render() {

        const { errors, message, loading, modal } = this.state;
        return (
            <React.Fragment>
                <Segment className = "message__form">
                    <Input 
                        fluid 
                        name = "message" 
                        style = {{ marginBottom: '0.7em'}} 
                        label = {<Button 
                        icon = {'add'} />}
                        labelPosition = "left"
                        placeholder = "Write your message"
                        onChange =  { this.handleChange } 
                        value = { message }
                        className = { errors.some(error => error.message.includes("messages")) ? "error" : "" } />
                        <Button.Group icon width = "2">
                            <Button 
                                color = "orange" 
                                content = "Add Reply" 
                                labelPosition = "left" 
                                icon="edit" 
                                onClick = { this.sendMessage }
                                disabled = { loading }
                            />
                            <Button 
                                color = "teal" 
                                content = "Upload Media" 
                                labelPosition = "right" 
                                icon="cloud upload" 
                                onClick = { this.openModal }
                            />
                        </Button.Group>
                        <FileModal 
                            modal = { modal } 
                            closeModal = { this.closeModal }
                            uploadFile = { this.uploadFile }
                        />
                </Segment>
            </React.Fragment>
        )
    }
}

export default MessageForm;