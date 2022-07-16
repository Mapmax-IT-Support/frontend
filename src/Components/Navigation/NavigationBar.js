import React, { Fragment} from 'react';
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Image from 'react-bootstrap/Image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser} from '@fortawesome/free-solid-svg-icons'
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom'
import * as selectors from '../../Reducers/selectors'
import { createSelector } from 'reselect';
import { updateUser } from '../../Actions/user-actions';
import white_smaple from '../../images/logo/white_sample.png'
import NavLookUpForm from './NavLookUpForm'
import MediaQuery from 'react-responsive'

class NavigationBar extends React.Component {

    constructor(props) {
        super(props)
        this.state = {}
    }

    onUpdateUser = (user) => {
        this.props.onUpdateUser(user)
    }

    logout = () => {
        this.props.history.push('/login')
        let user = {_id: -1, username: 'guest', is_admin: false}
        this.onUpdateUser(user)
        localStorage.setItem('user', JSON.stringify(user))
    }

    login = () => {
        this.props.history.push('/login')
    }

    goToSearches = () => {
        this.props.history.push('/profile')
    }

    goToAddListing = () => {
        this.props.history.push('/addlisting')
    }

    navigateHome = () => {
        this.props.history.push('/')
    }


    render() {
        return (
            <Navbar className="navBar" expand="lg">
                    <div className="logo_container" onClick={this.navigateHome}>
                        <div className="fluid_image_logoContainer">
                            <Image src={white_smaple} fluid className="fluid_image_logo"/>
                        </div>
                        <MediaQuery minDeviceWidth={551}>
                            <Link to="/" className="logoLinkText">Landmark</Link>
                        </MediaQuery>
                    </div>
                    {this.props.displaySearchBar &&
                        <NavLookUpForm urlParams={this.props.urlParams}/>
                    }
                
                    <div className="user_tools">
                        <NavBarDropDown user={this.props.user} logout={this.logout} login={this.login} goToSearches={this.goToSearches} goToAddListing={this.goToAddListing}/>
                    </div>
            </Navbar>
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

const NavBarDropDown = props => {

    let title, signIn;

    if (props.user._id === -1) {
        return <Link  to="/login" style={{ color: 'whitesmoke'}}>Sign in</Link>
    } else {
        title = <span style={{ color: 'whitesmoke'}}>Welcome,  {props.user.first} </span>
        signIn = <NavDropdown.Item onClick={props.logout}>Sign Out</NavDropdown.Item>

        return (
            <Fragment>
                <MediaQuery minDeviceWidth={551}>
                    <NavDropdown title={title}>
                        <NavDropdown.Item onClick={props.goToSearches}>My Profile</NavDropdown.Item>
                        <NavDropdown.Item onClick={props.goToAddListing}>Add listing</NavDropdown.Item>
                        {signIn}
                    </NavDropdown> 
                </MediaQuery>
                <MediaQuery maxDeviceWidth={551} minDeviceWidth={370}>
                    <DropdownButton menuAlign='right' id="mobileDropdown" title={<FontAwesomeIcon icon={faUser}/>}>
                        <NavDropdown.Item onClick={props.goToSearches} >My Profile</NavDropdown.Item>
                        <NavDropdown.Item onClick={props.goToAddListing}>Add listing</NavDropdown.Item>
                        {signIn}
                    </DropdownButton> 
                </MediaQuery>
                <MediaQuery maxDeviceWidth={370}>
                    <DropdownButton menuAlign='right' id="mobileDropdown" >
                        <NavDropdown.Item onClick={props.goToSearches} >My Profile</NavDropdown.Item>
                        <NavDropdown.Item onClick={props.goToAddListing}>Add listing</NavDropdown.Item>
                        {signIn}
                    </DropdownButton> 
                </MediaQuery>
            </Fragment>
        )
    }
}

export default withRouter(connect(mapStateToProps, mapActionsToProps)(NavigationBar));
