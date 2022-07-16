import React from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import PropogateLoader from '../../UI/ProppgateLoader'

export const SaveModal = (props) => {
    const {onHide, handleSave, loading, message } = props;

    return (
        <Modal
          {...props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
             Are you sure you want to save this listing as an unpublished draft?
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p style={{fontSize: '16px'}}>
              Saving will remove your listing from public view until it is resubmitted. 
              You can resubmit any time by selecting 'update' under 'My Listings' in your profile page.
            </p>
            {loading && <div style={{ display: 'flex',  justifyContent: 'center', margin: '2em 0 2em 0'}}>
                <PropogateLoader  color='#00D4FF' size={10} /> 
                </div>
            }
            <div style={{ color: 'black', fontWeight: 'bold', display: 'flex', justifyContent: 'center'}}>{message}</div>
          </Modal.Body>
          <Modal.Footer style={{ display: 'flex', justifyContent: 'center'}}>
            {message !== 'Success' && <>
              <Button style={{ width: '80px', marginRight: '.5em'}} disabled={loading} variant="danger" onClick={onHide}>Cancel</Button>
              <Button style={{ width: '80px'}} onClick={handleSave} disabled={loading}>Save</Button>
            </>}
            {message === 'Success' && <Button style={{ width: '80px'}} disabled={loading} onClick={onHide}>Ok</Button>}
          </Modal.Footer>
        </Modal>
      );
}

export default SaveModal;