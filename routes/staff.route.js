import { Router } from 'express'
import { checkSchema } from 'express-validator'
import {
  addStaff,
  getStaffs,
  getStudentListUnderStaff
} from '../controllers/staff.controller'
import { isAuthorised } from '../middleware/auth.middleware'
import wrapAsync from '../utils/wrapAsync'

const staffRouter = Router()

staffRouter.get('/', isAuthorised('staff'), (req, res, next) => {
  wrapAsync(getStudentListUnderStaff, req, res, next)
})

staffRouter.post(
  '/addstaffs',
  isAuthorised('admin'),
  checkSchema({
    data: {
      isArray: {
        bail: true,
        options: {
          min: 0
        }
      }
    },
    'data.*.personal_info.name': {
      errorMessage: 'name should contain only alphabets',
      isAlpha: true
    },
    'data.*.personal_info.birthday': {
      isDate: true,
      optional: { options: { nullable: true } },
      errorMessage: 'only date format is available'
    },
    'data.*.personal_info.gender': {
      optional: { options: { nullable: true } },
      isIn: {
        options: [['male', 'female', 'transgender', 'prefer not to say']],
        errorMessage: 'Invalid role'
      }
    },
    'data.*.personal_info.email': {
      isEmail: true,
      errorMessage: 'only email is allowed'
    },
    'data.*.personal_info.phone': {
      isMobilePhone: true,
      errorMessage: 'only phonenumber is allowed',
      optional: { options: { nullable: true } }
    },

    'data.*.personal_info.location': {
      isAlpha: true,
      optional: { options: { nullable: true } }
    },
    'data.*.skills': {
      isArray: true,
      optional: { options: { nullable: true } }
    },
    'data.*.work_exp.department_name': {
      isAlpha: true,
      optional: { options: { nullable: true } }
    },
    'data.*.work_exp.designation': {
      isAlpha: true,
      optional: { options: { nullable: true } }
    },
    'data.*.social_links.*': {
      isURL: true,
      errorMessage: 'only urls allowed'
    }
  }),
  (req, res, next) => {
    wrapAsync(addStaff, req, res, next)
  }
)

staffRouter.post('/:records/:page', isAuthorised('admin'), (req, res, next) => {
  wrapAsync(getStaffs, req, res, next)
})

export default staffRouter
