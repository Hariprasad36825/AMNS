import mailer from '../config/mail.config'
export const sendMailServices = async (msg) => {
  return await mailer
    .send(msg)
    .then(() => {
      return 'success'
    })
    .catch((err) => {
      return err.response?.data
    })
}
