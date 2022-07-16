import React from 'react';
import ImageUploader from '../../../react-images-upload';
 
export default class PhotoUploader extends React.Component {
 
    constructor(props) {
        super(props);
         this.state = { updateKey: false };
         this.onDrop = this.onDrop.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (!this.state.updateKey && prevProps.photos !== this.props.photos) {
            this.setState({existingFiles: this.props.photos, existingImages : this.props.photos.map(e => URL.createObjectURL(e))})
            this.setState({ updateKey : true })
        }
    }
 
    onDrop(pictures) {
        this.props.setPhotos(pictures)
    }
 
    render() {
        return (
            <div className="fileUploadContainer">
                <ImageUploader
                    defaultFiles={this.state.existingFiles}
                    defaultImages={this.state.existingImages}
                    singleImage={this.props.singleImage}
                    withPreview={true}
                    withIcon={true}
                    buttonText='Choose images'
                    onChange={this.onDrop}
                    imgExtension={['.jpg', '.jpeg', '.gif', '.png']}
                    maxFileSize={26214400}
                />
            </div>
        );
    }
}