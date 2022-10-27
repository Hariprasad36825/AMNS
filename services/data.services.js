import { LocationModel } from '../models/data.model'

export const setLocation = async (locations) => {
  await LocationModel.insertMany(
    locations.map((el) => {
      return { location: el }
    })
  )
}

export const getLocations = async (searchStr) => {
  return await LocationModel.find(
    { location: { $regex: searchStr } },
    { location: 1, _id: 0 },
    { transform: true }
  )
}
