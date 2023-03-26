import { saveMessage } from '../../services/chat.services'

export const chatsListener = (chatsNamespace) => {
  /*
    chatsNamespace will emit connection as soon as a connection is established with the server.
  */

  chatsNamespace.on('connection', async (socket) => {
    try {
      console.log(`Client namespace connected with id ${socket.id}`)

      /*
        Event listener that fires when client connection gets disconnected
      */
      socket.on('disconnect', async (reason) => {
        console.log(
          `Client Namespace with id ${socket.id} disconnected due to ${reason}`
        )
      })

      /*
        Listens to error in client connection.
      */
      socket.on('connect_error', (err) => {
        console.log(`Client namespace connect_error due to ${err.message}`)
      })

      /*
        Creating a room for all new users.
      */
      socket.join(socket.data.roomId)

      socket.on('send_message', async (message) => {
        const roomId = message.roomId
        await saveMessage({
          author: message.author,
          message: message.body,
          media: message.media
        })

        socket.to(roomId).emit('receive_message', message)
      })
    } catch (error) {
      console.log(error?.stack)
    }
  })
}
