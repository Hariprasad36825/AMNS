export const wrapper = (message) => ({ error: [{ message }] })

export const userError = {
  exists: 'Email already exists',
  invalid: 'Invalid Credentials',
  notDefined: 'User not defined'
}

export const tokenError = {
  notFound: 'No token, authorization denied',
  invalid: 'Token is not valid',
  notAuthorised: "you don't have previleges to perform operation"
}
