import { Global, Module } from '@nestjs/common'
import { PaginatorService } from '~/shared/paginator/application/paginator.service';
import { PAGINATOR_PORT } from '~/shared/paginator/ports/paginator.service.port';

@Global()
@Module({
  providers: [
    {
      provide: PAGINATOR_PORT,
      useClass: PaginatorService,
    }
  ],
  exports: [PAGINATOR_PORT],
})
export class PaginatorModule {}
