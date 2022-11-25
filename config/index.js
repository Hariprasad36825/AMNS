import dotenv from 'dotenv'

dotenv.config()
export const jwtSecret = process.env.JWT_SECRET || 'abc'
export const jwtSecretRefersh = process.env.JWT_SECRET_REFRESH || 'cde'
export const mongoURI = process.env.mongoURI || ''

export const defaultAvatar =
  'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.flaticon.com%2Ffree-icon%2Fprofile_3135715&psig=AOvVaw1trNYOYzuD2ElAZw8lrNbP&ust=1668843891488000&source=images&cd=vfe&ved=0CA8QjRxqFwoTCJi1yYyet_sCFQAAAAAdAAAAABAE'
