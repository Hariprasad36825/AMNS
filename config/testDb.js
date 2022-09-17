import { MongoMemoryServer } from 'mongodb-memory-server'
export default async () => {
  return await MongoMemoryServer.create()
}
