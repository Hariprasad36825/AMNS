import { model, Schema } from 'mongoose'
import { UserModel } from './user.model'

const staffSchema = new Schema({
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
      }
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      validate: {
        validator: function (val) {
          const re = /(@kct\.ac\.in)$/gim
          return !re.test(val)
        },
        message: (props) => `${props.value} must not be KCT email ID`
      }
    },
    phone: {
      type: [String]
    },
    location: {
      type: String
    }
  },
  skills: {
    type: [String]
  },
  work_exp: {
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
    designation: {
      type: String
    },
    interests: {
      type: [String]
    },
    achievements: {
      type: [String]
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

export const StaffModel = model('Staff', staffSchema)
