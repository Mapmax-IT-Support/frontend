import React from 'react';
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import FormGroup from "react-bootstrap/FormGroup";
import FormControl from "react-bootstrap/FormControl"
import FormLabel from "react-bootstrap/FormLabel"
import { registerUser } from '../../Requests/users-requests'
import { Link, withRouter } from 'react-router-dom'

const darkBg = 'rgb(26,28,41)'
const lightBg = 'rgb(31,33,48)'
const textPrimary = 'whitesmoke'

class Register extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            first: { value: '', isValid: true, message: '' },
            last: { value: '', isValid: true, message: '' },
            username: { value: '', isValid: true, message: '' },
            email: { value: '', isValid: true, message: '' },
            password: { value: '', isValid: true, message: '' },
            password_confirm: { value: '', isValid: true, message: '' },
            validated: false
        };
    }

    async componentDidMount() {
   
    }

    onFormChange = (e) => {
        let update = { ...this.state[e.target.name]}
        let updatePasswordConfirm = ''

        update.value = e.target.value
        update.target = e.target

        // password link to confirm
        if (e.target.name == 'password') {
                updatePasswordConfirm = this.state.password_confirm

                // if on password 
                if (update.value == updatePasswordConfirm.value) {
                    if (updatePasswordConfirm.message.length > 1) {
                        updatePasswordConfirm.target.setCustomValidity('')
                        updatePasswordConfirm.message = ''
                    } 
                } else {
                    if (updatePasswordConfirm.target != undefined) {
                        updatePasswordConfirm.target.setCustomValidity('Passwords do not match')
                        updatePasswordConfirm.message = 'Passwords do not match'
                    }
                }
            } 
            else if (e.target.name == 'password_confirm') {
                // if on password confirm
                if (update.value == this.state.password.value) {
                    if (update.message.length > 1) {
                        update.target.setCustomValidity('')
                        update.message = ''
                    } 
                } else {
                    if (update.target != undefined) {
                        update.target.setCustomValidity('Passwords do not match')
                        update.message = 'Passwords do not match'
                    }
                }
            }

            else {
            // reset custom validation on change 
            if (update.message.length > 1) {
                update.target.setCustomValidity('')
                update.message = ''
            }
        }
        
        if (e.target.name == 'password') {
            this.setState({[e.target.name]: update, password_confirm : updatePasswordConfirm})
        } 
        else {
            this.setState({[e.target.name]: update})
        }
    }

    handleSubmit = async (event) => {
        const form = event.currentTarget;
        const password = {...this.state.password}
        const password_confirm = {...this.state.password_confirm}
        let isValid = true;
       
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } 

        // additional custom validation
        if (this.state.password.value != this.state.password_confirm.value) {
            password.isValid = false
            password_confirm.message = 'Passwords do not match'
            isValid = false;

            if (this.state.password_confirm.target != undefined) {
                this.state.password_confirm.target.setCustomValidity('Passwords do not match')
            }
            this.setState({ password_confirm: {...this.state.password_confirm, message: 'Passwords do not match'}})
        }

        if (form.checkValidity()) {
            event.preventDefault()
            // get additional validation from server response
            let results = await registerUser(this.state)

            if (results.res.emailError == 'Email taken') {
                if (this.state.email.target != undefined) {
                    this.state.email.target.setCustomValidity('Email already taken')
                }
                this.setState({ email: {...this.state.email, message: 'Email already taken'}})
            }

            if (results.res.usernameError == 'Username taken') {
                if (this.state.username.target != undefined) {
                    this.state.username.target.setCustomValidity('Username already taken')
                }
                this.setState({ username: {...this.state.username, message: 'Username already taken'}})
            }

           this.props.history.push('/login')
        } else {
            this.setState({validated: true});
        }
      };

    

    render() {
   
        return (
            <div className="loginPage">
                <h1 >Create an Account</h1>
            <div className="loginFormContainer">
               <Form noValidate validated={this.state.validated} onSubmit={this.handleSubmit}>
               <Form.Row>
                <Form.Group controlId="firstName" style={{ marginRight: '1em'}} >
                    <Form.Label className="formLabels">First Name</Form.Label>
                    <Form.Control 
                        required
                        type="text" 
                        name="first" 
                        placeholder="First name" 
                        autoFocus
                        value={this.state.first.value}
                        onChange={this.onFormChange} 
                    />
                    <Form.Text className="text-muted">
                    </Form.Text>
                </Form.Group>
        
                <Form.Group controlId="lastName" >
                    <Form.Label className="formLabels">Last Name</Form.Label>
                    <Form.Control 
                        required
                        type="text" 
                        name="last" 
                        placeholder="Last name" 
                        value={this.state.last.value}
                        onChange={this.onFormChange}/>
                    <Form.Text className="text-muted" style={{}}>
                    </Form.Text>
                </Form.Group>
                </Form.Row>

                <Form.Group controlId="username" >
                    <Form.Label className="formLabels">Username</Form.Label>
                    <Form.Control 
                        required
                        type="text"
                        name="username" 
                        placeholder="Enter username" 
                        value={this.state.username.value}
                        onChange={this.onFormChange} 
                        />
                    <Form.Text className="text-muted">
                    </Form.Text>
                    <span type="invalid" className="errorText">
                             {this.state.username.message}
                          </span>
                </Form.Group>
                <Form.Group controlId="Username" >
                    <Form.Label className="formLabels">Email</Form.Label>
                    <Form.Control 
                        required
                        type="email" 
                        name="email" 
                        placeholder="Enter email"
                        value={this.state.email.value}
                        onChange={this.onFormChange} />
                    <Form.Text className="text-muted">
                    </Form.Text>
                    <span type="invalid" className="errorText">
                             {this.state.email.message}
                          </span>
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                    <Form.Label className="formLabels">Password</Form.Label>
                    <Form.Control 
                        required
                        type="password" 
                        name="password" 
                        placeholder="Password" 
                        value={this.state.password.value}
                        onChange={this.onFormChange}/>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label className="formLabels"> Confirm Password</Form.Label>
                    <Form.Control 
                        required
                        type="password" 
                        name="password_confirm" 
                        placeholder="Password"
                        value={this.state.password_confirm.value}
                        onChange={this.onFormChange}/>
                         <span type="invalid" className="errorText">
                             {this.state.password_confirm.message}
                          </span>
                </Form.Group>
                <div className="checkContainer">
                    <Form.Group className="bottomText">
                        <Form.Check
                        required
                        label="Agree to terms and conditions"
                        feedback="You must agree before submitting."
                        />
                    </Form.Group>
                </div>
                <Form.Row className="submitContainer">
                    <Button variant="primary" type="submit">Submit</Button>
                </Form.Row>
            </Form>
                <div>
                    <span className="bottomText">Already have an account? &nbsp;</span>
                    <Link style={{fontSize: '20px'}} to="/login">Login here</Link> 
                </div>
            </div>
          
            </div>
        );
    }
}

export default withRouter(Register);
