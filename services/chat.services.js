import { ChatsModel } from '../models/chats.model'

export const findRoom = async (roomId) => {
  console.log(roomId)
  const chatRoom = await ChatsModel.findById(roomId)
  return chatRoom
}

export const addOrFindroom = async (roomName, members) => {
  const chatRoom = await ChatsModel.findOrCreate({
    room_name: roomName,
    members
  })
  return chatRoom
}

export const saveMessage = async (roomId, message) => {
  const chatRoom = await ChatsModel.findById(roomId)
  chatRoom.messages.push(message)
  await chatRoom.save()
  return chatRoom
}

export const getRooms = async (userId) => {
  console.log('getRooms', userId)
  const rooms = await ChatsModel.find({ members: userId })
    .populate({
      path: 'members',
      select: '_id name username'
    })
    .select('_id room_name members')

  return rooms
}
