import jwt from 'jsonwebtoken'
import { jwtSecret } from '../config/index'
import { errorMessageWrapper, tokenError } from '../errorResponses'
import { FORBIDDEN_REQUEST, INVALID_TOKEN } from '../statusCodes'

export const isAuthorised = (role) => (req, res, next) => {
  let token = req.header('authorization')
  // console.log(req.body)
  if (!token) {
    return res
      .status(INVALID_TOKEN)
      .send(errorMessageWrapper(tokenError.notFound))
  }
  token = token.split(' ')[1]
  jwt.verify(token, jwtSecret, (error, decoded) => {
    if (error) {
      if (error.name === 'TokenExpiredError') {
        return res
          .status(FORBIDDEN_REQUEST)
          .send(errorMessageWrapper(tokenError.expired))
      }
      return res
        .status(INVALID_TOKEN)
        .send(errorMessageWrapper(tokenError.invalid))
    }
    if (role && decoded.user.type !== role) {
      return res
        .status(FORBIDDEN_REQUEST)
        .send(errorMessageWrapper(tokenError.notAuthorised))
    }
    req.user = decoded.user
    // console.log(req.user)
    next()
  })
}
