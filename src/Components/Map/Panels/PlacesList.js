import { connect } from 'react-redux'
import React from 'react'; 
import Table from 'react-bootstrap/Table'
import store from '../../../Redux/store'
import { createSelector } from 'reselect';
import { updateActivePlace } from '../../../Actions/active-actions';
import { BLUE_MARKER, RED_MARKER, YELLOW_MARKER } from '../GoogleMaps/GoogleMapComponents'

const textPrimary = 'whitesmoke'

class PlacesList extends React.Component {

  constructor(props) {
    super(props)
    
    this.state = store.getState()
    this.onUpdateActivePlace = this.onUpdateActivePlace.bind(this)
    this.activatePlace = this.activatePlace.bind(this)

  }
  
  onUpdateActivePlace(data) {
    this.props.onUpdateActivePlace(data)
  }

  activatePlace(event) {
    this.onUpdateActivePlace(event.target.value)
  }

  render() {
    let places;
    if (this.props.places.length > 0) {
       places = this.props.places.map((place, i) => {
         if (!place) {
           return;
         }
         let icon;
       if (place.place_id == this.props.address.place.place_id)
          icon = BLUE_MARKER
       else  icon = place.icon
        return (
          <tr
            key={i}
            onClick={() =>  this.onUpdateActivePlace(place)}
          >
            <td>{i+1}</td>
            <td>{place.name}</td>
            <td>{<img src={icon} style={{width: '32px', height: '32px'}}></img>}</td>
          </tr>
        );
      })
    } else {
       places = <div></div>
    }

    return (
      <div className="places-list" >
        <div id="places-list_header">
          <br></br>
          <p style={{textAlign: 'center', color: textPrimary}}><strong>Nearby Businesses</strong></p>
          <div style={{display: 'flex',justifyContent: 'space-evenly', fontWeight: 'bold'}}>
            <img style={{ width: 32, height: 32}} src={BLUE_MARKER}></img>
            <p style={{color: textPrimary}}>Site</p>
            <img style={{ width: 32, height: 32}} src={RED_MARKER}></img>
            <p style={{color: textPrimary}}>Competition</p>
            <img style={{ width: 32, height: 32}} src={YELLOW_MARKER}></img>
            <p style={{color: textPrimary}}>Other</p>
          </div>
      </div>
      <div style={{flexGrow: 1, overflowY: 'auto'}}>
        <Table striped bordered hover variant="dark" >
          <thead>
            <tr>
              <th>#</th>
              <th>Place</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {places}
            </tbody>
          </Table>
        </div>
      </div>);
    }
}

const activePlaceSelector = createSelector (
  state => state.active_place,
  active_place => active_place
)

const placesSelector = createSelector (
  state => state.places,
  places => places
)

const addressSelector = createSelector (
  state => state.address,
  address => address
)

const mapStateToProps = createSelector(
  activePlaceSelector, placesSelector, addressSelector,
  (active_place, places, address) => ({
    active_place,
    places,
    address
  })
);
 
const mapActionsToProps = {
  onUpdateActivePlace: updateActivePlace,
};


export default connect(mapStateToProps, mapActionsToProps)(PlacesList);