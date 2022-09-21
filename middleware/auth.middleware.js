import jwt from 'jsonwebtoken'
import { jwtSecret } from '../config/index'
import { tokenError, wrapper } from '../errorResponses'
import { FORBIDDEN_REQUEST, INVALID_TOKEN } from '../statusCodes'

export const isAuthorised = (role) => (req, res, next) => {
  const token = req.header('x-auth-token')
  // console.log(token, jwtSecret)
  if (!token) {
    return res.status(INVALID_TOKEN).send(wrapper(tokenError.notFound))
  }
  jwt.verify(token, jwtSecret, (error, decoded) => {
    if (error) {
      return res.status(INVALID_TOKEN).send(wrapper(tokenError.invalid))
    }
    if (role && decoded.user.type !== role) {
      return res
        .status(FORBIDDEN_REQUEST)
        .send(wrapper(tokenError.notAuthorised))
    }
    req.user = decoded.user
    // console.log(req.user)
    next()
  })
}
