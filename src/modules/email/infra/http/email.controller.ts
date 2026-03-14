import { Controller, Inject, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApiSwaggerTag } from '~/shared/const/app.const'
import { EMAIL_PORT, type EmailPort } from '~/modules/email/email.port'

@Controller({ path: 'email', version: '1' })
@ApiTags(ApiSwaggerTag.Email)
export class EmailController {
  constructor(
    @Inject(EMAIL_PORT)
    private readonly emailService: EmailPort,
  ) {}

  @Get('')
  async ping() {
    return { msg: 'Email controller is running' }
  }

  @Get('send')
  async send() {
    await this.emailService.send({
      to: 'lnkonion2@gmail.com',
      subject: 'Sending with SendGrid is Fun',
      text: 'and easy to do anywhere, even with Node.js',
      html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    })
    return { msg: 'ok' }
  }
}
