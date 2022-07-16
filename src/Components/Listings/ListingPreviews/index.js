import React, { useState, useEffect}  from 'react'
import { connect } from 'react-redux'
import { createSelector } from 'reselect';
import * as selectors from '../../../Reducers/selectors'
import '../../../css/listingView.scss';
import { Link, withRouter } from 'react-router-dom'
import { getRecents } from '../../../Requests/listings-requests'
import MultiSlideshow from "./MultipleSlideShow"
import { useMediaQuery } from 'react-responsive'

const S3_BASE = "https://landmarkbucket2.s3.amazonaws.com/"
const darkBg = 'rgb(26,28,41)'
const lightBg = 'rgb(31,33,48)'
const textPrimary = 'whitesmoke'

function ListingsBrowse() {

    const [listings, setListings] = useState([])
    const isMobile = useMediaQuery({
        query: '(max-width:551px)'
    })
    const setSize = (isMobile) ? 1 : 3

    useEffect(() => {
        const init = async () => {
            let data = await getRecents()
            let triplets = [[]]
            let tripletIndex = 0
    
            if (data === undefined) return;
 
            //set at 9 most recent
            let i=0;
            while ( i < 9 && i < data.length) {
                if (triplets[tripletIndex].length === setSize) {
                    tripletIndex += 1
                    triplets.push([])
                }
    
                triplets[tripletIndex].push(data[i]) 
                i += 1;
            }
   
            setListings(triplets)
        }
        
        init()
    }, [])


    return (
            <div style={{  width: '100%', height: '80%',  display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <div id="previewHeader" style={{ width: '100%', backgroundColor: lightBg, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <h3  style={{ color: 'white', textAlign: 'left', paddingTop: '0.5em', paddingLeft: '0.5em'}}>Recent Listings</h3>
                    <Link to="listings/browse" style={{textDecorationLine: 'underline', color: 'white'}}> <h3  style={{ color: 'white', textAlign: 'left', paddingTop: '0.5em', paddingRight: '0.5em'}}>See more...</h3></Link>
                </div>
                <MultiSlideshow width={'100%'} height={'400px'} data={listings}/>  
            </div>
       )
    }

 
 const mapStateToProps = createSelector(
     selectors.addressSelector,
     selectors.userSelector,
    (address, user) => ({
        address, user 
    })
 )

 const capitalizeFirst = value => {
    return value.substring(0,1).toUpperCase() + value.substring(1, value.length)
 }

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


 export default withRouter(connect(mapStateToProps)(ListingsBrowse))



 /**
  * 
        const getUrl = () => {
            let address = encodeURI(JSON.stringify(this.state.listingData.location.formatted))
            let business_type = "restaurant"
            let url = '/' + address + '/' + business_type
            return url
        }
  */
