import { Router } from 'express'
import { generateJSON, saveExcelData } from '../controllers/import.controller'
import { isAuthorised } from '../middleware/auth.middleware'
import wrapAsync from '../utils/wrapAsync'

const ImportRouter = Router()

ImportRouter.post(
  '/generate-json/:header',
  isAuthorised(),
  (req, res, next) => {
    wrapAsync(generateJSON, req, res, next)
  }
)

ImportRouter.post('/save', isAuthorised(), (req, res, next) => {
  wrapAsync(saveExcelData, req, res, next)
})

export default ImportRouter
