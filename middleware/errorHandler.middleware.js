import { wrapper } from '../errorResponses'
import { BAD_REQUEST, DB_ERROR, INTERNAL_SERVER_ERROR } from '../statusCodes'

export const handleValidationError = (error, req, res, next) => {
  // console.log(error.array)
  if (error instanceof Error && 'array' in error) {
    return res.status(BAD_REQUEST).send({ errors: error.array() })
  }
  next(error)
}

export const handleMongooseError = (error, req, res, next) => {
  if (error instanceof Error && error.name === 'MongooseError') {
    console.error(error)
    return res.status(DB_ERROR).send(wrapper(error.message))
  }
  next(error)
}

export const handleDatabaseError = (error, req, res, next) => {
  if (error instanceof Error && error.name === 'MongoServerError') {
    // console.error(error)
    return res.status(DB_ERROR).send(wrapper(error.message))
  }
  next(error)
}

export const handleDefaultError = (error, req, res, next) => {
  if (error instanceof Error) {
    return res.status(INTERNAL_SERVER_ERROR).send(wrapper(error.message))
  }
  next(error)
}
