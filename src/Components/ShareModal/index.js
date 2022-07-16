import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShare, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import ShareButtons from './ShareButtons'

export const ShareModal = () => {

    const [showModal, setShowModal] = useState(false); 
    const [isHidden, setHidden] = useState(false); 

    const openModal = () => {
        if (!showModal) {
            setShowModal(true);
        }
    };

    const closeModal = async () => {
        setShowModal(false);
    };

    const hideShare = () => {
        setHidden(true);
    };

    if (isHidden) {
        return (<></>);
    } else {
        return (
            <div className="shareModalContainer" onClick={openModal}>
                <ShareModalPopup 
                   show={showModal}
                   onHide={closeModal}
                 />
                 <div className="shareModalExit" onClick={hideShare}>
                    <FontAwesomeIcon icon={faTimesCircle} size="1x" color="white"/>
                 </div>
                <FontAwesomeIcon icon={faShare} size="1x" color="white"/>
                <div className="shareText">
                    <span>Share</span>
                </div>
            </div>
        );
    }  
};

export default ShareModal;

const ShareModalPopup = (props) => {

    return (
      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
           Invite a friend or colleague to join!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ShareButtons />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }