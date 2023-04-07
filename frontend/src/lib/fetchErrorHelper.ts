export type IError = {
        data: {
            message: string
        },
        status: number
}

export function isErrorWithMessage(
  error: unknown
): error is IError {
  return (
    typeof error === 'object' &&
    error != null &&
    'data' in error &&
    'status' in error &&
    typeof (error as any).data.message === 'string' &&
    typeof (error as any).status === 'number'
  )
}