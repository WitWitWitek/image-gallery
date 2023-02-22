import { RequestHandler } from 'express'
import User from '../models/User'
import bcrypt from 'bcrypt'
import asyncHandler from 'express-async-handler';
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%.]).{8,24}$/;

interface UserType {
    username: string
}

export const getAllUsers: RequestHandler = asyncHandler(async (req, res, next) => {
        const allUsers: UserType[] = await User.find().select('-password')
        if (allUsers?.length === 0) {
            res.status(400).json({message: 'No users found!'})
            return;
        }
        res.status(200).json(allUsers)
    }
)

export const createNewUser: RequestHandler = asyncHandler(async (req, res, next) => {
    const { username, password } = req.body;
    
    if(!username || !password) {
        res.status(400).json({message: 'Credentials are required!'})
        return
    }

    const userExist = await User.findOne({ username }).collation({locale: 'en', strength: 2}).exec()
    if (userExist) {
        res.status(408).json({message: 'User already exists!'})
        return
    }

    if (!PASSWORD_REGEX.test(password)) {
        res.status(401).json({message: 'Invalid password!'})
        return
    }

    const hashedPwd = await bcrypt.hash(password, 10)
    const userObject = { username, password: hashedPwd }

    const user = await User.create(userObject)
    
    if (user) {
        res.status(201).json({ message: `New user ${username} created.`})
    } else {
        res.status(400).json({ message: 'Invalid user data received.' })
    }
})

export const updateUserPassword: RequestHandler = asyncHandler(async (req, res, next) => {
        const { username, password, newPassword } = req.body;
    
        if (!username || !password || !newPassword) {
            res.status(400).json({message: 'All fields are required!'})
            return;
        }
    
        const userExist = await User.findOne({ username }).exec()
        if (!userExist) {
            res.status(404).json({message: 'User doesn\'t exists'})
            return;
        }
    
        const pwdsMatch = await bcrypt.compare(password, userExist.password)
        if (!pwdsMatch) {
            res.status(400).json({message: 'Invalid old password!'})
            return;
        }
    
        if (!PASSWORD_REGEX.test(newPassword)) {
            res.status(400).json({message: 'Invalid new password!'})
            return;
        }
        const hashedPwd = await bcrypt.hash(newPassword, 10)
    
        await User.updateOne({username}, {$set: {password: hashedPwd}})
    
        res.status(201).json({message: 'Your password has been updated!'})
    
    }
)