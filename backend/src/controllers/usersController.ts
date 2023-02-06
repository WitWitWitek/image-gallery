import { RequestHandler } from 'express'
import User from '../models/User'
import bcrypt from 'bcrypt'

interface UserType {
    username: string
}

export const getAllUsers: RequestHandler = async (req, res, next) => {
    const allUsers: UserType[] = await User.find().select('-password')
    if (allUsers?.length === 0) {
        return res.status(400).json({message: 'No users found!'})
    }
    res.status(200).json(allUsers)
}

export const createNewUser: RequestHandler = async (req, res, next) => {
    const { username, password } = req.body;
    
    if(!username || !password) {
        return res.status(400).json({message: 'Credentials are required!'})
    }

    const userExist = await User.findOne({ username }).collation({locale: 'en', strength: 2}).exec()
    if (userExist) {
        return res.status(408).json({message: 'User already exists!'})
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