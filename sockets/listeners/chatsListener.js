import { saveMessage } from '../../services/chat.services'

export const chatsListener = (chatsNamespace, io) => {
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
        socket.leave(socket.roomId)
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
      socket.on('setup_connection', async (data) => {
        socket.join(data.roomId)
        socket.roomId = data.roomId
      })

      socket.on('send_message', async (data) => {
        const isMessageSaved = await saveMessage(data.roomId, {
          author: data.author,
          message: data.body,
          media: data.media
        })

        console.log(socket.rooms)

        if (isMessageSaved) {
          chatsNamespace.emit('receive_message', isMessageSaved)
        }
      })
    } catch (error) {
      console.log(error.stack)
    }
  })
}
