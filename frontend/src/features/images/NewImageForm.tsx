import React, { useState } from 'react'
import { useAddNewImageMutation } from './imagesApiSlice';
import '../../styles/NewImage.scss'
import useToken from '../../hooks/useToken';

const NewImageForm = () => {
    const [title, setTitle] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [selectedFile, setSelectedFile] = useState<string | Blob>('');
    const user = useToken()
    const [addNewImage] = useAddNewImageMutation()

    const onTitleChanged = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)
    const onDescriptionChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)
    const onFileChanged = (event: React.BaseSyntheticEvent) => setSelectedFile(event.target.files[0])

	const handleSubmission = (e: React.SyntheticEvent) => {
        e.preventDefault()
        if (!title || !description || !selectedFile) {
            alert('fill in all inputs')
            return
        }
        const formData = new FormData()
        formData.append('title', title)
        formData.append('description', description)
        formData.append('file', selectedFile)
        formData.append('user', user)
        addNewImage(formData)
	};

    // handle error classes when css will be aplied

  return(
       <form onSubmit={handleSubmission} className='new-image'>
            <label htmlFor="title" className='new-image__label'>Title:</label>
            <input 
                className='new-image__input'
                id='title'
                name='title'
                autoComplete='off'
                type="text"
                onChange={onTitleChanged}

            />
            <label htmlFor="description" className='new-image__label'>Description:</label>
            <textarea 
                className='new-image__textarea'
                id='description'
                name='description'
                autoComplete='off'  
                onChange={onDescriptionChanged}
                maxLength={150}
            ></textarea>
            <label htmlFor="file" className='new-image__label'>Image:</label>
            <input
                className='new-image__file-input'
                id='file' 
                type="file" 
                name="file" 
                onChange={onFileChanged} 
                accept='image/png, image/jpeg, image/jpg'
                maxLength={25}
            />
            <button type="submit" className='new-image__submit-button'>Submit</button>
       </form>
   )
}

export default NewImageForm