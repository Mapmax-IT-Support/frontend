import React  from 'react'
import { connect } from 'react-redux'
import { createSelector } from 'reselect';
import * as selectors from '../../../Reducers/selectors'
import Table from 'react-bootstrap/Table'
import PhotoUploader from './PhotoUploader'
import { Link } from 'react-router-dom'
import { createListing,  setListingPhotos, updateListing} from "../../../Requests/listings-requests"
import Button from 'react-bootstrap/Button'
import PropogateLoader from '../../UI/ProppgateLoader'

class AddListing extends React.Component {

    constructor(props) {
        super(props)
       
        this.state = {
            loading : false,
            error : true,
            errorMessage : "",
            success : false,
            listingURL : "",
            listingId : "",
            published : true
        }
    }

    async componentDidUpdate(prevProps) {
        if (prevProps.saveKey !== this.props.saveKey) {
            await this.setState({ published : false })
            this.handleSubmit();
        } 
    }

    handleUploadPhotos = async (listingId) => {
        let error = false 
        let errormessage = ""
        let formData = new FormData();
        formData.append("listingId", ''+listingId)
        this.props.photos.contact_photos.forEach(e => formData.append("contact_photos", e))
        this.props.photos.site_photos.forEach(e => formData.append("site_photos", e))
        this.props.photos.cover_photos.forEach(e => formData.append("cover_photos", e))

        let res = await setListingPhotos(formData).catch(e => { error = true; errormessage = e })

        if (error) {
            this.props.setSaveData(false, errormessage)
            this.setState({ loading : false, errror : true, errorMessage: errormessage })
            return
        }
    }

    handleSubmit = async () => {
        let error = false 
        let errormessage = ""
        this.setState({ loading : true })
        let data = {...this.props.formData, user_id : this.props.user._id, published : this.state.published }  // userid
        let listingAction = (this.props.isUpdate) ? updateListing : createListing
    
        let res = await listingAction(data).catch(e => { error = true; errormessage = e })

        if (error) {
            this.props.setSaveData(false, errormessage)
            this.setState({ loading : false, errror : true, errorMessage: errormessage })
            return
        }

        if (res.listingId != undefined) {
            await this.handleUploadPhotos(res.listingId)
        }
        this.props.setSaveData(false, 'Success')
        this.setState({ loading : false, success : this.state.published, listingId : res.listingId  })
    }

    render() {
        const { photos, formData } = this.props
        return (
            <div className="formPage">
                <div style={{ borderBottom: '1px solid rgb(31,33,48)', width: '25%', textAlign: 'left'}}>       
                    <h3>Review and Submit</h3>
                </div> 
                <br></br>
                <div style={{ borderBottom: '1px solid rgb(31,33,48)', width: '20%', textAlign: 'left', marginTop: '3em' }}>       
                    <h3 style={{ fontSize: '24px' }}>1. Contact Info</h3>
                </div> 
                    {
                        <Table striped bordered hover  className="listingDataTable">
                            <tbody>
                                {Object.entries(formData.contactInfo).map(([key, val], i) => {
                                    return (
                                        <tr><td>{formatKeys(key)}</td><td className="tableValue">{capitalizeFirst(val)}</td></tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                    }

                    <h3 style={{ fontSize: '18px', marginBottom: '0.5em'}}>Contact Photos: {photos.contact_photos.length == 0 && <span style={{ color: 'red', fontSize: '16px'}}>No photos provided</span>}</h3>
                    <div className="photoScroller">
                        {photos.contact_photos.map(photo => {
                            return (<img className="previewImage" src={URL.createObjectURL(photo)}/>)
                        })}
                    </div>

                <div style={{ borderBottom: '1px solid rgb(31,33,48)', width: '20%', textAlign: 'left', marginTop: '3em' }}>       
                    <h3 style={{ fontSize: '24px' }}>2. location Details</h3>
                </div> 
                    {
                    <Table striped bordered hover  className="listingDataTable">
                        <tbody>
                            {Object.entries(formData.locationDetails).map(([key, val], i) => {
                                return (
                                    <tr><td>{formatKeys(key)}</td><td className="tableValue">{capitalizeFirst(val)}</td></tr>
                                )
                            })}
                        </tbody>
                    </Table> 
                    }

                <h3 style={{ fontSize: '18px', marginBottom: '0.5em'}}>Cover Photos: {photos.cover_photos.length == 0 && <span style={{ color: 'red', fontSize: '16px'}}>No photos provided</span>}</h3> 
                        <div className="photoScroller">
                        {photos.cover_photos.map(photo => {
                                return (<img className="previewImage" src={URL.createObjectURL(photo)}/>)
                            })}
                        </div>

            <h3 style={{ fontSize: '18px', marginBottom: '0.5em', marginTop: '1em'}}>Site Photos: {photos.site_photos.length == 0 && <span style={{ color: 'red', fontSize: '16px'}}>No photos provided</span>}</h3>
                    <div className="photoScroller">
                        {photos.site_photos.map(photo => {
                            return (<img className="previewImage" src={URL.createObjectURL(photo)}/>)
                        })}
                    </div>

                <div style={{ borderBottom: '1px solid rgb(31,33,48)', width: '20%', textAlign: 'left', marginTop: '3em' }}>       
                    <h3 style={{ fontSize: '24px' }}>3. Pricing and Terms</h3>
                </div> 
                    {
                    <Table striped bordered hover  className="listingDataTable">
                    <tbody>
                        {Object.entries(this.props.formData.pricingInfo).map(([key, val], i) => {
                            return (
                                <tr><td>{formatKeys(key)}</td><td className="tableValue">{capitalizeFirst(val)}</td></tr>
                            )
                        })}
                    </tbody>
                </Table> 
                }   
                <div style={{ width: '100%', height: '100px', display: 'flex', flexDirection: 'column',  alignSelf: 'center'}}>
                    {this.state.error && <span style={{ flex: 1, color: 'red',  }}>{this.state.errorMessage}</span>}
                    {this.state.loading &&  <div style={{ flex: 1,  display: 'flex', alignItems: 'center', justifyContent: 'center'}}><PropogateLoader  color='#00D4FF' size={10} /> </div>}
                    {!this.state.loading && !this.state.success &&
                    <div style={{ flex: 1}}>
                        <Button variant="primary" onClick={this.handleSubmit} 
                            style={{backgroundColor:'#00d4ff', fontWeight: 'bold',     }}>
                            Submit
                        </Button>
                     </div>
                    }
                    {this.state.success && <div> <span style={{ color: 'black'}}>Success</span><br></br><Link to={"/listing/"+this.state.listingId}>Go to your listing </Link> </div>}
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

 const formatKeys = value => {
    let formatted = ""
    for (let i=0; i < value.length; i++) {
        let char = value.substring(i, i+1)
        if (i == 0) {
            formatted += char.toUpperCase()
            continue;
        }
        
        if (char == char.toUpperCase()) {
            formatted += " " + char
            continue;
        }

        formatted += char;
    }
    return formatted;
 }

 const capitalizeFirst = value => {
    return value.substring(0,1).toUpperCase() + value.substring(1, value.length)
 }


 export default connect(mapStateToProps)(AddListing)