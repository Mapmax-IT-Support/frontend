import React  from 'react'
import { connect } from 'react-redux'
import { createSelector } from 'reselect';
import * as selectors from '../../../Reducers/selectors'
import Table from 'react-bootstrap/Table'
import ReactTableContainer from "react-table-container";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { getComments, createComment } from '../../../Requests/locations-requests'
import { S3_BASE } from "../../../Constants"

const lightBg = 'rgb(31,33,48)'

class CommentsPanel extends React.Component {

    constructor(props) {
        super(props)
       
        this.state = {
            comments: [],
            body: ''
        }
    }

    async componentDidMount() {
        let comments = await getComments(this.props.address.place.place_id)
        if (comments === undefined) return;
        this.setState({comments: comments.res})
    }

    handleSubmit = async () => {
        let pid = this.props.address.place.place_id
        let user = {
            first : this.props.user.first,
            last: this.props.user.last,
            username: this.props.user.username,
            _id: this.props.user._id
        } 
        let body = this.state.body
        let results = await createComment(pid, user, body)
        // handle failed post
        let comments = await getComments(this.props.address.place.place_id)
        if (comments === undefined) return;
        this.setState({comments: comments.res})
    }

    handleChange = e => {
        this.setState({body: e.target.value})
    }

    render() {
        let header =  <thead>
            <tr>
            </tr>
        </thead>
        return (
            <div style={{display: 'block',  flexDirection: 'column', marginTop: '1.5em', padding: '1.5em', width: '100%', backgroundColor: lightBg}}>
                <h1 style={{color: 'whitesmoke', }}>Comments</h1>
                <ReactTableContainer height={this.state.tableHeight} width='100%' customHeader={[header]}>
                    <Table striped hover variant="light">
                        {header}
                        <tbody>
                            <CommentsRows comments={this.state.comments}/>
                        </tbody>
                    </Table>
                </ReactTableContainer>
                <div>
                    <Form>
                        <Form.Group controlId="exampleForm.ControlTextarea1">
                            <Form.Label></Form.Label>
                            <Form.Control value={this.state.body} onChange={this.handleChange} as="textarea" placeholder='Enter comments here'rows="3" />
                        </Form.Group>
                       {this.props.user._id != -1 && <Button variant='primary'  onClick={this.handleSubmit} style={{backgroundColor:'#00d4ff', fontWeight: 'bold'}}>Submit</Button>}
                       {this.props.user._id == -1 && <div><Button variant='primary'  onClick={this.handleSubmit} style={{backgroundColor:'#00d4ff', fontWeight: 'bold'}} disabled>Submit</Button> <p>Sign in to comment</p></div>}
                    </Form>
                </div>
            </div>    
       )
    }
 }
 const CommentsRows = (props) => {
    return (
       props.comments.map((e,i) => {

            return (
                <tr key={i}>
                    <td>
                        <div style={{  width: '100%', height: '25%'}}>
                            <div style={{display: 'flex', fontSize: '14px',  alignItems: 'center', alignContent: 'center' }}>
                                <div style={{}}>
                                    <img src={(e.user.hasProfile) ? S3_BASE + 'users/' + e.user._id + '/profile.png' : "https://devshift.biz/wp-content/uploads/2017/04/profile-icon-png-898.png" } 
                                    width={45} height={45} style={{borderRadius: 30, marginLeft: '1em'}}/>
                                </div>
                                <p style={{marginLeft: '1em', textAlign: 'left'}}>
                                    <span style={{fontWeight: 'bold', color: 'black', }}> {e.user.username}</span>
                                    <br></br>
                                    <span style={{ opacity : 0.7, color: 'black'}}>{getDateDisplay(e.date)}</span>
                                </p>
                            </div>
                            <p style={{ marginLeft: '1em', textAlign: 'left'}}>{e.body}</p>
                        </div>
                    </td>
                </tr>
            )
        }) 
    )
}

 
 const mapStateToProps = createSelector(
     selectors.addressSelector,
     selectors.userSelector,
    (address, user) => ({
        address, user 
    })
 )

 const getDateDisplay = (timestamp) => {
    let today = new Date()
    let date =  new Date(timestamp)
    let months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

    if (datesAreOnSameDay(today, date)) {
        let split = date.toLocaleTimeString().split(' ')
        return split[0].substring(0, split[0].lastIndexOf(':')) + ' ' + split[1] 
            +' '+  months[date.getMonth()] +' '+ date.getDate() + ', '+ date.getFullYear()
    } else {
        return months[date.getMonth()] +' '+ date.getDate() + ', '+ date.getFullYear()
    }
 }

 const datesAreOnSameDay = (first, second) =>
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate();

 export default connect(mapStateToProps)(CommentsPanel)