export const commentsListener = (commentsNamespace) => {
  /*
    commentsNamespace will emit connection as soon as a connection is established with the server.
  */
  commentsNamespace.on('connection', async (socket) => {
    try {
      console.log(`Client namespace connected with id ${socket.id}`)

      // will be chaged to posted id later
      socket.join(socket.data.user.email)

      socket.on('disconnect', async (reason) => {
        console.log(
          `Client Namespace with id ${socket.id} disconnected due to ${reason}`
        )
      })

      socket.on('connect_error', (err) => {
        console.log(`Client namespace connect_error due to ${err.message}`)
      })
    } catch (error) {
      console.log(error?.stack)
    }
  })
}
