import { CompanyMessage, LocationMessage } from '../errorResponses'
import {
  getCompanies,
  getLocations,
  setCompany,
  setLocation
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
