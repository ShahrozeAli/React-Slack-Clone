import React from 'react';
import mime from 'mime-types';
import { Icon, Modal, Input, Button } from 'semantic-ui-react';

class FileModal extends React.Component {

    state = {
        file: null,
        authorized: ['image/jpeg', 'image/png']
    }

    addFile = event => {
        console.log("Entered into addFile function");
        const file = event.target.files[0];
        if (file) {
            this.setState ({ file });
        }
    }

    sendFile = () => {
        console.log("Entered into sendFile function");
        const { file } = this.state;
        const { uploadFile, closeModal } = this.props;
        if (file !== null) {
            if (this.isAuthorized(file.name)) {
                const metadata = { contentType: mime.lookup(file.name)};
                uploadFile(file, metadata);
                closeModal();
                this.clearFile();
            }
        }
    }

    isAuthorized = filename => this.state.authorized.includes(mime.lookup(filename));

    clearFile = () => {
        this.setState({ file: null });
        console.log("File state cleared");
    }
    


    render () {
        const { modal, closeModal } = this.props;

        return (
            <React.Fragment>
                <Modal basic open = { modal } onClose = { closeModal }>
                    <Modal.Header>Select an Image</Modal.Header>
                    <Modal.Content>
                        <Input 
                            fluid
                            label = "File types: jpg, png"
                            name = "file"
                            type = "file"
                            onChange = { this.addFile }
                        />
                    </Modal.Content>
                    <Modal.Actions>
                        <Button 
                            onClick = { this.sendFile }
                            color = "green" 
                            inverted > 
                            <Icon name = "checkmark" /> Send  </Button>
                        <Button color = "red" inverted onClick = { closeModal }>  <Icon name = "remove" /> Cancel </Button>
                    </Modal.Actions>
                </Modal>
            </React.Fragment>
        )
    }
}

export default FileModal;