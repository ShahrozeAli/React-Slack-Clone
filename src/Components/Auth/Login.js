import React from 'react';
import { Grid, Form, Segment, Button, Header, Message, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import firebase from "../../firebase";

class Login extends React.Component {
    state = {
        email : '',
        password : '',
        errors: [],
        loading: false,
    }

    //update react component upon any change in form fields
    handleChange = event => {
        this.setState ({ [event.target.name] : event.target.value }); 
    }

    //Handling form submit with firebase
    handleSubmit = event => {
        //refresh page upon successful form submission
        event.preventDefault();
        if(this.isFormValid(this.state)){
            //removing erros upon successful registration
            this.setState({ errors: [], loading: true})
            //configuring with firebase
            firebase //firebase promise
            .auth()
            .signInWithEmailAndPassword (this.state.email, this.state.password)
            .then(signedInUser => {
                console.log(signedInUser);
                this.setState ({ loading: false });
            })
            .catch(err => {
                console.log(err);
                this.setState ({ errors: this.state.errors.concat(err), loading: false });
            })
        }
    }

    isFormValid = ({ email, password }) => email && password

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
        const { email, password, errors, loading } = this.state;

        return(
            <div>
                <Grid textAlign = "center" verticalAlign = "middle" className = "app">
                    <Grid.Column style = {{ maxWidth: 450 }}>
                        <Header as = "h2" icon color = "purple" textAlign = "center">
                            <Icon name = "code branch" color = "purple"/>
                            Login to Devchat
                        </Header>
                        <Form onSubmit = { this.handleSubmit } size = "large">
                            <Segment stacked>
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
                                <Button 
                                    color = "purple" 
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
                            Don't have an account? <Link to = "/register"> Register </Link>
                        </Message>
                    </Grid.Column>
                </Grid>
            </div>
        )
    }
}

export default Login;