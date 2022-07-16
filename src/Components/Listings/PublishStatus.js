import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'

export const PublishedStatus = ({ published, size, fontColor }) => {
   let color = (published) ? "green" : "whitesmoke"
   let label = (published) ? "published" : "unpublished"

   return (
       <div className="is-published-container">
           <FontAwesomeIcon icon={faCheckCircle} color={color} size={size}/>
           <span style={{ color : fontColor}}>{label}</span>
       </div>
   )
}

export default PublishedStatus;