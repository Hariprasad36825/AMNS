import { model, Schema } from 'mongoose'
import { UserModel } from './user.model'

const studentSchema = new Schema({
  user_id: {
    type: Number,
    ref: UserModel
  },
  personal_info: {
    name: {
      type: String,
      validate: {
        validator: function (val) {
          const re = /(\w){4,15}/gim
          return re.test(val)
        },
        message: (props) => `${props.value} is not valid.`
      },
      index: true
    },
    roll_no: {
      type: String,
      required: true,
      unique: true
    },
    birthday: {
      type: Date
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'transgender', 'prefer not to say']
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      validate: {
        validator: function (val) {
          const re = /(@kct\.ac\.in)$/gim
          return !re.test(val)
        },
        message: (props) => `${props.value} must not be KCT email ID`
      }
    },
    phone: {
      type: String,
      default: undefined
    },
    location: {
      type: String
    }
  },
  bio: {
    type: String
  },
  skills: {
    type: [String],
    default: undefined
  },
  work_exp: {
    company_name: {
      type: String
    },
    designation: {
      type: String
    },
    from: {
      type: Date
    },
    Work_location: {
      type: String
    }
  },
  advisor: {
    _id: {
      type: Number,
      ref: UserModel
    },
    Advisor_name: {
      type: String,
      validate: {
        validator: function (val) {
          const re = /(\w){4,15}/gim
          return re.test(val)
        },
        message: (props) => `${props.value} is not valid.`
      }
    }
  },
  academics: {
    department_name: {
      type: String,
      enum: [
        'ae',
        'aue',
        'bt',
        'cse',
        'ce',
        'eee',
        'ece',
        'eie',
        'ft',
        'ise',
        'it',
        'me',
        'mce',
        'tt'
      ]
    },
    achievements: {
      type: [String]
    },
    year: {
      type: Number
    }
  },
  social_links: {
    linked_in: {
      type: String
    },
    twitter: {
      type: String
    },
    github: {
      type: String
    }
  }
})

studentSchema.index(
  {
    'personal_info.name': 'text',
    'personal_info.roll_no': 'text',
    'personal_info.email': 'text',
    'personal_info.phone': 'text',
    'work_exp.company_name': 'text',
    'work_exp.designation': 'text'
  },
  {
    weights: {
      'personal_info.name': 5,
      'personal_info.roll_no': 4,
      'personal_info.email': 1,
      'personal_info.phone': 2,
      'work_exp.company_name': 5,
      'work_exp.designation': 2
    }
  }
)

export const StudentModel = model('Student', studentSchema)
