import { Module } from '@nestjs/common'
import { EmailController } from '~/modules/email/infra/http/email.controller'
import { EMAIL_PORT } from '~/modules/email/email.port'
import { EmailService } from '~/modules/email/email.service'
import { EmailProviderModule } from '~/infra/email-provider/email-provider.module'

@Module({
  imports: [EmailProviderModule],
  controllers: [EmailController],
  providers: [
    {
      provide: EMAIL_PORT,
      useClass: EmailService,
    },
  ],
  exports: [EMAIL_PORT],
})
export class EmailModule {}
