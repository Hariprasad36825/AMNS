import FormData from 'form-data'
export const createFormData = (file, body) => {
  const data = new FormData()
  if (file) {
    data.append('image', file)
  }
  Object.keys(body).forEach((key) => {
    data.append(key, body[key])
  })

  return data
}
