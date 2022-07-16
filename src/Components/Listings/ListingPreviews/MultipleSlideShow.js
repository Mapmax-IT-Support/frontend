import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import '../../../css/listingView.scss'
import ListingCard from './ListingCard'
 
const S3_BASE = "https://landmarkbucket2.s3.amazonaws.com/"

export default class Slideshow extends React.Component {

    constructor(props) {
        super(props)
    }

 
render() {
    return (
        <Carousel style={{ width: this.props.width}} interval={10000}>
            {this.props.data.map((e, i) => { 
                return (
                    <Carousel.Item>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
                                {e.map((listing, i) => {
                                    return (
                                        <ListingCard listing={listing} height={this.props.height}/> 
                                    )
                                } 
                             )}
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

/**
 * <
                        className="d-block w-100"
                        src={S3_BASE + e}
                        alt="First slide"
                        fluid
                        style={{ width: '100%', height : this.props.height}}
                        />
 */