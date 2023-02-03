import React, { useState } from 'react'
import '../../styles/Login.scss'
import { useLoginMutation } from './authApiSlice'
import { useDispatch } from 'react-redux'
import { setCredentials } from './authSlice'
import { useNavigate } from 'react-router-dom'
import usePersist from '../../hooks/usePersist'

const Login = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [persist, setPersist] = usePersist()
    const [login, { isSuccess, isLoading }] = useLoginMutation()

    const onUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)
    const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)

    const handleToggle = () => setPersist((prev: boolean) => !prev)
    const handleSubmission = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const { accessToken } = await login({username, password}).unwrap()
            isSuccess && dispatch(setCredentials({ accessToken }))
            setUsername('')
            setPassword('')
            navigate('/dashboard')
        } catch (err) {
            console.log(err);
            navigate('/login')
        }
    }

    return (
        <section className='login'>
            <h1>Login:</h1>
            <form className='login__form' onSubmit={handleSubmission}>
                <label htmlFor="username">Username:</label>
                <input
                    id="username"
                    className='login__input' 
                    type="text" 
                    autoComplete='off'
                    onChange={onUsernameChange}
                />
                <label htmlFor="password">Password:</label>
                <input
                    id="password"
                    className='login__input' 
                    type="password" 
                    autoComplete='off'
                    onChange={onPasswordChange}
                />

                <button className='login__button' type='submit'>{isLoading ? 'Loading...': 'Sign in'}</button>

                <label htmlFor="persist">
                    <input 
                        type="checkbox"
                        id='persist'
                        onChange={handleToggle}
                        checked={persist}
                    />
                    Remember this device
                </label>
            </form>
        </section>
    )
}

export default Login