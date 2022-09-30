import jwt from 'jsonwebtoken'
import { jwtSecretRefersh } from '../config/index'
import { tokenError, userError, wrapper } from '../errorResponses'
import { createRefreshToken } from '../services/token.services'
import { getUserWithId } from '../services/user.services'
import { FORBIDDEN_REQUEST, INVALID_TOKEN } from '../statusCodes'

export const verifyToken = () => (req, res, next) => {
  let token = req.body.refreshToken
  // console.log(token)
  if (!token) {
    return res.status(INVALID_TOKEN).send(wrapper(tokenError.notFound))
  }
  jwt.verify(token, jwtSecretRefersh, async (error, decoded) => {
    let user
    if (error) {
      if (error.name === 'TokenExpiredError') {
        const payload = jwt.verify(token, jwtSecretRefersh, {
          ignoreExpiration: true
        })
        // console.log(payload)
        token = await createRefreshToken({ user: payload._id }, payload.uid)
        user = payload._id
      } else {
        return res.status(INVALID_TOKEN).send(wrapper(tokenError.invalid))
      }
    }
    if (decoded) {
      user = decoded._id
    }
    user = await getUserWithId(user)
    if (!user) {
      return res.status(INVALID_TOKEN).send(wrapper(tokenError.invalid))
    }
    if (user.status !== 'active') {
      return res
        .status(FORBIDDEN_REQUEST)
        .send(wrapper(userError.InvalidAccount))
    }
    req.user = user
    // console.log(req.user)
    next()
  })
}
