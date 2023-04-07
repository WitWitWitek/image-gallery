const convertDataToLocaleString = (data: string) => {
    return new Date(data).toLocaleDateString('en-EN', {
      year: 'numeric',
      month: 'short',
      day: "numeric", 
      hour: "numeric",
      minute: 'numeric',
    })
}

export const dateHelper = (creationDate: string, editionDate: string): string => {
    const createdAtMs = new Date(creationDate).getTime()
    const updatedAtMs = new Date(editionDate).getTime()

    if (createdAtMs < updatedAtMs) {
      return 'Edited at: ' + convertDataToLocaleString(editionDate)
    } else {
      return 'Created at: ' + convertDataToLocaleString(creationDate)
    }
}