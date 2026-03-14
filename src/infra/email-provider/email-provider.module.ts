import { Module } from '@nestjs/common'
import { SendGridService } from '~/infra/email-provider/sendgrid/sendgrid.service'
import { SendGridModule } from '~/infra/email-provider/sendgrid/sendgrid.module'
import { EMAIL_PROVIDER_PORT } from './email-provider.port'

@Module({
  imports: [SendGridModule],
  providers: [
    {
      provide: EMAIL_PROVIDER_PORT,
      useExisting: SendGridService,
    },
  ],
  exports: [EMAIL_PROVIDER_PORT],
})
export class EmailProviderModule {}
