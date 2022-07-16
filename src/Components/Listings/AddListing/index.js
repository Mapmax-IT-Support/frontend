import React from 'react'
import { connect } from 'react-redux'
import { createSelector } from 'reselect';
import * as selectors from '../../../Reducers/selectors'
import ContactInfo from './ContactInfo'
import LocationDetails from './LocationDetails'
import PricingInfo from './PricingInfo'
import SelectLocation from './SelectLocation'
import Submit from './submit'
import Button from 'react-bootstrap/Button';
import { withRouter } from 'react-router-dom'
import { getListingById, downloadListingImage } from "../../../Requests/listings-requests"
import SaveModal from './SaveModal'

class AddListing extends React.Component {

    constructor(props) {
        super(props)
       
        this.state = {
            body: '',
            index : 0,
            formData :  { contactInfo : {}, locationDetails: {}, pricingInfo : {} },
           // {"_id":{"$oid":"5eb5a860c1a797ac66c79d31"},"location":{"formatted":"Ippudo NY, 4th Avenue, New York, NY, USA","street":"65 4th Ave","city":"New York","state":"NY","zip":"10003","coords":{"lat":40.730948,"lng":-73.990287},"place":{"access_points":[],"address_components":[{"long_name":"65","short_name":"65","types":["street_number"]},{"long_name":"4th Avenue","short_name":"4th Ave","types":["route"]},{"long_name":"Manhattan","short_name":"Manhattan","types":["political","sublocality","sublocality_level_1"]},{"long_name":"New York","short_name":"New York","types":["locality","political"]},{"long_name":"New York County","short_name":"New York County","types":["administrative_area_level_2","political"]},{"long_name":"New York","short_name":"NY","types":["administrative_area_level_1","political"]},{"long_name":"United States","short_name":"US","types":["country","political"]},{"long_name":"10003","short_name":"10003","types":["postal_code"]}],"formatted_address":"65 4th Ave, New York, NY 10003, USA","geometry":{"location":{"lat":40.730948,"lng":-73.990287},"location_type":"ROOFTOP","viewport":{"south":40.7295990197085,"west":-73.9916359802915,"north":40.7322969802915,"east":-73.98893801970848}},"place_id":"ChIJWUOc55tZwokR9q_g5l051rk","plus_code":{"compound_code":"P2J5+9V New York, United States","global_code":"87G8P2J5+9V"},"types":["establishment","food","point_of_interest","restaurant"]}},"contactInfo":{"forSale":"yes","forLease":"no","relationship":"broker","ownershipDetails":"Shane Inman discusses his commitment to excellence in customer service as well as his depth of experience in the real estate industry. Inman’s occupational pride is evident, as is his devotion to the company’s design expertise. Call (973) xxx-xxxx for details"},"locationDetails":{"sizeDetails":"12334","dimensionDetails":"123434","position":"in-line","tenantMixDetails":"aSas","parkingSpaceDetails":"12233","designatedParkingDetails":"yes","underConstruction":"no","ingressInfo":"asdasd","hasOccupancyCert":"yes","hasZoning":"yes"},"pricingInfo":{"askingPrice":"1234","leasePricePerSquareFoot":"1233","leaseTermDetails":"2 years","maintainenceCostPerSquareFoot":"123","insuranceCostPerSquareFoot":"1222","isAssignment":"no","isSublet":"no"},"listingId":280085022,"photos":{"contact_photos":["listings/280085022/contact_photos/upload1.png"],"site_photos":["listings/280085022/site_photos/upload1.jpg","listings/280085022/site_photos/upload2.jpg","listings/280085022/site_photos/upload3.jpg"],"cover_photos":["listings/280085022/site_photos/upload3.jpg"]}},
         //   photos : {"contact_photos":["listings/280085022/contact_photos/upload1.png"],"site_photos":["listings/280085022/site_photos/upload1.jpg","listings/280085022/site_photos/upload2.jpg","listings/280085022/site_photos/upload3.jpg"],"cover_photos":["listings/280085022/site_photos/upload3.jpg"]},
            photos: { cover_photos : [], contact_photos : [], site_photos : []},
            contactInfoIncomplete : true,
            locationDetailsIncomplete : true,
            pricingInfoIncomplete : true,
            updateInfo: {},
            isUpdate: false,
            saveKey: -1,
            photo_update_key : -1, // needed for [][] to descend to children 
            showSaveModal: false,
            loading : false,
            message : '',
            wrongUser : false
        }
    }

    componentDidMount() {
       this.verifyUser()
       this.handleUpdateParams()
    }

    verifyUser = () => {
        const { user } = this.props
        if (user._id === -1) {
            this.props.history.push('/login')
        } 
    }

    handleUpdateParams = async () => {
        const { urlParams, user } = this.props
        if (!urlParams.listingId) return;

        let res = await getListingById(urlParams.listingId)

        // check if owned by user
        if (user._id !== res[0]?.user_id) {
            this.setState({ wrongUser : true })
        }

        this.setState({ index : 1})

        let photoRes = res[0].photos
        let photos = { contact_photos: [], cover_photos: [], site_photos: [] }
        if (photoRes) {
            photos = {
                contact_photos: await Promise.all(photoRes.contact_photos.map(e => this.downloadImage(e))), 
                cover_photos:  await Promise.all(photoRes.cover_photos.map(e => this.downloadImage(e))),
                site_photos:  await Promise.all(photoRes.site_photos.map(e => this.downloadImage(e))) //res[0].photos.site_photos.map(async e => await this.downloadImage(e))
           };
        }
      

        this.setState({ 
            formData: res[0], 
            location: res[0].location,
            photos: photos,
            contactInfoIncomplete: false,
            locationDetailsIncomplete: false,
            pricingInfoIncomplete: false,
            isUpdate: true
        })
    }

    downloadImage = async (uri) => {
        let response = await downloadListingImage(uri)
        let fileName = uri.substring(uri.lastIndexOf('/')+1, uri.length)
        let file = new File([response], fileName)
        return file
    }

    setLocation = (location) => {
        this.setState({ location : location })
        this.addFormInfo(location, 'location')
        this.handleNext()
    }

    handleChange = e => {
        this.setState({body: e.target.value})
    }

    handleTabPress = index => {
        this.setState({ index : index })
    }

    addFormInfo = async (data, category )=> {
        await this.setState({ formData : {...this.state.formData, [category] : data }})
        this.setState({ contactInfoIncomplete : this.state.formData.contactInfo.forSale === undefined 
            || this.state.formData.contactInfo.forLease === undefined 
            || this.state.formData.contactInfo.relationship === undefined 
        })
    }

    handleNext = () => {
        this.setState({ index : this.state.index+1})
        window.scrollTo(0, 0)
    }

    handleSetPhotos = (category, photos) => {
        let photosState = { ...this.state.photos, [category] : photos }
       
        this.setState({ photos : photosState, photo_update_key : -1*this.state.photo_update_key,
             locationDetailsIncomplete : photosState.cover_photos.length === 0 
        })
    }

    removePhoto = (category, index) => {
        let photosState = this.state.photos
        photosState[category].splice(index, 1)

        this.setState({ photos : photosState, photo_update_key : this.state.photo_update_key *-1,  
            locationDetailsIncomplete : photosState.cover_photos.length === 0  
        })
    }

    handleOpenSave = () => {
        this.setState({ showSaveModal : true })
    }

    handleSave = () => {
        this.setState({ saveKey : -1*this.state.saveKey, loading : true})
    }

    handleCancelSave = () => {
        this.setState({ showSaveModal : false })
    }

    setSaveData = (loading, message) => {
        this.setState({ loading : loading, message: message })
    }

    render() {
        const { isUpdate, location, contactInfoIncomplete, 
            locationDetailsIncomplete, index, photos, formData, 
            photo_update_key, saveKey, wrongUser, showSaveModal,
            loading, message
        } = this.state;

        if (wrongUser) {
            return (
                <div className="warningPage">
                    <h3>Sorry, you do not own this listing.</h3>
                </div>
            )
        }
        return (
            <div className="addListingPage">
               <div className="bannerContainer">
                <div className="bannerHeader">
                        <div className="bannerImage" >
                            <h3 className="bannerText">New Listing</h3>
                        </div>
                    </div> 
                </div>
                <div className="toolbarContainer">  
                    <Button className="tabItem" disabled={isUpdate} onClick={() => this.handleTabPress(0)}>
                      <span>Location</span>
                    </Button>
                    <Button className="tabItem" onClick={() => this.handleTabPress(1)} disabled={location === undefined}>
                        <span>Location Details</span>
                    </Button>
                    <Button className="tabItem" onClick={() => this.handleTabPress(2)} disabled={location === undefined}>
                        <span>Pricing {"&"} terms</span>
                    </Button>
                    <Button className="tabItem" onClick={() => this.handleTabPress(3)} disabled={location === undefined}>
                      <span>Contact Info</span>
                    </Button>
                    <Button className="tabItem" onClick={() => this.handleTabPress(4)} disabled={location === undefined}>
                        <span>Submit</span>
                    </Button>
                </div>
                <div className="formPageContainer">
                    {index !== 0 && <SaveButton handleOpenSave={this.handleOpenSave}/>}
                    <div style={(index === 0) ? {} : { display : 'none'} }> 
                      <SelectLocation setLocation={this.setLocation}/>
                    </div>
             
                    <div style={(index === 1) ? {} : { display : 'none'}}> 
                        <LocationDetails 
                            addFormInfo={this.addFormInfo}  
                            handleNext={this.handleNext}
                            handleSetPhotos={this.handleSetPhotos} 
                            photos={photos} 
                            photo_update_key={photo_update_key}
                            handleRemovePhoto={this.removePhoto} 
                            updateInfo={formData.locationDetails}
                            isUpdate={isUpdate}
                        />
                    </div>
                    <div style={(index === 2) ? {} : { display : 'none'}}> 
                        <PricingInfo 
                            addFormInfo={this.addFormInfo}  
                            handleNext={this.handleNext} 
                            photoKey={photo_update_key}
                            updateInfo={formData.pricingInfo}
                            isUpdate={isUpdate}
                        />
                    </div>
                    <div style={(index === 3) ? {} : { display : 'none'} }> 
                        <ContactInfo addFormInfo={this.addFormInfo} 
                            handleNext={this.handleNext} 
                            handleSetPhotos={this.handleSetPhotos} 
                            photos={photos.contact_photos} 
                            handleRemovePhoto={this.removePhoto} 
                            photoKey={photo_update_key}
                            updateInfo={formData.contactInfo}
                            isUpdate={isUpdate}
                        />
                    </div>
                    <div style={(index === 4) ? {} : { display : 'none'}}> 
                         <Submit 
                            formData={formData} 
                            photos={photos} 
                            photoKey={photo_update_key}
                            isUpdate={isUpdate}
                            saveKey={saveKey}
                            setSaveData={this.setSaveData}
                        />
                    </div>
                </div>
                <SaveModal show={showSaveModal} 
                    onHide={this.handleCancelSave} 
                    handleSave={this.handleSave} 
                    loading={loading}
                    message={message}
                    />
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

 const SaveButton = props => {
    const { handleOpenSave } = props
    return (
        <div className="saveButton" onClick={handleOpenSave}>
            <span>Save as a draft</span>
        </div>
    )
 }

 export default withRouter(connect(mapStateToProps)(AddListing))
