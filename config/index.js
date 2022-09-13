import dotenv from 'dotenv'

dotenv.config()
export const jwtSecret = process.env.JWT_SECRET || 'abc'
export const mongoURI = process.env.mongoURI || ''
