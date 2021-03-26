import { NotFoundHttpError } from './errorHandler'

export function notFound() {
  throw new NotFoundHttpError()
}
