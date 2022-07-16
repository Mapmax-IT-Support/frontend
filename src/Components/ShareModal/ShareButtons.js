import React from 'react';
import {
    EmailShareButton, EmailIcon,
    FacebookShareButton, FacebookIcon,
    LinkedinShareButton, LinkedinIcon,
    TwitterShareButton, TwitterIcon,
    WhatsappShareButton, WhatsappIcon
} from "react-share";


export const ShareButtons = () => {

    const url = window.location.href; 
    const size = 32;
    const round = true;

    return (
        <div className="shareButtonsContainer">
            <EmailShareButton url={url} className="buttonContainer">
                <EmailIcon size={size} round={round}/>
                Email
            </EmailShareButton>

            <FacebookShareButton url={url} className="buttonContainer">
                <FacebookIcon size={size} round={round}/>
                Facebook
            </FacebookShareButton>

            <LinkedinShareButton url={url} className="buttonContainer">
                <LinkedinIcon size={size} round={round}/>
                LinkedIn
            </LinkedinShareButton>

            <TwitterShareButton url={url} className="buttonContainer">
                <TwitterIcon size={size} round={round}/>
                Twitter
            </TwitterShareButton>

            <WhatsappShareButton url={url} className="buttonContainer">
                <WhatsappIcon size={size} round={round}/>
                WhatsApp
            </WhatsappShareButton>
        </div>
    )
}

export default ShareButtons;