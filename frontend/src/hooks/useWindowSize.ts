import { useState, useEffect } from "react"

interface WindowParams {
    width: number | null,
    height: number | null,
}

const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState<WindowParams>({
        width: null,
        height: null,
    })

    useEffect(() => {
        setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            })
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            })
        }
        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return { windowSize }
}

export default useWindowSize