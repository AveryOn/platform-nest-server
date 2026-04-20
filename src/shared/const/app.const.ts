/**
 * All available tags defining controllers and parts of the system API
 */
export enum ApiSwaggerTag {
  System = 'System',
  Auth = 'Auth',
  User = 'User',
  Profile = 'Profile',
  ResolvedRuleset = 'ResolvedRuleset',
  Project = 'Project',
  RuleGroup = 'Rule Group',
  Rule = 'Rule',
  TemplateSnapshot = 'Template Snapshot',
  Template = 'Template',
  Tree = 'Tree',
  Export = 'Export',
  Snapshot = 'Snapshot',
  ProjectConfig = 'ProjectConfig',
}

export enum NodeEnv {
  development = 'development',
  production = 'production',
  test = 'test',
}

/** undefined placeholder for values */
export const _ = void undefined
