import React  from 'react'
import { connect } from 'react-redux'
import { createSelector } from 'reselect';
import * as selectors from '../../Reducers/selectors'
import GridLoader from '../UI/GridLoader'
import ListingItem from './MyListingItem'


class RecentSearches extends React.Component {

    constructor(props) {
        super(props)
       
        this.state = {
            loading : true,
            body: '',
            listings : []
        }
    }

    render() {
        const { listings, loading, handleDeleteListing } = this.props

        return (
            <div className="my-listings-container">
                {this.props.loading &&  <div className="loadingContainer"> 
                    <GridLoader color={"#0892d0"}/> 
                </div>}
                {!loading && 
                    listings.map((listing, i) =>  {
                        return (
                            <ListingItem listing={listing} index={i} handleDeleteListing={handleDeleteListing}/>
                        )
                    })
                }
                {!loading && listings.length == 0 &&  <p>You currently do not have any listings.</p>}
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

 export default connect(mapStateToProps)(RecentSearches)