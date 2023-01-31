import { useDeleteImageMutation, useUpdateImageMutation } from "./imagesApiSlice"
import { imageProps } from "./imageTypes"
import useDate from '../../hooks/useDate'
import React, { useState } from "react"
import '../../styles/ImageItem.scss'

type ImageItemProps = {
  imageProps: imageProps
}

const ImageItem = ( { imageProps }: ImageItemProps): JSX.Element => {
  const { src, _id, title, description, createdAt, updatedAt } = imageProps
  const [deleteImage] = useDeleteImageMutation()
  const [updateImage] = useUpdateImageMutation()
  const deleteImageHandler = (imageId: string) => deleteImage({id: imageId})
  const { date } = useDate(createdAt, updatedAt)
  
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

  const titleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => setUpdatedTitle(e.target.value)
  const descriptionOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setUpdatedDescription(e.target.value)

  return (
    <li className="image-item">
        <div className="image-item__image-container">
          <img className="image-item__image"
            src={src}
            alt={title}
          />
        </div>
        <div className="image-item__wrapper">
            <input 
              className="image-item__title-input"
              type="text"
              disabled={!isEditing}
              value={updatedTitle}
              onChange={titleOnChange}
              maxLength={25} 
            />
            <textarea 
              className="image-item__description-textarea"
              disabled={!isEditing} 
              value={updatedDescription}
              onChange={descriptionOnChange}
              maxLength={150}
            />
            {isEditing && <button onClick={sendEditionHandler}>Send</button>}
          <div>
            <button onClick={() => deleteImageHandler(_id)}>delete</button>
            <button onClick={() => setIsEditing(prev => !prev)}>edit</button>
          </div>
          <div className="image-item__date">{date}</div>
        </div>
    </li>
  )
}

export default ImageItem