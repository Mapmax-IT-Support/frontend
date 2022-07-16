import React, { Component } from 'react';

class StreetView extends React.Component {
    constructor(props) {
        super(props) 
        this.state = {active: ''}

        this.getImage = this.getImage.bind(this)
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

export default StreetView;