import React, { Component } from 'react';
import defaultMarker from '../images/markers/default-marker.png'
import homeMarker from '../images/markers/home-marker.png'
import selectedMarker from '../images/markers/selected-marker.png'
import Popover from 'react-bootstrap/Popover'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
export const SELECTED = 'selected'
export const HOME = 'home'
export const DEFAULT = 'default'
export const COMPETITION = 'competition'

class Marker extends React.Component {
    constructor(props) {
        super(props) 
        this.state = {active: ''}

        this.getImage = this.getImage.bind(this)
    }
    getImage() {
        switch (this.props.type) {
            case HOME:
                return homeMarker
            case SELECTED:
                return selectedMarker
            case DEFAULT:
                return defaultMarker
            default:
                return defaultMarker
        }
    }

    componentDidMount() {

    }

    render() {
        const popover = (
            
            <Popover id="popover-basic" title={this.props.title}>
            And here's some <strong>amazing</strong> Description
            </Popover>
        );
        var show = this.props.show
        
        return (
        <OverlayTrigger defaultShow={show} rootClose={true} onHide={() => this.setState({show: false})}  trigger="click" placement="top" overlay={popover}>          
            <div>
            <img style={{width: '32px', height: '32px'}} src={require('../images/markers/' + this.props.type + '-marker.png')}></img>
            </div>
        </OverlayTrigger>
        )
    }
}

export default Marker;