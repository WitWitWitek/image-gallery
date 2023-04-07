import React, { useState  } from 'react'
import '../../styles/Forms.scss'
import { useLoginMutation } from './authApiSlice'
import { useDispatch } from 'react-redux'
import { setCredentials } from './authSlice'
import { Link, useNavigate } from 'react-router-dom'
import { isErrorWithMessage, IError } from '../../lib/fetchErrorHelper'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleExclamation, faEye, faCircleCheck } from '@fortawesome/free-solid-svg-icons'



const Login = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false)
    const [loginError, setLoginError] = useState<IError>()

    const [login, { isSuccess, isLoading, isError }] = useLoginMutation()

    const onUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)
    const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)

    const handleSubmission = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const { accessToken } = await login({username, password}).unwrap()
            dispatch(setCredentials({ accessToken }))
            setUsername('')
            setPassword('')
            navigate('/dashboard')
        } catch (err) {
            if (isErrorWithMessage(err)) {
                setLoginError(err)
            }
            navigate('/login') 
        }
    }

    return (
        <section className='form-section'>
            <h2 className='form-section__title'>Login:</h2>
            <form className='form-section__form' onSubmit={handleSubmission}>
                <label className='form-section__label' htmlFor="username">
                    Username:
                    <input
                        id="username"
                        className='form-section__input' 
                        type="text" 
                        onChange={onUsernameChange}
                        required
                    />
                </label>
                <label className='form-section__label' htmlFor="password">
                    Password:
                    <input
                        id="password"
                        className='form-section__input' 
                        type={isPasswordVisible ? "text" : "password"} 
                        autoComplete='off'
                        onChange={onPasswordChange}
                        required
                    />
                    <button type="button" className='form-section__password-button' onClick={() => setIsPasswordVisible(prev => !prev)}>
                            <FontAwesomeIcon icon={faEye} />
                    </button>
                </label>
                <button className='form-section__button' type='submit' disabled={isLoading}>{isLoading ? 'Loading...': 'Sign in'}</button>
            </form>
            <p className='form-section__linkto'>No account yet? <Link to='/signup' className='form-section__button'>Sign up</Link></p>
            {isError && 
                <div className='form-section__error'>
                    <p className='form-section__error-paragraph'><FontAwesomeIcon icon={faCircleExclamation} /> {loginError?.data.message}</p>
                    <p className='form-section__error-paragraph'>Is your account unconfirmed?</p>
                    <p className='form-section__error-paragraph'>Resend verification <Link to='/resend-email' className="public__btn-login">e-mail</Link></p>
                </div>
            }
            {isSuccess && 
                <div className='form-section__success'>
                    <p className='form-section__success-paragraph'><FontAwesomeIcon icon={faCircleCheck} /> User successfully logged in.</p>
                </div>
            }
        </section>
    )
}

export default Login