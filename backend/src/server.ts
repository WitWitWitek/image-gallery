require('dotenv').config()
import express, {Request, Response, NextFunction} from 'express';
import path from 'path'
import imagesRoute from './routes/images'
import cors from 'cors'
import { corsOptions } from './config/corsOptions';
import multer from 'multer';
import connectMongoDb from './lib/connectMongoDb';
import mongoose from 'mongoose';
const app = express()

mongoose.set('strictQuery', false);
connectMongoDb()
app.use(cors(corsOptions))
app.use(express.json())
app.use(multer({ storage: multer.memoryStorage()}).single('file'))
app.use('/images', imagesRoute)

app.all('*', (req: Request, res: Response) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found'});
    } else {
        res.type('txt').send('404 Not Found');
    }
})


mongoose.connection.once('open', () => {
    console.log('MongoDb connected...');
    app.listen(3500, () => console.log('Server listening on port 3500'))
})