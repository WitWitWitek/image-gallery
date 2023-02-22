import User from "../models/User";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { RequestHandler } from 'express'
import asyncHandler from 'express-async-handler';

export const login: RequestHandler = async (req, res, next) => {
    const { username, password } = req.body
    if (!username || !password) {
        res.status(400).json({ message: 'All credentials are required' })
        return;
    }

    const foundUser = await User.findOne({ username })
    const passwordsMatch = await bcrypt.compare(password, foundUser!.password)

    if (!passwordsMatch) {
        res.status(401).json({ message: 'Unathorized'})
        return;
    }

    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "username": foundUser!.username
            }
        },
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: '15m'}
    )

    const refreshToken = jwt.sign(
        { "username": foundUser?.username },
        process.env.REFRESH_TOKEN_SECRET as string,
        { expiresIn: '1d'}
    )
    
    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.json({ accessToken })
}

export const refresh: RequestHandler = asyncHandler(async (req, res, next) => {
    const cookies = req.cookies
    if (!cookies?.jwt) {
        res.status(401).json({ message: 'Unauthorized' })
        return;
    }

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET as string,
        // find TYPES @@@@@@@@@@@@
        (async (err: any, decoded: any) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })

            const foundUser = await User.findOne({ username: decoded.username }).exec()

            if (!foundUser) return res.status(401).json({ message: 'Unauthorized' })

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": foundUser.username,
                    }
                },
                process.env.ACCESS_TOKEN_SECRET as string,
                { expiresIn: '15m' }
            )

            res.json({ accessToken })
        })
    )
}) 

export const logut: RequestHandler = asyncHandler(async (req, res, next) => {
    const cookies = req.cookies
    if (!cookies?.jwt) {
        res.sendStatus(204)
        return;
    }
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true })
    res.json({ message: 'Cookie cleared' })
}) 