import React  from 'react'
import { connect } from 'react-redux'
import { createSelector } from 'reselect';
import * as selectors from '../../Reducers/selectors'
import '../../css/listingView.scss';
import { Link, withRouter } from 'react-router-dom'
import { deleteListing} from "../../Requests/listings-requests"
import Image from "react-bootstrap/Image"
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { S3_BASE } from "../../Constants"
import PublishedStatus from "../Listings/PublishStatus"

class ListingItem extends React.Component {

    constructor(props) {
        super(props)
       
        this.state = {
            listings : [],
            startIndex: 0,
            limit : 20,
            showModal : false,
        }
    }

    getUrl = () => {
        let url = '/listing/' + this.props.listing.listingId
        return url
    }

    getMapUrl = () => {
        let address = encodeURI(JSON.stringify(this.props.listing.location.formatted))
        let business_type = "restaurant"
        let url = '/' + address + '/' + business_type
        return url
    }

    navigateToListing = () => {
        this.props.history.push(this.getUrl())
    }

    handleDeleteListing = async () => {
        let res = await deleteListing(this.props.listing.listingId)

        this.setState({ showModal : false })
        this.props.handleDeleteListing(this.props.listing.listingId)
    }

    handleUpdate = () => {
       const { history, listing} = this.props
       history.push('/addlisting/' + listing.listingId)
    }

    render() {
      const { listing } = this.props;

        return (
            <div className="my-listing-item" >
                <MyVerticallyCenteredModal
                    show={this.state.showModal}
                    onHide={() => this.setState({showModal:false})}
                    handleAction={this.handleDeleteListing}
                />          
                <div className="my-listing-photo">
                    <Image 
                        onClick={this.navigateToListing}
                        className="listingCard"
                        src={S3_BASE + listing.photos?.cover_photos[0]}
                        style={{ width: '100%', height: '100%'}}
                        fluid
                    />
                </div>

                <div className="my-listing-links">
                    <Link to={this.getUrl}>
                        <span className="my-listing-link">{listing.location.formatted}</span>
                    </Link>
                    <div>
                        <Button variant="primary" onClick={this.handleUpdate} style={{ marginRight: '0.5em'}}>
                            Update
                        </Button>
                        <Button variant="danger" onClick={() => this.setState({ showModal : true })}>
                            Remove
                        </Button>
                    </div>
                </div>
               <PublishedStatus published={listing.published}/>
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

 const MyVerticallyCenteredModal = (props) => {
    return (
      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter"style={{ display : 'flex', justifyContent: 'center'}}>
           <span style={{ textAlign : 'center'}}>Are you sure you want to remove this listing?</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ display : 'flex', justifyContent: 'center'}}>
        
         <Button onClick={props.onHide} variant={'secondary'} style={{ marginRight: '2em'}}>Cancel</Button>
         <Button onClick={props.handleAction} variant="danger" >
            Delete
         </Button>
          
        </Modal.Body>
      </Modal>
    );
  }
  


 export default withRouter(connect(mapStateToProps)(ListingItem))
