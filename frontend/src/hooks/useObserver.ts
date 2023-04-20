import { useEffect, useRef } from 'react';

const options = {
  root: document.querySelector('.image-gallery__refetch-btn'),
  rootMargin: '100px',
  threshold: 1.0,
};

function useObserver<T extends HTMLElement>(stateFn: React.Dispatch<React.SetStateAction<number>>):
React.RefObject<T> {
  const containerRef = useRef<T>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          stateFn((prev) => prev + 1);
        }
      },
      options,
    );

    if (containerRef.current) observer.observe(containerRef.current as T);
    return () => observer.disconnect();
    // eslint-disable-next-line
    }, [])

  return containerRef;
}

export default useObserver;
