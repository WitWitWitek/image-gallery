import { allowedOrigins } from "./allowedOrigins"

export const corsOptions = {
    origin: function (origin: any, callback: any) {
        console.log(origin);
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}