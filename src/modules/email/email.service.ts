import { Inject, Injectable } from '@nestjs/common'
import { EmailPort } from '~/modules/email/email.port'
import { SendParams } from '~/infra/email-provider/email-provider.types'
import {
  EMAIL_PROVIDER_PORT,
  type EmailProviderPort,
} from '~/infra/email-provider/email-provider.port'
import { env } from '~/core/env'

@Injectable()
export class EmailService implements EmailPort {
  constructor(
    @Inject(EMAIL_PROVIDER_PORT)
    private readonly emailProvider: EmailProviderPort,
  ) {}

  async send(params: SendParams): Promise<void> {
    if (env.ENABLED_REAL_EMAIL) {
      console.debug('Real Sending Email')
      return await this.emailProvider.send(params)
    }
    console.debug('Testing Sending Email')
  }
}
