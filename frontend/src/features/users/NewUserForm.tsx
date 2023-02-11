import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateNewUserMutation } from './usersApiSlice'
import '../../styles/NewUserForm.scss'

const USER_REGEX = /^[A-z][A-z0-9-_]{3,20}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%.]).{8,24}$/;

const NewUserForm = () => {
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [passwordRepeat, setPasswordRepat] = useState<string>('')
    const [passwordsMatch, setPasswordsMatch] = useState<boolean>(false)
    const [validUsername, setValidUsername] = useState<boolean>(false)
    const [validPassword, setValidPassword] = useState<boolean>(false)
    const [validationError, setValidationError] = useState<string>('')

    const navigate = useNavigate()

    const [createNewUser, {
        isSuccess,
        // isError,
        // error
    }] = useCreateNewUserMutation()

    
    useEffect(() => {
        setValidUsername(USER_REGEX.test(username))
    }, [username])

    useEffect(() => {
        setValidPassword(PASSWORD_REGEX.test(password))
        setPasswordsMatch(password === passwordRepeat)
    }, [password, passwordRepeat])
    

    const canSave = validUsername && validPassword && passwordsMatch

    const handleSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!canSave) {
            if (!validUsername) {
                setValidationError('Invalid username!')
            } else if (!validPassword) {
                setValidationError('Invalid password!')
            } else if (!passwordsMatch ) {
                setValidationError('Passwords are not the same!')
            } 
            return
        }
        await createNewUser({username, password}).unwrap()
    }

    useEffect(() => {
        if (isSuccess) {
            setPassword('')
            setUsername('')
            setValidationError('')
            navigate('/login')
        }
    }, [isSuccess, navigate])

    const onUsernameChanged = (e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)
    const onPasswordChanged = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)
    const onPasswordRepeatChanged = (e: React.ChangeEvent<HTMLInputElement>) => setPasswordRepat(e.target.value)

    return (
        <form className='signup' onSubmit={handleSubmission}>
            <label className='signup__label' htmlFor="username">Username:</label>
            <input 
                type="text"
                autoComplete='off' 
                id="username"
                className='signup__input'
                onChange={onUsernameChanged}
                required
            />
            <label className='signup__label' htmlFor="password">Password:</label>
            <input 
                type="password" 
                id="password"
                onChange={onPasswordChanged}
                required
                className='signup__input'
            />
            <label className='signup__label' htmlFor="passwordRepeat">Repeat password:</label>
            <input 
                type="password" 
                id="passwordRepeat"
                className='signup__input'
                onChange={onPasswordRepeatChanged}
                required
            />
            <button type="submit" className='signup__btn'>Sign up</button>
            {validationError && (
                <p>{validationError}</p>
            )}
        </form>
    )
}

export default NewUserForm