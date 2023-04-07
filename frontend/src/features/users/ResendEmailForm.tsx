import { useState, useEffect } from 'react'
import { useResendVerificationEmailMutation } from "./usersApiSlice"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons'
import { isErrorWithMessage } from '../../lib/fetchErrorHelper'

export default function ResendEmailForm() {
    const [email, setEmail] = useState<string>('')
    const [errMessage, setErrMessage] = useState<string>('')
    const [resendEmail, { isSuccess, isError, isLoading }] = useResendVerificationEmailMutation()

    const onEmailChanged = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)

    const handleSubmission = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await resendEmail(email).unwrap()
        } catch (err) {
            if (isErrorWithMessage(err)) {
                setErrMessage(err.data.message)
            }
        }
    }

    useEffect(() => {
      if (isSuccess) {
        setEmail('')
      }
    }, [isSuccess])
    

    return (
        <section className='form-section'>
            <h2 className='form-section__title'>Resend verification <br /> e-mail:</h2>
            <form className='form-section__form' onSubmit={handleSubmission}>
                <label className='form-section__label' htmlFor="email">
                    E-mail:
                        <input 
                        type="email" 
                        id="email"
                        className='form-section__input'
                        onChange={onEmailChanged}
                        required
                    />
                </label>
                <button type="submit" className='form-section__button' disabled={isLoading}>{isLoading ? 'Loading...' : 'Resend'}</button>
                {isError && 
                    <div className='form-section__error'>
                        <p className='form-section__error-paragraph'><FontAwesomeIcon icon={faCircleExclamation} /> {errMessage}</p>
                    </div>
                }
            </form>
        </section>
    )
}