import React  from 'react'
import { connect } from 'react-redux'
import { createSelector } from 'reselect';
import * as selectors from '../../../Reducers/selectors'
import Button from 'react-bootstrap/Button'

class AddListing extends React.Component {

    constructor(props) {
        super(props)
       
        this.state = {
        }
    }

    componentDidUpdate(prevProps) {
        const { updateInfo, isUpdate } = this.props
        if (prevProps.isUpdate !== isUpdate && JSON.stringify(updateInfo) !== JSON.stringify(this.state)) {
            this.setState({...updateInfo})
        }
    }
    handleChange = async event => {
        await this.setState({[event.target.name]: event.target.value })
        this.props.addFormInfo(this.state, "pricingInfo")
    }

    render() {
        return (
            <div className="formPage">
                            
                <h3>2. Pricing Info</h3>
                    <form>

                    <strong>Asking price, if for sale?</strong>
                        <div className="inputGroup" >
                            <textarea maxLength="240" className="textArea"
                                type="text" 
                                multiline
                                name="askingPrice"
                                placeholder=""
                                value={this.state.askingPrice} onChange={this.handleChange} />
                        </div>

                        <strong>Asking price per square foot, if for lease?</strong>
                        <div className="inputGroup" >
                            <textarea maxLength="240" className="textArea"
                                type="text" 
                                multiline
                                name="leasePricePerSquareFoot"
                                placeholder=""
                                value={this.state.leasePricePerSquareFoot} onChange={this.handleChange} />
                        </div>

                        <strong>If for lease, duration of the initial lease term and available renewal options, if any?</strong>
                        <div className="inputGroup" >
                            <textarea maxLength="240" className="textArea"
                                type="text" 
                                multiline
                                name="leaseTermDetails"
                                placeholder=""
                                value={this.state.leaseTermDetails} onChange={this.handleChange} />
                        </div>
                        
                        <strong>Common area maintenance costs, per square foot?</strong>
                        <div className="inputGroup">
                            <textarea maxLength="240" className="textArea"
                                type="text" 
                                multiline
                                name="maintainenceCostPerSquareFoot"
                                placeholder=""
                                value={this.state.maintainenceCostPerSquareFoot} onChange={this.handleChange} />
                        </div>


                        <strong>Property insurance costs per square foot, if lease?</strong>
                        <div className="inputGroup" >
                            <textarea maxLength="240" className="textArea"
                                type="text" 
                                multiline
                                name="insuranceCostPerSquareFoot"
                                placeholder=""
                                value={this.state.insuranceCostPerSquareFoot} onChange={this.handleChange} />
                        </div>

                        <strong>Is this an assignment?</strong>
                        <div className="inputGroup">
                            <label>yes<input type="checkbox" checked={this.state.isAssignment =="yes" } name="isAssignment" value={'yes'} onChange={this.handleChange} /></label>
                            <label>no<input type="checkbox" checked={this.state.isAssignment == "no" } name="isAssignment" value={'no'} onChange={this.handleChange} /></label>
                        </div>

                        <strong>Is this a sublet?</strong>
                        <div className="inputGroup">
                            <label>yes<input type="checkbox" checked={this.state.isSublet =="yes" } name="isSublet" value={'yes'} onChange={this.handleChange} /></label>
                            <label>no<input type="checkbox" checked={this.state.isSublet == "no" } name="isSublet" value={'no'} onChange={this.handleChange} /></label>
                        </div>

                        <strong>Positive Site Considerations</strong>
                        <div className="inputGroup" >
                            <textarea maxLength="500" className="textArea"
                                type="text" 
                                multiline
                                name="positiveConsiderations"
                                placeholder=""
                                value={this.state.insuranceCostPerSquareFoot} onChange={this.handleChange} />
                        </div>
                        <p style={{ fontSize: '12px'}}>500 characters max</p>

                        <strong>Negative Site Considerations</strong>
                        <div className="inputGroup" >
                            <textarea maxLength="500" className="textArea"
                                type="text" 
                                multiline
                                name="negativeConsiderations"
                                placeholder=""
                                value={this.state.insuranceCostPerSquareFoot} onChange={this.handleChange} />
                        </div>
                        <p style={{ fontSize: '12px'}}>500 characters max</p>

                        <strong>Special Site Considerations</strong>
                        <div className="inputGroup" >
                            <textarea maxLength="500" className="textArea"
                                type="text" 
                                multiline
                                name="specialConsiderations"
                                placeholder=""
                                value={this.state.insuranceCostPerSquareFoot} onChange={this.handleChange} />
                        </div>
                        <p style={{ fontSize: '12px'}}>500 characters max</p>


                    </form>

                <Button variant="primary" onClick={this.props.handleNext} 
                    className="nextButton">
                    Next
                </Button>
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


 export default connect(mapStateToProps)(AddListing)