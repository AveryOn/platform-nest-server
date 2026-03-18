import type { TemplateDefinition } from "~/infra/drizzle/seeds/types";

export const shadcnTemplateDefinition: TemplateDefinition = {
  groups: [
    {
      ref: "styles",
      name: "Styles",
      kind: "category",
      order_index: 0,
      children: [
        {
          ref: "colors",
          name: "Colors",
          kind: "category",
          order_index: 0,
          children: [
            {
              ref: "color-foreground",
              name: "Foreground",
              kind: "token",
              order_index: 0,
              metadata: {
                token_type: "color",
                value: "hsl(234 96% 9%)",
                css_var: "--foreground",
              },
            },
            {
              ref: "color-background",
              name: "Background",
              kind: "token",
              order_index: 1,
              metadata: {
                token_type: "color",
                value: "hsl(0 0% 100%)",
                css_var: "--background",
              },
            },
            {
              ref: "color-card",
              name: "Card",
              kind: "token",
              order_index: 2,
              metadata: {
                token_type: "color",
                value: "hsl(0 0% 100%)",
                css_var: "--card",
              },
            },
            {
              ref: "color-card-foreground",
              name: "Card Foreground",
              kind: "token",
              order_index: 3,
              metadata: {
                token_type: "color",
                value: "hsl(234 96% 9%)",
                css_var: "--card-foreground",
              },
            },
            {
              ref: "color-popover",
              name: "Popover",
              kind: "token",
              order_index: 4,
              metadata: {
                token_type: "color",
                value: "hsl(0 0% 100%)",
                css_var: "--popover",
              },
            },
            {
              ref: "color-popover-foreground",
              name: "Popover Foreground",
              kind: "token",
              order_index: 5,
              metadata: {
                token_type: "color",
                value: "hsl(234 96% 9%)",
                css_var: "--popover-foreground",
              },
            },
            {
              ref: "color-primary",
              name: "Primary",
              kind: "token",
              order_index: 6,
              metadata: {
                token_type: "color",
                value: "hsl(229 84% 51%)",
                css_var: "--primary",
              },
              rules: [
                {
                  ref: "color-primary-rule-1",
                  title: "Primary action color",
                  body: "Use primary for main CTAs and key interactive elements.",
                  order_index: 0,
                },
              ],
            },
            {
              ref: "color-primary-foreground",
              name: "Primary Foreground",
              kind: "token",
              order_index: 7,
              metadata: {
                token_type: "color",
                value: "hsl(233 100% 96%)",
                css_var: "--primary-foreground",
              },
            },
            {
              ref: "color-secondary",
              name: "Secondary",
              kind: "token",
              order_index: 8,
              metadata: {
                token_type: "color",
                value: "hsl(231 70% 95%)",
                css_var: "--secondary",
              },
              rules: [
                {
                  ref: "color-secondary-rule-1",
                  title: "Secondary actions",
                  body: "Use secondary for less prominent actions and backgrounds.",
                  order_index: 0,
                },
              ],
            },
            {
              ref: "color-secondary-foreground",
              name: "Secondary Foreground",
              kind: "token",
              order_index: 9,
              metadata: {
                token_type: "color",
                value: "hsl(229 84% 51%)",
                css_var: "--secondary-foreground",
              },
            },
            {
              ref: "color-muted",
              name: "Muted",
              kind: "token",
              order_index: 10,
              metadata: {
                token_type: "color",
                value: "hsl(233 80% 99%)",
                css_var: "--muted",
              },
              rules: [
                {
                  ref: "color-muted-rule-1",
                  title: "Subtle backgrounds",
                  body: "Use muted for subtle backgrounds and disabled states.",
                  order_index: 0,
                },
              ],
            },
            {
              ref: "color-muted-foreground",
              name: "Muted Foreground",
              kind: "token",
              order_index: 11,
              metadata: {
                token_type: "color",
                value: "hsl(234 17% 50%)",
                css_var: "--muted-foreground",
              },
            },
            {
              ref: "color-accent",
              name: "Accent",
              kind: "token",
              order_index: 12,
              metadata: {
                token_type: "color",
                value: "hsl(72 100% 93%)",
                css_var: "--accent",
              },
              rules: [
                {
                  ref: "color-accent-rule-1",
                  title: "Accent highlights",
                  body: "Use accent for highlights and emphasis.",
                  order_index: 0,
                },
              ],
            },
            {
              ref: "color-accent-foreground",
              name: "Accent Foreground",
              kind: "token",
              order_index: 13,
              metadata: {
                token_type: "color",
                value: "hsl(73 23% 24%)",
                css_var: "--accent-foreground",
              },
            },
            {
              ref: "color-info",
              name: "Info",
              kind: "token",
              order_index: 14,
              metadata: {
                token_type: "color",
                value: "hsl(201 98% 32%)",
                css_var: "--info",
              },
            },
            {
              ref: "color-info-foreground",
              name: "Info Foreground",
              kind: "token",
              order_index: 15,
              metadata: {
                token_type: "color",
                value: "hsl(204 100% 97%)",
                css_var: "--info-foreground",
              },
            },
            {
              ref: "color-success",
              name: "Success",
              kind: "token",
              order_index: 16,
              metadata: {
                token_type: "color",
                value: "hsl(155 90% 24%)",
                css_var: "--success",
              },
            },
            {
              ref: "color-success-foreground",
              name: "Success Foreground",
              kind: "token",
              order_index: 17,
              metadata: {
                token_type: "color",
                value: "hsl(145 81% 96%)",
                css_var: "--success-foreground",
              },
            },
            {
              ref: "color-warning",
              name: "Warning",
              kind: "token",
              order_index: 18,
              metadata: {
                token_type: "color",
                value: "hsl(22 92% 37%)",
                css_var: "--warning",
              },
            },
            {
              ref: "color-warning-foreground",
              name: "Warning Foreground",
              kind: "token",
              order_index: 19,
              metadata: {
                token_type: "color",
                value: "hsl(45 100% 96%)",
                css_var: "--warning-foreground",
              },
            },
            {
              ref: "color-destructive",
              name: "Destructive",
              kind: "token",
              order_index: 20,
              metadata: {
                token_type: "color",
                value: "hsl(357 100% 45%)",
                css_var: "--destructive",
              },
              rules: [
                {
                  ref: "color-destructive-rule-1",
                  title: "Destructive actions only",
                  body: "Use destructive color only for irreversible or dangerous actions.",
                  order_index: 0,
                },
                {
                  ref: "color-destructive-rule-2",
                  title: "Confirmation required",
                  body: "Always pair destructive actions with a confirmation step.",
                  order_index: 1,
                },
              ],
            },
            {
              ref: "color-border",
              name: "Border",
              kind: "token",
              order_index: 21,
              metadata: {
                token_type: "color",
                value: "hsl(233 14% 23% / 7%)",
                css_var: "--border",
              },
            },
            {
              ref: "color-input",
              name: "Input",
              kind: "token",
              order_index: 22,
              metadata: {
                token_type: "color",
                value: "hsl(233 26% 86%)",
                css_var: "--input",
              },
            },
            {
              ref: "color-ring",
              name: "Ring",
              kind: "token",
              order_index: 23,
              metadata: {
                token_type: "color",
                value: "hsl(234 39% 44%)",
                css_var: "--ring",
              },
            },
            {
              ref: "color-chart-1",
              name: "Chart 1",
              kind: "token",
              order_index: 24,
              metadata: {
                token_type: "color",
                value: "hsl(211 100% 78%)",
                css_var: "--chart-1",
              },
            },
            {
              ref: "color-chart-2",
              name: "Chart 2",
              kind: "token",
              order_index: 25,
              metadata: {
                token_type: "color",
                value: "hsl(216 100% 58%)",
                css_var: "--chart-2",
              },
            },
            {
              ref: "color-chart-3",
              name: "Chart 3",
              kind: "token",
              order_index: 26,
              metadata: {
                token_type: "color",
                value: "hsl(221 97% 54%)",
                css_var: "--chart-3",
              },
            },
            {
              ref: "color-chart-4",
              name: "Chart 4",
              kind: "token",
              order_index: 27,
              metadata: {
                token_type: "color",
                value: "hsl(225 84% 49%)",
                css_var: "--chart-4",
              },
            },
            {
              ref: "color-chart-5",
              name: "Chart 5",
              kind: "token",
              order_index: 28,
              metadata: {
                token_type: "color",
                value: "hsl(227 76% 41%)",
                css_var: "--chart-5",
              },
            },
            {
              ref: "color-sidebar",
              name: "Sidebar",
              kind: "token",
              order_index: 29,
              metadata: {
                token_type: "color",
                value: "hsl(231 90% 97%)",
                css_var: "--sidebar",
              },
            },
            {
              ref: "color-sidebar-foreground",
              name: "Sidebar Foreground",
              kind: "token",
              order_index: 30,
              metadata: {
                token_type: "color",
                value: "hsl(234 96% 9%)",
                css_var: "--sidebar-foreground",
              },
            },
            {
              ref: "color-sidebar-primary",
              name: "Sidebar Primary",
              kind: "token",
              order_index: 31,
              metadata: {
                token_type: "color",
                value: "hsl(229 84% 51%)",
                css_var: "--sidebar-primary",
              },
            },
            {
              ref: "color-sidebar-primary-foreground",
              name: "Sidebar Primary Foreground",
              kind: "token",
              order_index: 32,
              metadata: {
                token_type: "color",
                value: "hsl(233 100% 96%)",
                css_var: "--sidebar-primary-foreground",
              },
            },
            {
              ref: "color-sidebar-accent",
              name: "Sidebar Accent",
              kind: "token",
              order_index: 33,
              metadata: {
                token_type: "color",
                value: "hsl(73 100% 96%)",
                css_var: "--sidebar-accent",
              },
            },
            {
              ref: "color-sidebar-accent-foreground",
              name: "Sidebar Accent Foreground",
              kind: "token",
              order_index: 34,
              metadata: {
                token_type: "color",
                value: "hsl(72 100% 12%)",
                css_var: "--sidebar-accent-foreground",
              },
            },
            {
              ref: "color-sidebar-border",
              name: "Sidebar Border",
              kind: "token",
              order_index: 35,
              metadata: {
                token_type: "color",
                value: "hsl(232 60% 85%)",
                css_var: "--sidebar-border",
              },
            },
            {
              ref: "color-sidebar-ring",
              name: "Sidebar Ring",
              kind: "token",
              order_index: 36,
              metadata: {
                token_type: "color",
                value: "hsl(233 27% 53%)",
                css_var: "--sidebar-ring",
              },
            },
          ],
        },
        {
          ref: "typography",
          name: "Typography",
          kind: "category",
          order_index: 1,
          children: [
            {
              ref: "font-sans",
              name: "Font Sans",
              kind: "token",
              order_index: 0,
              metadata: {
                token_type: "font",
                value: "Geist",
                css_var: "--font-sans",
              },
            },
            {
              ref: "font-mono",
              name: "Font Mono",
              kind: "token",
              order_index: 1,
              metadata: {
                token_type: "font",
                value: "Geist Mono",
                css_var: "--font-mono",
              },
            },
            {
              ref: "text-xs",
              name: "text-xs",
              kind: "token",
              order_index: 2,
              metadata: {
                token_type: "typography",
                value: "0.75rem",
                line_height: "1rem",
                css_var: "--font-size-xs",
              },
              rules: [
                {
                  ref: "text-xs-rule-1",
                  title: "Small text only",
                  body: "Use text-xs for captions and helper text only.",
                  order_index: 0,
                },
              ],
            },
            {
              ref: "text-sm",
              name: "text-sm",
              kind: "token",
              order_index: 3,
              metadata: {
                token_type: "typography",
                value: "0.875rem",
                line_height: "1.25rem",
                css_var: "--font-size-sm",
              },
              rules: [
                {
                  ref: "text-sm-rule-1",
                  title: "Body text",
                  body: "Use text-sm for body text and secondary content.",
                  order_index: 0,
                },
              ],
            },
            {
              ref: "text-base",
              name: "text-base",
              kind: "token",
              order_index: 4,
              metadata: {
                token_type: "typography",
                value: "1rem",
                line_height: "1.5rem",
                css_var: "--font-size-base",
              },
              rules: [
                {
                  ref: "text-base-rule-1",
                  title: "Default size",
                  body: "Use text-base as the default font size for most content.",
                  order_index: 0,
                },
              ],
            },
            {
              ref: "text-lg",
              name: "text-lg",
              kind: "token",
              order_index: 5,
              metadata: {
                token_type: "typography",
                value: "1.125rem",
                line_height: "1.75rem",
                css_var: "--font-size-lg",
              },
              rules: [
                {
                  ref: "text-lg-rule-1",
                  title: "Subheadings",
                  body: "Use text-lg for subheadings in card layouts.",
                  order_index: 0,
                },
              ],
            },
          ],
        },
        {
          ref: "radius",
          name: "Radius",
          kind: "category",
          order_index: 2,
          children: [
            {
              ref: "radius",
              name: "Radius",
              kind: "token",
              order_index: 0,
              metadata: {
                token_type: "radius",
                value: "0.625rem",
                css_var: "--radius",
              },
            },
            {
              ref: "radius-sm",
              name: "radius-sm",
              kind: "token",
              order_index: 1,
              metadata: {
                token_type: "radius",
                value: "calc(var(--radius) - 4px)",
                css_var: "--radius-sm",
              },
              rules: [
                {
                  ref: "radius-sm-rule-1",
                  title: "Small elements",
                  body: "Use radius-sm for small interactive elements like badges.",
                  order_index: 0,
                },
              ],
            },
            {
              ref: "radius-md",
              name: "radius-md",
              kind: "token",
              order_index: 2,
              metadata: {
                token_type: "radius",
                value: "calc(var(--radius) - 2px)",
                css_var: "--radius-md",
              },
              rules: [
                {
                  ref: "radius-md-rule-1",
                  title: "Default radius",
                  body: "Use radius-md as the default border radius for most components.",
                  order_index: 0,
                },
              ],
            },
            {
              ref: "radius-lg",
              name: "radius-lg",
              kind: "token",
              order_index: 3,
              metadata: {
                token_type: "radius",
                value: "var(--radius)",
                css_var: "--radius-lg",
              },
              rules: [
                {
                  ref: "radius-lg-rule-1",
                  title: "Cards and modals",
                  body: "Use radius-lg for cards and modals, never for buttons.",
                  order_index: 0,
                },
              ],
            },
            {
              ref: "radius-xl",
              name: "radius-xl",
              kind: "token",
              order_index: 4,
              metadata: {
                token_type: "radius",
                value: "calc(var(--radius) + 4px)",
                css_var: "--radius-xl",
              },
            },
            {
              ref: "radius-2xl",
              name: "radius-2xl",
              kind: "token",
              order_index: 5,
              metadata: {
                token_type: "radius",
                value: "calc(var(--radius) + 8px)",
                css_var: "--radius-2xl",
              },
            },
            {
              ref: "radius-3xl",
              name: "radius-3xl",
              kind: "token",
              order_index: 6,
              metadata: {
                token_type: "radius",
                value: "calc(var(--radius) + 12px)",
                css_var: "--radius-3xl",
              },
            },
            {
              ref: "radius-4xl",
              name: "radius-4xl",
              kind: "token",
              order_index: 7,
              metadata: {
                token_type: "radius",
                value: "calc(var(--radius) + 16px)",
                css_var: "--radius-4xl",
              },
            },
          ],
        },
        {
          ref: "shadows",
          name: "Shadows",
          kind: "category",
          order_index: 3,
          children: [
            {
              ref: "shadow-sm",
              name: "shadow-sm",
              kind: "token",
              order_index: 0,
              metadata: {
                token_type: "shadow",
                value: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                css_var: "--shadow-sm",
              },
              rules: [
                {
                  ref: "shadow-sm-rule-1",
                  title: "Subtle elevation",
                  body: "Use shadow-sm for subtle elevation on hover states.",
                  order_index: 0,
                },
              ],
            },
            {
              ref: "shadow-md",
              name: "shadow-md",
              kind: "token",
              order_index: 1,
              metadata: {
                token_type: "shadow",
                value: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                css_var: "--shadow-md",
              },
              rules: [
                {
                  ref: "shadow-md-rule-1",
                  title: "Elevated surfaces",
                  body: "Use shadow-md for elevated surfaces like dropdowns and popovers.",
                  order_index: 0,
                },
              ],
            },
            {
              ref: "shadow-lg",
              name: "shadow-lg",
              kind: "token",
              order_index: 2,
              metadata: {
                token_type: "shadow",
                value: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                css_var: "--shadow-lg",
              },
              rules: [
                {
                  ref: "shadow-lg-rule-1",
                  title: "Modals and dialogs",
                  body: "Use shadow-lg for modals and dialogs to create depth.",
                  order_index: 0,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      ref: "components",
      name: "Components",
      kind: "category",
      order_index: 1,
      children: [
        {
          ref: "button",
          name: "Button",
          kind: "component",
          order_index: 0,
          rules: [
            {
              ref: "button-rule-1",
              title: "Always include a visible text label",
              body: "Buttons must have a visible text label for accessibility.",
              order_index: 0,
            },
            {
              ref: "button-rule-2",
              title: "Max one primary button per view",
              body: "Limit to one primary button per view to maintain visual hierarchy.",
              order_index: 1,
            },
          ],
          children: [
            {
              ref: "button-destructive",
              name: "Destructive",
              kind: "variant",
              order_index: 0,
              rules: [
                {
                  ref: "button-destructive-rule-1",
                  title: "Only for irreversible actions",
                  body: "Use destructive variant only for irreversible or dangerous actions.",
                  order_index: 0,
                },
                {
                  ref: "button-destructive-rule-2",
                  title: "Must include confirmation step",
                  body: "Destructive buttons must include a confirmation step before execution.",
                  order_index: 1,
                },
              ],
            },
            {
              ref: "button-ghost",
              name: "Ghost",
              kind: "variant",
              order_index: 1,
              rules: [
                {
                  ref: "button-ghost-rule-1",
                  title: "Secondary actions in toolbars",
                  body: "Use ghost variant for secondary actions in toolbars and navigation.",
                  order_index: 0,
                },
              ],
            },
            {
              ref: "button-outline",
              name: "Outline",
              kind: "variant",
              order_index: 2,
              rules: [
                {
                  ref: "button-outline-rule-1",
                  title: "Secondary actions",
                  body: "Use outline variant for secondary actions that need visual weight.",
                  order_index: 0,
                },
              ],
            },
          ],
        },
        {
          ref: "accordion",
          name: "Accordion",
          kind: "component",
          order_index: 1,
          rules: [
            {
              ref: "accordion-rule-1",
              title: "Collapsible content sections",
              body: "Use accordion for collapsible content sections to save space.",
              order_index: 0,
            },
          ],
        },
        {
          ref: "alert",
          name: "Alert",
          kind: "component",
          order_index: 2,
          rules: [
            {
              ref: "alert-rule-1",
              title: "Important information",
              body: "Use alerts to display important information that requires user attention.",
              order_index: 0,
            },
          ],
        },
        {
          ref: "alert-dialog",
          name: "Alert Dialog",
          kind: "component",
          order_index: 3,
          rules: [
            {
              ref: "alert-dialog-rule-1",
              title: "Confirmation dialogs",
              body: "Use alert dialogs for confirmation of critical actions.",
              order_index: 0,
            },
          ],
        },
      ],
    },
    {
      ref: "content",
      name: "Content",
      kind: "category",
      order_index: 2,
      rules: [
        {
          ref: "content-rule-1",
          title: "Tone of voice",
          body: "Use active voice. Be direct and clear.",
          order_index: 0,
        },
      ],
    },
  ],
};
