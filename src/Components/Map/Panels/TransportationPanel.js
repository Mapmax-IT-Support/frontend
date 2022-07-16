import React  from 'react'
import { connect } from 'react-redux'
import { createSelector } from 'reselect';
import * as selectors from '../../../Reducers/selectors'
import SubwayIcon from '../../../images/subway.png'
import nySubwayMap from '../../../images/subway_map.jpg'
import Table from 'react-bootstrap/Table'
import ReactImageMagnify from 'react-image-magnify';
import Button from 'react-bootstrap/Button'
import { updateTransportation } from '../../../Actions/transportation-actions';
import MediaQuery from 'react-responsive'

class TransportationPanel extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            showSubways : false,
            isNYC : true 
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.transportation.subways != this.props.transportation.subways) {
            if (this.props.transportation.subways == undefined) {
                this.setState({ showSubways : false})
            } else if (this.props.transportation.subways.size <= 0) {
                this.setState({ showSubways : false})
            } else {
                this.setState({ showSubways : true})
            }
        }
    }

    handleSubwayClick = async () => {
        let showSubways = -1
        if (this.props.transportation.showSubways != undefined) {
            showSubways = this.props.transportation.showSubways*-1
        }
        await this.props.onUpdateTransportation({...this.props.transportation,  showSubways : showSubways})
        // window.scrollTo({
        //     top: 0,
        //     behavior: 'smooth',
        // })
    }



    render() {
        let header = <thead>
            <tr>
                <th>
                    <div style={{display: 'inline-block'}}>
                        <img src={SubwayIcon} width={50} height={50}/>
                    </div>
                </th>
                <th>Subway</th>
                <th>Lines</th>
                <th>Yearly Foot Traffic-In</th>
                <th>Yearly Foot Traffic-Out</th>
                <th colSpan='0'><Button onClick={this.handleSubwayClick}>Get</Button></th>
            </tr>
        </thead>

    const subwaysMap =
        <ReactImageMagnify {...{
            largeImage: {
                src: nySubwayMap,
                width: 2000,
                height: 2500
            }, 
            smallImage: {
                src: nySubwayMap,
                width: 320,
                height: 500
            },
            
            }} //2700 × 3314
            enlargedImageContainerStyle={{ zIndex: 1000, width: 2000, height: 2500}}
            enlargedImagePosition='over'
        />

        return (
            <div className="transportationPage" size="sm">
                <h1>Transportation</h1>
                <MediaQuery minDeviceWidth={880}>
                    <div className="transportationContainer">
                        {subwaysMap}
                        <Table striped hover variant="dark" id="subwaysTable" style={{ display: 'block'}}>
                            {header}
                            <tbody>
                                <SubwaysRows transportation={this.props.transportation}/>
                            </tbody>
                            {(this.props.transportation.subways == undefined || this.props.transportation.subways.length == 0) && 
                                <tr></tr>
                            }
                        </Table>  
                    </div>
                </MediaQuery>

                <MediaQuery maxDeviceWidth={880}>
                        <Table responsive striped hover variant="dark" id="subwaysTable">
                            {header}
                            <tbody>
                                <SubwaysRows transportation={this.props.transportation}/>
                            </tbody>
                            {(this.props.transportation.subways == undefined || this.props.transportation.subways.length == 0) && 
                                <tr></tr>
                            }
                        </Table>  
                </MediaQuery>
            </div>    
       )
    }
 }
 const SubwaysRows = (props) => {

    if (props.transportation.subways == undefined || props.transportation.subways.length == 0)
        return<></>;
    return (
       Array.from(props.transportation.subways.entries()).map(([name, data],i) => {
           if (i > 3) return;
            return (
                <tr key={(i)}>
                    <td>{(i+1)}</td>
                    <td>{name}</td>
                    <td>{data.G_LINES}</td>
                    <td>{formatCommas(data.G_TOTAL_ENT)}</td>
                    <td>{formatCommas(data.G_TOTAL_EXITS)}</td>
                    <td></td>
                  
                </tr>
            )
        }) 
    )
    /**
     *   <td>{e.directions.distance.text}</td>
                    <td>{e.directions.duration.text}</td>
     */
}
 
 const mapStateToProps = createSelector(
     selectors.transportationSelector,
    (transportation) => ({
        transportation, 
    })
 )

 const mapActionsToProps = {
    onUpdateTransportation: updateTransportation
  };

 const formatCommas = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") 
}

 export default connect(mapStateToProps, mapActionsToProps)(TransportationPanel)
 