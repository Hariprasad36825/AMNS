import { LocationMessage } from '../errorResponses'
import { getLocations, setLocation } from '../services/data.services'
import { OK } from '../statusCodes'

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
