import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config()
export const jwtSecret = process.env.JWT_SECRET || 'abc'
export const jwtSecretRefersh = process.env.JWT_SECRET_REFRESH || 'cde'
export const mongoURI = process.env.mongoURI || ''
export const defaultAvatar =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Faenza-avatar-default-symbolic.svg/120px-Faenza-avatar-default-symbolic.svg.png?20180510194227'
export const appLogo = fs.readFileSync(
  '../AMNS/assets/MicrosoftTeams-image.png',
  'base64'
)
