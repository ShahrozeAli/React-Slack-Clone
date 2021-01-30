import React from 'react';
import { Grid, Form, Segment, Button, Header, Message, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import firebase from "../../firebase";
//import md5 from 'md5';

class Register extends React.Component {
    state = {
        username : '',
        email : '',
        password : '',
        passwordConfirmation : '',
        errors: [],
        loading: false,
        usersRef: firebase.database().ref('users') //referencing to firebase database, uers table
    }

    //update react component upon any change in form fields
    handleChange = event => {
        this.setState ({ [event.target.name] : event.target.value }); 
    }

    //Form Validation
    isFormValid = () => {
        let errors = [];
        let error;

        if(this.isFormEmpty(this.state)) {
            error = { message: 'Fill in all Fields' };
            this.setState ({ errors: errors.concat(error) });
            return false;
        }
        else if (!this.isPasswordValid(this.state)){
            error = { message: 'Password is not valid' };
            this.setState ({ errors: errors.concat(error) });
            return false;
        }
        else{
            return true;
        }
    }

    //Checking if form is empty
    isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
        return !username.length || !email.length || !password.length || !passwordConfirmation.length;
    }

    //Checking if password is valid
    isPasswordValid = ({ password, passwordConfirmation }) => {
        if (password !== passwordConfirmation){
            return false;
        }
        else if (password.length < 6 || passwordConfirmation.length < 6){
            return false;
        }
        else {
            return true;
        }
    }

    //Handling form submit with firebase
    handleSubmit = event => {
        var randomColor = Math.floor(Math.random()*16777215).toString(16); /* for random color avatar */
        var randomTextColor = Math.floor(Math.random()*16777215).toString(16); /* for random color avatar */
        //const randomURL = `https://ui-avatars.com/api/?background=${randomColor}&color=${randomTextColor}`;

        if(this.isFormValid()){
            //removing erros upon successful registration
            this.setState({ errors: [], loading: true})
            //refresh page upon successful form submission
            event.preventDefault();
            //configuring with firebase
            firebase //firebase promise
            .auth()
            .createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then(createdUser => {
                console.log(createdUser);
                //updating user displayname and avatar for firebase /* look in for developer tools console */ //
                createdUser.user.updateProfile ({
                    //save additionalUserInfo object as global for debugging in console
                    displayName: this.state.username,
                    // photoURL: `http://gravatar.com/avatar${md5(createdUser.user.email)}?d=identicon` //using md5 for creating unique url avatars for users
                    photoURL : `https://ui-avatars.com/api/?background=${randomColor}&color=${randomTextColor}`
                })
                .then(() => {
                    //saving user in firebase database /* using saveUser function */
                    this.saveUser(createdUser).then(() => {
                        console.log('user saved');
                        this.setState ({ loading: false });
                    })
                })
                .catch(err => {
                    console.error(err);
                    this.setState ({ errors: this.state.errors.concat(err), loading: false });
                })
            })
            .catch(err => {
                console.error(err);
                this.setState ({ errors: this.state.errors.concat(err), loading: false });
            })
        }
    }

    //saving user in firebase
    saveUser = createdUser => {
        return this.state.usersRef.child(createdUser.user.uid).set({ //uid for unique user in firebase
            name: createdUser.user.displayName,
            avatar: createdUser.user.photoURL
        }) 
    }

    //Display errors to users
    displayErrors = errors => 
        errors.map ((error, i) => 
            <p key= {i}>
                { error.message }
            </p>
        )
    
    //Displaying errors for each individual inputs
    /* className = { errors.some(error => error.message.toLowerCase().inlcudes("username")) ? "error" : ""} */
    handleInputError = (errors, inputName) => {
        return errors.some(error => error.message.toLowerCase().includes(inputName)) ? "error" : ''
    }
    
    render(){

        //Object distructuring /* this.state.email => email */ //
        const { username, email, password, passwordConfirmation, errors, loading } = this.state;

        return(
            <div>
                <Grid textAlign = "center" verticalAlign = "middle" className = "app">
                    <Grid.Column style = {{ maxWidth: 450 }}>
                        <Header as = "h2" icon color = "blue" textAlign = "center">
                            <Icon name = "puzzle piece" color = "blue"/>
                            Register For Devchat
                        </Header>
                        <Form onSubmit = { this.handleSubmit } size = "large">
                            <Segment stacked>
                                <Form.Input 
                                    fluid 
                                    name = "username" 
                                    icon = "user" 
                                    iconPosition = "left" 
                                    placeholder = "Username" 
                                    type = "text" 
                                    onChange = { this.handleChange } 
                                    value = { username }
                                    className = { this.handleInputError(errors, 'username') }
                                />
                                <Form.Input 
                                    fluid 
                                    name = "email" 
                                    icon = "mail" 
                                    iconPosition = "left" 
                                    placeholder = "Email Address" 
                                    type = "email" 
                                    onChange = { this.handleChange } 
                                    value = { email }
                                    className = { this.handleInputError(errors, 'email') }
                                />
                                <Form.Input 
                                    fluid 
                                    name = "password" 
                                    icon = "lock" 
                                    iconPosition = "left" 
                                    placeholder = "Password" 
                                    type = "password" 
                                    onChange = { this.handleChange } 
                                    value = { password }
                                    className = { this.handleInputError(errors, 'password') }
                                />
                                <Form.Input 
                                    fluid 
                                    name = "passwordConfirmation" 
                                    icon = "repeat" 
                                    iconPosition = "left" 
                                    placeholder = "Password Confirmation" 
                                    type = "password" 
                                    onChange = { this.handleChange } 
                                    value = { passwordConfirmation }
                                    className = { this.handleInputError(errors, 'passwordConfirmation') }
                                />
                                <Button 
                                    color = "blue" 
                                    fluid 
                                    size = "large"
                                    disabled = { loading }
                                    className = { loading ? 'loading' : ''}
                                    > Submit 
                                </Button>
                            </Segment>
                        </Form>
                        { errors.length > 0 && (
                            <Message error>
                                <h3> Error </h3>
                                { this.displayErrors (errors) }
                            </Message>
                        )}
                        <Message>
                            Already a user? <Link to = "/login"> Login </Link>
                        </Message>
                    </Grid.Column>
                </Grid>
            </div>
        )
    }
}

export default Register;