import React from 'react'
import Image from 'react-bootstrap/Image'
import Button from 'react-bootstrap/Button'

function PhotoPreviews(props) {

    const { photos, removePhoto } = props

    return (
        <div className="photoMapContainer">
            { photos.map((e, i) => {
                return (
                    <div className="photoPreviewContainer" key={e.name +'_'+i}>
                         <Button variant="danger" className="photoDeleteButton" onClick={()=> removePhoto(i)}>
                            X
                         </Button>
                        <Image key={e} src={getSource(e)} style={{ width: '100%', height: '100%'}} />
                    </div>
                )
            })}
        </div>
    )
}

const getSource = (photo) => {
    return URL.createObjectURL(photo)
}

export default PhotoPreviews