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
        validator: '/(\\w){4,15}/gmi',
        message: (props) => `${props.value} is not valid.`
      }
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      validate: {
        validator: '/(([a-zA-Z0-9_]+\\.*)+(@kct.ac.in))/gmi',
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
  await Counter.updateOne(
    {},
    { $inc: { staff_counter: 1 } },
    function (counter) {
      doc._id = counter.staff_counter
    }
  )
})

export const StaffModel = model('Staff', staffSchema)
