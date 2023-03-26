import { ChatsModel } from '../models/chats.model'

export const addOrFindroom = async (roomName, members) => {
  const chatRoom = await ChatsModel.findOrCreate({ roomName, members })

  return chatRoom
}

export const saveMessage = async (roomId, message) => {
  const chatRoom = await ChatsModel.findById(roomId)
  chatRoom.messages.push(message)
  await chatRoom.save()
  return chatRoom
}
