import React from 'react'
import NavigationBar from './Navigation/NavigationBar'
import LookUpForm from './Home/LookUpForm'
import DemographicsPanel from './Map/Panels/DemographicsPanel'
import { connect } from 'react-redux'
import Map from './Map'
import PlacesList from './Map/Panels/PlacesList'
import * as selectors from '../Reducers/selectors'
import { createSelector } from 'reselect';
import ChartsPanel from './Map/Panels/ChartsPanel'
import { Route, Switch } from 'react-router-dom';
import Login from './Login'
import Register from './Login/Register'
import CommentsPanel from './Map/Panels/CommentsPanel'
import { updateAddress } from '../Actions/address-actions';
import TransportationPanel from './Map/Panels/TransportationPanel'
import Footer from './Navigation/Footer'
import white_smaple from '../images/logo/landmark_logo_spiral_white.png'
import logo_full from '../images/logo/landmark_logo_full_white.png'
import Image from 'react-bootstrap/Image'
import Joyride, {  STATUS }  from 'react-joyride';
import { updateUser } from '../Actions/user-actions';
import { setRecentSearches, getUserInfo } from '../Requests/users-requests' 
import Profile from './Profile'
import AddListing from './Listings/AddListing'
import ListingView from './Listings/ListingView'
import ListingsPreviews from './Listings/ListingPreviews'
import ListingsBrowse from './Listings/ListingsBrowse'
import Cookies from 'universal-cookie';
import About from './About'
import MediaQuery from 'react-responsive'
import { steps, mobileSteps } from './Map/JoyRideSteps'
import { hasSubways } from '../Helpers/Subways'
import ShareModal from './ShareModal'

const darkBg = 'rgb(26,28,41)'
const cookies = new Cookies();

class App extends React.Component { 

  constructor(props) {
    super(props) 
    this.onUpdateAddress = this.onUpdateAddress.bind(this)
    
    this.state = {
      searches : [],
      isFirstTimeUser : false,
      run: false,
    }
  }

  async componentDidMount() {
  //  localStorage.clear() for testing
    const { user } = this.props
    let userInfo;

    if (user._id !== -1) {
      // get user from local storage
      userInfo = await getUserInfo(user._id)
      if (userInfo.res[0]?.recentSearches?.length > 0) {
        await this.setState({ searches : userInfo.res[0].searches})
        localStorage.setItem('recentSearches', JSON.stringify(userInfo.res[0].recentSearches))
      }
    }
    if (cookies.get('hasLoggedIn') == undefined && user._id == -1 ) {
      this.setState({ isFirstTimeUser : true  })
      cookies.set('hasLoggedIn', 1, { path: '/', expires : new Date('2200-12-1T03:24:00')})
     } 
     else {
      this.setState({ isFirstTimeUser : false  })
     }

    // check if local storage has changes and update server on interval
    setInterval(async () => {
      this.checkSearches()
    }, 10000);
  }

  checkSearches = async () => {
    // push recent searches
    if (this.props.user._id != -1) {
      let searches = localStorage.getItem('recentSearches')

      if (searches != null) {
        if (searches != this.state.searches) {
           this.setState({ searches : searches}) 
          
          searches = JSON.parse(searches)
          await setRecentSearches(this.props.user._id, searches)
        }
      } 
    }
  }

  onUpdateUser = (user) => {
    this.props.onUpdateUser(user)
  }

  onUpdateAddress = (address) => {
    this.props.onUpdateAddress(address)
  }
  runJoyRideTutorial = () => {
    this.setState({run: true, isFirstTimeUser : false})
  }

  handleJoyrideCallback = (data) => {
    const { status, action, index } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];
    
    if (action === 'update' && index === 4) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
    })
    }
    if (finishedStatuses.includes(status)) {
      this.setState({ run: false });
    }
  }

  getHelpers = (helpers) => {
    this.helpers = helpers;
  };

  updateIsFirstTime = flag => {
    this.setState({ isFirstTimeUser : flag })
  }

  render() {
    const { address } = this.props

    let availHeight = window.screen.availHeight - 170 - 40;

    if (this.props.ready) {
    
      var map = <div>
        <div className="results-container">   
          <div className="demographicsWrappper">
            <DemographicsPanel 
              address={this.props.address} 
              business_type={this.props.business_type} 
              getHelpers={this.getHelpers}
              orientation = {"demographics-list-vertical "}>
            </DemographicsPanel>
          </div>
          <Map 
            runJoyRideTutorial={this.runJoyRideTutorial} 
            height={'72.2vh'} 
            address={this.props.address} 
            center={this.props.address.coords} 
            zoom={15} 
            business_type={this.props.business_type} 
            isFirstTimeUser={this.state.isFirstTimeUser}
            updateIsFirstTime={this.updateIsFirstTime}
            />
          <div className="placesListWrapper">
            <PlacesList/>
          </div>
          </div>          <br></br>
          <ChartsPanel/>
          <div className="transportationWrapper">
            {hasSubways(address.zip) && <TransportationPanel/> }
          </div>
          {/* <div className="commentsWrapper">
            <CommentsPanel/>
          </div> */}
        </div>

        var mobile_map = <div className="mob_map_dashboard">
          <Map 
            runJoyRideTutorial={this.runJoyRideTutorial} 
            height={availHeight}
            address={this.props.address} 
            center={this.props.address.coords} 
            zoom={15} 
            business_type={this.props.business_type} 
            isFirstTimeUser={this.state.isFirstTimeUser}
            updateIsFirstTime={this.updateIsFirstTime}
            />
         </div>
    }
    return (
      <div>
        <Switch>
        <Route
           path={'/login'}
          render={(({match}) => {
            return <div>
                <NavigationBar urlParams={match.params}/>
                <div className="App">
                <header className="App-header">
                  <Login/>
                </header>
              </div>
            </div>
          })}>
        </Route>
        <Route
            path={'/register'}
          render={(({match}) => {
            return <div>
                <NavigationBar urlParams={match.params}/>
                <div className="App">
                <header className="App-header">
                  <Register/>
                </header>
              </div>
            </div>
          })}>
        </Route>
        <Route
            path={'/profile'}
          render={(({match}) => {
            return <div>
                <NavigationBar urlParams={match.params}/>
                <div className="App">
                <header className="App-header">
                  <Profile />
                </header>
              </div>
            </div>
          })}>
        </Route>
        <Route
          exact path={'/listings/browse'}
          render={(({match}) => {
            return <div>
                <NavigationBar  urlParams={match.params}/>
                <div className="App">
                  <ListingsBrowse />
              </div>
            </div>
          })}>
        </Route>
        <Route
          exact path={'/listing/:listingId'}
          render={(({match}) => {
            return <div>
                <NavigationBar displaySearchBar={true} />
                <div className="App">
                  <ListingView  urlParams={match.params}/>
                </div>
            </div>
          })}>
        </Route>
        <Route
            path={'/addlisting/:listingId?'}
          render={(({match}) => {
            return <div>
                <NavigationBar urlParams={match.params}/>
                <div className="App" >
                  <AddListing urlParams={match.params} />
              </div>
            </div>
          })}>
        </Route>
        <Route
          path={'/:address/:business_type'}
          render={(({match}) => {
            return <div className="App" style={{backgroundColor: darkBg}}>
              <NavigationBar displaySearchBar={true} urlParams={match.params}/>
              <ShareModal />
              <MediaQuery minDeviceWidth={551} ><>
                <Joyride 
                  steps={steps} 
                  continuous={true}
                  run={this.state.run}
                  callback={this.handleJoyrideCallback}
                  scrollToFirstStep={true}
                  showProgress={true}
                  showSkipButton={true}
                  styles={{
                    options: {
                      zIndex: 10000,
                    },
                  }}
              />
                {map}
              </>
              </MediaQuery> 
              <MediaQuery maxDeviceWidth={550}><>
                <Joyride 
                    steps={mobileSteps} 
                    continuous={true}
                    run={this.state.run}
                    callback={this.handleJoyrideCallback}
                    scrollToFirstStep={true}
                    showProgress={true}
                    showSkipButton={true}
                    styles={{
                      options: {
                        zIndex: 99999999,
                      },
                    }}
                />
                {mobile_map}
                </>
              </MediaQuery> 
          </div>
        })}>
        </Route>
        <Route
          exact path={'/'}
          render={(({match}) => {
            return <div>
                <NavigationBar urlParams={match.params}/>
                <ShareModal />
                <div className="App" >

                <header className="App-header">
                  <div className='lookupContainer'>
                    <div className="logoTitleContainer"> 
                    <div className='fullLogoContainer'>
                            <Image src={logo_full} className="titleLogo" fluid/>
                    </div>
                      {/* <MediaQuery minDeviceWidth={551}> */}
                         
                      

                          {/* <div className='logoContainer'>
                            <Image src={white_smaple} className="titleLogo" fluid/>
                          </div> */}
                      {/* </MediaQuery> */}
                        
                        {/* <MediaQuery maxDeviceWidth={550}>
                          <div className="titlesContainer">
                            <h1 className='homePageTitle'>Landmark</h1>
                            <h3 className='homePageSubTitle'>Real Estate Consultation for All</h3>
                          </div> 
                        </MediaQuery> */}
                          {/* <div className="titlesContainer">
                            <h1 className='homePageTitle'>Landmark</h1>
                            <h3 className='homePageSubTitle'>Real Estate Consultation for All</h3>
                          </div> */}
                      </div> 
                      <div className="lookupWrapper">
                        <LookUpForm/>
                      </div>
                  </div>
                </header>
                <About/>
                <ListingsPreviews />
        
              </div>
            </div>
          })}>
        </Route>
      </Switch>
      <Footer/>
      </div>
    );
  }
}

const mapStateToProps = createSelector(
  selectors.addressSelector,
  selectors.businessTypeSelector,
  selectors.readySelector,
  selectors.isCitySelector,
  selectors.userSelector,
  (address, business_type, ready, isCity, user) => ({
      address,
      business_type,
      ready,
      isCity,
      user
  })
);

const mapActionsToProps = {
  onUpdateAddress: updateAddress,
  onUpdateUser: updateUser
}

export default connect(mapStateToProps, mapActionsToProps) (App);

