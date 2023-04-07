import React, { useState, useEffect, useRef } from 'react'
import { useAddNewImageMutation } from './imagesApiSlice';
import useToken from '../../hooks/useToken';
import { isErrorWithMessage } from '../../lib/fetchErrorHelper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleExclamation, faCircleCheck } from '@fortawesome/free-solid-svg-icons'

const NewImageForm = () => {
    const user = useToken()

    const [title, setTitle] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [selectedFile, setSelectedFile] = useState<string | Blob>('');

    const [errMessage, setErrMessage] = useState<string>('')

    const [addNewImage, { isSuccess, isError, isLoading }] = useAddNewImageMutation()
    const fileInputRef = useRef<any>()

    const onTitleChanged = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)
    const onDescriptionChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)
    const onFileChanged = (event: React.BaseSyntheticEvent) => setSelectedFile(event.target.files[0])
	
    const handleSubmission = async (e: React.SyntheticEvent) => {
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
        try {
            await addNewImage(formData).unwrap()
        } catch (err) {
            if (isErrorWithMessage(err)) {
                setErrMessage(err.data.message)
            }
        }
	};

    useEffect(() => {
      if (isSuccess) {
        setTitle('')
        setDescription('')
        setSelectedFile('')
        fileInputRef.current.value = null
      }
    }, [isSuccess])
    
    // handle error classes when css will be aplied

  return(
        <section className="form-section">
            <h2 className='form-section__title'>Add new image:</h2>
            <form onSubmit={handleSubmission} className='form-section__form'>
                <label htmlFor="title" className='form-section__label'>
                    Title:
                    <input 
                        className='form-section__input'
                        id='title'
                        name='title'
                        autoComplete='off'
                        type="text"
                        value={title}
                        onChange={onTitleChanged}
                        maxLength={20} 
                    />
                    {!title && (
                        <p className='form-section__note'>
                            1 to 20 characters.
                        </p>
                    )}
                </label>  
                <label htmlFor="description" className='form-section__label'>
                    Description:
                    <textarea 
                        className='form-section__textarea'
                        id='description'
                        name='description'
                        autoComplete='off'
                        value={description}  
                        onChange={onDescriptionChanged}
                        maxLength={150}
                    ></textarea>
                    {!description && (
                        <p className='form-section__note'>
                            1 to 150 characters.
                        </p>
                    )}
                </label>
                
                <label htmlFor="file" className='form-section__label'>
                    Image:
                    <input
                        className='form-section__file-input'
                        id='file' 
                        type="file" 
                        name="file" 
                        onChange={onFileChanged} 
                        accept='image/png, image/jpeg, image/jpg'
                        ref={fileInputRef}
                    />
                    {!selectedFile && (
                        <p className='form-section__note'>
                            Allowed extensions: <br />.png, .jpeg, .jpg
                        </p>
                    )}
                </label>
                <button type="submit" className='form-section__button' disabled={isLoading}>{isLoading ? 'Loading...' : 'Submit'}</button>
            </form>
            {isError && 
                <div className='form-section__error'>
                    <p className='form-section__error-paragraph'><FontAwesomeIcon icon={faCircleExclamation} />{errMessage}</p>
                </div>
            }
            {isSuccess && 
                <div className='form-section__success'>
                    <p className='form-section__success-paragraph'><FontAwesomeIcon icon={faCircleCheck} /> Post successfully added.</p>
                </div>
            }
        </section>
   )
}

export default NewImageForm