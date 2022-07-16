import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table'
import Accordion from 'react-bootstrap/Accordion'
import Form from 'react-bootstrap/Form'
import { updateBusinessType} from '../../../Actions/business-actions'
import { BUSINESS_TYPES } from '../../../Constants'
import Card from 'react-bootstrap/Card'
import { connect } from 'react-redux'
import { createSelector } from 'reselect';
import { updateDataRange } from '../../../Actions/dataRange-actions'
import { updateStatsZip, updateStatsTradezone } from '../../../Actions/stats-actions'
import { isCitySelector, tractSelector, addressSelector, dataRangeSelector, tradeZoneBoundsSelector, statsSelector, geoUnitSelector, businessTypeSelector } from '../../../Reducers/selectors';
import Button from 'react-bootstrap/Button'
import { createTradeZoneStats } from '../../../Requests/locations-requests'
import { updateTradeZoneBounds } from '../../../Actions/tradeZoneBoundaries-actions'
import {AiOutlineInfoCircle} from 'react-icons/ai'
import { getZipData, getTradezoneData } from '../../../Requests/tradezones-requests';
import Modal from 'react-bootstrap/Modal'
import { determineRadius } from '../../utils/distance';

export const ZIP = 'zip code tabulation area'
export const TRADE_ZONE = 'tradeZone'
const darkBg = 'rgb(26,28,41)'
const lightBg = 'rgb(31,33,48)'
const textPrimary = 'whitesmoke'

class DemographicsPanel extends React.Component {
    constructor(props) {
        super(props) 

        // reconcile state display and backend business type encoding
        let business_type = this.props.business_type.type
        if (business_type == 'lodging') business_type = 'hotels /lodging'

        this.state = {
            statsLoaded : false,
            zipVariant : 'light',
            tzVariant : 'dark',
            zipDisabled : false,
            zipHeader : "Zip - " + this.props.address.zip,
            accordianKeys :  { zip :  ['0', '0', '0', '0'], tradeZone : ['0', '0', '0', '0']},
            showModal : false,
            business_type : business_type.replace(/_/g, ' '),
            hasValidTradeZone: false 
         }
    };

    async componentDidMount() {
        this.getZip()
        this.loadNewTradeZoneStats()  
    };

   onUpdateDataRange = (event) =>  {
    let val = event.target.value
    if (val === 'zip') {
        this.props.onUpdateDataRange(ZIP)
        this.setState({ zipVariant: 'light', tzVariant: 'dark'})
    }
    else if (val == 'tradeZone') {
        this.props.onUpdateDataRange(TRADE_ZONE)
        this.setState({zipVariant: 'dark', tzVariant: 'light'})
    }
   };

   onUpdateStatsZip = (stats) => {
       updateStatsZip(stats)
   };

   onUpdateStatsTZ = (stats) => {
    updateStatsTradezone(stats)
};

    getZip = async () => {
       const { address } = this.props;
       const { state, zip } = address;

       const res = await getZipData(state, zip);
       if (res.length >= 1) {
            this.setState({ zipStats : res[0].stats, accordianKeys : {...this.state.accordianKeys, zip: ['0', '1', '2', '3']}})
            this.props.onUpdateStatsZip(res[0])
       } else {
           this.setState({ zipHeader: 'Zip Unavailable', zipDisabled: true })
        this.props.onUpdateDataRange(TRADE_ZONE)
        this.setState({zipVariant: 'dark', tzVariant: 'light'})
       }
    };

    loadNewTradeZoneStats = async () => {
        const { address, stats } = this.props;
        const params = determineRadius(address.zip)
        const { radius, isnyc } = params;

        this.setState({ isnyc });

        const res = await getTradezoneData(address.state, address.zip, address.coords.lat, address.coords.lng, radius, isnyc);
    
        if (res.stats) {
            // set internal state
            this.setState({ tradeZoneStats : res.stats, statsLoaded : true, hasValidTradeZone: false, // wtf is this named that???
                accordianKeys : {...this.state.accordianKeys, tradeZone: ['0', '1', '2', '3']}
            })
           this.props.onUpdateStatsTZ(res);
        }
    };

    checkForTradeZone = () => {
        return new Promise(resolve => {
            if (this.state.tradeZoneStats == null) {
                let loop = setInterval(()=> {
                    if (this.state.tradeZoneStats != null) {
                        clearInterval(loop)
                        resolve()
                    }
                }, 100)
             } else resolve()
        })
    };

    onUpdateTradeZoneBounds = tradeZone_bounds => {
        this.props.onUpdateTradeZoneBounds(tradeZone_bounds)
    };

    setModalShow = (flag) => {
        this.setState({showModal: flag})
    };

    onBusinessFormChange = (event) => {
        let type = event.target.value
        this.setState({ business_type : type })

        // for props
        if (type == 'hotels /lodging') type = 'lodging'
        let business = {
            type: type.replace(/ /g, '_'),
            priceLevel : 0
        }

        this.onUpdateBusinessType(business)
    };

    onUpdateBusinessType(business_type) {
        this.props.onUpdateBusinessType(business_type)
    };

    hasValidTradeZone = () => {
        const { address } = this.props
        const isValid = address.state !== 'NJ' && address.state !== 'NY'
        this.setState({ hasValidTradeZone : isValid })
        return isValid;
    };

    render() {
        const { hasValidTradeZone } = this.state

        var social_data =  {
            summary: {
                gender : {},
            },
            
            race : {},
            nativity: {},
            education : {},
            marital_status : {},
            employment : {},
            transportation : {}
        }
        var income_data = {}
        var age_data={}

        if (this.props.data_range == ZIP) {
            if (this.state.zipStats != null) {
                social_data = this.state.zipStats.social
                income_data = this.state.zipStats.income
                age_data = this.state.zipStats.age
            }
        } else if (this.props.data_range == TRADE_ZONE) {
            if (this.state.tradeZoneStats != null) {
                social_data = this.state.tradeZoneStats.social
                income_data = this.state.tradeZoneStats.income
                age_data = this.state.tradeZoneStats.age
            }
        }

        const NestedCard = ({name, data, key_i}) => {
            let total = 0
            Object.entries(data).forEach(([k,v]) => {
                if (k.toLowerCase().search('total') <= -1 && k.toLowerCase().search('median') <= -1)
                    total += v
            })
      
            return (
                <Card style={{backgroundColor: lightBg}}>
                    <Accordion.Toggle as={Card.Header} eventKey={key_i} style={{color: 'whitesmoke', backgroundColor: darkBg, margin: '3px', fontWeight: 'bold'}}>
                        {name}
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey={key_i} >
                    <Card.Body>
                        <div style={{overflowX: "auto", width: "100%"}}>
                        <Table striped bordered hover variant="dark" >
                        <tbody>
                            {
                                Object.entries(data).map((data, i) => {
                                let entry = data[0].replace(/_/g, ' ')

                                let output = getPercent(data[1], total)
                                if (entry.toLowerCase().search('total') > -1 || entry.toLowerCase().search('median') > -1) output = formatCommas(data[1])
                                return (
                                    <tr key={i}>
                                        <td>{capitalize(entry)}</td><td>{output}</td>
                                    </tr>
                                );
                                })}
                        </tbody>
                        </Table>
                        </div>
                    </Card.Body>
                    </Accordion.Collapse>
                </Card>
            )
        }
        let business_type= this.props.business_type.type.replace(/_/g, ' ')
        if (business_type == 'lodging') business_type = 'hotel /lodging'

        return (
           <div className="demographics_container" >

             <div style={{ display: 'flex', flexDirection: 'column', width: '100%'}}>
                <br></br>
                    <div style={{ display: 'flex',flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                        <p></p>
                        <strong style={{color:'whitesmoke', }}>Demographics</strong>
                        <InfoButton clickFunction={()=>this.setModalShow(true)}/>   
                        <MyVerticallyCenteredModal
                            show={this.state.showModal}
                            onHide={() => this.setState({showModal:false})}
                        />
                    </div>
                    <br></br>
                <div style={{display: 'flex', height: '35px', width: '100%'}}>
                  <Button disabled={this.state.zipDisabled} variant={this.state.zipVariant} className='map-control_button'  onClick={this.onUpdateDataRange} value= {'zip'} style={{ width: '50%', height: 35, padding: '0', fontWeight: 'bold'}}>
                    {this.state.zipHeader}
                </Button>
                <LoadingButton click={this.onUpdateDataRange} buffer={this.checkForTradeZone} buttonVariant={this.state.tzVariant} hasValidTradeZone={this.state.hasValidTradeZone}/>
                </div>
            </div>
           
            <div style={{ flex: 1, overflowY: 'auto', backgroundColor: lightBg}}>
               <Accordion defaultActiveKey='0'>
                <Card style={{backgroundColor: lightBg}}>
                    <Accordion.Toggle as={Card.Header} eventKey="0" ref={ref => this.accordion = ref} style={{color: 'whitesmoke', backgroundColor: darkBg, marginTop: '3px', fontWeight: 'bold'}}>
                    General
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0" >
                    <Card.Body>
                        <Table striped bordered hover variant="dark" >
                        <tbody style={{overflowX: 'auto'}}>
                            <tr>
                            <td>Your Proposed Business Type</td>
                            <td>
                                <Form.Group>
                                    <Form.Label style={{color: textPrimary}} style={{color: textPrimary}}></Form.Label>
                                    <Form.Control as="select" name="business_type" value={this.state.business_type} onChange={this.onBusinessFormChange}>
                                            {BUSINESS_TYPES.map((e,i) => {
                                                return <option key={i}>{e.replace(/_/g, ' ')}</option>
                                            })}
                                    </Form.Control>
                                </Form.Group>
                            </td>
                             </tr><tr>
                             <td>Address</td><td>{ this.props.address.formatted}</td>
                             </tr>
                           <tr>
                            <td>Population</td><td>{social_data.summary.population != undefined && formatCommas(social_data.summary.population)}
                                {!hasValidTradeZone && social_data.summary.population == undefined && 'loading...'}
                            </td>
                                </tr><tr>
                            <td>Median Age</td><td>{social_data.summary.median_age != undefined && social_data.summary.median_age + ' yrs'}
                            {!hasValidTradeZone && social_data.summary.median_age == undefined && 'loading...'}
                            </td>
                                </tr><tr>
                            <td>Median Household Income</td><td>{income_data.median != undefined && '$'+formatCommas(income_data.median)}
                            {!hasValidTradeZone && income_data.median == undefined && 'loading...'}
                            </td>
                            </tr><tr>
                            <td>Males</td><td>{social_data.summary.gender.males != undefined && formatCommas(social_data.summary.gender.males)}
                            {!hasValidTradeZone && social_data.summary.gender.males == undefined && 'loading...'}
                            </td>
                             </tr><tr>
                            <td>Females</td><td>{social_data.summary.gender.females != undefined && formatCommas(social_data.summary.gender.females)}
                            {!hasValidTradeZone && social_data.summary.gender.females == undefined && 'loading...'}
                            </td>
                             </tr>
                        </tbody>
                        </Table>
                    </Card.Body>
                    </Accordion.Collapse>
                </Card>
                
                <Card style={{backgroundColor: lightBg}}>
                    <Accordion.Toggle as={Card.Header} eventKey={this.state.accordianKeys[this.props.data_range.split(' ')[0]][1]} style={{color: 'whitesmoke', backgroundColor: darkBg, marginTop: '3px', fontWeight: 'bold'}}>
                    Social
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="1">
                    <Card.Body>
                        <Accordion defaultActiveKey="0">
                        { !(this.props.data_range == TRADE_ZONE && this.state.isnyc) &&  <NestedCard name={"Ethnicity"} data={social_data.race} key_i={"0"}></NestedCard> }
                        { !(this.props.data_range == TRADE_ZONE && this.state.isnyc ) &&  <NestedCard name={"Nativity"} data={social_data.nativity} key_i={"1"}></NestedCard> }
                        {!(this.props.data_range == TRADE_ZONE && this.state.isnyc)  && <NestedCard name={"Education (Ages 25+)"} data={social_data.education} key_i={"2"}></NestedCard> }
                        <NestedCard name={"Marital Status"} data={social_data.marital_status} key_i={"3"}></NestedCard> 
                        { !(this.props.data_range == TRADE_ZONE) && <NestedCard name={"Transportation (for work)"} data={social_data.transportation} key_i={"4"}></NestedCard> }
                        </Accordion>
                    </Card.Body>
                    </Accordion.Collapse>
                </Card>
                <Card style={{backgroundColor: lightBg}}>
                    <Accordion.Toggle as={Card.Header} eventKey={this.state.accordianKeys[this.props.data_range.split(' ')[0]][2]}style={{color: 'whitesmoke', background: darkBg, fontWeight: 'bold'}}>
                    Household Income
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="2" >
                    <Card.Body>
                        <Table striped bordered hover variant="dark" >
                        <tbody>
                            <tr>
                            <td>Sample total</td><td>{formatCommas(income_data.sample_total)}</td>
                             </tr><tr>
                             <td>Median Household Income</td><td>{'$'+ formatCommas(income_data.median)}</td>
                             </tr><tr>
                             <td>0-35k</td><td>{getPercent(income_data._0_9999 + income_data._10000_14999 + income_data._15000_19999 + income_data._20000_24999 + income_data._25000_29999 + income_data._30000_34999, income_data.sample_total)}</td>
                             </tr><tr>
                             <td>35-50k</td><td>{getPercent(income_data._35000_39999 + income_data._40000_44999 + income_data._45000_49999, income_data.sample_total)}</td>
                             </tr><tr>
                             <td>50-75k</td><td>{getPercent(income_data._50000_59999 + income_data._60000_74999, income_data.sample_total)}</td>
                             </tr><tr>
                             <td>75-100k</td><td>{getPercent(income_data._75000_99999, income_data.sample_total)}</td>
                             </tr><tr>
                             <td>100-150k</td><td>{getPercent(income_data._100000_124999 + income_data._125000_149999, income_data.sample_total)}</td>
                             </tr><tr>
                             <td>150-200k</td><td>{getPercent(income_data._150000_199999, income_data.sample_total)}</td>
                             </tr><tr>
                             <td>200k+</td><td>{getPercent(income_data._200000_MORE, income_data.sample_total)}</td>
                             </tr>
                        </tbody>
                        </Table>
                    </Card.Body>
                    </Accordion.Collapse>
                </Card>
                <Card style={{backgroundColor: lightBg}}>
                    <Accordion.Toggle as={Card.Header} eventKey={this.state.accordianKeys[this.props.data_range.split(' ')[0]][3]} style={{color: 'whitesmoke', background: darkBg, fontWeight: 'bold'}}>
                    Age
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="3" >
                    <Card.Body>
                        <Table striped bordered hover variant="dark" >
                        <tbody>
                            <tr>
                            <td>Median</td><td>{age_data.median_age + ' yrs'}</td>
                             </tr><tr>
                             <td>Sample Total</td><td>{formatCommas(age_data.sample_total)}</td>
                             </tr><tr>
                             <td>0-9yrs</td><td>{getPercent(age_data.ZERO_FIVE + age_data.FIVE_NINE, age_data.sample_total)}</td>
                             </tr><tr>
                             <td>10-19yrs</td><td>{getPercent(age_data.TEN_FOURTEEN + age_data.FIFTEEN_SEVENTEEN + age_data.EIGHTEEN_NINETEEN, age_data.sample_total)}</td>
                             </tr><tr>
                             <td>20-29yrs</td><td>{getPercent(age_data.TWENTY + age_data.TWENTYONE + age_data.TWENTYTWO_TWENTYFOUR + age_data.TWENTYFIVE_TWENTYNINE, age_data.sample_total)}</td>
                             </tr><tr>
                             <td>30-39yrs</td><td>{getPercent(age_data.THIRTY_THIRTYFOUR + age_data.THIRTYFIVE_THIRTYNINE, age_data.sample_total)}</td>
                             </tr><tr>
                             <td>40-49yrs</td><td>{getPercent(age_data.FORTY_FORTYFOUR + age_data.FORTYFIVE_FORTYNINE, age_data.sample_total)}</td>
                             </tr><tr>
                             <td>50-59yrs</td><td>{getPercent(age_data.FIFTY_FIFTYFOUR + age_data.FIFTYFIVE_FIFTYNINE, age_data.sample_total)}</td>
                             </tr><tr>
                             <td>60-69yrs</td><td>{getPercent(age_data.SIXTY_SIXTYONE + age_data.SIXTYTWO_SIXTYFOUR + age_data.SIXTYFIVE_SIXTYSIX + age_data.SIXTYSEVEN_SIXTYNINE, age_data.sample_total)}</td>
                             </tr><tr>
                             <td>70-79yrs</td><td>{getPercent(age_data.SEVENTY_SEVENTYFOUR + age_data.SEVENTYFIVE_SEVENTYNINE, age_data.sample_total)}</td>
                             </tr><tr>
                             <td>80+yrs</td><td>{getPercent(age_data.EIGHTY_EIGHTYFOUR + age_data.EIGHTYFIVE_UP, age_data.sample_total)}</td>
                             </tr>
                        </tbody>
                        </Table>
                    </Card.Body>
                    </Accordion.Collapse>
                  
                </Card>
                </Accordion>
              
                </div>

                
           </div>
        );
    }
}

const LoadingButton = (props) => {
    const [isLoading, setLoading] = useState(false)
    
    useEffect(() => {
      if (isLoading) {
        props.buffer().then(() => {
          setLoading(false);
        });
      }
    }, [isLoading]);

    const handleClick = (e) =>{
        props.click(e)
        setLoading(true); 
    }
  
    let label = (isLoading) ? 'Loading...' : 'Tradezone'
    if (props.hasValidTradeZone) label += ' Unavailable'

    return (
      <Button
        style={{margin: 'auto', width: '50%', height: 35, padding: '0', fontWeight: 'bold'}}
        variant={props.buttonVariant}
        disabled={props.hasValidTradeZone}
        value = {'tradeZone'} 
        onClick={!isLoading ? handleClick : null}
      >
        {label}
      </Button>
    );
  }

  const formatCommas = (value) => {
    if (value == undefined) return ''
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  const getPercent = (value, total) => {
      return ((value/total) * 100).toFixed(1) + '%'
  }

  const capitalize = word => {
      let split = word.split(' ')
      let capitalize = []
      split.forEach(e => {
          if (e == 'or' || e == 'or')
            capitalize.push(e)
          else 
            capitalize.push(e.substring(0, 1).toUpperCase() + e.substring(1, e.length))
      })
      return capitalize.join(' ')
  }

  const InfoButton = (props) => {
    const [clicked, setClicked] = useState(false)
    let color = 'white'

    if (clicked) {
     //   color = 'rgba(255,255,255,0.5'
    }
    else color = 'white'
    
    let style = {color: color,  marginRight: '0.4em'}

    return (
         <AiOutlineInfoCircle size={20} onClick={(e)=> [setClicked(!clicked), props.clickFunction()]} 
         style={style}/>
    ) 
}


  const MyVerticallyCenteredModal = (props) => {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Demographics
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <h3 style={{fontSize: '20px'}}>
            1. Zip Code and Tradezone
          </h3>
          <p style={{ marginLeft: '1em'}}>
              <p>
              <strong> Zip Codes </strong>   
              <br></br>
              <span style={{ fontSize: 14}}>Zip codes may contain visible gaps, especially in urban areas. 
              This will occurr in the special case of a designated zip code for a particular building or 
              complex such as Penn Station or the Empire State Building. </span>
              </p>
              <p>
              <strong> Trade Zone </strong>   
              <br></br>
              <span style={{ fontSize: 14}}>The 'Trade Zone' is calculated by aggregating the set of census <a href='https://www2.census.gov/geo/pdfs/education/CensusTracts.pdf'>tracts </a> 
                that fall within a radius of 1 mile for 'driving' and 0.25 miles for 'walking.'</span>
                <br></br>
                <span style={{ fontSize: 14}}>Note that results may vary if location is bordering areas not within the following locations: </span>
                <br></br>
                <span><strong style={{ fontSize: 14}}>New Jersey, the 5 boroughs of New York City, and Long Island</strong> </span> 
              </p>
          </p>
          <h3 style={{fontSize: '20px'}}>
            2. Statistics
          </h3>
          <p style={{ marginLeft: '1em'}}>
              <p>
              <span style={{ fontSize: 14}}>Demographics statistics are calculated using the U.S. Census's <a href='https://www.census.gov/programs-surveys/acs'>2017 American Community Survey.</a> </span>
              </p>
          </p>
      
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }


const mapStateToProps = createSelector(
    /* for above
         {this.income_data == undefined && <NestedCard name={"Income"} data={<Text>Loading..</Text>} key_i={"2"}></NestedCard>}
                {this.income_data != undefined && <NestedCard name={"Income"} data={income_data} key_i={"2"}></NestedCard>}
    */
    tractSelector,
    addressSelector,
    dataRangeSelector,
    tradeZoneBoundsSelector,
    statsSelector,
    isCitySelector,
    geoUnitSelector,
    businessTypeSelector,

    (tract, address, data_range, tradeZone_bounds, stats, isCity, geo_unit, business_type) => ({
        tract, address, data_range, tradeZone_bounds, stats, isCity, geo_unit, business_type
    })
);

const mapActionsToProps = {
    onUpdateDataRange: updateDataRange,
    onUpdateTradeZoneBounds: updateTradeZoneBounds,
    onUpdateBusinessType : updateBusinessType,
    onUpdateStatsZip: updateStatsZip,
    onUpdateStatsTZ: updateStatsTradezone
};

export default connect(mapStateToProps, mapActionsToProps) (DemographicsPanel);


/**
 *   <tr>
                             <td>City</td><td>{ this.props.city}</td>
                             </tr><tr>
                             <td>Street</td><td>{this.props.street}</td>
                             </tr>
 */