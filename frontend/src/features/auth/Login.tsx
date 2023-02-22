import React, { useState } from 'react'
import '../../styles/Login.scss'
import { useLoginMutation } from './authApiSlice'
import { useDispatch } from 'react-redux'
import { setCredentials } from './authSlice'
import { Link, useNavigate } from 'react-router-dom'

interface error {
    data: {
        message: string
    },
    status: number
}

const Login = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [login, { isLoading }] = useLoginMutation()

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
            console.log((err as error).data.message);
            navigate('/login')
        }
    }

    return (
        <section className='login'>
            <h1 className='login__label'>Login:</h1>
            <form className='login__form' onSubmit={handleSubmission}>
                <label className='login__label' htmlFor="username">Username:</label>
                <input
                    id="username"
                    className='login__input' 
                    type="text" 
                    autoComplete='off'
                    onChange={onUsernameChange}
                />
                <label className='login__label' htmlFor="password">Password:</label>
                <input
                    id="password"
                    className='login__input' 
                    type="password" 
                    autoComplete='off'
                    onChange={onPasswordChange}
                />

                <button className='login__button' type='submit'>{isLoading ? 'Loading...': 'Sign in'}</button>
            </form>
            <p className='login__linkto'>No account yet? <Link to='/signup'>Sign up</Link></p>
        </section>
    )
}

export default Login