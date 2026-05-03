export const DEV_SEED = {
  orgA: {
    id: 'org_dev_a',
    name: 'UI Rules Dev Org A',
    slug: 'dev-org-a',
  },

  orgB: {
    id: 'org_dev_b',
    name: 'UI Rules Dev Org B',
    slug: 'dev-org-b',
  },

  users: {
    owner: {
      id: 'user_dev_owner',
      name: 'Owner User',
      email: 'owner@uirules.dev',
    },
    member: {
      id: 'user_dev_member',
      name: 'Member User',
      email: 'member@uirules.dev',
    },
    noMember: {
      id: 'user_dev_nomember',
      name: 'No Member User',
      email: 'nomember@uirules.dev',
    },
    otherOrg: {
      id: 'user_dev_other_org',
      name: 'Other Org User',
      email: 'other-org@uirules.dev',
    },
  },

  sessions: {
    owner: {
      id: 'session_dev_owner',
      token: 'session_token_dev_owner',
    },
    member: {
      id: 'session_dev_member',
      token: 'session_token_dev_member',
    },
    noMember: {
      id: 'session_dev_nomember',
      token: 'session_token_dev_nomember',
    },
    otherOrg: {
      id: 'session_dev_other_org',
      token: 'session_token_dev_other_org',
    },
  },

  accounts: {
    owner: {
      id: 'account_dev_owner',
      accountId: 'user_dev_owner',
    },
    member: {
      id: 'account_dev_member',
      accountId: 'user_dev_member',
    },
    noMember: {
      id: 'account_dev_nomember',
      accountId: 'user_dev_nomember',
    },
    otherOrg: {
      id: 'account_dev_other_org',
      accountId: 'user_dev_other_org',
    },
  },

  verifications: {
    owner: {
      id: 'verification_dev_owner',
    },
    member: {
      id: 'verification_dev_member',
    },
    noMember: {
      id: 'verification_dev_nomember',
    },
    otherOrg: {
      id: 'verification_dev_other_org',
    },
  },

  members: {
    owner: {
      id: 'member_dev_owner_org_a',
    },
    member: {
      id: 'member_dev_member_org_a',
    },
    otherOrg: {
      id: 'member_dev_other_org_b',
    },
  },

  brands: {
    brandA: {
      id: '00000000-0000-0000-0000-0000000000a1',
      name: 'Dev Brand A',
    },
    brandB: {
      id: '00000000-0000-0000-0000-0000000000b1',
      name: 'Dev Brand B',
    },
  },

  projects: {
    projectA: {
      id: '00000000-0000-0000-0000-0000000000a2',
      name: 'Dev Project A',
      slug: 'dev-project-a',
      description: 'Main DX project for backend testing',
    },
    projectB: {
      id: '00000000-0000-0000-0000-0000000000b2',
      name: 'Dev Project B',
      slug: 'dev-project-b',
      description: 'Cross-tenant project for negative tests',
    },
  },

  ruleGroups: {
    components: '00000000-0000-0000-0000-000000000101',
    button: '00000000-0000-0000-0000-000000000102',
    buttonWhenToUse: '00000000-0000-0000-0000-000000000103',
    buttonAccessibility: '00000000-0000-0000-0000-000000000104',
    styles: '00000000-0000-0000-0000-000000000105',
    colors: '00000000-0000-0000-0000-000000000106',
  },

  rules: {
    buttonPrimary: '00000000-0000-0000-0000-000000000201',
    buttonLink: '00000000-0000-0000-0000-000000000202',
    buttonA11y: '00000000-0000-0000-0000-000000000203',
    colorContrast: '00000000-0000-0000-0000-000000000204',
  },

  apiKeys: {
    readOnly: {
      id: '00000000-0000-0000-0000-000000000301',
      raw: 'uir_dev_readonly_project_a',
      prefix: 'uir_dev_readonly',
      name: 'Dev Read Only API Key',
    },
    writable: {
      id: '00000000-0000-0000-0000-000000000302',
      raw: 'uir_dev_writable_project_a',
      prefix: 'uir_dev_writable',
      name: 'Dev Writable API Key',
    },
    revoked: {
      id: '00000000-0000-0000-0000-000000000303',
      raw: 'uir_dev_revoked_project_a',
      prefix: 'uir_dev_revoked',
      name: 'Dev Revoked API Key',
    },
  },
} as const

export const DEV_PASSWORD_HASH =
  'cad2b0da342e015f2129b1748f3107a3:373880fbfda8dcc5b7b2f3ab36212b6ce764ddf750995a2108fc06a434494cefb356811c005a73125e3cec552ac74c485cba17406277ce85075fc46806a009ae'
