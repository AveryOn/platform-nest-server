import { SendParams } from '~/infra/email-provider/email-provider.types'

export const EMAIL_PORT = Symbol('EMAIL_PORT')

export interface EmailPort {
  send(params: SendParams): Promise<void>
}
