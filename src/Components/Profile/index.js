import React  from 'react'
import { connect } from 'react-redux'
import { createSelector } from 'reselect';
import * as selectors from '../../Reducers/selectors'
import Button from 'react-bootstrap/Button'
import RecentSearches from './RecentSearches';
import MyListings from './MyListings'
import UserProfile from './UserProfile'
import { getListingByUserId } from '../../Requests/listings-requests'

class Profile extends React.Component {

    constructor(props) {
        super(props)
       
        this.state = {
            searches: [],
            body: '',
            index : 0,
            listings: [],
            loadingListings : true,
            user_id : ''
        }
    }

    async componentDidMount() {
        const user_id = this.props.user._id
        const searches = localStorage.getItem('recentSearches')
        if (searches !== null) {
            this.setState({ searches : JSON.parse(searches)})
        }
 
        //check if userid set in props, if not look in local storage
        if (user_id === undefined) {
            let user = localStorage.getItem('user')

            if (user !== undefined) {
                user_id = JSON.parse(user)._id
            }
            else return;
        }

        this.setState({ user_id : user_id})
        let res = await getListingByUserId(user_id)
        console.log('userID', user_id, res)
        this.setState({ listings : res, loadingListings : false })

    }    

    handleChange = e => {
        this.setState({body: e.target.value})
    }

    handleDeleteListing = async (id) => {

        let listings = this.state.listings.filter((listing) => {
            return listing.listingId != id
        })

        await this.setState({ listings : listings })
    }

    render() {
    
        return (
            <div className="profilePageContainer">
                 <UserProfile user={this.props.user} user_id={this.state.user_id}/>
                 <div className="profileItemsContainer">
                     <div className="tabsContainer">
                        <Button className="tabButton" style={{ fontWeight: (this.state.index == 0) ? 'bold' : 'normal'}} 
                        variant={(this.state.index == 0) ? "primary" : "secondary"} onClick={() => this.setState({ index : 0})}>Recent Searches</Button>

                        <Button className="tabButton" style={{ fontWeight: (this.state.index == 1) ? 'bold' : 'normal'}}
                         variant={(this.state.index == 1) ? "primary" : "secondary"} onClick={() => this.setState({ index : 1})}>My Listings</Button>
                     </div>
                        {this.state.index == 0 && <RecentSearches/>}
                        {this.state.index == 1 && <MyListings listings={this.state.listings} loading={this.state.loadingListings} handleDeleteListing={this.handleDeleteListing}/>}
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


 export default connect(mapStateToProps)(Profile)