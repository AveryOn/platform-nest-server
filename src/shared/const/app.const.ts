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
}

export enum NodeEnv {
  development = 'development',
  production = 'production',
  test = 'test',
}