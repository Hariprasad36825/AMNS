import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

dotenv.config()
export const jwtSecret = process.env.JWT_SECRET || 'abc'
export const jwtSecretRefersh = process.env.JWT_SECRET_REFRESH || 'cde'
export const mongoURI = process.env.mongoURI || ''
export const defaultAvatar = 'avatar.png'
export const appLogo = fs.readFileSync(
  '../AMNS/assets/MicrosoftTeams-image.png',
  'base64'
)

const folderPath = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath)
}
