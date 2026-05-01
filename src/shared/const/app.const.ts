/**
 * All available tags defining controllers and parts of the system API
 */
export enum ApiSwaggerTag {
  System = 'System',
  Auth = 'Auth',
  User = 'User',
  ResolvedRuleset = 'Resolved Ruleset',
  Project = 'Project',
  RuleGroup = 'Rule Group',
  Rule = 'Rule',
  Template = 'Template',
  Tree = 'Tree',
  Export = 'Export',
  Snapshot = 'Snapshot',
  ProjectConfig = 'Project Config',
  Brand = 'Brand',
}

export enum NodeEnv {
  development = 'development',
  production = 'production',
  test = 'test',
}

/** undefined placeholder for values */
export const _ = void undefined

export enum OperationStatus {
  success = 'success',
  failed = 'failed',
}
