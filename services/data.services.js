import { CompanyModel, LocationModel } from '../models/data.model'

// location
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

// company
export const setCompany = async (companies) => {
  await CompanyModel.insertMany(
    companies.map((el) => {
      return { company: el }
    })
  )
}

export const getCompanies = async (searchStr) => {
  return await CompanyModel.find(
    { company: { $regex: searchStr } },
    { company: 1, _id: 0 },
    { transform: true }
  )
}
