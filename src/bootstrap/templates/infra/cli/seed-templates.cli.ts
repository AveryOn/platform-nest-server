import 'reflect-metadata'

import { NestFactory } from '@nestjs/core'

import { AppModule } from '~/app.module'
import { applyTemplateSnapshots } from '~/bootstrap/templates/application/scripts/apply-template-snapshot.script'

async function main() {
  const mode = process.argv[2] ?? 'apply'

  if (mode !== 'apply') {
    throw new Error(
      `Unsupported template seed mode "${mode}". Supported mode: apply`,
    )
  }

  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  })

  try {
    const result = await applyTemplateSnapshots(app)

    console.log(JSON.stringify(result, null, 2))
  } finally {
    await app.close()
  }
}

void main().catch((error) => {
  console.error(error)
  process.exit(1)
})
