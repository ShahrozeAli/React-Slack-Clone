import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

//React semantic
import 'semantic-ui-css/semantic.min.css'

//React Routes
import { BrowserRouter as Router, Switch, Route, withRouter } from "react-router-dom";

//Componenets
import App from './App';
import Register from './Components/Auth/Register';
import Login from './Components/Auth/Login';
import Spinner from './spinner';

//importing firebase, we are gonna firebase listener to check, if a user is logged in into our app
import firebase from './firebase';

//importing Redux Store
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';

//impporting Reducers
import rootReducer from './Redux/reducers'

//importing Actions/Reducers
import { setUser, clearUser } from './Redux/actions'

const store = createStore(rootReducer, composeWithDevTools());

class Root extends React.Component {
    //listener to check whether a user is logged in our app
    //it will not let loggedin user to visit login and register pages
    componentDidMount(){
        console.log(this.props.isLoading);
        firebase
        .auth()
        .onAuthStateChanged(user => {
            if (user) {
                //console.log(user);
                //console.log(this.props)
                this.props.setUser(user);
                this.props.history.push("/");
            }
            else {
                this.props.history.push("/login");
                //Clear user global state /* function created in redux actions and types */
                this.props.clearUser();
            }
        })
    }

    render (){
        //adding a loader spinner component until the data is loaded
        return this.props.isLoading ? <Spinner /> : (
                <Switch>
                    <Route exact path="/" component = {App}/>
                    <Route exact path="/register" component = {Register}/>
                    <Route exact path="/login" component = {Login}/>
                </Switch>
        )
    } 
};

//loading data for asynchronous user state
const mapStateFromProps = state => ({
    isLoading: state.user.isLoading
})

//for redirecting to main app component
// const RootWithAuth = withRouter(connect(null, mapDispatchToProps)(Root));
const RootWithAuth = withRouter (connect (mapStateFromProps, { setUser, clearUser })(Root));

ReactDOM.render(
    //Provider component to provide our global state to any components that wants to use it
    <Provider store = { store }>
        <Router>
        <RootWithAuth />
    </Router>
    </Provider>
    
, document.getElementById('root'));
registerServiceWorker();