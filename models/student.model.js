import { model, Schema } from 'mongoose'
import { StaffModel } from './staff.model'
import { UserModel } from './user.model'

const studentSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: UserModel
  },
  personal_info: {
    name: {
      type: String,
      validate: {
        validator: '/(\\w){4,15}/gim',
        message: (props) => `${props.value} is not valid.`
      }
    },
    roll_no: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: '/\\d{2}[a-z]{3}\\d{3}/gim',
        message: (props) => `${props.value} is not a valid roll number.`
      }
    },
    birthday: {
      type: Date,
      required: true
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'transgender', 'prefer not to say']
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      validate: {
        validator: '/(([a-z0-9_]+\\.*)+(@kct.ac.in))/gim',
        message: (props) => `${props.value} is not an official email ID`
      }
    },
    phone: {
      type: [String]
    },
    location: {
      type: String
    }
  },
  bio: {
    type: String
  },
  skills: {
    type: [String]
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
    location: {
      type: String
    }
  },
  advisor: {
    _id: {
      type: Schema.Types.ObjectId,
      ref: StaffModel
    },
    name: {
      type: String,
      validate: {
        validator: '/(\\w){4,15}/gim',
        message: (props) => `${props.value} is not valid.`
      }
    }
  },
  academics: {
    department_name: {
      type: String,
      enum: [
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

export const StudentModel = model('Student', studentSchema)
