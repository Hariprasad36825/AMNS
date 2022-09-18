import { model, Schema } from 'mongoose'
import { Counter } from './counter.model'
import { UserModel } from './user.model'

const staffSchema = new Schema({
  _id: {
    type: Number,
    default: 0
  },
  user_id: {
    type: Schema.Types.ObjectId,
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
          const re = /(([a-zA-Z0-9_]+\.*)+(@kct.ac.in))/gim
          return re.test(val)
        },
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

staffSchema.pre('save', async function () {
  const doc = this
  const counter = await Counter.findByIdAndUpdate(
    'entityId',
    { $inc: { staff_counter: 1 } },
    { new: true, upsert: true }
  )
  doc._id = await counter.staff_counter
})

export const StaffModel = model('Staff', staffSchema)
