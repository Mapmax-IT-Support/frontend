import React  from 'react'
import { connect } from 'react-redux'
import { createSelector } from 'reselect';
import * as selectors from '../../Reducers/selectors'
import Button from 'react-bootstrap/Button'
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Form from "react-bootstrap/Form"
import Image from "react-bootstrap/Image"
import {editUser} from '../../Requests/users-requests'
import { updateUser } from '../../Actions/user-actions';
import { uploadProfilePic } from '../../Requests/users-requests'
import PhotoUploader from "../Listings/AddListing/PhotoUploader"
import { S3_BASE } from "../../Constants"

const darkBg = 'rgb(26,28,41)'
const lightBg = 'rgb(31,33,48)'
const textPrimary = 'whitesmoke'

class ProfilePanel extends React.Component {

    constructor(props) {
        super(props)
       
        this.state = {
            searches: [],
            body: '',
            first: { value: this.props.user.first, isValid: true, message: '' },
            last: { value: this.props.user.last, isValid: true, message: '' },
            username: { value: this.props.user.username, isValid: true, message: '' },
            email: { value: this.props.user.email, isValid: true, message: '' },
            validated: false,
            editMode : false,
            photos : []
        }
    }

    handleChange = e => {
        this.setState({body: e.target.value})
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

        this.setState({[e.target.name]: update})
    }


    handleSubmit = async (event) => {
        const form = event.currentTarget;
        let isValid = true;
       
       
        event.preventDefault();
        event.stopPropagation();

        if (form.checkValidity() === true) {

                 // stop default for failed custom validation
                let results = await editUser(this.state, this.props.user._id )

                // email error
                if (results.res.emailError == 'Email taken') {
                    if (this.state.email.target != undefined) {
                        this.state.email.target.setCustomValidity('Email taken')
                    }
                    this.setState({ email: {...this.state.email, message: 'Email taken' }})
                    isValid = false
                }

                // username error
                if (results.res.usernameError == 'Username taken') {
                    if (this.state.username.target != undefined) {
                        this.state.username.target.setCustomValidity('Username taken')
                    }
                    this.setState({ username: {...this.state.username, message: 'Username taken' }})
                    isValid = false
                }

                // update error
                if (results.res.updateError == "No change") {
                    isValid = false;
                }

                if (isValid) {
                    await this.updateUser(results.newUser)
                }
            }
            this.setState({validated: true, editMode: false});
    }

    updateUser = async (user) => {
        localStorage.clear()

        // change to _id on backend 
        let _id = user.uid
        delete user.uid
        user._id = _id
       
        // fetch user info and set searches in local storage
        localStorage.setItem('user', JSON.stringify(user))
        this.props.onUpdateUser(user)
    }



    handleEdit = () => {
        this.setState({ editMode : true})
    }

    handleCancel = () => {
        this.setState({ editMode : false,
            first: { value: this.props.user.first, isValid: true, message: '' },
            last: { value: this.props.user.last, isValid: true, message: '' },
            username: { value: this.props.user.username, isValid: true, message: '' },
            email: { value: this.props.user.email, isValid: true, message: '' },
        })
    }


    handleUploadProfile = async () => {

        let error = false 
        let errormessage = ""
        let formData = new FormData();
        formData.append("profile", this.state.photos[0])
        formData.append("user_id", this.props.user_id)
    
        let res = await uploadProfilePic(formData).catch(e => { error = true; errormessage = e })

        if (res.success) {
            this.setState({ editMode: false })
        }
    }

    handleSetPhotos = (photos ) => {
        this.setState({ photos : photos })
    }

    render() {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'center',  justifyContent: 'center',  minWidth: '320px', marginBottom: "1rem" }}>
                <div style={{ marginTop: '2em', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                  <Image src={(this.state.photos.length > 0) ? URL.createObjectURL(this.state.photos[0]) : S3_BASE + "users/" + this.props.user_id+ "/profile.jpg"} 
                    width={100} height={100} style={{borderRadius: 45}}/>

                 {this.state.editMode &&  <PhotoUploader setPhotos={this.handleSetPhotos}/> }
                </div>
                <div style={{ fontSize: 16, color: 'black',  width: '80%', margin: 'auto', marginTop: '2em'}}>
                <Form noValidate validated={this.state.validated} onSubmit={this.handleSubmit}>
               <Row>
                    <Col>
                        <Form.Group controlId="firstName" >
                            <Form.Label style={{float: 'left', color: lightBg, fontSize: '24px'}}>First Name</Form.Label>
                            {!this.state.editMode && 
                            <Form.Control 
                                disabled
                                required
                                type="text" 
                                name="first" 
                                placeholder={this.props.user.first}
                                autoFocus
                                value={this.props.user.first}
                                
                                onChange={this.onFormChange} 
                            />
                            }
                            {this.state.editMode && 
                            <Form.Control
                                required
                                type="text" 
                                name="first" 
                                placeholder={this.props.user.first}
                                autoFocus
                                value={this.state.first.value}
                                
                                onChange={this.onFormChange} 
                            />
                            }
                            <Form.Text className="text-muted" style={{}}>
                            </Form.Text>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="lastName" >
                            <Form.Label style={{float: 'left', color: lightBg, fontSize: '24px'}}>Last Name</Form.Label>
                            {!this.state.editMode && 
                            <Form.Control 
                                disabled
                                required
                                type="text" 
                                name="last" 
                                placeholder={this.props.user.last}
                                value={this.props.user.last}
                                onChange={this.onFormChange}/>
                            }{this.state.editMode && 
                                <Form.Control 
                                    required
                                    type="text" 
                                    name="last" 
                                    placeholder={this.props.user.last}
                                    value={this.state.last.value}
                                    onChange={this.onFormChange}/>
                                }

                            <Form.Text className="text-muted" style={{}}>
                            </Form.Text>
                         </Form.Group>
                    </Col>
                </Row>
                <Form.Group controlId="username" >
                    <Form.Label style={{float: 'left', color: lightBg, fontSize: '24px'}}>Username</Form.Label>
                    {!this.state.editMode && 
                        <Form.Control 
                            disabled
                            required
                            type="text"
                            name="username" 
                            placeholder={this.props.user.username}
                            value={this.props.user.username}
                            onChange={this.onFormChange} 
                        />
                    }
                    
                        {this.state.editMode &&
                        <Form.Control 
                            required
                            type="text"
                            name="username" 
                            placeholder={this.props.user.username}
                            value={this.state.username.value}
                            onChange={this.onFormChange} 
                        />
                        }
                    <Form.Text className="text-muted" style={{}}>
                    </Form.Text>
                    <span type="invalid" style={{fontSize: '16px', color: 'red' }}>
                             {this.state.username.message}
                          </span>
                </Form.Group>
                <Form.Group controlId="Username" >
                    <Form.Label style={{float: 'left', color: lightBg, fontSize: '24px'}}>Email</Form.Label>
                    {!this.state.editMode &&  <Form.Control 
                        disabled
                        required
                        type="email" 
                        name="email" 
                        placeholder={this.props.user.email}
                        value={this.props.user.email}
                        onChange={this.onFormChange} />
                    }
                    {this.state.editMode &&  <Form.Control 
                        required
                        type="email" 
                        name="email" 
                        placeholder={this.props.user.email}
                        value={this.state.email.value}
                        onChange={this.onFormChange} />
                    }
                    <Form.Text className="text-muted" style={{}}>
                    </Form.Text>
                    <span type="invalid" style={{fontSize: '16px', color: 'red' }}>
                             {this.state.email.message}
                          </span>
                </Form.Group>
                <div style={{ display: 'flex', width: '100%', justifyContent: 'center', marginTop: '32px', marginBottom: '32px'}}>
                {!this.state.editMode &&
                    <Button variant="primary" onClick={this.handleEdit} style={{ color: 'whitesmoke', fontSize: '20px'}}>
                        Edit
                    </Button>
                }
               
                {this.state.editMode &&
                    <Button variant="danger" onClick={this.handleCancel} style={{ color: 'whitesmoke', fontSize: '20px'}}>
                        Cancel
                    </Button>
                }
                {this.state.editMode &&
                <Button variant="primary" type="submit" style={{ marginLeft: '2em', color: 'whitesmoke', fontSize: '20px'}} onClick={this.handleUploadProfile}>
                    Submit
                </Button>
                }
                </div>
            </Form>
                </div>
                
            </div>
       )
    }
 }

 
 const mapStateToProps = createSelector(
     selectors.addressSelector,
     selectors.userSelector,
    (address, user) => ({
        address, user 
    })
 )

 const mapActionsToProps = {
    onUpdateUser: updateUser
};


 export default connect(mapStateToProps, mapActionsToProps)(ProfilePanel)