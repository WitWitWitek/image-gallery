import { ErrorRequestHandler, Request, Response } from "express"

interface IError extends ErrorRequestHandler {
    message: string
}

export const errorHandler = (error: IError, req: Request, res: Response) => {
    res.status(res.statusCode || 500)
    res.json({message: error.message, isError: true})
}