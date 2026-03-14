import { SendParams } from './email-provider.types'

export const EMAIL_PROVIDER_PORT = Symbol('EMAIL_PROVIDER_PORT')

export interface EmailProviderPort {
  send: (params: SendParams) => Promise<void>
}
