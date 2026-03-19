/**
 * All available tags defining controllers and parts of the system API
 */
export enum ApiSwaggerTag {
  System = 'System',
  Auth = 'Auth',
  User = 'User',
  Profile = 'Profile',
  Session = 'Session',
  Project = 'Project',
  RuleGroup = 'RuleGroup',
  Rule = 'Rule',
  TemplateSnapshot = 'TemplateSnapshot',
  Template = 'Template',
  Tree = 'Tree',
  Export = 'Export',
}

export enum NodeEnv {
  development = 'development',
  production = 'production',
  test = 'test',
}
