import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { SystemController } from './system.controller'

@Module({
  controllers: [SystemController],
  imports: [AuthModule],
})
export class SystemModule {}
