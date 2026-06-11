# TailwindCSS v4 Guidelines

## Configuration
- Use `@import "tailwindcss"` instead of `@tailwind` directives
- Define theme in `@theme` blocks in CSS
- Use CSS variables for design tokens

## Theme Tokens
- Brand: --color-primary (#14213d), --color-accent (#fca311)
- Surfaces: --color-background, --color-surface
- Semantic: --color-muted, --color-border, --color-ring
- Status: --color-success, --color-warning, --color-destructive

## Best Practices
- Use semantic color names, not raw values
- Use `size-*` shorthand for equal width/height
- Use `truncate` not overflow-hidden text-ellipsis
- No manual dark: overrides - use semantic tokens
- Use `@custom-variant` for dark mode if needed

## Responsive
- Mobile-first approach
- Use sm:/md:/lg:/xl: prefixes
- Use container queries for component-level responsiveness
