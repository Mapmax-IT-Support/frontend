import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import '../../css/listingView.scss'
import { S3_BASE } from "../../Constants" 

export default class Slideshow extends React.Component {
 
render() {
    return (
        <Carousel style={{ width: this.props.width}}>
            {this.props.photos?.map((e, i) => {
                return (
                    <Carousel.Item >
                         <div className="slideShowImgContainer" style={{ height : this.props.height}}> 
                            <img className="listingImage" src={S3_BASE + e}/>
                         </div>
                        <Carousel.Caption>
                        </Carousel.Caption>
                    </Carousel.Item>
                )
            })}
            
        </Carousel>
    )
    }
}
