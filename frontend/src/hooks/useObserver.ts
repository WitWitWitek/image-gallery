import { useEffect, useRef } from 'react'

const options = {
    root: null,
    rootMargin: "100px",
    threshold: 0.1,
}

function useObserver<T extends HTMLElement>(stateFn: React.Dispatch<React.SetStateAction<number>>): React.RefObject<T>[] {
    const containerRef = useRef<T>(null)

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
          const entry = entries[0]
          if (entry.isIntersecting) {
            stateFn(prev => prev + 1)
          }
        }, options)

        if (containerRef.current) observer.observe(containerRef.current as T)

        return () => {if (containerRef!.current) observer.unobserve(containerRef!.current as T)}
      }, [containerRef.current , stateFn])

      return [containerRef]
}

export default useObserver