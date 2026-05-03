import 'reflect-metadata'

import { NestFactory } from '@nestjs/core'

import { AppModule } from '~/app.module'
import { applyTemplateSnapshots } from '~/bootstrap/templates/application/scripts/apply-template-snapshot.script'
import { checkTemplateSnapshots } from '~/bootstrap/templates/application/scripts/check-template-snapshot.script'
import { diffTemplateSnapshots } from '~/bootstrap/templates/application/scripts/diff-template-snapshot.script'
import { dryRunTemplateSnapshots } from '~/bootstrap/templates/application/scripts/dry-run-template-snapshot.script'
import type { TemplateSeedMode } from '~/bootstrap/templates/application/service/template.types'

const supportedModes: TemplateSeedMode[] = [
  'apply',
  'check',
  'dry-run',
  'diff',
]

async function main() {
  const mode = (process.argv[2] ?? 'apply') as TemplateSeedMode

  if (!supportedModes.includes(mode)) {
    throw new Error(
      `Unsupported template seed mode "${mode}". Supported modes: ${supportedModes.join(', ')}`,
    )
  }

  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  })

  try {
    const result = await runMode(app, mode)

    console.log(JSON.stringify(result, null, 2))
  } finally {
    await app.close()
  }
}

async function runMode(
  app: Awaited<ReturnType<typeof NestFactory.createApplicationContext>>,
  mode: TemplateSeedMode,
) {
  switch (mode) {
    case 'apply':
      return applyTemplateSnapshots(app)

    case 'check':
      return checkTemplateSnapshots(app)

    case 'dry-run':
      return dryRunTemplateSnapshots(app)

    case 'diff':
      return diffTemplateSnapshots(app)

    default:
      throw new Error(
        `Unsupported template seed mode "${mode as string}"`,
      )
  }
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
