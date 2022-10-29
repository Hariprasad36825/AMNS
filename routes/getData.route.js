import { Router } from 'express'
import {
  addCompany,
  addDepartment,
  addLocation,
  addSkill,
  getAdvisors,
  getAllLocation,
  getCompany,
  getDepartment,
  getSkill
} from '../controllers/data.controller'
import { isAuthorised } from '../middleware/auth.middleware'
import wrapAsync from '../utils/wrapAsync'

export const LocationRouter = Router()

LocationRouter.get('/:searchStr', isAuthorised(), (req, res, next) => {
  wrapAsync(getAllLocation, req, res, next)
})

LocationRouter.post('/', isAuthorised(), (req, res, next) => {
  wrapAsync(addLocation, req, res, next)
})

export const CompanyRouter = Router()

CompanyRouter.get('/:searchStr', isAuthorised(), (req, res, next) => {
  wrapAsync(getCompany, req, res, next)
})

CompanyRouter.post('/', isAuthorised(), (req, res, next) => {
  wrapAsync(addCompany, req, res, next)
})

export const DepartmentRouter = Router()

DepartmentRouter.get('/:id', isAuthorised(), (req, res, next) => {
  wrapAsync(getDepartment, req, res, next)
})
DepartmentRouter.post('/', isAuthorised(), (req, res, next) => {
  wrapAsync(addDepartment, req, res, next)
})

export const SkillsRouter = Router()

SkillsRouter.get('/:id', isAuthorised(), (req, res, next) => {
  wrapAsync(getSkill, req, res, next)
})
SkillsRouter.post('/', isAuthorised(), (req, res, next) => {
  wrapAsync(addSkill, req, res, next)
})

export const AdvisorRouter = Router()

AdvisorRouter.get('/', isAuthorised(), (req, res, next) => {
  wrapAsync(getAdvisors, req, res, next)
})
