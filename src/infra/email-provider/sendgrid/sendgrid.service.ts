import { env } from '~/core/env'
import sgMail from '@sendgrid/mail'
import { Injectable, OnModuleInit } from '@nestjs/common'
import { SendParams } from '~/infra/email-provider/email-provider.types'
import { EmailProviderPort } from '~/infra/email-provider/email-provider.port'

@Injectable()
export class SendGridService implements OnModuleInit, EmailProviderPort {
  onModuleInit() {
    sgMail.setApiKey(env.SENDGRID_API_KEY)
  }

  /** Отправка письма на почту */
  async send(params: SendParams) {
    await sgMail.send({
      to: params.to,
      from: {
        email: env.EMAIL_NO_REPLY,
        name: 'ChernozemTest',
      },
      subject: params.subject,
      text: params.text,
      html: params.html,
    })
  }
}
