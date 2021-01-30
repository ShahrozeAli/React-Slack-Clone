import React from 'react';
import { Menu, Icon, Modal, Form, Input, Button } from 'semantic-ui-react';
import firebase from '../../../firebase';

//importing Redux Store
//import { createStore } from 'redux';
import { connect } from 'react-redux';
//import { composeWithDevTools } from 'redux-devtools-extension';

//impporting Reducers
//import rootReducer from '../../../Redux/reducers'

//importing Actions/Reducers
import { setCurrentChannel } from '../../../Redux/actions'

//const store = createStore(rootReducer, composeWithDevTools());

class Channels extends React.Component{

    state = {
        user: this.props.currentUser,
        channels: [],
        channelName: '',
        channelDetails: '',
        modal: false,
        channelsRef: firebase.database().ref("channels"), //referencing to firebase database /* table -> channels */
        firstLoad: true,
        activeChannel: ''
    };

    componentDidMount() {
        this.addListeners();
    }

    componentWillUnmount() {
        this.removeListeners();
    }

    addListeners = () => {
        let loadedChannels = [];
        this.state.channelsRef.on('child_added' , snap => {
            loadedChannels.push(snap.val());
            //console.log(loadedChannels);
            this.setState ({ channels: loadedChannels }, () => this.setFirstChannel());
        })
    }

    removeListeners = () => {
        this.state.channelsRef.off();
    }

    setFirstChannel = () => {
        const firstChannel = this.state.channels[0];
        if (this.state.firstLoad && this.state.channels.length > 0) {
            this.props.setCurrentChannel(firstChannel);
            this.setActiveChannel(firstChannel);
        }

        this.setState ({ firstLoad: false})
    }

    closeModal = () => this.setState ({ modal: false });
    openModal = () => this.setState ({ modal: true });

    handleChange = event => {
        this.setState ({ [event.target.name]: event.target.value });
    }

    handleSubmit = event => {
        event.preventDefault();
        if (this.isFormValid(this.state)) {
            //console.log("channel added");
            this.addChannel();
        }
    }

    addChannel = () => {
        const { channelsRef, channelName, channelDetails, user } = this.state;

        //unique identifier for each channel
        const key = channelsRef.push().key;

        const newChannel = {
            id: key,
            name: channelName,
            details: channelDetails,
            createdBy: {
                name: user.displayName,
                avatar: user.photoURL
            }
        }

        channelsRef
        .child(key)
        .update(newChannel)
        .then(() => {
            this.setState({ channelName: '', channelDetails: ''});
            this.closeModal();
            console.log("channel added");
        })
        .catch(err => {
            console.log(err);
        })
    }

    isFormValid = ({ channelName, channelDetails }) => channelName && channelDetails;

    //putting channel on global state /* for redux */
    changeChannel = channel => {
        this.setActiveChannel(channel);
        this.props.setCurrentChannel(channel);
        //console.log("ye mera area hai, or mera area mai entrance ni karne ka");
    }

    setActiveChannel = channel => {
        this.setState({ activeChannel: channel.id })
    }

    displayChannels = channels => 
        channels.length > 0 && 
        channels.map(channel => (
            <Menu.Item 
                key = {channel.id}
                onClick = {() => this.changeChannel(channel)}
                name = {channel.name}
                style = {{ opacity: 0.7 }}
                active = { channel.id === this.state.activeChannel }
            >
                # {channel.name}
            </Menu.Item>
        ))
    

    render() {

        const { channels, modal } = this.state;

        return(
            <div>
                <Menu.Menu style = {{ paddingBottom: '2em' }}>
                    <Menu.Item>
                        <span>
                            <Icon name = "exchange" /> Channels
                        </span>{" "}
                        ({ channels.length }) <Icon name = "add" onClick = { this.openModal }/>
                    </Menu.Item>
                    { this.displayChannels(channels) }
                </Menu.Menu>
                <Modal basic open = { modal } onClose = { this.closeModal }>
                    <Modal.Header>Add a Channel</Modal.Header>
                    <Modal.Content>
                    <Form onSubmit = { this.handleSubmit }>
                        <Form.Field>
                            <Input
                                fluid
                                label = "Name of Channel"
                                name = "channelName"
                                onChange = { this.handleChange }
                            />
                        </Form.Field>
                        <Form.Field>
                            <Input
                                fluid
                                label = "About the Channel"
                                name = "channelDetails"
                                onChange = { this.handleChange }
                            />
                        </Form.Field>
                    </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color = "green" inverted onClick = { this.handleSubmit }>
                            <Icon name = "checkmark" /> Add
                        </Button>
                        <Button color = "red" inverted onClick = { this.closeModal }>
                            <Icon name = "remove" /> Cancel
                        </Button>
                    </Modal.Actions>
                </Modal>
            </div>
        )
    }
}

export default connect( null, {setCurrentChannel} )(Channels);