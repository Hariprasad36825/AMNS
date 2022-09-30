import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { jwtSecret, jwtSecretRefersh } from '../config/index'
import { TokenModel } from '../models/token.model'

export const createAuthToken = (user) => {
  const payload = {
    user
  }
  const AccessToken = jwt.sign(payload, jwtSecret, { expiresIn: '2h' })
  return AccessToken
}

export const createRefreshToken = (user, oldUid) => {
  const uid = uuidv4()

  const RefreshPayload = {
    uid,
    _id: user._id
  }

  oldUid === undefined
    ? InsertToken(RefreshPayload)
    : updateToken(oldUid, RefreshPayload)

  const refreshToken = jwt.sign(RefreshPayload, jwtSecretRefersh, {
    expiresIn: '30d'
  })
  return refreshToken
}

export const updateToken = async (oldUid, payload) => {
  await TokenModel.updateOne(
    { uid: oldUid },
    { uid: payload.uid },
    { upsert: true }
  )
}

export const InsertToken = async ({ uid, user }) => {
  await new TokenModel({ uid, user }).save()
}
