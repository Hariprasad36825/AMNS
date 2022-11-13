import { StaffModel } from '../models/staff.model'
import { CompanyModel, DataModel, LocationModel } from '../models/data.model'

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

// department
export const getDepartments = async (id) => {
  return await DataModel.find({ _id: id }, { _id: 0, __v: 0, skills: 0 })
}
export const setDepartment = async (id, dept) => {
  await DataModel.updateOne({ _id: id }, { department: dept }, { upsert: true })
}

// skills
export const getSkills = async (id) => {
  return await DataModel.find({ _id: id }, { _id: 0, __v: 0, department: 0 })
}
export const setSkills = async (id, skill) => {
  await DataModel.updateOne({ _id: id }, { skills: skill }, { upsert: true })
}

// advisors
export const getAllAdvisors = async () => {
  return (await StaffModel.find({})).map((obj) => obj.personal_info.name)
}
