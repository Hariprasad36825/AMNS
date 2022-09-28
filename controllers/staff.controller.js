import { userError } from '../errorResponses'
import { getStudentOfStaff } from '../services/staff.services'
import { OK } from '../statusCodes'

export const getStudentListUnderStaff = async (req, res) => {
  const staffID = req.user?._id
  // console.log(staffID)
  if (!staffID) throw new Error(userError.notDefined)
  res.status(OK).send(await getStudentOfStaff(staffID))
}
