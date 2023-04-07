import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_IP,
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    })
    
export const mailOptions = (recipent: string, href: string) => ({
    from: process.env.EMAIL_ADDRESS,
    to: recipent,
    subject: 'Confirm your account on Image-Gallery',
    html: `${href}`,
})
