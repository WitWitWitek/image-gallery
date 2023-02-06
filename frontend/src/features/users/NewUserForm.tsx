import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateNewUserMutation } from './usersApiSlice'

const NewUserForm = () => {
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const navigate = useNavigate()

    const [createNewUser, {
        isSuccess,
        // isError,
        // error
    }] = useCreateNewUserMutation()

    const handleSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!username || !password) {
            alert('All inputs required!')
            return
        }
        await createNewUser({username, password}).unwrap()
    }

    useEffect(() => {
        if (isSuccess) {
            setPassword('')
            setUsername('')
            navigate('/login')
        }
    }, [isSuccess, navigate])

    const onUsernameChanged = (e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)
    const onPasswordChanged = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)

    return (
        <form onSubmit={handleSubmission}>
            <label htmlFor="username">Username:</label>
            <input 
                type="text" 
                id="username"
                onChange={onUsernameChanged}
            />
            <label htmlFor="password">Password:</label>
            <input 
                type="password" 
                id="password"
                onChange={onPasswordChanged}
            />
            <button type="submit">Sign up</button>
        </form>
    )
}

export default NewUserForm