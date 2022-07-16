import React from 'react';
import GoogleMapReact from 'google-map-react';

export const GoogleMap = () => 
    <div style={{height: '75vh'}}>
        <GoogleMapReact
          options={mapOptions}
          bootstrapURLKeys={{ key: GOOGLE_KEY}}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
          center={this.state.center}
          yesIWantToUseGoogleMapApiInternals={true}
          layerTypes={['TrafficLayer', 'TransitLayer']}
          id={'map'}
          onGoogleApiLoaded={({ map, maps }) => apiIsLoaded(map, maps, this.state.center)}
        >
        </GoogleMapReact>
      </div>
