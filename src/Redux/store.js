import { applyMiddleware, compose, createStore, combineReducers} from 'redux';
import userReducer from '../Reducers/user-reducer'
import addressReducer from '../Reducers/address-reducer'
import placesReducer from '../Reducers/places-reducers'
import activeReducer from '../Reducers/active-reducer'
import thunk from 'redux-thunk';
import businessReducer from '../Reducers/business-reducer';
import zipReducer from '../Reducers/zip-reducer';
import stateReducer from '../Reducers/state-reducer'
import tractReducer from '../Reducers/tract-reducer'
import dataRangeReducer from '../Reducers/dataRange-reducer'
import readyReducer from '../Reducers/ready-reducer'
import isCityReducer from '../Reducers/isCity-reducer'
import tradeZoneBoundsReducer from '../Reducers/tradeZoneBounds-reducer'
import statsReducer from '../Reducers/stats-reducer'
import { ZIP } from  '../Components/Map/Panels/DemographicsPanel'
import { CLEAR_DATA } from '../Actions/root-actions'
import transportationReducer from '../Reducers/transportation-reducer'
import geoUnitReducer from '../Reducers/geoUnit-reducer'

const allReducers = combineReducers({
    user: userReducer,
    address: addressReducer,
    places: placesReducer,
    business_type: businessReducer,
    active_place: activeReducer,
    zip: zipReducer,
    state: stateReducer,
    tract: tractReducer,
    data_range: dataRangeReducer,
    ready: readyReducer,
    isCity : isCityReducer,
    tradeZone_bounds : tradeZoneBoundsReducer,
    stats : statsReducer,
    transportation: transportationReducer,
    geo_unit : geoUnitReducer
});

export const rootReducer = (state, action) => {
    if (action.type === CLEAR_DATA) {
      state = undefined
    }
    return allReducers(state, action)
  }

const allStoreEnhancers = compose(
    applyMiddleware(thunk),
//    window.devToolsExtension && window.devToolsExtension()
);

const localStorageUser = JSON.parse(localStorage.getItem('user'))
const user = (localStorageUser === null)
     ? {_id: -1, username: 'guest', is_admin: false}
     : localStorageUser

const store = createStore(
    rootReducer, 
    {
    user: user,
    address: undefined,
    places: [],
    business_type: 'none',
    active_place: undefined,
    state: undefined,
    zip: undefined,
    tract: undefined,
    data_range: ZIP,
    ready: false,
    isCity: false,
    tradeZone_bounds: [],
    geo_unit : 'zip',
    stats : {
        zip: undefined,
        tradezone: undefined
    },
    transportation: undefined
    },
   
    allStoreEnhancers
    );

console.log("store init state: ", store.getState())

export default store;