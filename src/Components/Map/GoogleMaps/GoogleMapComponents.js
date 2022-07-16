import { google } from '../../../Constants.js'
import React from 'react';

export const renderCircle = (radius, color, map, center) => new google.maps.Circle({
    strokeColor: color,
    strokeOpacity: 0.5,
    strokeWeight: 4,
    fillColor: "#00ff00",
    fillOpacity: 0.0,
    map: map,
    center: center,
    radius: radius
  });

export const renderMarker = (key, position, map, title, icon, label) =>  new google.maps.Marker({
    key: key,
    position: position,
    map: map,
    animation: google.maps.Animation.DROP,
    title: title,
    icon: icon,
    labelContent : label,
  });


  export const renderLargeMarker = (key, position, map, title, icon, anchor, label) =>  new google.maps.Marker({
    key: key,
    position: position,
    map: map,
    title: title,
    icon: {
      url: icon,
      scaledSize: new google.maps.Size(40, 40),
      anchor : new google.maps.Point(0, 50)
    },
    labelContent : label
  });



  export const renderComplexMarker = (key, position, map, title, icon, anchor, label) =>  new google.maps.Marker({
    key: key,
    position: position,
    map: map,
    title: title,
    icon: {
      url: icon,
      scaledSize: new google.maps.Size(120, 120),
      anchor : anchor
    },
    labelContent : label
  });

export function renderInfoContent(place) {
  var details = this.state.place_details.get(place.place_id)
  var photo_url = this.state.place_photos.get(place.place_id)
  let header;
  let icon;
  if (place.place_id == this.props.address.place.place_id) {
    header = <h3>Your Location</h3>
  } 
  let price;
    if (place.price_level != undefined) {
      price = place.price_level + ' / 4'
    } else {
      price = 'Unavailable'
    }
  
  return (
  <div id="content">
    <div id="siteNotice">
    </div>
      {header}
      <h3 style={{textAlign: 'center'}}>{place.name}</h3>
      <br></br>
      <img style={{display: 'block',  marginRight: 'auto', marginLeft: 'auto', width: '50%'}}src={photo_url}></img> 
      <br></br>
      <div id="bodyContent">
        <p style={{textAlign: 'center'}}><strong>{details.formatted_address}</strong></p>
        <p><a target="_blank" href={details.website}>{details.website}</a></p>
        {/* <p>
          Price: {price}
          <br></br>
          Rating: {place.rating} / 5.0
          <br></br>
          Total Ratings: {place.user_ratings_total}
          <br></br>
          Open Now: {this.getOpen(place.opening_hours)}
        </p> */}
    </div>
  </div>
  )
}

export const BLUE_MARKER = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
export const YELLOW_MARKER = 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
export const RED_MARKER = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
export const GREEN_MARKER = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
export const YELLOW_DOT_25 = "https://mcphersondev.com/landmark/project%20landmark%20icons%20black-03.png"
export const YELLOW_DOT_3 = 'https://mcphersondev.com/landmark/project%20landmark%20icons%20black-06.png'
export const BLUE_DOT_05 = "http://mcphersondev.com/landmark/project%20landmark%20icons-11.png"
export const BLUE_DOT_5 = 'https://mcphersondev.com/landmark/project%20landmark%20icons-12.png'
