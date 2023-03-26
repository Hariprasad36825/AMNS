import {
  errorMessageWrapper,
  roomMessage,
  successMessageWrapper
} from '../errorResponses'
import { addOrFindroom } from '../services/chat.services'
import { BAD_REQUEST, CREATION_SUCCESSFULL } from '../statusCodes'

export const findOrcreate = async (req, res) => {
  const { roomName, members } = req.body

  const room = await addOrFindroom(roomName, members)

  if (room) {
    return res.staus(CREATION_SUCCESSFULL).send(successMessageWrapper(room))
  }

  return res.status(BAD_REQUEST).send(errorMessageWrapper(roomMessage.error))
}
