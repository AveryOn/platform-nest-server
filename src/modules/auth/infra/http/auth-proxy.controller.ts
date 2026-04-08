import { All, Controller, Req, Res } from '@nestjs/common'
import type { Request as ExpressRequest, Response as ExpressResponse } from 'express'

import { AuthService } from '~/modules/auth/auth.service'
import type { BetterAuthInstance } from '~/modules/auth/auth.instance'

async function readRawBody(req: ExpressRequest): Promise<string | undefined> {
  if (req.method === 'GET' || req.method === 'HEAD') {
    return undefined
  }

  const chunks: Buffer[] = []

  await new Promise<void>((resolve, reject) => {
    req.on('data', (chunk) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    })

    req.on('end', () => resolve())
    req.on('error', (err) => reject(err))
  })

  if (chunks.length === 0) {
    return undefined
  }

  return Buffer.concat(chunks).toString('utf8')
}

export async function betterAuthExpressHandler(
  req: ExpressRequest,
  res: ExpressResponse,
  auth: BetterAuthInstance,
) {
  const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`

  const headers: Array<[string, string]> = []

  for (const [key, value] of Object.entries(req.headers)) {
    if (Array.isArray(value)) {
      for (const v of value) {
        headers.push([key, v])
      }
      continue
    }

    if (typeof value === 'string') {
      headers.push([key, value])
    }
  }

  const rawBody = await readRawBody(req)

  const request = new Request(url, {
    method: req.method,
    headers,
    body: rawBody,
  })

  const response = await auth.handler(request)

  res.status(response.status)

  response.headers.forEach((value, key) => {
    res.append(key, value)
  })

  res.send(await response.text())
}

@Controller({ path: 'auth', version: '1' })
export class AuthProxyController {
  constructor(private readonly authService: AuthService) {}

  @All()
  async root(@Req() req: ExpressRequest, @Res() res: ExpressResponse) {
    await betterAuthExpressHandler(req, res, this.authService.auth)
  }

  @All(':path')
  async nested1(@Req() req: ExpressRequest, @Res() res: ExpressResponse) {
    await betterAuthExpressHandler(req, res, this.authService.auth)
  }

  @All(':path/:path2')
  async nested2(@Req() req: ExpressRequest, @Res() res: ExpressResponse) {
    await betterAuthExpressHandler(req, res, this.authService.auth)
  }

  @All(':path/:path2/:path3')
  async nested3(@Req() req: ExpressRequest, @Res() res: ExpressResponse) {
    await betterAuthExpressHandler(req, res, this.authService.auth)
  }
}
