/** Examples for Swagger documentation */
export const SWAGGER_EXAMPLES = {
  uuid: '550e8400-e29b-41d4-a716-446655440000',
  cuid2: 'clx7k9z2n0000qf1a8w3d9e4b',
  betterAuthId: 'org_123456',
  betterAuth: {
    orgId: 'org_123456',
    userId: 'user_1234',
  },
  hash: 'NEPXDGGnnvd2QoXY2LYM0VfpUqtkvg91',
  dateISO: '2026-03-25T12:00:00.000Z',
  email: 'test001@gmail.com',
  firstName: 'Alex',
  lastName: 'Smith',
  fullName: 'Alex Smith',
  phoneNumber: '+995555123123',
  password: 'strong_password_123',
  url: '/url',
  url_2: 'http://example.com',
  boolean: true,
  socialProvider: 'google',

  exportRulesetMd:
    '# UI Rules\n\n## Components / Button\n\n### When to use\n\nUse Button for primary user actions.',
  exportRulesetJson: {
    projectId: '2f972727-e95d-4564-b1bc-7dc95d44c7a3',
    rules: [
      {
        id: '7f91e1c2-8d4a-4b0e-9b7f-2c58a1f6f9a3',
        title: 'When to use',
        body: 'Use Button for primary user actions.',
        path: ['Components', 'Button'],
        orderKey: '0001.0001',
      },
    ],
  },
} as const
