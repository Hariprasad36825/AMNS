import fs from 'fs'
import mime from 'mime'
import { wrapper } from '../errorResponses'
import { sendMailServices } from '../services/mail.services'
import { BAD_REQUEST, OK } from '../statusCodes'

export const sendMail = async (req, res) => {
  const from = 'amns.the.network.services@gmail.com'
  const { to, subject, text, files } = req.body

  const attachments = []

  if (files) {
    Object.keys(files).map((file) => {
      const pathToAttachment = process.cwd() + '\\uploads\\' + files[`${file}`]
      attachments.push({
        content: fs.readFileSync(pathToAttachment).toString('base64'),
        filename: file,
        type: mime.getType(pathToAttachment),
        disposition: 'attachment'
      })
      return file
    })
  }

  const msg = { to, from, subject, text, attachments }
  const result = await sendMailServices(msg)

  if (result !== 'success') {
    res.status(BAD_REQUEST).send(wrapper('mail send failed'))
  }
  res.status(OK).send({ msg: 'success' })
}
