import React from 'react';
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form"
import FormGroup from "react-bootstrap/FormGroup";
import FormControl from "react-bootstrap/FormControl"
import FormLabel from "react-bootstrap/FormLabel"
import { loginUser } from '../../Requests/users-requests'
import * as selectors from '../../Reducers/selectors'
import { updateUser } from '../../Actions/user-actions';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Link, withRouter } from 'react-router-dom'
import { getUserInfo } from '../../Requests/users-requests'


class Login extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            email: { value: '', isValid: true, message: '', target: '' },
            password: { value: '', isValid: true, message: '', target: '' },
            validated: false
        
        };
    }

    onFormChange = (e) => {
        let update = { ...this.state[e.target.name]}

        update.value = e.target.value
        update.target = e.target

        // reset custom validation on change 
        if (update.message.length > 1) {
            update.target.setCustomValidity('')
            update.message = ''
        }

        // reset password error on email change
        if (e.target.name == 'email') {
            if (this.state.password.message.length > 0) {
                this.state.password.target.setCustomValidity('')
                this.setState({ password : {...this.state.password, message : ''}})
            }
        }

        this.setState({[e.target.name]: update})
    }

    onUpdateUser = async (user) => {
        localStorage.clear()
       
        // fetch user info and set searches in local storage
        if (user.recentSearches != undefined)
            localStorage.setItem('recentSearches', JSON.stringify(user.recentSearches))
        localStorage.setItem('user', JSON.stringify(user))
        this.props.onUpdateUser(user)
    }


    handleSubmit = async (event) => {
        const form = event.currentTarget;
        let isValid = true;
       
       
        event.preventDefault();
        event.stopPropagation();

        if (form.checkValidity() === true) {

                 // stop default for failed custom validation
                let results = await loginUser(this.state.email.value, this.state.password.value)
                
                if (results.error != undefined) {
                    switch (results.error) {
                        case 'Email not found': 
                            if (this.state.email.target != undefined) {
                                this.state.email.target.setCustomValidity('Username not found')
                            }
                            this.setState({ email: {...this.state.email, message: 'Username not found' }})
                            break;
                        
                        case 'Password not found': 
                            if (this.state.password.target != undefined) {
                                this.state.password.target.setCustomValidity('Password not found')
                            }
                            this.setState({ password: {...this.state.password, message: 'Password not found' }})
                            break;

                        default: break;
                    }
                    this.setState({validated: true});
                } else {
                if (results.length > 0) {
                    await this.onUpdateUser(results[0])
                    this.props.history.push('/')
                }
            }
        } else this.setState({ validated : true})
    }

    render() {
 
        return (
            <div className="loginPage">
                <h1>Login</h1>
            <div className="loginFormContainer">
               <Form noValidate validated={this.state.validated} onSubmit={this.handleSubmit}>
               <Form.Row>
                    <Form.Group controlId="formBasicEmail" >
                        <Form.Label className="formLabels">Email</Form.Label>
                        <Form.Control 
                            type="email" 
                            placeholder="Enter email" 
                            autoFocus
                            required
                            name="email"
                            value={this.state.email.value}
                            onChange={this.onFormChange}
                        />
                        <Form.Text className="text-muted">
                        </Form.Text>
                            <span type="invalid" className="errorText">
                                {this.state.email.message}
                            </span>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label className="formLabels">Password</Form.Label>
                        <Form.Control 
                            name="password"
                            required
                            value={this.state.password.value}
                            type="password" 
                            placeholder="Password" 
                            onChange={this.onFormChange}/>
                            <span type="invalid" className="errorText">
                                {this.state.password.message}
                            </span>
                    </Form.Group>
                </Form.Row>
                
                <Form.Row className="submitContainer">
                    <Button variant="primary" type="submit">Submit</Button>
                </Form.Row>
                <span className="bottomText">New User?	&nbsp;</span>
                <Link className="bottomLink" to="/register">Create an Account</Link> 
            </Form>
            </div>
          
            </div>
        );
    }
}


const mapStateToProps = createSelector(
    selectors.userSelector,
    (user) => ({
        user
    })
)

const mapActionsToProps = {
    onUpdateUser: updateUser
};

export default withRouter(connect(mapStateToProps, mapActionsToProps)(Login));
