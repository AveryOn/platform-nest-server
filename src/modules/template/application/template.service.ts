import { Inject, Injectable } from "@nestjs/common"
import { TemplateServicePort } from "~/modules/template/ports/template.service.port"
import { TEMPLATE_REPO_PORT, type TemplateRepoPort } from "~/modules/template/ports/template.repo.port"


@Injectable()
export class TemplateService implements TemplateServicePort {
  constructor (
    @Inject(TEMPLATE_REPO_PORT)
    private readonly templateRepo: TemplateRepoPort,
  ) {}
}