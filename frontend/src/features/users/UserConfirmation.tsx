import { useEffect, useState } from 'react'
import { Link, useParams } from "react-router-dom"
import { useConfirmUserMutation } from './usersApiSlice'
import { isErrorWithMessage } from '../../lib/fetchErrorHelper'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck, faCircleExclamation } from '@fortawesome/free-solid-svg-icons'

export default function UserConfirmation() {
  const { emailToken } = useParams()
  let content;
  const [errMessage, setErrMessage] = useState<string>('')
  const [confirmation, { isSuccess, isError } ] = useConfirmUserMutation()

  useEffect(() => {
    const sendToken = async () => {
      if (emailToken) {
        try {
          await confirmation(emailToken).unwrap()
        } catch (err) {
          if (isErrorWithMessage(err)) {
            return setErrMessage(err.data.message)
          }
          setErrMessage('Error related to user confirmation occured.')
        }
      }
    }

    sendToken()
  }, [])
  
  content = (
    <div className="dashboard__confirmation">
      <div className="dashboard__confirmation-icon">
        <FontAwesomeIcon icon={faCircleExclamation}/>
      </div>
      <p className="dashboard__confirmation-paragraph">{errMessage}</p>
      <p className="dashboard__confirmation-paragraph">Try to: <Link to='/resend-email' className="public__btn-login">Resend Email</Link></p>
    </div>
  )

  if (isSuccess) {
    content = (
      <div className="dashboard__confirmation">
        <div className="dashboard__confirmation-icon">
          <FontAwesomeIcon icon={faCircleCheck}/>
        </div>
        <p className="dashboard__confirmation-paragraph">User successfully confirmed.</p>
        <p className="dashboard__confirmation-paragraph">Please: <Link to='/login' className="public__btn-login">Login</Link></p>
      </div>
    )
  } else if (isError) {
    content = (
      <div className="dashboard__confirmation">
        <div className="dashboard__confirmation-icon">
          <FontAwesomeIcon icon={faCircleExclamation}/>
        </div>
        <p className="dashboard__confirmation-paragraph">{errMessage}</p>
        <p className="dashboard__confirmation-paragraph">Try to: <Link to='/resend-email' className="public__btn-login">Resend Email</Link></p>
      </div>
    )
  } else {
    content = <p>Loading...</p>
  }
  
  return content;
}