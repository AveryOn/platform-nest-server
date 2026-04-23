import 'dotenv/config'
import { z } from 'zod'
import { LogLevel } from '~/core/logger/logger.types'
import { NodeEnv } from '~/shared/const/app.const'
import { zBool, zJson, zNumberSoft } from '~/shared/zod/zod.helper'

export const envSchema = z.object({
  NODE_ENV: z.enum([
    NodeEnv.development,
    NodeEnv.production,
    NodeEnv.test,
  ]),
  DATABASE_URL: z.string(),
  PORT: zNumberSoft().default(3000),
  SWAGGER_ENABLED: zBool(),
  CORS_ORIGIN: zJson().pipe(z.array(z.string())),
  SENDGRID_API_KEY: z.string(),
  EMAIL_NO_REPLY: z.string(),
  EMAIL_COMPANY_NAME: z.string(),
  ENABLED_REAL_EMAIL: zBool(),
  LOG_LEVEL: z
    .enum([...Object.keys(LogLevel)])
    .default(LogLevel.info),
  NEST_LOGGER_ENABLED: zBool(),
  MAX_SESSIONS_PER_USER: zNumberSoft(),
  CLEAR_CONSOLE_BY_START: zBool().default(false),
  REDIS_URL: z.url(),
  BETTER_AUTH_URL: z.url(),
  BETTER_AUTH_BASE_PATH: z.string(),
  BETTER_AUTH_SECRET: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),

  // SUPABASE VARIABLES
  SUPABASE_URL: z.url().optional(),
  SUPABASE_REST_URL: z.url().optional(),
  SUPABASE_GRAPHQL_URL: z.url().optional(),
  SUPABASE_FUNCTIONS_URL: z.url().optional(),
  SUPABASE_ANON_KEY: z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  SUPABASE_STORAGE_URL: z.url().optional(),
  SUPABASE_STORAGE_ACCESS_KEY: z.string().min(1).optional(),
  SUPABASE_STORAGE_SECRET_KEY: z.string().min(1).optional(),
  SUPABASE_STORAGE_REGION: z
    .enum([
      'local',
      'us-east-1',
      'us-east-1',
      'eu-central-1',
      'ap-southeast-1',
    ])
    .default('local')
    .optional(),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  const errors = z.treeifyError(parsed.error)

  console.error('❌ Invalid environment variables:\n')
  Object.entries(errors.properties ?? {}).forEach(([k, v]) => {
    console.error(k, ': ', v.errors)
  })
  console.error('\n')
  process.exit(1)
}

{
  if (parsed.data.NODE_ENV === NodeEnv.development) {
    console.debug({
      LOG_LEVEL: parsed.data.LOG_LEVEL,
    })
    console.debug({
      NODE_ENV: parsed.data.NODE_ENV,
    })
    console.debug({
      NEST_LOGGER_ENABLED: parsed.data.NEST_LOGGER_ENABLED,
    })
    console.debug({
      MAX_SESSIONS_PER_USER: parsed.data.MAX_SESSIONS_PER_USER,
    })
    console.debug({
      CLEAR_CONSOLE_BY_START: parsed.data.CLEAR_CONSOLE_BY_START,
    })
  }
}

export type Env = z.infer<typeof envSchema>
export const env = parsed.data
