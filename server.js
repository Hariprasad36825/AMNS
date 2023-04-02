import app from './app'
import { connectDB } from './config/db_config'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { commentsListener } from './sockets/listeners/commentsListener'
import { chatsListener } from './sockets/listeners/chatsListener'

// Constants
const PORT = 8080
const HOST = '127.0.0.1'

const httpServer = createServer(app)

// socket initialization
const io = new Server(httpServer, {
  cors: {
    origin: '*'
  }
})
const commentsNamespace = io.of('/comments')
commentsListener(commentsNamespace, io)
const chatsNamespace = io.of('/chats')
chatsListener(chatsNamespace, io)

// App
connectDB().then(() => {
  httpServer.listen(PORT, HOST)
  console.log('connection establised on 127.0.0.1:8080')
})
