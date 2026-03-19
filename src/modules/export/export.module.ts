import { Module } from "@nestjs/common";
import { EXPORT_PORT } from "~/modules/export/ports/export.service.port";
import { ExportController } from "~/modules/export/infra/http/export.controller";
import { EXPORT_REPO_PORT } from "~/modules/export/ports/export.repo.port";
import { ExportDrizzleRepo } from "~/modules/export/infra/persistance/export.drizzle.repo";
import { ExportService } from "~/modules/export/application/export.service";

@Module({
  controllers: [ExportController],
  providers: [
    {
      provide: EXPORT_PORT,
      useClass: ExportService,
    },
    {
      provide: EXPORT_REPO_PORT,
      useClass: ExportDrizzleRepo,
    },
  ],
  exports: [EXPORT_PORT],
})
export class ExportModule {}