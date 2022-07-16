import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import { getNearby, getPages, getPhoto } from '../../Requests/map-requests' 
import '../../css/App.scss';
import { connect } from 'react-redux'
import { createSelector } from 'reselect';
import { updatePlaces } from '../../Actions/places-actions'
import { updateActivePlace } from '../../Actions/active-actions'
import ReactDOMServer from 'react-dom/server';
import DemographicsPanel from './Panels/DemographicsPanel'
import {updateTract} from '../../Actions/tract-actions'
import Form from 'react-bootstrap/Form'
import { getPoints } from '../../Helpers/TradeZone'
import { ZIP, TRADE_ZONE} from './Panels/DemographicsPanel'
import { GOOGLE_KEY, google, BUSINESS_TYPES, POI_TYPES } from '../../Constants.js'
import { renderCircle, renderMarker, renderComplexMarker, renderLargeMarker, renderInfoContent, BLUE_MARKER, YELLOW_MARKER, GREEN_MARKER, RED_MARKER, BLUE_DOT_05, YELLOW_DOT_25, YELLOW_DOT_3, BLUE_DOT_5 } from './GoogleMaps/GoogleMapComponents'
import { activeSelector, addressSelector, businessTypeSelector, dataRangeSelector, placesSelector, stateSelector, tractSelector, zipSelector, isCitySelector, tradeZoneBoundsSelector, transportationSelector, geoUnitSelector, statsSelector } from '../../Reducers/selectors'
import SliderSwitch from '../UI/SliderSwitch'
import Button from 'react-bootstrap/Button';
import { updateTradeZoneBounds } from '../../Actions/tradeZoneBoundaries-actions'
import ReactStreetview from 'react-streetview';
import { updateTransportation} from '../../Actions/transportation-actions'
import { createTradeZoneCartography } from '../../Requests/locations-requests'
import FadeLoader from '../UI/FadeLoader'
import { getSubwayTotals } from '../../Requests/subway-requests';
import { getListingByPlaceId } from "../../Requests/listings-requests"
import { withRouter } from 'react-router-dom'
import MediaQuery from 'react-responsive'
import Toolbar from '../Mobile/Toolbar'
import PlacesList from './Panels/PlacesList'
import ChartsPanel from './Panels/ChartsPanel'
// import CommentsPanel from './Panels/CommentsPanel'
import TransportationPanel from './Panels/TransportationPanel'
import { getCounty } from '../utils/distance'
import { Boroughs } from '../utils/zipcodes'

const infoWindow =  new google.maps.InfoWindow()

class SimpleMap extends Component {
  static defaultProps = {
    defaultCenter: {
      lat: 59.95,
      lng: 30.33
    },
    defaultzoom: 11
  };

  constructor(props) {
    super(props)
    this.myRef = React.createRef();
    this.streetView = React.createRef();
    this.service = new google.maps.StreetViewService;
    // let defaultPlace = this.props.business_type.type
    // let type = this.props.business_type.type
    // let business_option = type.replace(/_/g, ' ')
    // if (type == 'lodging') type = 'hotels /lodging'
    // else if (defaultPlace == 'residential') {
    //   defaultPlace = 'establishment'
    //   business_option = 'all'
    // }

    this.state = {
      center: this.props.center,
      map : undefined,
      markers : new Map(),
      place_details : new Map(),
      place_photos : new Map(),
      places_cache : new Map(),
      tokens_cache : new Map(),
      places_count : 20,
      address_line : this.props.address.street + ', ' + this.props.address.city + ' ' + this.props.address.state + ', ' + this.props.address.zip,
      boundaries : getPoints(this.props.center, 0.804, 1),
      cartography : {},
      display_cartography: true,
      business_type: '', //defaultPlace,
      cartographyLoaded : false,
      poi : 'none',
      business_type_option: '', //business_option,
      aerial : true,
      zoom : this.props.zoom,
      siteView: false,
      mapType : google.maps.MapTypeId.SATELLITE,
      loadingCart : {[ZIP] : true, [TRADE_ZONE] : true},
      mapOptions : {
        streetViewControl: true,
        scaleControl: true,
        fullscreenControl: false,
        styles: [{
            featureType: "poi.business",
            elementType: "labels",
            stylers: [{
                visibility: "off"
            }]
        }],
        gestureHandling: "greedy",
        disableDoubleClickZoom: true,
        minZoom: 5,
        maxZoom: 100,
        mapTypeControl: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.BOTTOM_CENTER,
            mapTypeIds: [
              google.maps.MapTypeId.ROADMAP,
              google.maps.MapTypeId.SATELLITE,
              google.maps.MapTypeId.HYBRID
            ]
        },
        zoomControl: true,
        clickableIcons: false
      },

      toolsOpen : false
    }  
  
    this.onUpdatePlaces = this.onUpdatePlaces.bind(this);
    this.onUpdateActivePlace = this.onUpdateActivePlace.bind(this);
    this.onUpdateTract = this.onUpdateTract.bind(this)
    this.lessPlaces = this.lessPlaces.bind(this);
    this.loadAllPlaces = this.loadAllPlaces.bind(this);
    this.loadMorePlaces = this.loadMorePlaces.bind(this);
    this.loadDefaultPlaces = this.loadDefaultPlaces.bind(this);
    this.exampleRef = React.createRef()
    this.updateMarkers = this.updateMarkers.bind(this)
    this.updateMarker = this.updateMarker.bind(this)
    this.updateInfoWindow = this.updateInfoWindow.bind(this)
    this.getopen  = this.getOpen.bind(this)
    this.getPlaceDetails = this.getPlaceDetails.bind(this)
    this.updatePlaceDetails = this.updatePlaceDetails.bind(this)
    this.onBusinessFormChange = this.onBusinessFormChange.bind(this);
    this.loadZipCartography = this.loadZipCartography.bind(this)
    this.renderCartography = this.renderCartography.bind(this)
    this.getInfoContent = this.getInfoContent.bind(this)
    this.handleSwitch = this.handleSwitch.bind(this)
    this.clearCartography = this.clearCartography.bind(this)
    this.onPlacesCountChange = this.onPlacesCountChange.bind(this)
    this.updateRadii =this.updateRadii.bind(this)
    this.initCache = this.initCache.bind(this)
    this.onUpdateTradeZoneBounds = this.onUpdateTradeZoneBounds.bind(this)
    this.loadTradeZoneCartography = this.loadTradeZoneCartography.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.onPoiFormChange = this.onPoiFormChange.bind(this)
    
    // to-do create function updateInfoWindow
    setInterval(async () => {
        let isBound = (infoWindow.getMap() ? true : false)
        if (!isBound && infoWindow.marker != undefined && infoWindow.marker.key != 'your_business') {
          let img = ''
          if (infoWindow.marker.place.place_id == this.props.address.place.place_id) {
            img = BLUE_MARKER
          }
          else if (this.props.business_type.type != 'residential' && infoWindow.marker.place.types.includes(this.props.business_type.type)) {
            img = RED_MARKER
          } else {
            img = YELLOW_MARKER
          }
          infoWindow.marker.marker.setIcon(img)
          this.onUpdateActivePlace(false)
        }
    }, 500);
  }

  async componentDidMount() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    this.initCache()
    await this.loadListing()

    // first time user check
    if (this.props.isFirstTimeUser) {
      this.props.updateIsFirstTime(false)
      if (window.innerWidth > 550) {
        this.props.runJoyRideTutorial()
      }
    }
  }

  componentWillUnmount() {
    this.onUpdatePlaces([])
  }

  async componentDidUpdate(prevProps, prevState) {
    // active place change
    if (this.props.active_place && this.props.active_place !== prevProps.active_place) 
      if (this.props.active_place.toString().length > 0) {
        this.setState({center : this.props.active_place.geometry.location})
        // highlight marker on map
        if (prevProps.active_place.toString().length > 0) {
          this.updateMarker(this.state.markers.get(prevProps.active_place.place_id))
        }
        this.state.markers.get(this.props.active_place.place_id).marker.setIcon(GREEN_MARKER)
        google.maps.event.trigger(this.state.markers.get(this.props.active_place.place_id).marker, 'click')
      }

    // update markers 
    if (this.props.places !== prevProps.places && !(!this.state.siteView && prevState.siteView)) {
      if (this.state.map != undefined) {
        let all_markers =  Array.from(this.state.markers.values())
        let markers_to_delete = [];
        let markers_to_keep = new Map(); 

        if (prevProps.places.length > this.props.places.length) { 
          markers_to_delete = all_markers.slice(this.props.places.length, prevProps.places.length)
          all_markers.slice(0, this.props.length).forEach(m => markers_to_keep.set(m.place_id, 0)) // set placeholder, actual value not needed
        } 
        else if (prevProps.places.length < this.props.places.length) {
   
          let arr = all_markers.slice(0, prevProps.places.length)
          arr.forEach(m => markers_to_keep.set(m.place_id, 0)) 
        } else {
          this.clearMarkers()
        }

        // remove necesary markers
        markers_to_delete.forEach(m => m.marker.setMap(null))
        
        // update all markers ....
        this.updateMarkers(this.state.map, markers_to_keep)
      }
    }

    // update geojson
    if (this.state.map !== undefined) {
      if (this.props.data_range !== prevProps.data_range) {
        if (this.state.display_cartography)
          await this.renderCartography()
      }   
    }

    // reload subways on address change
    if (prevProps.address != this.props.address) {
      this.clearMarkers()
      this.loadListing()
  //    this.clearCartography()

    }

    // show subways on transportation change
    if (prevProps.transportation.showSubways != this.props.transportation.showSubways) {
      await this.loadNearbySubways()
      this.updatePlacesFromRedux('subway_station', 'subway station', 4)
    }


    // change business type from demo panel
    if (prevProps.business_type != this.props.business_type) {

      let defaultPlace = this.props.business_type.type
      let type = this.props.business_type.type
      let business_option = type.replace(/_/g, ' ')
      if (type == 'lodging') type = 'hotels /lodging'
      else if (defaultPlace == 'residential') {
        defaultPlace = 'establishment'
        business_option = 'all'
      }
    //  await this.setState({ business_type : type, business_type_option : business_option })
      this.clearMarkers()
      this.updateMarkers(this.state.map, new Map())
    }

    // zip cart
    if (prevProps.stats.zip !== this.props.stats.zip) {
      this.loadZipCartography()  
    }

    //TZ cart
    if (prevProps.stats.tradezone !== this.props.stats.tradezone) {
      this.loadTradeZoneCartography()
    }
  }

  loadListing = async () => {
    let res = await getListingByPlaceId(this.props.address.place.place_id)
    if (res === undefined) return;
    if (res.length > 0) {
      this.setState({ hasListing : true, listing: res[0] })
    }
  }

  onUpdateTradeZoneBounds(tradeZone_bounds) {
    this.props.onUpdateTradeZoneBounds(tradeZone_bounds)
  }

  async loadZipCartography() {
    if (this.props.address.zip == undefined) return;
      let mCartography = Object.assign({}, this.state.cartography)
      let data = [this.props.stats.zip] 
      mCartography.zip = data
        
      this.setState({cartography : mCartography, loadingCart : {...this.state.loadingCart, [ZIP]: false}})
      // init geojson rendering
      this.renderCartography()
  }
    
  async loadTradeZoneCartography() {
    // get new tz cart with bounds 
    let data =  this.props.stats.tradezone.collection 

    let mCartography = Object.assign({}, this.state.cartography)
    mCartography.tradezone = data
    await this.setState({ cartography : mCartography, cartographyLoaded : true, loadingCart : {...this.state.loadingCart, [TRADE_ZONE] : false } })
    this.renderCartography()
  }



  initCache() {
     for (let type of BUSINESS_TYPES.concat(POI_TYPES).concat(['establishment'])) {
       if (type == 'hotels /lodging') type = 'lodging'
       this.state.places_cache.set(type, new Map())
     }
  }

  clearCartography() {
    if (this.state.map)
    this.state.map.data.forEach((feature) => {
      this.state.map.data.remove(feature)
    })
  }

  renderCartography() {
    // clear data layer 
      this.clearCartography()
      // render cartography
      if (this.props.data_range == ZIP) {
        if (this.state.cartography.zip !== undefined && this.state.map) {
          this.state.cartography.zip.forEach(featureSet => this.state.map.data.addGeoJson(featureSet))
        } else {
          setTimeout(() => this.renderCartography(), 100)
        }
      } 
      else if (this.props.data_range == TRADE_ZONE) {
        if (this.state.cartography.tradezone !== undefined && this.state.map) {
          this.state.cartography.tradezone.forEach(featureSet => this.state.map.data.addGeoJson(featureSet))
       } else {
         setTimeout(() => this.renderCartography(), 100)
       }
    }
}

  async loadDefaultPlaces() {
    
    // TO-DO: get placeId with address or from autofill
    if (this.props.address.place.types.includes('establishment')) {  // get and set place for address if applicable 
      let place = this.props.address.place
      await this.setState({ addressPlace : place})
      this.getPlaceDetails(this.state.map, this.props.address.place.place_id, async (details) => {

        place.icon = details.icon
        place.name = details.name
        place.place_id = details.id
        this.state.place_details.set(place.id, details)
      })
    } 

    // await getNearby(this.props.address, this.state.business_type, (data, token) => {
   
    //   var morePlaces = this.props.places.concat(data)
    //   this.setState({places: morePlaces})
    //   for (let place of morePlaces) {
    //     if (!this.state.places_cache.get(this.state.business_type).has(place.place_id)) {
    //       this.state.places_cache.get(this.state.business_type).set(place.place_id, place)
    //     } 
    //   }
    //   this.state.tokens_cache.set(this.state.business_type, token)
    //   if (this.props.address.place.types.includes('establishment')) {  // get and set place for address if applicable 
    //     this.getPlaceDetails(this.state.map, this.props.address.place.place_id, async (details) => {
    //       let place = this.props.address.place
    //       place.icon = details.icon
    //       place.name = details.name
    //       place.place_id = details.id
    //       this.state.place_details.set(place.id, details)
    //       await this.setState({ addressPlace : place})
    //       this.onUpdatePlaces(data)
    //     })
    //   } else {
    //     this.onUpdatePlaces(data)
    //   }
    //   this.setState({ places_count : 20 })
    // })     
  }

  loadPlaceType(type, index) {

    let cached_places = Array.from(this.state.places_cache.get(type).values())
    if (cached_places.length == 0) {
      // if not cached load places
      getNearby(this.props.address, type, (data, token) => {
   //     var morePlaces = this.props.places.concat(data)

        this.setState({places: data})

        // cache loaded places
        for (let place of data) {
          if (!this.state.places_cache.get(type).has(place.place_id)) {
            this.state.places_cache.get(this.state.business_type).set(place.place_id, place)
          } 
        }
          this.state.tokens_cache.set(type, token)
          this.onUpdatePlaces(data)
        })
      // if already cached 
    } else {
      if (index == undefined) {
        this.setState({places: cached_places.slice(0, 20)})
        this.onUpdatePlaces(cached_places.slice(0,20))
      } else {
        this.setState({places: cached_places.slice(0, index)})
        this.onUpdatePlaces(cached_places.slice(0, index))
      }
    }
  }

  loadAllPlaces() {
    getNearby(this.props.address, 'establishment', (data, token) => {
      var morePlaces = this.props.places.concat(data)
      this.setState({places: morePlaces})
      this.setState({ places_count : 20 })
      this.state.tokens_cache.set('establishment', token)
      this.onUpdatePlaces(data)
    })
  }

  loadMorePlaces(index, hasCallback, callback) {
        let cached_places = Array.from(this.state.places_cache.get(this.state.business_type).values())
        if (cached_places.length > index) {
          var morePlaces = this.state.places.concat(cached_places.slice(index, index + 20))
          this.setState({places: morePlaces}, () => {
            this.onUpdatePlaces(morePlaces)
            if (hasCallback) { callback() }
          })
        } else {
        getPages(this.state.tokens_cache.get(this.state.business_type), (data, token) => {
        this.state.tokens_cache.set(this.state.business_type, token)
        var morePlaces = this.props.places.concat(data)
        for (let place of morePlaces) {
          if (!this.state.places_cache.get(this.state.business_type).has(place.place_id)) {
            this.state.places_cache.get(this.state.business_type).set(place.place_id, place)
          } 
        }
        this.setState({places: morePlaces}, () => {
          this.onUpdatePlaces(morePlaces)
          if (hasCallback) { callback() }
        })
      })
    }
  }
  
  lessPlaces() {
    if (this.props.places.length > 20) {
      var places = this.props.places
      places = places.slice(0, (places.length-20))
      this.setState({places: places})
      this.onUpdatePlaces(places)
    }
  }

  async onBusinessFormChange(event) {
  
    let type = event.target.value.replace(/ /g, '_')
    if (type == 'hotels_/lodging') type = 'lodging'
    else if (type == 'all') type = 'establishment'

    // clear places
    if (type == 'none') {
      this.setState({places_count : 0, 
        business_type_option: event.target.value,
        business_type: type,
        poi : 'none'
      }, () => this.onUpdatePlaces([]))

    } else {
      this.setState({places_count : 20, 
        business_type_option: event.target.value,
        business_type: type,
        poi : 'none'
      })
      this.clearMarkers()
      await this.loadPlaceType(type, 0)
    }
  }

  async onPoiFormChange(event) {
    let type = event.target.value.replace(/ /g, '_')
    if (type == 'hotels_/lodging') type = 'lodging'
    else if (type == 'all') type = 'establishment'

    if (type == 'none') {
        this.setState({places_count : 0, 
          poi: event.target.value,
          business_type : type,
          business_type_option : 'none'
        }, () => this.onUpdatePlaces([]))
      
    } else {
      this.setState({places_count : 20, 
        poi : event.target.value, 
        business_type : type,
        business_type_option : 'none'
      })
      this.clearMarkers()
      await this.loadPlaceType(type)
    }
  }

  updatePlacesFromRedux = async (type, display_value, index) => {
    if (type == 'hotels_/lodging') type = 'lodging'
    else if (type == 'all') type = 'establishment'

    if (type == 'none') {
        this.setState({places_count : 0, 
          poi: display_value,
          business_type : type,
          business_type_option : 'none'
        }, () => this.onUpdatePlaces([]))
      
    } else {
      this.setState({places_count : index+1, 
        poi : display_value, 
        business_type : type,
        business_type_option : 'none'
      })
      this.clearMarkers()
      await this.loadPlaceType(type, index)
    }
  }

  clearMarkers = () => {
    // clear markers 
    let updatedMarkers = new Map()
    this.state.markers.forEach((e, i) => {
       e.marker.setMap(null)
       if (i < this.props.places.length) 
          updatedMarkers.set(e.place_id, e)
    })
    this.setState({ markers: updatedMarkers})
  }


  // to do clean up & cache ffs
  onPlacesCountChange(event) {
    this.setState({places_count: event.target.value})
      switch (event.target.value) {
        case '20':
            var places = this.props.places
            places = places.slice(0, 20)
            this.setState({places: places})
            this.onUpdatePlaces(places)
            break;

        case '40':
            if (this.props.places.length < 40) {
              this.loadMorePlaces(20, false)
            } else {
              var places = this.props.places
              places = places.slice(0, 40)
              this.setState({places: places})
              this.onUpdatePlaces(places)
            }
            break;

        case '60':
            if (this.props.places.length < 40) {
              this.loadMorePlaces(20, true, ()=> {
                this.loadMorePlaces(40, false)
              })
              
            } else if (this.state.places.length == 40) {
              this.loadMorePlaces(40, false)
            }
            else {
              var places = this.props.places
              places = places.slice(0, 60)
              this.onUpdatePlaces(places)
            }
            break;
      }
  }

  onUpdatePlaces(data) {
    if (this.props.address.place.types.includes('establishment')) { // check not to add two markers id address contains place
      let updatedData = [this.state.addressPlace]
      data.map(e => {
        if (e.place_id === undefined) return
        if (e.place_id !== this.state.addressPlace.place_id)
          updatedData.push(e)
      })
      this.props.onUpdatePlaces(updatedData)
    } else 
      this.props.onUpdatePlaces(data)
  }
  
  onUpdateActivePlace(data) {
    this.props.onUpdateActivePlace(data)
  }
  onUpdateTract(data) {
    this.props.onUpdateTract(data)
  }
  getInfoContent(place) {
   return renderInfoContent.apply(this, [place])
  }

  async updateRadii() {
    const { Manhattan, Brooklyn, Queens, Bronx, Staten } = Boroughs;

    const county = await getCounty(this.props.address.zip)
      if (!county) {
          // NJ, Long Island    
          let circle1Distance = 4828 // 3 mi
          let circle2Distance = 8046 // 0.5 mi
          const circle1 = renderCircle(circle1Distance, "#ffff00", this.state.map, this.state.center) 
          const circle2 = renderCircle(circle2Distance, "#0000ff", this.state.map, this.state.center) 
          // to-do cleanup, add label
          let points = getPoints(this.state.center, 4.828, 1)
          renderComplexMarker('circle1', points[0], this.state.map, '3 mi', YELLOW_DOT_3, new google.maps.Point(60, 60))
          points = getPoints(this.state.center, 8.046, 1)
          renderComplexMarker('circle2', points[0], this.state.map, '5 mi', BLUE_DOT_5, new google.maps.Point(60, 60))
   
          // render test points
          points = getPoints(this.state.center, 4.8225, 1)
          let counter = 1
          let divisor = 10;
          let increment = 4.828 / divisor //4.828 = exact 3 miles 0.804672
                
                for (let i=1; i <= divisor; i++) {
                    points = points.concat(getPoints(this.state.center, i*increment, counter*8))
                    counter+=1
                }
  
          // render TZ pins 
          points.forEach((e, i) => {
  //          renderMarker(i, e, this.state.map, e.lat + ', ' + e.lng, GREEN_MARKER)
          })
        
          let outerRing = getPoints(this.state.center, 8, 80)
          outerRing.forEach((e,i) => {
   //        renderMarker(i, e, this.state.map, e.lat + ', ' + e.lng, RED_MARKER)
          })
        return;
    }
   

      if (county === Manhattan) {
        // WALKING
        let circle1Distance = 402 // 0.25 mi
        let circle2Distance = 804 // 0.5 mi
         const circle1 = renderCircle(circle1Distance, "#ffff00", this.state.map, this.state.center) 
         const circle2 = renderCircle(circle2Distance, "#0000ff", this.state.map, this.state.center) 
        // to-do cleanup, add label
        let points = getPoints(this.state.center, 0.402, 1)
        renderComplexMarker('circle1', points[0], this.state.map, '0.25 mi', YELLOW_DOT_25, new google.maps.Point(60, 60))
        points = getPoints(this.state.center, 0.804, 1)
        renderComplexMarker('circle2', points[0], this.state.map, '0.5 mi', BLUE_DOT_05, new google.maps.Point(60, 60))
      
        // render test points
        let divisor = 4;
        let increment = 0.35 / divisor // 0.2174799
        let counter = 1 
        for (let i=1; i <= divisor; i++) {
            points = points.concat(getPoints(this.state.center, i*increment, counter*8))
            counter+=1
        }
                
        points.forEach((e, i) => {
  //          renderMarker(i, e, this.state.map, e.lat + ', ' + e.lng, GREEN_MARKER)
        })

        let outerRing = getPoints(this.state.center, .800, 50)
        outerRing.forEach((e,i) => {
  //          renderMarker(i, e, this.state.map, e.lat + ', ' + e.lng, RED_MARKER)
        })
      
      } else  {
        // Brooklyn, Staten Island, Bronx    
        let circle1Distance = 804  // 0.5 mi
        let circle2Distance =  4828 // 3 mi
        const circle1 = renderCircle(circle1Distance, "#0000ff", this.state.map, this.state.center) 
        const circle2 = renderCircle(circle2Distance, "#ffff00", this.state.map, this.state.center) 
        // to-do cleanup, add label
        let points = getPoints(this.state.center, 0.804, 1)
        renderComplexMarker('circle1', points[0], this.state.map, '0.5 mi', BLUE_DOT_05, new google.maps.Point(60, 60))
        points = getPoints(this.state.center, 4.828, 1)
        renderComplexMarker('circle1', points[0], this.state.map, '3 mi', YELLOW_DOT_3, new google.maps.Point(60, 60))
 
        // render test points
        points = getPoints(this.state.center, 4.8225, 1)
        let counter = 1
        let divisor = 5;
        let increment = 0.8/ divisor //4.828 = exact 3 miles 0.804672
        //  0.804672km = 0.5miles
        
        for (let i=1; i <= divisor; i++) {
            points = points.concat(getPoints(this.state.center, i*increment, counter*8))
            counter+=1
        }

        points.forEach((e, i) => {
   //       renderMarker(i, e, this.state.map, e.lat + ', ' + e.lng, GREEN_MARKER)
        })
      
        let outerRing = getPoints(this.state.center, 4.828, 80)
        outerRing.forEach((e,i) => {
       //  renderMarker(i, e, this.state.map, e.lat + ', ' + e.lng, RED_MARKER)
        })
    }
  }

  onHandleCenter= () => {
    this.setState({ center : this.props.center })
    if (this.state.siteView) this.setState({siteView: false})
  }
  
  updateMapCenter(coords)  {
    this.setState({
        center: coords
    });
} 

   // markers
  updateMarkers = (map, markers_to_keep) =>  {
    let markerMap = this.state.markers
    
    
    Array.from(this.props.places).map((place, i) => {
      var id= place.place_id
      var img = ''
      var marker;
      // filter preexisting places
      if (!markers_to_keep.has(id)) { 

          if (this.props.business_type.type != 'residential' && this.props.business_type.type == this.state.business_type) {
            img = RED_MARKER
          } else {
            img = YELLOW_MARKER
          }
            marker = renderMarker(i, place.geometry.location, map, place.name, img)
            markerMap.set(id, {marker: marker, place: place})
      }
    })
  this.setState({ markers : markerMap})
  this.updateInfoWindow(map)
};

updateInfoWindow = (map) => Array.from(this.state.markers, ([key, value]) =>  {

  // to close window on exit
  value.marker.addListener('click',  () => {
       this.onUpdateActivePlace(value.place)
        this.updatePlaceDetails(() => {
          infoWindow.setContent(ReactDOMServer.renderToStaticMarkup(this.getInfoContent(value.place)))
          infoWindow.marker = value
          infoWindow.open(map, value.marker) 
        });
       })
});

updatePlaceDetails(callback) {

  // get details
  if (!this.state.place_details.has(this.props.active_place.place_id)) {
    this.getPlaceDetails(this.state.map, this.props.active_place.place_id, (details) => {
      this.state.place_details.set(this.props.active_place.place_id, details)

         // get photo
    if (!this.state.place_photos.has(this.props.active_place.place_id)) {
      if (this.props.active_place.photos !== undefined) {
       getPhoto(this.props.active_place.photos[0].photo_reference, 400, 400, (data) => {
        this.state.place_photos.set(this.props.active_place.place_id, data.url)
        callback()
      })
      } else {
        callback()
      }
    }
    })
  } else {
    callback()
  }
};

getPlaceDetails = (map, place_id, callback) => {
  var service = new google.maps.places.PlacesService(map);
  var request = {
    placeId: place_id,
    fields: ['id', 'name', 'icon', 'formatted_address', 'website']
  };
  
     // get details
    service.getDetails(request, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        callback(place)
      } else {
        console.error('error', status)
      }
    });
};

getOpen = (opening_hours) => {
  if (opening_hours === undefined)
    return 'Unknown'
  else {
    let answer = (opening_hours.is_open) ? "Yes" : "No"
    return answer
  }
};

updateMarker = (marker) => {
  if (marker == undefined) 
    return; 

  var img = ''
  if (marker.place.place_id == this.props.address.place.place_id) {
    img = BLUE_MARKER
  }
  else if (marker.place_id === this.props.active_place.place_id) {
    img = GREEN_MARKER
  } else if (this.props.business_type.type != 'residential' && this.props.business_type.type == this.state.business_type){
    img = RED_MARKER
  } else {
    img = YELLOW_MARKER
  }
  marker.marker.setIcon(img)
};

handleSwitch = (checked) => {
  if (checked) {
    this.renderCartography()
  } else {
    this.clearCartography()
  }
};

onHandleSite = (checked) => {
  if (checked) {
    this.setState({ siteView : true})
  } else {
    this.setState({ siteView : false})
  }
};

handleChange = (event) => {
  this.setState({ center : event.center})
};

// subways 
onUpdateTransportation = async (transportation) => {
  this.props.onUpdateTransportation(transportation)
};

loadNearbySubways = async () => {
  let type = 'subway_station'
  getNearby(this.props.address, type, async (data, token) => {
      // cache loaded places
      for (let place of data) {
        if (!this.state.places_cache.get(type).has(place.place_id)) {
          this.state.places_cache.get(type).set(place.place_id, place)
        } 
      }
      this.state.tokens_cache.set(type, token)
      let subwayCoords = []
      Array.from(this.state.places_cache.get(type).entries()).map(([key, value], i) => {
        if ( i > 4) return;
        subwayCoords.push(value.geometry.location)
      })
      
      let subway_data = await getSubwayTotals(subwayCoords)
      // Calculate distance //////
      subway_data.forEach(e => {
        let dist= distance(this.props.address.coords.lat, this.props.address.coords.lng,
          e.data.G_LAT, e.data.G_LNG)
          e.distance = dist
      })

      subway_data.sort((x, y) => {
        if (x.distance < y.distance) {
          return -1;
        }
        if (x.distance > y.distance) {
          return 1;
        }
        return 0;
      })
      
        let transportObj = JSON.parse(JSON.stringify(this.props.transportation))
        if (transportObj == '') { transportObj = {}}
    
        // clean up subway data
        let subwayMap = new Map()
        for (let i=0; i< subway_data.length; i++) {
          if (!subwayMap.has(subway_data[i].name)) {
            subwayMap.set(subway_data[i].name, subway_data[i].data)
          } else {
            // check if values are equal, if so arggregate to one location
            if (subwayMap.get(subway_data[i].name).G_TOTAL_ENT == subway_data[i].data.G_TOTAL_ENT) {
              subwayMap.set(subway_data[i].name, 
                {...subwayMap.get(subway_data[i].name), 
                  G_LINES : subwayMap.get(subway_data[i].name).G_LINES +'-'+ subway_data[i].data.G_LINES 
                })
            }
          }
        }
        transportObj.subways = subwayMap
        await this.onUpdateTransportation(transportObj)

    })       
};

generateHeading = () => {
  var sv = new google.maps.StreetViewService();
 // initialize a new panorama API object and point to the element with ID streetview as container
 var panorama = new  google.maps.StreetViewPanorama(document.getElementById('pano'), {position: this.props.center});

    sv.getPanorama({
        location: this.props.center,
        radius: 50
    }, (data, status) => {
      if (status === google.maps.StreetViewStatus.OK) {
  
          var marker_pano = new google.maps.Marker({
              position: this.props.center,
              map: panorama
          });
  
          var heading = google.maps.geometry.spherical.computeHeading(data.location.latLng, marker_pano.getPosition());
  
          panorama.setPov({
              heading: heading,
              pitch: 0
          });
          this.setState({heading: heading})
      }
  });
}

// navigate to listing view
navigateToListing = () => {
  let url = '/listing/' + this.state.listing.listingId
  this.props.history.push(url)
}

openToolBar = () => {
  this.setState({ toolsOpen : !this.state.toolsOpen })
}

  render() {
    const apiIsLoaded = (map, maps, center) => {
      this.state.map = map
  //    if (!this.props.address.place.types.includes('establishment')) {
        let yourBusinessMarker = renderMarker('your_business', center, map, 'Your Business', BLUE_MARKER)
        yourBusinessMarker.setZIndex(9999)
        const content = '<h3>Your Location</h3>'
   //     var content ='<h3>Your ' + this.props.business_type.type.toString() +'</h3>'
          yourBusinessMarker.addListener('click', () => {
            infoWindow.setContent(content)
            infoWindow.open(map, yourBusinessMarker)
            infoWindow.marker = yourBusinessMarker
        })
//     }
      this.updateRadii()

      this.generateHeading()
      this.loadDefaultPlaces()
     // this.loadNearbySubways()
    }

    // const resultsDropDown = <div>
    //   <span style={{ color: 'whitesmoke'}}> Results</span>
    //   <Form.Control value={this.state.places_count} as="select" name="places_count" onChange={this.onPlacesCountChange}>
    //                 <option>20</option>
    //                 <option>40</option>
    //                 <option>60</option>
    //   </Form.Control>
    // </div>

  const MapButtons = () => 
    
    <div className='map-control_bar'>
      <div className="rowOne">
        <Button className="toolbar_button" onClick={this.props.runJoyRideTutorial}>?</Button>
        <Button className="toolbar_button" variant="light" onClick={this.onHandleCenter}>Ctr</Button>
          
        <div className="switch_container">
            <span>Street</span>
            <SliderSwitch checked={this.state.siteView} switchFunction={this.onHandleSite}></SliderSwitch>
        </div>
        <div className="switch_container">
          <span>Overlay</span>
          <SliderSwitch checked={true} switchFunction={this.handleSwitch}></SliderSwitch>
        </div>
      </div>
        <div className="place_dropdown_container">
          <div>
            <span> Other Businesses</span>
            <Form.Control value={this.state.business_type_option} as="select" name="business_type" onChange={this.onBusinessFormChange}>
                          <option>none</option>
                          <option>all</option>
                        {BUSINESS_TYPES.map((e, i) => {
                          if (e != 'residential') {
                              return <option  key={i}>{e.replace(/_/g, ' ')}</option>
                          }
                        })}
            </Form.Control>
          </div>
          <div>
            <span>Places of Interest</span>
            <Form.Control value={this.state.poi} as="select" name="poi" onChange={this.onPoiFormChange}>
                        <option>none</option>
                        <option>all</option>
                        {POI_TYPES.map((e, i) => {
                          return <option key={i}>{e.replace(/_/g, ' ')}</option>
                        })}
            </Form.Control>
          </div>
        </div>
    </div>


    // init street view only after heading is calculated
    let streetViewContainer = <></>
    const streetView =  <ReactStreetview
    ref={this.streetView}
    apiKey={GOOGLE_KEY}
    streetViewPanoramaOptions={{
      position: {lat: this.props.center.lat, lng: this.props.center.lng},
      pov: {heading: this.state.heading, pitch: 0},
      zoom: 1,
      source: google.maps.StreetViewSource.OUTDOOR
    }}
    width={'400px'}
    height={'400px'}
  />;

    if (this.state.heading != undefined) {
      streetViewContainer = streetView;
  }

  const MapBundle = <div className="googleMap_container">
        <GoogleMapReact
          ref={this.myRef}
            bootstrapURLKeys={{ key: GOOGLE_KEY}}
            center={this.state.center}
            zoom={this.state.zoom}
            yesIWantToUseGoogleMapApiInternals={true}
            layerTypes={['TrafficLayer', 'TransitLayer']}
            id={'map'}
            onGoogleApiLoaded={({ map, maps }) => apiIsLoaded(map, maps, this.state.center)}
            options= {this.state.mapOptions}
            resetBoundsOnResize = {true}
            onChange={this.handleChange}
          />
        {this.state.siteView && 
        <div className="streetView_container">
          {streetViewContainer}
        </div>}
        {this.state.loadingCart[this.props.data_range] == true && 
          <div className="fade_container">
            <FadeLoader color='#123abc' size={10}/>
            <span>Loading Overlay</span>
          </div>
        }
  </div>

    return (
      <div className='map_container'>

        <MediaQuery minDeviceWidth={551}><MapButtons/></MediaQuery>
        <MediaQuery maxDeviceWidth={550}>
          <Toolbar openToolBar={this.openToolBar}/>
          {this.state.toolsOpen && <MapButtons/>}
        </MediaQuery>

          {this.state.hasListing && 
            <button className="listingBanner" onClick={this.navigateToListing}>
              <div>
                <span style={{ color: 'black'}}>This location has a listing, click </span> <span style={{ color : "blue"}}>here</span> <span style={{ color: 'black'}}> for details</span>
              </div>
            </button>
          }

         <MediaQuery maxDeviceWidth={550}>    
            {this.state.hasListing &&  <div style={{height: window.innerHeight - 86 - 32 }}>
                  {MapBundle}
              </div>
            }
            {!this.state.hasListing &&  <div style={{height: window.innerHeight - 86 }}>
                {MapBundle}
              </div>
            } 
         </MediaQuery>

         <MediaQuery minDeviceWidth={551}>
            <div style={{height:  (this.state.hasListing) ? `calc(${this.props.height} - 32px)` : this.props.height }}>     
              {MapBundle}
            </div>
         </MediaQuery>
        
        <MediaQuery maxDeviceWidth={550}>
           
          <DemographicsPanel 
             business_type={this.props.business_type} 
             street = {this.props.address.street}
             city = {this.props.address.city}
             state = {this.props.address.state}
             zip = {this.props.address.zip}
             lat = {this.props.address.coords.lat}
             lng = {this.props.address.coords.lng}
             getHelpers={this.getHelpers}
             orientation = {"demographics-list-vertical "}>
           </DemographicsPanel>

           <PlacesList/>
           <ChartsPanel />
          <div className="extrasContainer">
            <TransportationPanel/>
            {/* <CommentsPanel/> */}
          </div>
        </MediaQuery>
      </div>
    );
  }
}


const mapStateToProps = createSelector(
  placesSelector, 
  activeSelector,
  addressSelector,
  businessTypeSelector,
  zipSelector,
  stateSelector,
  tractSelector,
  dataRangeSelector,
  isCitySelector,
  tradeZoneBoundsSelector,
  transportationSelector, 
  geoUnitSelector,
  statsSelector,
  (places, active_place, address, business_type, zip, state, tract, data_range, isCity, tradeZone_bounds, transportation, geo_unit, stats) => ({
    places, 
    active_place,
    address,
    business_type,
    zip,
    state, 
    tract,
    data_range,
    isCity,
    tradeZone_bounds,
    transportation,
    geo_unit,
    stats
  })
);
 
const mapActionsToProps = {
  onUpdatePlaces: updatePlaces,
  onUpdateActivePlace: updateActivePlace,
  onUpdateTract: updateTract,
  onUpdateTradeZoneBounds: updateTradeZoneBounds,
  onUpdateTransportation: updateTransportation
};

export default withRouter(connect(mapStateToProps, mapActionsToProps) (SimpleMap));


function distance(lat1, lon1, lat2, lon2, unit) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
		if (unit=="N") { dist = dist * 0.8684 }
		return dist;
	}
}