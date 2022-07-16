import React from 'react'
import { connect } from 'react-redux'
import { createSelector } from 'reselect';
import * as selectors from '../../../Reducers/selectors'
import Button from 'react-bootstrap/Button'
import PhotoUploader from './PhotoUploader'
import PhotoPreviews from './PhotoPreviews'

class AddListing extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            photos: []
        }
    }

    componentDidUpdate(prevProps) {
        const { updateInfo, isUpdate } = this.props
        if (prevProps.isUpdate !== isUpdate && JSON.stringify(updateInfo) !== JSON.stringify(this.state)) {
            this.setState({ ...updateInfo })
        }
    }

    handleChange = async e => {
        await this.setState({ [e.target.name]: e.target.value })
        this.props.addFormInfo(this.state, "locationDetails")
    }

    handleSetPhotos = photos => {
        this.props.handleSetPhotos('site_photos', photos)
    }

    handleSetCoverPhotos = photos => {
        this.props.handleSetPhotos('cover_photos', photos)
    }

    removeSitePhoto = index => {
        this.props.handleRemovePhoto('site_photos', index)
    }

    removeCoverPhoto = index => {
        this.props.handleRemovePhoto('cover_photos', index)
    }


    render() {
        return (
            <div className="formPage">
                <h3>1. Location Details</h3>
                <form style={{ padding: '16px' }}>
                    <p><strong>Upload Cover Photos</strong> <span style={{ color: 'red' }}>* requires at least one photo</span></p>
                    <p>These will be the first photos users see for your listing</p>
                    <PhotoUploader setPhotos={this.handleSetCoverPhotos} photos={this.props.photos.cover_photos}/>

                    <strong>Size of location</strong>
                    <div className="inputGroup"  >
                        <textarea maxLength="120" className="textArea"
                            type="text"
                            name="sizeDetails"
                            multiline
                            placeholder="Enter any additional information that is relevant to this listing"
                            value={this.state.sizeDetails} onChange={this.handleChange} />
                    </div>
                    <p style={{ fontSize: '12px' }}>120 characters max</p>
                    <strong>Dimensions</strong>
                    <div className="inputGroup" >
                        <textarea maxLength="120" className="textArea"
                            type="text"
                            name="dimensionDetails"
                            multiline
                            placeholder="Enter any additional information that is relevant to this listing"
                            value={this.state.dimensionDetails} onChange={this.handleChange} />
                    </div>
                    <p style={{ fontSize: '12px' }}>120 characters max</p>

                    <strong>Position of space</strong>
                    <div className="inputGroup" style={{ width: '100%' }}>
                        <label>End cap<input type="checkbox" checked={this.state.position == "end cap"} name="position" value={'end cap'} onChange={this.handleChange} /></label>
                        <label>In-line<input type="checkbox" checked={this.state.position == "in-line"} name="position" value={'in-line'} onChange={this.handleChange} /></label>
                        <label>Free standing<input type="checkbox" checked={this.state.position == "free standing"} name="position" value={'free standing'} onChange={this.handleChange} /></label>
                        <label>(city) corner<input type="checkbox" checked={this.state.position == "corner"} name="position" value={'corner'} onChange={this.handleChange} /></label>
                        <label>(city) mid block<input type="checkbox" checked={this.state.position == "mid block"} name="position" value={'mid block'} onChange={this.handleChange} /></label>
                        <label>other<input type="checkbox" checked={this.state.position == "other"} name="position" value={'other'} onChange={this.handleChange} /></label>
                    </div>

                    <strong>Tenant mix</strong>
                    <div className="inputGroup">
                        <textarea maxLength="500" className="textArea"
                            type="text"
                            multiline
                            name="tenantMixDetails"
                            placeholder="Enter any additional information that is relevant to this listing"
                            value={this.state.tenantMix} onChange={this.handleChange} />
                    </div>
                    <p style={{ fontSize: '12px' }}>500 characters max</p>

                    <strong>Number of parking spaces available, if applicable? </strong>
                    <div className="inputGroup" style={{ width: '60px' }}>
                        <textarea maxLength="240" className="textArea"
                            type="text"
                            multiline
                            name="parkingSpaceDetails"
                            placeholder=""
                            value={this.state.parkingSpaceDetails} onChange={this.handleChange} />
                    </div>

                    <strong>Designated Parking? </strong>
                    <div className="inputGroup" >
                        <textarea maxLength="240" className="textArea"
                            type="text"
                            multiline
                            name="designatedParkingDetails"
                            placeholder="Enter any additional information that is relevant to this listing"
                            value={this.state.designatedParkingDetails} onChange={this.handleChange} />
                    </div>
                    <p style={{ fontSize: '12px' }}>240 characters max</p>
                    <strong>Is the location under construction?</strong>
                    <div className="inputGroup">
                        <label>yes<input type="checkbox" checked={this.state.underConstruction == "yes"} name="underConstruction" value={'yes'} onChange={this.handleChange} /></label>
                        <label>no<input type="checkbox" checked={this.state.underConstruction == "no"} name="underConstruction" value={'no'} onChange={this.handleChange} /></label>
                    </div>
                    <strong>If yes, estimated completion date? </strong>
                    <div className="inputGroup" style={{ width: '70%' }}>
                        <textarea maxLength="120" className="textArea"
                            type="text"
                            multiline
                            name="estimatedCompletionDate"
                            placeholder="Enter any additional information that is relevant to this listing"
                            value={this.state.estimatedCompletionDate} onChange={this.handleChange} />
                    </div>
                    <p style={{ fontSize: '12px' }}>120 characters max</p>
                    <br></br>

                    <strong>If existing structure, what date was it built, if available? </strong>
                    <div className="inputGroup" style={{ width: '70%' }}>
                        <textarea maxLength="120" className="textArea"
                            type="text"
                            multiline
                            name="dateOfConstruction"
                            placeholder="Enter any additional information that is relevant to this listing"
                            value={this.state.dateOfConstruction} onChange={this.handleChange} />
                    </div>
                    <p style={{ fontSize: '12px' }}>120 characters max</p>

                    <strong>Means of ingress and egress for strip center, mall of free-standing unit? Please specify.</strong>
                    <div className="inputGroup" style={{ width: '70%' }}>
                        <textarea maxLength="240" style={{ marginLeft: '0em', width: '100%', height: '100px', padding: '0.25em', fontSize: '14px' }}
                            type="text"
                            multiline
                            name="ingressInfo"
                            placeholder="Enter any additional information that is relevant to this listing"
                            value={this.state.ingressInfo} onChange={this.handleChange} />
                    </div>
                    <p style={{ fontSize: '12px' }}>240 characters max</p>

                    <strong>Number of Access Points?</strong>
                    <div className="inputGroup" style={{ width: '60px' }}>
                        <textarea maxLength="120" className="textArea"
                            type="text"
                            multiline
                            name="dateOfConstruction"
                            placeholder=""
                            value={this.state.dateOfConstruction} onChange={this.handleChange} />
                    </div>

                    <strong>Does this space have a certificate of occupancy?</strong>
                    <div className="inputGroup">
                        <label>yes<input type="checkbox" checked={this.state.hasOccupancyCert == "yes"} name="hasOccupancyCert" value={'yes'} onChange={this.handleChange} /></label>
                        <label>no<input type="checkbox" checked={this.state.hasOccupancyCert == "no"} name="hasOccupancyCert" value={'no'} onChange={this.handleChange} /></label>
                    </div>

                    <strong>Zoning usuage allowed?</strong>
                    <div className="inputGroup">
                        <label>yes<input type="checkbox" checked={this.state.hasZoning == "yes"} name="hasZoning" value={'yes'} onChange={this.handleChange} /></label>
                        <label>no<input type="checkbox" checked={this.state.hasZoning == "no"} name="hasZoning" value={'no'} onChange={this.handleChange} /></label>
                    </div>

                    <div className="inputGroup" style={{ width: '70%' }}>
                        <textarea maxLength="240" className="textArea"
                            type="text"
                            multiline
                            name="zoningDetails"
                            placeholder="Enter any additional zoning information"
                            value={this.state.zoningDetails} onChange={this.handleChange} />
                    </div>
                    <p style={{ fontSize: '12px' }}>240 characters max</p>


                    <strong>Type and dimensions of sign/signs permitted?</strong>
                    <div className="inputGroup" style={{ width: '70%' }}>
                        <textarea maxLength="240" className="textArea"
                            type="text"
                            multiline
                            name="signDetails"
                            placeholder="Enter any additional  information that is relevant to this listing"
                            value={this.state.signDetails} onChange={this.handleChange} />
                    </div>
                    <p style={{ fontSize: '12px' }}>240 characters max</p>

                    <strong>Upload Site Photos</strong>
                    <p>This can include site plans, and other relevant photos to the site's dimensions, construction photos, access points (ingress and egress), Zoning Ordinace Maps, current signage, etc.</p>
                    <PhotoUploader setPhotos={this.handleSetPhotos} photos={this.props.photos.site_photos} />

                </form>

                <Button variant="primary" onClick={this.props.handleNext} 
                    className="nextButton">
                    Next
                </Button>
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


export default connect(mapStateToProps)(AddListing)