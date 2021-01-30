import React from 'react';
import firebase from '../../../firebase';
import { Dropdown, Grid, Header, Icon, Image } from 'semantic-ui-react';

class UserPanel extends React.Component {

    state = {
        user: this.props.currentUser
    }

    dropdownOptions = () => [
        {
            key: "user",
            text: <span>Signed in as 
                <strong> { this.state.user && this.state.user.displayName } </strong>
                </span>,
            disabled: true
        },
        {
            key: "avatar",
            text: <span> Change Avatar </span>
        },
        {
            key: "signout",
            text: <span onClick = { this.handleSignOut }>Sign Out</span>
        }
    ];

    //configurating firebase
    handleSignOut = () => {
        //console.log("ye mera area hai")
        firebase
        .auth()
        .signOut() //signout user
        .then(() => console.log("Signed Out"))
        .catch(err => console.log(err));
    }

    render () {

        //console.log(this.props.currentUser);
        const { user } = this.state;
        // const { displayName, photoURL } = this.state.user;
        const { displayName, photoURL } = this.state.user;
        // var randomColor = Math.floor(Math.random()*16777215).toString(16); /* for random color avatar */
        // var randomTextColor = Math.floor(Math.random()*16777215).toString(16); /* for random color avatar */
        // const randomURL = `https://ui-avatars.com/api/?background=${randomColor}&color=${randomTextColor}`

        return (
            <div style = {{ width: "90%"}}>
                <Grid style = {{ background: '#4c3c4c'}}>
                    <Grid.Column>
                        <Grid.Row style = {{ padding: '1.2em', margin: 0 }}>
                            <Header inverted floated = "left" as = "h2">
                                <Icon name = "code"/>
                                <Header.Content>
                                    DevChat
                                </Header.Content>
                            </Header>
                        </Grid.Row>
                        <Header style = {{ padding: '0.25em' }} as = "h4" inverted>
                            <Dropdown trigger = {
                                <span>
                                    <Image src = { user && photoURL } spaced="right" avatar/>
                                    {/* <Image src = { randomURL } spaced="right" avatar/> */}
                                    { user && displayName } 
                                </span>
                             } options = {
                                 this.dropdownOptions()
                             } />
                        </Header>
                    </Grid.Column>
                </Grid>
            </div>
        )
    }
}

export default UserPanel;