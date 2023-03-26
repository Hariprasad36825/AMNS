import { StaffModel } from '../models/staff.model'
import { StudentModel } from '../models/student.model'
import PDFDocument from '../utils/pdfKitTables'
import excelJS from 'exceljs'
import { appLogo } from '../config/index'

export const getStudentOfStaff = async (staffId) => {
  const students = await StudentModel.find({
    'advisor._id': staffId,
    'academics.year': 2019
  })
  return students
}

export const getStaffProfile = async (staffId) => {
  return await StaffModel.find(
    { user_id: staffId },
    { __v: 0, _id: 0, user_id: 0 }
  )
}

export const getStaffProfilePublicView = async (staffId) => {
  return await StaffModel.find(
    { _id: staffId },
    {
      __v: 0,
      _id: 0,
      user_id: 0,
      'personal_info.email': 0,
      'personal_info.phone': 0,
      'personal_info.location': 0
    }
  )
}

export const upsertStaffs = async (docs) => {
  return await StaffModel.bulkWrite(
    docs.map((doc) => ({
      updateOne: {
        filter: { 'personal_info.email': doc.personal_info.email },
        update: doc,
        upsert: true
      }
    }))
  )
}

export const getAllStaffs = async (searchStr, filter, records, skip) => {
  const nameQuery = { 'personal_info.name': { $regex: searchStr } }
  const query =
    searchStr !== ''
      ? { $or: [nameQuery, { $text: { $search: searchStr } }] }
      : { ...nameQuery }

  typeof filter !== 'undefined' &&
    Object.entries(filter).map(([key, value]) =>
      key === 'skills'
        ? (query[`${key}`] = { $elemMatch: { $in: value } })
        : (query[`${key}`] = { $in: value })
    )

  const staffs = await StaffModel.find(query, {
    'personal_info.birthday': 0,
    'personal_info.gender': 0
  })
    .populate({ path: 'user_id', select: 'profilePic' })
    .skip(skip)
    .limit(records)
  return staffs
}

export const getStaffColumns = () => {
  const paths = Object.keys(StaffModel.schema.paths)
  const columns = {}
  paths.map((item) => {
    const tmp = item.split('.').pop().replaceAll('_', ' ')
    columns[tmp.charAt(0).toUpperCase() + tmp.slice(1)] = item
    return item
  })
  delete columns[' id']
  delete columns['User id']
  delete columns['  v']
  return columns
}

export const getDefaultColumns = () => {
  const columns = getStaffColumns()
  const subset = Object.fromEntries(
    Object.entries(columns).filter(([key]) =>
      [
        'Name',
        'Email',
        'Phone',
        'Location',
        'Department name',
        'Year',
        'Designation'
      ].includes(key)
    )
  )
  return subset
}

const convertRawData = (rawData, mappings) => {
  const get = (t, path) => path.split('.').reduce((r, k) => r?.[k], t)

  const rows = []
  rawData.forEach((val) => {
    const row = []
    Object.entries(mappings).forEach(([key, value]) => {
      const cell = get(val, value)

      if (key.toLowerCase() === 'birthday' && cell) {
        const dateStr = new Date(cell)
        dateStr.toLocaleDateString()
        const datetime = dateStr.toISOString().split('T')
        row.push(datetime[0])
      } else {
        row.push(cell ? cell.toString() : 'NIL')
      }
    })
    rows.push(row)
  })

  return rows
}

export const getPdf = async (searchStr, filter, rawData, mappings, res) => {
  const doc = new PDFDocument()

  let filterString = ''

  if (Object.keys(filter).length > 0) {
    for (const key in Object.keys(filter)) {
      filterString += `${key} : ${toString(filter[key])}`
    }
  }
  const img = Buffer.from(appLogo, 'base64')
  doc
    .image(img, 50, 30, {
      width: 100,
      height: 100
    })
    .fillColor('#444444')
    .fontSize(20)
    .fontSize(10)
    .text(`Search String : ${searchStr}`, 200, 65, { align: 'right' })
    .text(
      `Filters applied : ${filterString.length > 0 ? filterString : 'N.A'}`,
      200,
      80,
      { align: 'right' }
    )
    .moveDown()
  const rows = await convertRawData(rawData, mappings)
  const table = {
    headers: [...Object.keys(mappings)],
    rows: [...rows]
  }

  doc.moveDown().table(table, 10, 125, { width: 620 })

  doc.pipe(res)

  doc.end()
}

export const getXLSX = async (searchStr, filter, rawData, mappings) => {
  const workbook = new excelJS.Workbook()
  const worksheet = workbook.addWorksheet('search results')

  const rows = await convertRawData(rawData, mappings)
  const columns = []

  Object.keys(mappings).forEach((val) => {
    columns.push({ name: val, filterButton: true })
  })

  worksheet.addTable({
    name: 'MyTable',
    ref: 'A1',
    headerRow: true,
    style: {
      theme: 'TableStyleLight12',
      showRowStripes: true
    },
    columns: [...columns],
    rows: [...rows]
  })

  worksheet.columns.forEach((column) => {
    const lengths = column.values.map((v) => v.toString().length)
    const maxLength = Math.max(...lengths.filter((v) => typeof v === 'number'))
    column.width = maxLength + 3
  })

  const buffer = await workbook.xlsx.writeBuffer()

  return buffer
}
