import {
  CompanyMessage,
  DepartmentMessage,
  LocationMessage,
  SkillMessage
} from '../errorResponses'
import {
  getAllAdvisors,
  getCompanies,
  getDepartments,
  getLocations,
  getSkills,
  setCompany,
  setDepartment,
  setLocation,
  setSkills
} from '../services/data.services'
import { OK } from '../statusCodes'

// location
export const getAllLocation = async (req, res) => {
  const searchStr = req.params.searchStr
  res
    .status(OK)
    .send(await (await getLocations(searchStr)).map((obj) => obj.location))
}

export const addLocation = async (req, res) => {
  const loc = req.body.location
  await setLocation(typeof loc === 'string' ? [loc] : loc)
  res.status(OK).send({ message: LocationMessage.added })
}

// company
export const getCompany = async (req, res) => {
  const searchStr = req.params.searchStr

  res
    .status(OK)
    .send(await (await getCompanies(searchStr)).map((obj) => obj.company))
}

export const addCompany = async (req, res) => {
  const com = req.body.company
  await setCompany(typeof com === 'string' ? [com] : com)
  res.status(OK).send({ message: CompanyMessage.added })
}

// department
export const getDepartment = async (req, res) => {
  const id = req.params.id
  res
    .status(OK)
    .send(await (await getDepartments(id)).map((obj) => obj.department)[id - 1])
}

export const addDepartment = async (req, res) => {
  const dept = req.body.department
  const id = req.body._id
  await setDepartment(id, typeof dept === 'string' ? [dept] : dept)
  res.status(OK).send({ message: DepartmentMessage.added })
}

// skills
export const getSkill = async (req, res) => {
  const id = req.params.id
  res
    .status(OK)
    .send(await (await getSkills(id)).map((obj) => obj.skills)[id - 1])
}

export const addSkill = async (req, res) => {
  const skill = req.body.skills
  const id = req.body._id
  await setSkills(id, typeof skill === 'string' ? [skill] : skill)
  res.status(OK).send({ message: SkillMessage.added })
}

// advisor namelist
export const getAdvisors = async (req, res) => {
  res.status(OK).send(await getAllAdvisors())
}
