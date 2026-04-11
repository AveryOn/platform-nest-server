import { toNodeHandler } from 'better-auth/node'
import { auth } from '~/modules/auth/infra/better-auth.instance'

export const betterAuthHandler = toNodeHandler(auth)
