import { Router } from 'express'
import { checkSchema } from 'express-validator'
import {
  addStudents,
  exportStudents,
  getColumns,
  getStudents
} from '../controllers/student.controller'
import { isAuthorised } from '../middleware/auth.middleware'
import wrapAsync from '../utils/wrapAsync'

const studentRouter = Router()

studentRouter.post(
  '',
  isAuthorised(),
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
      // errorMessage: 'name should contain only alphabets',
      matches: {
        options: /^[A-Za-z ]+$/i,
        errorMessage: 'name should contain only alphabets'
      }
    },
    'data.*.personal_info.roll_no': {
      isAlphanumeric: true,
      errorMessage: 'roll-no should contain only alphanumeric characters'
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
      errorMessage: 'only email is allowed',
      optional: { options: { nullable: true } }
    },
    // 'data.*.personal_info.phone': {
    //   isMobilePhone: true,
    //   errorMessage: 'only phonenumber is allowed',
    //   optional: { options: { nullable: true } }
    // },

    'data.*.personal_info.location': {
      isAlpha: true,
      optional: { options: { nullable: true } }
    },
    'data.*.skills': {
      isArray: true,
      optional: { options: { nullable: true } }
    },
    'data.*.work_exp.company_name': {
      isAlphanumeric: true,
      optional: { options: { nullable: true } }
    },
    'data.*.work_exp.designation': {
      isAlpha: true,
      optional: { options: { nullable: true } }
    },
    'data.*.work_exp.from': {
      isDate: true,
      optional: { options: { nullable: true } }
    },
    'data.*.work_exp.Work_location': {
      isAlpha: true,
      optional: { options: { nullable: true } }
    },
    'data.*.advisor._id': {
      isInt: true,
      optional: { options: { nullable: true } }
    },
    'data.*.advisor.Advisor_name': {
      isAlpha: true,
      optional: { options: { nullable: true } }
    },
    'data.*.academics.department_name': {
      optional: { options: { nullable: true } },
      isIn: {
        options: [
          [
            'ae',
            'aue',
            'bt',
            'cse',
            'ce',
            'eee',
            'eee',
            'eie',
            'ft',
            'ise',
            'it',
            'me',
            'mce',
            'tt'
          ]
        ],
        errorMessage: 'Invalid role'
      }
    },
    'data.*.academics.year': {
      isInt: true,
      optional: { options: { nullable: true } }
    },
    'data.*.social_links.*': {
      isURL: true,
      errorMessage: 'only urls allowed'
    }
  }),
  (req, res, next) => {
    wrapAsync(addStudents, req, res, next)
  }
)

studentRouter.post('/:records/:page', isAuthorised(), (req, res, next) => {
  wrapAsync(getStudents, req, res, next)
})

studentRouter.post('/exportData', isAuthorised(), (req, res, next) => {
  wrapAsync(exportStudents, req, res, next)
})

studentRouter.get('/getColumns', isAuthorised(), (req, res, next) => {
  wrapAsync(getColumns, req, res, next)
})

export default studentRouter
