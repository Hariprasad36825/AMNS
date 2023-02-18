import { BAD_REQUEST } from '../statusCodes'
import { upload } from '../config/storage.config'
import excelJS from 'exceljs'
import fs from 'fs'
import { findBestMatch } from 'string-similarity'
import { convertDate } from '../utils/dateConverter'
import { importStudents } from '../services/student.services'
import { errorMessageWrapper } from '../errorResponses'

function isObject(obj) {
  return obj != null && obj.constructor.name === 'Object'
}

const convertXLSXtoJSON = (workbook, headerNumber) => {
  let excelTitles = []
  const excelData = []
  workbook.worksheets[0].eachRow((row, rowNumber) => {
    if (rowNumber > 0) {
      const rowValues = row.values
      rowValues.shift()
      if (rowNumber === headerNumber) excelTitles = rowValues
      else {
        const rowObject = {}
        for (let i = 0; i < excelTitles.length; i++) {
          if (String(excelTitles[i])) {
            const title = String(excelTitles[i]).toLowerCase()
            if (isObject(rowValues[i])) {
              rowValues[i] = String(rowValues[i].text)
            } else {
              rowValues[i] = String(rowValues[i]).toLowerCase()
            }
            const value = rowValues[i] ? rowValues[i] : ''
            rowObject[title] = value
          }
        }
        excelData.push(rowObject)
      }
    }
  })
  return { headers: excelTitles, excelData }
}

export const generateJSON = async (req, res) => {
  if (!req.files) {
    res.status(BAD_REQUEST).send({ msg: 'No files found' })
  }
  try {
    const path = `uploads/${req.files[0].filename}`
    upload.single(req, res, (err) => {
      if (err) {
        res.status(BAD_REQUEST).send({ msg: 'upload Failed' })
      }
    })
    const workbook = new excelJS.Workbook()
    await workbook.xlsx.readFile(path)
    const data = convertXLSXtoJSON(workbook, Number(req.params.header))
    data.headers = [...new Set(data.headers)]
    data.headers = data.headers.filter((item) => !!item)
    fs.unlinkSync(path)

    const dbHeaders = {
      name: 'personal_info',
      roll_no: 'personal_info',
      birthday: 'personal_info',
      gender: 'personal_info',
      email: 'personal_info',
      phone: 'personal_info',
      location: 'personal_info',
      Advisor_name: 'advisor',
      department_name: 'academics'
    }
    const dbHeaderKeys = Object.keys(dbHeaders)
    let bestMatch = {}

    data.headers = data.headers.map((val) => {
      return String(val).toLowerCase()
    })

    dbHeaderKeys.forEach((val) => {
      const matches = findBestMatch(val.toLowerCase(), data.headers)
      const bestMatchWord = matches.bestMatch.target
      bestMatch = { ...bestMatch, [val]: bestMatchWord.toLowerCase() }
    })

    data.headers = data.headers.map((val) => {
      return { label: String(val).toLowerCase() }
    })

    data.headers.unshift({ label: 'not applicable' })

    const message = {
      data,
      mappings: bestMatch
    }

    return res.status(200).json({ success: true, message })
  } catch (err) {
    console.log(err)
    return res
      .status(400)
      .json(errorMessageWrapper({ success: false, message: err.message }))
  }
}

export const saveExcelData = async (req, res) => {
  const headerMappings = req.body.headerMappings
  const excelData = req.body.excelData

  const dbHeaders = {
    name: 'personal_info',
    roll_no: 'personal_info',
    birthday: 'personal_info',
    gender: 'personal_info',
    email: 'personal_info',
    phone: 'personal_info',
    location: 'personal_info',
    Advisor_name: 'advisor',
    department_name: 'academics'
  }

  const transformedDoc = []

  excelData.forEach((doc) => {
    if (doc && Object.keys(doc).length > 0) {
      const temp = {}
      for (let [key, val] of Object.entries(doc)) {
        if (headerMappings[key] && dbHeaders[headerMappings[key]]) {
          if (headerMappings[key] && val === 'undefined') {
            continue
          }
          if (headerMappings[key] === 'birthday') {
            val = convertDate(val)
          }
          const obj = {
            [headerMappings[key]]: val
          }
          temp[dbHeaders[headerMappings[key]]] = {
            ...temp[dbHeaders[headerMappings[key]]],
            ...obj
          }
        }
      }
      if (Object.keys(temp).length > 0) {
        transformedDoc.push(temp)
      }
    }
  })

  try {
    const ans = await importStudents(transformedDoc)
    return res.status(200).json({
      success: true,
      errorDocs: ans.errorDocs,
      savedDocs: ans.count
    })
  } catch (err) {
    return res.status(400).json(errorMessageWrapper({ message: err }))
  }
}
