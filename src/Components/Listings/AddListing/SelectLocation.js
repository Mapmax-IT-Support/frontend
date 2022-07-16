import React  from 'react'
import { connect } from 'react-redux'
import { createSelector } from 'reselect';
import * as selectors from '../../../Reducers/selectors'
import Button from 'react-bootstrap/Button'
import AutoCompleteBar from "../../AutoCompleteBar"
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { getListingByPlaceId } from '../../../Requests/listings-requests'
import PulseLoader from "../../UI/PulseLoader"

class SelectLocation extends React.Component {

    constructor(props) {
        super(props)
       
        this.state = {
            error : false,
            errorMessage : '',
            loading : false
        }
    }

    handleSubmit = async () => {
        this.props.setLocation(this.state.address)
    }

    selectAddress = async (address) => {
        this.setState({ error : false, loading: true  })
        let error = false
        let zip, number, street, city, state = ''
        let place;
        let geoCode = await geocodeByAddress(address).then(results => { 
                for (let c of results[0].address_components) {
                    for (let type of c.types) {
                        if (type == 'street_number')
                            number = c.long_name 
                        else if (type == 'route')
                            street =  c.short_name 
                        else if (type == 'locality')
                            city = c.long_name
                        else if (type == 'administrative_area_level_1')
                            state = c.short_name
                        else if (type == "postal_code") 
                            zip = c.long_name
                    }
                }
                // improper address
                if (number == undefined) {
                    this.setState({ error : true, errorMessage : "Sorry, this address is too general. Please try again", loading : false })
                    error = true 
                    return;
                }  
                place = results[0]
                return getLatLng(results[0])
            })
            .then(latLng => latLng)
            .catch(error => console.error('Error', error));

            if (place != undefined) {
                // check if listing already exists
                let list_check = await getListingByPlaceId(place.place_id, true)

                if (list_check.length > 0) {
                    this.setState({ error : true, errorMessage : "Sorry, this location already has a listing.", loading: false })
                    error = true 
                    return;
                }
            }

            let addressState = {}
            addressState.formatted = address
            addressState.street = number + ' ' + street
           
            addressState.city = city
            addressState.state = state
            addressState.zip = zip
            addressState.coords = geoCode
            addressState.place = place


            if (error) return;
            
            this.setState({ address : addressState, loading : false })
    }


    render() {
        return (
            <div className="selectLocationPage">
                <div className="selectLocationHeader">
                    <br></br>
                    <h2>Select Location</h2>
                    <br></br>
                    <p>Begin typing in the address of your desired location and select it from the dropdown menu to get started </p>
                </div>
                    {this.state.error && <p style={{ color: 'red', marginTop: 10}}>{this.state.errorMessage}</p>}
                    <div className="listingSearchBar">
                    <AutoCompleteBar addressFunction={this.selectAddress} position="relative" font/>
                    <br></br>
                    {this.state.loading &&  <PulseLoader color='#00D4FF' size={10}/>}
                    {!this.state.loading && <Button variant="primary" onClick={this.handleSubmit} disabled={this.state.address == undefined || this.state.error}
                        style={{backgroundColor:'#00d4ff', fontWeight: 'bold', alignSelf: 'center', zIndex: -100000 }}>
                        Submit
                    </Button>
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


 export default connect(mapStateToProps)(SelectLocation)