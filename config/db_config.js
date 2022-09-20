import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { mongoURI } from '.'

let mongod = MongoMemoryServer | null
export const connectDB = async () => {
  let dbUrl = mongoURI
  if (process.env.NODE_ENV === 'test') {
    const testDb = await import('./testDb')
    mongod = await testDb.default()
    dbUrl = mongod.getUri()
  }

  await mongoose.connect(dbUrl)
  // console.log('DB connected')
}

export const disconnectDB = async () => {
  await mongoose.connection.close()
  if (mongod) {
    await mongod.stop()
  }
}
