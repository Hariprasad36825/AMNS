import sgMail from '@sendgrid/mail'
import dotenv from 'dotenv'
dotenv.config()

const mailApi = process.env.SENDGRID_API_KEY

sgMail.setApiKey(mailApi)

export default sgMail
