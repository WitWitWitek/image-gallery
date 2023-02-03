import { useSelector } from "react-redux"
import { Outlet } from "react-router-dom"
import usePersist from "../../hooks/usePersist"
import { useRefreshMutation } from "./authApiSlice"
import { selectCurrentToken } from "./authSlice"
import { useState, useEffect, useRef } from 'react'

const PersistLogin = () => {
    const effectRan = useRef(false)
    const [persist] = usePersist()
    const token = useSelector(selectCurrentToken)

    const [trueSuccess, setTrueSuccess] = useState<boolean>(false)

    const [refresh, {
        isUninitialized,
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
        if (!token && persist) verifyRefreshToken()
      }
      return () => {
        effectRan.current = true
      }
      // eslint-disable-next-line
    }, [])
    
    if (!persist) return <Outlet />
    if (isLoading) return <p>Loading...</p>
    if (isError) return <p>Error occured...</p>
    if (token && isUninitialized) return <Outlet />
    return (
      <>
        {isSuccess && trueSuccess && (<Outlet />)}
      </>
    )
}

export default PersistLogin