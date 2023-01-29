import { useState, useEffect } from 'react'

const convertDataToLocaleString = (data: string) => {
    return new Date(data).toLocaleDateString('en-EN', {
      year: 'numeric',
      month: 'short',
      day: "numeric", 
      hour: "numeric",
      minute: 'numeric',
    })
}

const useDate = (creationDate: string, editionDate: string): {date: string} => {
    const [date, setDate] = useState<string>('')

    useEffect(() => {
        const createdAtMs = new Date(creationDate).getTime()
        const updatedAtMs = new Date(editionDate).getTime()
    
        if (createdAtMs < updatedAtMs) {
          setDate('Edited at: ' + convertDataToLocaleString(editionDate))
        } else {
          setDate('Created at: ' + convertDataToLocaleString(creationDate))
        }
      }, [creationDate, editionDate])

    return { date }
}

export default useDate