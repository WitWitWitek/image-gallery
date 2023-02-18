import { useEffect, useState } from 'react'
import { useChangeUserPasswordMutation } from './usersApiSlice';
import '../../styles/NewUserForm.scss'
import useToken from '../../hooks/useToken';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%.]).{8,24}$/;

const ChangePasswordForm = () => {
    const username = useToken()
    const [currentPassword, setCurrentPassword] = useState<string>('')
    const [newPassword, setNewPassword] = useState<string>('')
    const [newPasswordRepeat, setNewPasswordRepeat] = useState<string>('')
    const [passwordsMatch, setPasswordsMatch] = useState<boolean>(false)
    const [validPassword, setValidPassword] = useState<boolean>(false)
    const [validationError, setValidationError] = useState<string>('')

    const [changeUserPassword, {
        isSuccess,
        isError,
        error
    }] = useChangeUserPasswordMutation()
 
    const canSave = currentPassword.trim() !== '' && validPassword && passwordsMatch

    const handleSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!canSave) {
            setValidationError('All fields are required!')
        } 
        await changeUserPassword({
            username,
            password: currentPassword,
            newPassword
        }).unwrap()
    }

    useEffect(() => {
        setCurrentPassword('')
        setNewPassword('')
        setNewPasswordRepeat('')
    }, [isSuccess])

    useEffect(() => {
        setValidPassword(PASSWORD_REGEX.test(newPassword))
        setPasswordsMatch(newPassword === newPasswordRepeat)
    }, [newPassword, newPasswordRepeat])

    const onCurrentPasswordChanged = (e: React.ChangeEvent<HTMLInputElement>) => setCurrentPassword(e.target.value)
    const onNewPasswordChanged = (e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)
    const onNewPasswordRepeatChanged = (e: React.ChangeEvent<HTMLInputElement>) => setNewPasswordRepeat(e.target.value)

    return (
        <section className='signup'>
                <h2 className='signup__label'>Change password:</h2>
                <form className='signup__form'onSubmit={handleSubmission}>
                    <label className='signup__label' htmlFor="currentPassword">Current Password:</label>
                    <input 
                        type="password"
                        autoComplete='off' 
                        id="currentPassword"
                        className='signup__input'
                        onChange={onCurrentPasswordChanged}
                        required
                    />
                    <label className='signup__label' htmlFor="newPassword">New password:</label>
                    <input
                        type="password" 
                        id="newPassword"
                        onChange={onNewPasswordChanged}
                        required
                        className='signup__input'
                    />
                    <label className='signup__label' htmlFor="newPasswordRepeat">Repeat new password:</label>
                    <input 
                        type="password" 
                        id="newPasswordRepeat"
                        className='signup__input'
                        onChange={onNewPasswordRepeatChanged}
                        required
                    />
                    <button type="submit" className='signup__btn'>Update passwaord</button>
                    {validationError && (
                        <p>{validationError}</p>
                    )}
                </form>
            </section>
    )
}

export default ChangePasswordForm