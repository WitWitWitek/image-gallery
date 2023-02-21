import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"
import { useRefreshMutation } from "./authApiSlice"
import { selectCurrentToken } from "./authSlice"
import { useState, useEffect, useRef } from 'react'

const PersistLogin = () => {
    const effectRan = useRef(false)
    const token = useSelector(selectCurrentToken)

    const [trueSuccess, setTrueSuccess] = useState<boolean>(false)

    const [refresh, {
        isLoading,
        isSuccess,
        isError,
        // error
    }] = useRefreshMutation()


    useEffect(() => {
      if (effectRan.current === true) {
        const verifyRefreshToken = async () => {
          try {
              await refresh('')
              setTrueSuccess(true)
          } catch (err) {
              console.log(err)
          }
        }
        if (!token) verifyRefreshToken()
      }
      return () => {
        effectRan.current = true
      }
      // eslint-disable-next-line
    }, [])
    
    if (isLoading) return <p>Loading...</p>
    if (isError) return <Navigate to='/login' />
    if (token) return <Outlet />
    
    return (
      <>
        {isSuccess && trueSuccess && (<Outlet />)}
      </>
    )
}

export default PersistLogin