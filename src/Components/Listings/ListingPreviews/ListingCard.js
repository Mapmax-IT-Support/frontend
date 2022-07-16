import React from 'react'
import { connect } from 'react-redux'
import { createSelector } from 'reselect';
import * as selectors from '../../../Reducers/selectors'
import '../../../css/listingView.scss';
import { Link, withRouter } from 'react-router-dom'
import Image from 'react-bootstrap/Image'
import { S3_BASE } from "../../../Constants"

const lightBg = 'rgb(31,33,48)'

class ListingPreviews extends React.Component {

    constructor(props) {
        super(props)
       
        this.state = {
            hovering : false
        }
    }

    navigateToListing = () => {
        this.props.history.push(this.getUrl())
    }

    getUrl = () => {
        let url = '/listing/' + this.props.listing.listingId
        return url
    }


    render() {
        return (
            <div className="d-block w-100" style={{backgroundColor : lightBg, height: this.props.height, paddingTop: '0.5em'}} > 
             
             <div className="listingCardImgContainer" onMouseOver={this.handleHover} > 
                {this.props.listing != undefined &&  
                    <Image 
                        onClick={this.navigateToListing}
                        className="listingCard"
                        src={S3_BASE + this.props.listing.photos.cover_photos[0]}
                        alt="First slide"
                        fluid
                    />
                }
            </div>  

            <div style={{ color: 'white', fontSize : '1px', marginTop: '1em'  }}>
            {this.props.listing != undefined &&  
                <Link style={{  textDecorationLine: 'underline', color: 'white', fontSize: '16px', fontWeight: 'bold'}}to={this.getUrl}>{this.props.listing.location.formatted}</Link>
            }
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




 export default withRouter(connect(mapStateToProps)(ListingPreviews))
