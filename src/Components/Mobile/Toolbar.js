import React, { Component, useState } from 'react';
import Button from 'react-bootstrap/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

function Toolbar(props) {

    const { openToolBar } = props;

    const handleMap = () => {
        window.scrollTo({ top: 0, behavior: 'smooth'})
    }

    const handleStats = () => {
        
        window.scrollTo({ top: window.innerHeight - 38, behavior: 'smooth' })
    }

    const handlePlaces = () => {
        window.scrollTo({ top: window.innerHeight*2, behavior: 'smooth'})
    }

    const handleTools = () => {
        openToolBar()
        window.scrollTo({ top: 0, behavior: 'smooth'})
    }

    return (
        <div className="mob-place_menu">
            {/* <Button variant="link">
                <FontAwesomeIcon icon={faBars} size="1x" color="#007BFF" />
            </Button> */}
             <Button variant="link" onClick={handleTools}>Tools</Button>
            <Button variant="link" onClick={handleMap}>Map</Button>
            <Button variant="link" onClick={handleStats}>Demographics</Button>
            <Button variant="link" onClick={handlePlaces}>Places</Button>
            
        </div>
    )
}

export default Toolbar