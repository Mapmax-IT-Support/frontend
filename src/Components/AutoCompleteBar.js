import React from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';
import { updateAddress} from '../Actions/address-actions'
import { updateBusinessType} from '../Actions/business-actions'
import { updateZip } from '../Actions/zip-actions'
import { updateState } from '../Actions/state-actions'
import { connect } from 'react-redux'
import { createSelector } from 'reselect';
import * as selectors from '../Reducers/selectors'

class AutoCompleteBar extends React.Component {
  constructor(props) {
    super(props);
    let address = ''

    if (this.props.urlParams != undefined) {
       address = JSON.parse(this.props.urlParams.address)
    }
    this.state = { address: address};
    this.handleChange = this.handleChange.bind(this)
    this.onUpdateAddress = this.onUpdateAddress.bind(this)
  }

  handleChange = address => {
    this.setState({ address });
  };

  handleSelect = async address => {
    this.handleChange(address)
    //  this.onUpdateAddress(addressState)
    this.props.addressFunction(address)
  };

  onUpdateAddress(address) {
    this.props.onUpdateAddress(address)
  }

  render() {

    const customStyle= { 
      position: this.props.position, 
      width: '100%',
      height: '50px',
      marginTop: this.props.marginTop, 
      color: 'black', 
      zIndex: 999999,
    }

    return (
      <PlacesAutocomplete
        value={this.state.address}
        onChange={this.handleChange}
        onSelect={this.handleSelect}          
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div className="autoCompleteContainer">
            <input className="autoCompleteInput" style= {{  width: '100%', height: '35px', borderRadius: 8, fontSize: (this.props.fontSize == undefined) ? 22 : this.props.fontSize}}
              {...getInputProps({
                placeholder: 'Search Places ...',
                className: 'location-search-input',
              })}
            />
            {suggestions.length > 0 && <div style={customStyle}>
              {loading && <div>Loading...</div>}
              {suggestions.map(suggestion => {
                const className = suggestion.active
                  ? 'suggestion-item--active'
                  : 'suggestion-item';

                // inline style for demonstration purpose
                const defaultStyle = {cursor: 'pointer', width: '100%', marginLeft: '.5em', color: 'black' }
                const style = suggestion.active
                  ? {...defaultStyle, backgroundColor: 'whitesmoke'  }
                  : {...defaultStyle, backgroundColor: '#fafafa' };
                  
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                  >
                    <span style={{ color: 'black'}}>{suggestion.description}</span>
                  </div>
                );
              })}
            </div> }
          </div>
        )}
      </PlacesAutocomplete>
    );
  }
}

const mapStateToProps = createSelector(
    selectors.addressSelector,
    selectors.businessTypeSelector,
    selectors.zipSelector,
    selectors.stateSelector,
    (address, business_type, zip, state) => ({
        address,
        business_type,
        zip,
        state
    })
);

const mapActionsToProps = {
     onUpdateAddress: updateAddress,
     onUpdateBusinessType: updateBusinessType,
     onUpdateZip: updateZip,
     onUpdateState: updateState
};

export default connect(mapStateToProps, mapActionsToProps) (AutoCompleteBar);