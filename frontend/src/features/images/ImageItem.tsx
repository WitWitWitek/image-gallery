import { useDeleteImageMutation, useUpdateImageMutation } from "./imagesApiSlice"
import { imageProps } from "./imageTypes"
import useDate from '../../hooks/useDate'
import React, { useState } from "react"
import '../../styles/ImageItem.scss'
import useToken from "../../hooks/useToken"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan, faPen, faPaperPlane } from '@fortawesome/free-solid-svg-icons'

type ImageItemProps = {
  imageProps: imageProps
}

const ImageItem = ( { imageProps }: ImageItemProps): JSX.Element => {
  const { src, _id, title, description, createdAt, updatedAt, user } = imageProps
  const [deleteImage] = useDeleteImageMutation()
  const [updateImage] = useUpdateImageMutation()

  const deleteImageHandler = (imageId: string) => {
  if (window.confirm('Are you sure?') === true) {
      deleteImage({id: imageId})
    }
  }
  const { date } = useDate(createdAt, updatedAt)
  const loggedUser = useToken()
  
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [updatedTitle, setUpdatedTitle] = useState<string>(title)
  const [updatedDescription, setUpdatedDescription] = useState<string>(description)


  const sendEditionHandler = () => {
    updateImage({
      imageId: _id,
      updatedTitle: updatedTitle,
      updatedDescription: updatedDescription
    })
    setIsEditing(false)
  }

  const titleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setUpdatedTitle(e.target.value)
  const descriptionOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setUpdatedDescription(e.target.value)

  const imageClickHandler = (e: React.MouseEvent<HTMLImageElement>) => {
    const image = e.target as HTMLImageElement
  }

  return (
    <li className="image-item">
        <div 
          className="image-item__image-container"
          >
          <img className="image-item__image"
            src={src}
            alt={title}
            onClick={imageClickHandler}
          />
        </div>
        <div className="image-item__wrapper">
            <textarea 
              className="image-item__title"
              disabled={!isEditing}
              value={updatedTitle}
              onChange={titleOnChange}
              maxLength={20} 
            />
            <textarea 
              className="image-item__description"
              disabled={!isEditing} 
              value={updatedDescription}
              onChange={descriptionOnChange}
              maxLength={150}
            />
          {user === loggedUser && (
            <div>
              <button className="image-item__btn" onClick={() => setIsEditing(prev => !prev)}><FontAwesomeIcon icon={faPen} /> {!isEditing ? 'Edit' : 'Close edition'}</button>
              {isEditing && <button className="image-item__btn" onClick={sendEditionHandler}><FontAwesomeIcon icon={faPaperPlane} /> Send</button>}
              {!isEditing && <button className="image-item__btn" onClick={() => {deleteImageHandler(_id)}}><FontAwesomeIcon icon={faTrashCan} /> Delete</button>}
            </div>
          )}
          <div className="image-item__date">{date}</div>
        </div>
    </li>
  )
}

export default ImageItem