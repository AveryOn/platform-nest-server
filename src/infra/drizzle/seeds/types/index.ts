export interface TemplateGroupDef {
    ref: string;
    name: string;
    description?: string;
    kind: string;
    order_index: number;
    metadata?: Record<string, unknown> | null;
    rules?: TemplateRuleDef[];
    children?: TemplateGroupDef[];
  }
  
  export interface TemplateRuleDef {
    ref: string;
    title?: string;
    body: string;
    metadata?: Record<string, unknown> | null;
    order_index: number;
  }
  
  export interface TemplateDefinition {
    groups: TemplateGroupDef[];
  }
  