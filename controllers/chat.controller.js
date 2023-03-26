import {
  errorMessageWrapper,
  roomMessage,
  successMessageWrapper
} from '../errorResponses'
import { addOrFindroom, findRoom, getRooms } from '../services/chat.services'
import { BAD_REQUEST, CREATION_SUCCESS, OK } from '../statusCodes'

export const findOrcreate = async (req, res) => {
  const { roomName, members } = req.body

  const room = await addOrFindroom(roomName, members)

  if (room) {
    return res.status(CREATION_SUCCESS).send(successMessageWrapper(room))
  }

  return res.status(BAD_REQUEST).send(errorMessageWrapper(roomMessage.error))
}

export const index = async (req, res) => {
  const userId = req.params.userId
  const rooms = await getRooms(userId)
  if (rooms) {
    return res.status(OK).send(rooms)
  }

  return res.status(BAD_REQUEST).send(errorMessageWrapper(roomMessage.error))
}

export const show = async (req, res) => {
  const roomId = req.params.roomId

  const data = await findRoom(roomId)

  if (data) {
    return res.status(OK).send(data)
  }

  return res.status(BAD_REQUEST).send(errorMessageWrapper(roomMessage.error))
}
