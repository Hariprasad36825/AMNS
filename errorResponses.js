export const errorMessageWrapper = (message) => ({ errors: [{ message }] })
export const successMessageWrapper = (message) => ({ message })

export const resourseMessages = {
  notFound: 'Resource not found'
}

export const userError = {
  exists: 'Email already exists',
  invalid: 'Invalid Credentials',
  notDefined: 'User not defined',
  InvalidAccount: 'Invalid User contact administrator'
}
export const userMessage = {
  inserted: 'User Inserted successfully'
}

export const NotificationMessage = {
  created: 'Notification inserted successfully'
}

export const PostMessage = {
  created: 'post created successfully',
  error: 'something went wrong'
}

export const LocationMessage = {
  added: 'location added'
}

export const CompanyMessage = {
  added: 'company added'
}

export const SkillMessage = {
  added: 'skill added'
}

export const DepartmentMessage = {
  added: 'department added'
}

export const tokenError = {
  notFound: 'No token, authorization denied',
  invalid: 'Token is not valid',
  expired: 'Token expired',
  notAuthorised: "you don't have previleges to perform operation"
}

export const exportError = {
  failed: 'export failed'
}
