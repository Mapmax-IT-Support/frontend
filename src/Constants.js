export const API ='https://mapmax-it-support.github.io/backend/'
export const URL = 'https://mapmax-it-support.github.io/'

//export const API = 'http://localhost:8080/'
//export const URL = 'http://localhost:3000/#'


export const GOOGLE_KEY = 'AIzaSyC9E4iWpRUJxljL3sHTiciL--ukdb_ByrI'
 export const google = window.google; 
 export const GOOGLE_SECRET = 'lpkXmFKRjuqOM9YXgLIrGRlPWIA=';


export const S3_BASE = "http://mapmax.online.s3-website-us-east-1.amazonaws.com"

 export const mapOptions =  {
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
};

export const BUSINESS_TYPES = [
  'none',
  'accounting',
  'art_gallery',
  'bakery',
  'bank',
  'bar',
  'beauty_salon',
  'bicycle_store',
  'book_store',
  'bowling_alley',
  'cafe',
  'car_dealer',
  'car_rental',
  'car_repair',
  'car_wash',
  'clothing_store',
  'convenience_store',
  'dentist',
  'department_store',
  'doctor',
  'drugstore',
  'electrician',
  'electronics_store',
  'florist',
  'funeral_home',
  'furniture_store',
  'gas_station',
  'gym',
  'hardware_store',
  'home_goods_store',
  'hotels /lodging',
  'insurance_agency',
  'jewelry_store',
  'laundry',
  'lawyer',
  'liquor_store',
  'locksmith',
  'movie_rental',
  'movie_theater',
  'moving_company',
  'night_club',
  'painter',
  'pet_store',
  'pharmacy',
  'physiotherapist',
  'plumber',
  'real_estate_agency',
  'residential',
  'restaurant',
  'roofing_contractor',
  'shoe_store',
  'spa',
  'storage',
  'supermarket',
  'travel_agency',
  'veterinary_care'
]

export const POI_TYPES = [
  'airport',
  'amusement_park',
  'aquarium',
  'atm',
  'bus_station',
  'campground',
  'casino',
  'cemetery',
  'church',
  'city_hall',
  'courthouse',
  'fire_station',
  'hindu_temple',
  'hospital',
  'library',
  'light_rail_station',
  'mosque',
  'museum',
  'park',
  'parking',
  'police',
  'post_office',
  'school',
  'shopping_mall',
  'stadium',
  'subway_station',
  'synagogue',
  'taxi_stand',
  'tourist_attraction',
  'train_station',
  'transit_station',
  'university',
  'zoo'

]