import excelJS from 'exceljs'
import mongoose from 'mongoose'
import { appLogo } from '../config/index'
import { StudentModel } from '../models/student.model'
import PDFDocument from '../utils/pdfKitTables'

export const createStudent = async (students) => {
  await StudentModel.insertMany(students)
}

export const importStudents = async (students) => {
  let count = 0
  const errorDocs = []
  for (const student of students) {
    const newStudent = new StudentModel(student)
    try {
      await newStudent.save()
      count++
    } catch (err) {
      errorDocs.push(student)
    }
  }
  return { count, errorDocs }
}

export const getPersonalProfile = async (studentId) => {
  return await StudentModel.find(
    { _id: studentId },
    {
      __v: 0,
      _id: 0,
      'advisor._id': 0
    }
  )
}

export const getStudentProfilePublicView = async (studentId) => {
  const objectId = mongoose.Types.ObjectId(studentId)

  const students = await StudentModel.find(
    { _id: objectId },
    {
      __v: 0,
      _id: 0,
      user_id: 0,
      'personal_info.roll_no': 0,
      'personal_info.birthday': 0,
      'personal_info.email': 0,
      'personal_info.phone': 0,
      'personal_info.location': 0,
      advisor: 0
    }
  )

  return students
}

export const upsertStudents = async (docs) => {
  return await StudentModel.bulkWrite(
    docs.map((doc) => ({
      updateOne: {
        filter: { 'personal_info.roll_no': doc.personal_info.roll_no },
        update: doc,
        upsert: true
      }
    }))
  )
}

export const getAllStudents = async (searchStr, filter, records, skip) => {
  const nameQuery = {
    'personal_info.name': { $regex: searchStr, $options: 'i' }
  }
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

  const students = await StudentModel.find(query, {
    'work_exp.from': 0,
    'work_exp.location': 0,
    'academics.achievements': 0,
    social_links: 0
  })
    .populate({ path: 'user_id', select: 'profilePic' })
    .skip(skip)
    .limit(records)
  return students
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

export const getStudentColumns = () => {
  const paths = Object.keys(StudentModel.schema.paths)
  const columns = {}
  paths.map((item) => {
    const tmp = item.split('.').pop().replaceAll('_', ' ')
    columns[tmp.charAt(0).toUpperCase() + tmp.slice(1)] = item
    return item
  })
  delete columns[' id']
  delete columns['  v']
  delete columns['User id']
  return columns
}

export const getDefaultColumns = () => {
  const columns = getStudentColumns()
  const subset = Object.fromEntries(
    Object.entries(columns).filter(([key]) =>
      [
        'Name',
        'Roll no',
        'Email',
        'Phone',
        'Location',
        'Department name',
        'Year'
      ].includes(key)
    )
  )
  return subset
}
