import fs from 'fs'
import mime from 'mime'
import { uid } from 'uid'
import { wrapper } from '../errorResponses'
import { sendMailServices } from '../services/mail.services'
import { BAD_REQUEST, OK } from '../statusCodes'

export const sendMail = async (req, res) => {
  const from = 'amns.the.network.services@gmail.com'
  let { to, subject, html, files } = req.body

  const attachments = []

  if (files) {
    html = '<div>' + html
    Object.keys(files).map((file) => {
      const pathToAttachment = process.cwd() + '\\uploads\\' + files[`${file}`]
      const type = mime.getType(pathToAttachment)
      const id = uid()

      const commonObj =
        type.split('/')[0] === 'image'
          ? { disposition: 'inline', content_id: id }
          : { disposition: 'attachment' }

      if (commonObj.disposition === 'inline') {
        html += `<img src="cid:${id}" alt="loading error" style="max-height:600px; max-width: 500px"/>`
      }

      attachments.push({
        content: fs.readFileSync(pathToAttachment).toString('base64'),
        filename: file,
        type,
        ...commonObj
      })
      return file
    })
    html += '</div>'
  }
  console.log(html)

  const msg = { to, from, subject, html, attachments }
  const result = await sendMailServices(msg)
  console.log('🚀 ~ file: mail.controller.js:31 ~ sendMail ~ result', result)

  if (result !== 'success') {
    return res.status(BAD_REQUEST).send(wrapper('mail send failed'))
  }
  res.status(OK).send({ msg: 'success' })
}
