export enum ApiKeyMode {
  ReadOnly = 'READ_ONLY',
  Writable = 'WRITABLE',
}

export enum ApiKeyStatus {
  Active = 'ACTIVE',
  Revoked = 'REVOKED',
}

export enum ApiKeyScope {
  ProjectRead = 'project:read',
  RulesetRead = 'ruleset:read',
  SnapshotRead = 'snapshot:read',
  SnapshotPayloadRead = 'snapshot:payload:read',
  RuleRead = 'rule:read',
  RuleGroupRead = 'rule_group:read',
  TemplateRead = 'template:read',
  ExportRead = 'export:read',
}

export namespace ApiKeyServiceCmd {}
