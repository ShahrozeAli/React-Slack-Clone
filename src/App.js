import React from 'react';
import { Grid } from 'semantic-ui-react';
import "./App.css"
import { connect } from 'react-redux';

//importing panels
import ColorPanel from './Components/ChatPanels/ColorPanel';
import Sidepanel from './Components/ChatPanels/SidePanel/SidePanel';
import Messages from './Components/ChatPanels/Messages/Messages';
import MetaPanel from './Components/ChatPanels/MetaPanel';

const App = ({ currentUser, currentChannel }) => {
  //console.log({currentUser})
  return  (
    <Grid columns = "equal" className = "app" style = {{ background: "#eee" }}>
      <ColorPanel />
      <Sidepanel 
        key = { currentUser && currentUser.uid } 
        currentUser = { currentUser } />
  
      <Grid.Column style = {{ marginLeft: 320 }}>
      <Messages 
        key = { currentChannel && currentChannel.id } 
        currentChannel = { currentChannel } 
        currentUser = { currentUser }/>
      </Grid.Column>
  
      <Grid.Column width = {4}>
      <MetaPanel />
      </Grid.Column>
      
    </Grid>
  )
}

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
  currentChannel: state.channel.currentChannel
})

export default connect(mapStateToProps)(App);
