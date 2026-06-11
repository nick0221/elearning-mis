# shadcn/ui Guidelines

## Critical Rules
- Use `FieldGroup` + `Field` for form layout, never raw divs with space-y-*
- Use `gap-*` not `space-x-*` or `space-y-*`
- Use `size-*` when width equals height
- Use `cn()` for conditional classes
- Use semantic colors: `bg-primary`, `text-muted-foreground`

## Component Composition
- Items always inside their Group (SelectItem in SelectGroup)
- Dialog/Sheet/Drawer always need DialogTitle
- Use full Card composition: CardHeader/CardTitle/CardContent/CardFooter
- Button has no isPending - compose with Spinner + disabled

## Icons
- Use `data-icon="inline-start"` or `data-icon="inline-end"` on icons in buttons
- No sizing classes on icons inside components

## Forms
- Validation: data-invalid on Field, aria-invalid on control
- Option sets (2-7 choices) use ToggleGroup
- FieldSet + FieldLegend for checkbox/radio groups
