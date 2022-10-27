import { Router } from 'express'
import { checkSchema } from 'express-validator'
import { addStudents } from '../controllers/student.controller'
import { isAuthorised } from '../middleware/auth.middleware'
import wrapAsync from '../utils/wrapAsync'

const studentRouter = Router()

studentRouter.post(
  '/addstudents',
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
      errorMessage: 'name should contain only alphabets',
      isAlpha: true
    },
    'data.*.personal_info.roll_no': {
      isAlphanumeric: true,
      errorMessage: 'rollno should contain only alphanumeric characters'
    },
    'data.*.personal_info.birthday': {
      isDate: true,
      optional: { options: { nullable: true } },
      errorMessage: 'only date format is available',
      format: 'DD-MM-YYYY'
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
    'data.*.work_exp.location': {
      isAlpha: true,
      optional: { options: { nullable: true } }
    },
    'data.*.advisor._id': {
      isInt: true
    },
    'data.*.advisor.name': {
      isAlpha: true
    },
    'data.*.academics.department_name': {
      optional: { options: { nullable: true } },
      isIn: {
        options: [
          [
            'AE',
            'AUE',
            'BT',
            'CSE',
            'CE',
            'EEE',
            'ECE',
            'EIE',
            'FT',
            'ISE',
            'IT',
            'ME',
            'MCE',
            'TT'
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

export default studentRouter
