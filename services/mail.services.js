import mailer from '../config/mail.config'
export const sendMailServices = async (msg) => {
  return await mailer
    .send(msg)
    .then(() => {
      return 'success'
    })
    .catch((err) => {
      console.log(
        '🚀 ~ file: mail.services.js:11 ~ sendMailServices ~ err.response',
        err
      )
      return err.response?.data
    })
}
