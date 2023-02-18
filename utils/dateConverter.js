import moment from 'moment'

export const convertDate = (dateString) => {
  const date = moment(dateString)
  if (date.isValid()) {
    return date.format('YYYY-MM-DD')
  } else {
    const newdate = moment(dateString, 'dd/mm/yyyy')
    if (newdate.isValid()) {
      return newdate.format('YYYY-MM-DD')
    } else {
      throw new Error('Invalid date.')
    }
  }
}
