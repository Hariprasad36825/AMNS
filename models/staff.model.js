import { model, Schema } from 'mongoose'
import findOrCreatePlugin from 'mongoose-findorcreate'
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
      },
      index: true
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
    birthday: {
      type: Date
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'transgender', 'prefer not to say']
    },
    phone: {
      type: [String],
      default: []
    },
    location: {
      type: String
    }
  },
  skills: {
    type: [String],
    default: undefined
  },
  work_exp: {
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

staffSchema.index(
  {
    'personal_info.name': 'text',
    'personal_info.email': 'text',
    'personal_info.phone': 'text',
    'work_exp.designation': 'text',
    'work_exp.department_name': 'text'
  },
  {
    weights: {
      'personal_info.name': 5,
      'personal_info.email': 1,
      'personal_info.phone': 2,
      'work_exp.department_name': 5,
      'work_exp.designation': 4
    }
  }
)

staffSchema.plugin(findOrCreatePlugin)

export const StaffModel = model('Staff', staffSchema)
