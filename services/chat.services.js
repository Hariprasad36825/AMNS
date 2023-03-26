import { ChatsModel } from '../models/chats.model'

export const addOrFindroom = async (roomName, members) => {
  console.log('adding room ' + roomName)
  const chatRoom = await ChatsModel.findOrCreate({ roomName, members })

  console.log(chatRoom)
  return chatRoom
}

export const saveMessage = async (roomId, message) => {
  const chatRoom = await ChatsModel.findById(roomId)
  chatRoom.messages.push(message)
  await chatRoom.save()
  return chatRoom
}
