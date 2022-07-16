import React, {useState} from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import '../../css/App.scss';
import { updateBusinessType} from '../../Actions/business-actions'
import { updateReady } from '../../Actions/ready-actions'
import { updateIsCity } from '../../Actions/isCity-actions'
import { updateDataRange } from '../../Actions/dataRange-actions'
import { updateGeoUnit } from '../../Actions/geoUnit-actions'
import { connect } from 'react-redux'
import { createSelector } from 'reselect';
import AutoCompleteBar from '../AutoCompleteBar'
import * as selectors from '../../Reducers/selectors'
import { updateAddress} from '../../Actions/address-actions'
import {  withRouter } from 'react-router-dom'
import {AiOutlineInfoCircle} from 'react-icons/ai'
import Modal from 'react-bootstrap/Modal'
import  {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import { getLocation, createLocation } from '../../Requests/locations-requests';

const ZIP = 'zip code tabulation area'

class LookUpForm extends React.Component {

    constructor(props) {
        super(props)

        this.onFormChange = this.onFormChange.bind(this);
        this.onBusinessFormChange = this.onBusinessFormChange.bind(this);
        this.onUpdateBusinessType = this.onUpdateBusinessType.bind(this);
        this.onUpdateReady = this.onUpdateReady.bind(this)
        this.onHandleSubmit = this.onHandleSubmit.bind(this)
        this.onUpdateIsCity = this.onUpdateIsCity.bind(this)
        this.onPriceFormChange = this.onPriceFormChange.bind(this)
        this.onUpdateAddress = this.onUpdateAddress.bind(this)
        this.getAddress = this.getAddress.bind(this)

        this.state = {
            address: undefined,
            priceLevel : 1,
            business_type : 'none',
            distance: 'Driving',
            geoUnit: this.props.geo_unit,
            showModal: false,
            recentSearchs : new Map(),
            errorMessage : "",
            error : false,
        };
    }

    async componentDidMount() {

        if (this.props.urlParams) {
            let type = this.props.urlParams.business_type
            if (type == 'lodging') type = 'hotels /lodging'

            let business = {
                type: 'none', //this.props.urlParams.business_type,
                priceLevel : this.state.priceLevel
            }
            let promises= [
                this.loadAddress(JSON.parse(this.props.urlParams.address)),
                this.onUpdateBusinessType(business),
                this.setState({business_type: this.props.urlParams.business_type.replace(/_/g, ' ')}),
            ]
/*
            if (this.props.urlParams.distance.toLowerCase() == 'driving') {
                promises.push(this.onUpdateIsCity(false))
                promises.push(this.setState({distance: 'Driving'}))
            }
            else  {
                promises.push(this.onUpdateIsCity(true))
                promises.push(this.setState({distance: 'Walking'}))
            }
            */
            let res = await Promise.all(promises)
            await this.onUpdateAddress()
            this.onUpdateReady(true)
        }
    }

    loadAddress = async (address) => {
        await this.setState({ error : false })

        return new Promise(async (resolve, reject) => {

            let zip, number, street, city, state = ''
            let place;
            let geoCode = await geocodeByAddress(address)
            .then(results => { 
                for (let c of results[0].address_components) {
                    for (let type of c.types) {
                        if (type == 'street_number')
                            number = c.long_name 
                        if (type == 'route')
                            street =  c.short_name 
                        if (type == 'locality')
                            city = c.long_name
                        if (type == 'administrative_area_level_1')
                            state = c.short_name
                        if (type == "postal_code") 
                            zip = c.long_name
                    }
                }
                if (number == undefined) number = ''
                if (street == undefined) street = ''
                place = results[0]
                return getLatLng(results[0])
            })
            .then(latLng => latLng)
            .catch(error => console.error('Error', error));
            let addressState = {}
            addressState.formatted = address
            addressState.street = number + ' ' + street
           
            addressState.city = city
            addressState.state = state
            addressState.zip = zip
            addressState.coords = geoCode
            addressState.place = place

            // handle no zip
            if (addressState.zip == undefined) {
                this.setState({ error : true, errorMessage : "Address is too general, please try another."})
                return 
            }
            
            // handle no street
            if (addressState.street == " ") {
                let firstPart = address.substring(0, address.indexOf(','))
                let alreadyInAddress = false

                Object.entries(addressState).forEach(([label, value]) => {
                    if (value == firstPart) {
                        alreadyInAddress = true
                    }
                })
                if (!alreadyInAddress)
                    addressState.street = firstPart
            }

            // handle no city
            if (addressState.city == undefined) {
                let secondPart = address.substring(address.indexOf(',')+1, address.length)
                secondPart = secondPart.substring(0, secondPart.indexOf(','))
                let alreadyInAddress2 = false

                Object.entries(addressState).forEach(([label, value]) => {
                    if (value == secondPart) {
                        alreadyInAddress2 = true
                    }
                })
                if (!alreadyInAddress2)
                    addressState.city = secondPart
            }

        
            await this.setState({address: addressState })
            resolve(addressState)
        })

    }
    
    onUpdateBusinessType(business_type) {
        this.props.onUpdateBusinessType(business_type)
    }

    onUpdateIsCity(isCity) {
        this.props.onUpdateIsCity(isCity)
    }
    onFormChange(event) {
        this.setState({[event.target.name]: event.target.value})
    }

    onPriceFormChange(event) {
       let value = event.target.value.substring(0, 1)
       this.setState({[event.target.name]: value})
    }

    onBusinessFormChange(event) {
        this.setState({[event.target.name]: event.target.value})
    }

    onUpdateReady(isReady) {
        this.props.onUpdateReady(isReady)
    }

    async onHandleSubmit() {
        // return if no address
        if (this.state.address == undefined) 
            return;
        
        await this.onUpdateAddress(this.state.address)
        let type = this.state.business_type
        if (type == 'hotels /lodging') type = 'lodging'
        let business = {
            type: type.replace(/ /g, '_'),
            priceLevel : this.state.priceLevel
        }
        this.onUpdateBusinessType(business)
        this.onUpdateGeoUnit(this.state.geoUnit)
       
        if (this.props.address.toString().length > 0) {
            if (this.props.ready) {
                await this.onUpdateReady(false)
                await this.onUpdateReady(true)
            } else {
                await this.onUpdateReady(true)
            }

            // reset data_range to zip
            if (this.props.data_range != ZIP) {
                await this.props.onUpdateDataRange(ZIP)
            }
            // recent searches
            this.checkLocalStorage(this.props.address)

            let address = encodeURI(JSON.stringify(this.props.address.formatted))
            let business_type = encodeURI(this.props.business_type.type)
            let url = '/' + address + '/' + business_type
            this.props.history.push(url)
        }
        else {
            this.onUpdateReady(false)
        }
    }

    onUpdateAddress = async () => {
        let address = this.state.address
        // check for location from db 
        let results = await getLocation(address.place.place_id)
       /* 
        if (results.res.length <= 0) {
            let createRes = await createLocation(address.place.place_id, address)
            address.isNewEntry = true
        } else {
            address.isNewEntry = false
        }
        */
       address.isNewEntry = true
       let countyRes = await 
       this.props.onUpdateAddress(address)
    }

    checkLocalStorage = location => {
        // if signed in push to recent searches
        if (this.props.user_id != -1) {
               let searches = JSON.parse(localStorage.getItem('recentSearches'))
      
               if (searches == null) searches = new Map()
               else {
                    // keep last 25 
                    if (searches.length > 25)
                    searches = searches.slice((searches.length) -25, searches.length)
                    searches = new Map(searches)
               }
   
               searches.set(location.place.place_id, { 
                   location: location,
                    business_type: this.props.business_type,
                    date : new Date()
                })

               localStorage.setItem('recentSearches', JSON.stringify(Array.from(searches.entries())))
           }
    }

    getAddress = async (address) => {
        let addressState = await this.loadAddress(address)
        await this.setState({address: addressState})
    }

    setModalShow = (flag) => {
        this.setState({showModal: flag})
    }

    onUpdateDataRange = (range) => {
        this.props.onUpdateDataRange(range)
    }

    onUpdateGeoUnit = (geo_unit) => {
        this.props.onUpdateGeoUnit(geo_unit)
    }

    onHandleAddressWarning = () => {
        this.setState({ error : true, errorMessage : "Please begin typing your address and make sure to select it from the drop down menu."})
    }

    render() {
 
        return (
            <div className="lookup-form-block">
                <div className="errorMessage">
                    {this.state.error && <div>{this.state.errorMessage}</div>}
                </div>
                <MyVerticallyCenteredModal
                    show={this.state.showModal}
                    onHide={() => this.setState({showModal:false})}
                />          
                <div className="searchHeader">
                    <div className="addressText">Address</div>
                    <div className="howToContainer">
                        <span style={{ color: 'white'}}>How to use</span>
                        <InfoButton clickFunction={()=>this.setModalShow(true)}/>    
                    </div>
                </div>

                <div className="searchGo">
                    <div className="searchContainer">
                        <AutoCompleteBar urlParams={this.props.urlParams} addressFunction={this.getAddress} position="relative" fontSize="18px"/>
                    </div>
                    <Form style={{ flexDirection : 'row', justifyContent: 'flex-start', marginLeft: '.75em'}}>
                            {this.state.address !== undefined && <Button  disabled={this.state.error} variant="primary" onClick={this.onHandleSubmit} 
                                style={{backgroundColor:'#00d4ff', fontWeight: 'bold'}}>
                                Go</Button>
                            }
                            {this.state.address === undefined && <Button  variant="primary" onClick={this.onHandleAddressWarning} 
                                style={{backgroundColor:'#00d4ff', fontWeight: 'bold', opacity: 0.75}}>
                                Go</Button>
                            }
                    </Form>
                </div>
                
                <div className="disclaimerContainer">
                    <p style={{ fontSize: 18, color: 'whitesmoke', margin: 'auto'}}>*Current locations support New Jersey, the 5 boroughs of New York City, and Long Island, New York, USA.</p>
                </div>
  
        </div>
        );
    }
}

const InfoButton = (props) => {
    const [clicked, setClicked] = useState(false)
    let color = 'white'

    if (clicked) {
     //   color = 'rgba(255,255,255,0.5'
    }
    else color = 'white'
    
    let style = {color: color, float: 'right'}

    return (
         <AiOutlineInfoCircle onClick={(e)=> [setClicked(!clicked), props.clickFunction()]} 
         style={style}/>
    ) 
}

const MyVerticallyCenteredModal = (props) => {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
           Location Search 
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h3 style={{fontSize: '20px'}}>
            Start typing a street address* or the name of a business and select from the autofill results.
          </h3>
          <p>
              <ul>
                  <li><span><strong>*Current locations support New Jersey, the 5 boroughs of New York City, and Long Island, New York, USA</strong> </span> </li>
                  <li><span> For intersections type the first Street/Avenue/Road then '&amp;' or 'and' then the next Street/Avenue/Road.</span><br></br> <span>
            For example, '3rd Ave &amp; 11th St, New York, NY'
            </span>   </li>
              </ul>
          </p>
          
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
  
const mapStateToProps = createSelector(
    selectors.userSelector,
    selectors.businessTypeSelector,
    selectors.readySelector,
    selectors.addressSelector,
    selectors.isCitySelector,
    selectors.tradeZoneBoundsSelector,
    selectors.dataRangeSelector,
    selectors.geoUnitSelector,
    (user, business_type, ready, address, isCity, tradeZone_bounds, data_range, geo_unit) => ({
        user,
        business_type,
        ready,
        address,
        isCity,
        tradeZone_bounds,
        data_range,
        geo_unit
    })
);

const mapActionsToProps = {
     onUpdateBusinessType: updateBusinessType,
     onUpdateReady: updateReady,
     onUpdateIsCity: updateIsCity,
     onUpdateAddress: updateAddress,
     onUpdateDataRange: updateDataRange,
     onUpdateGeoUnit : updateGeoUnit
};

export default withRouter(connect(mapStateToProps, mapActionsToProps) (LookUpForm));
