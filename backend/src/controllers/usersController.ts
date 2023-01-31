import { RequestHandler } from 'express'
import User from '../models/User'
import bcrypt from 'bcrypt'

export const createNewUser: RequestHandler = async (req, res, next) => {
    const { username, password } = req.body;

    if(!username || !password) {
        return res.status(400).json({message: 'Credentials are required!'})
    }

    const hashedPwd = await bcrypt.hash(password, 10)
    const userObject = { username, password: hashedPwd }

    const user = await User.create(userObject)
    
    if (user) {
        res.status(201).json({ message: `New user ${username} created.`})
    } else {
        res.status(400).json({ message: 'Invalid user data received.' })
    }
}