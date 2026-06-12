---
name: react-best-practices
description: "React 19 best practices, including performance optimization, re-render prevention, hooks patterns, and component composition. Activate when building or reviewing React components, hooks, or JSX in this project."
license: MIT
metadata:
  author: project
---

# React Best Practices

## Performance
- Eliminate waterfalls: use Promise.all() for independent operations
- Import directly, avoid barrel files
- Use dynamic imports for heavy components
- Memoize expensive computations

## Re-render Optimization
- Use primitive dependencies in effects
- Use functional setState for stable callbacks
- Pass function to useState for expensive initial values
- Don't define components inside components

## Component Patterns
- Extract static JSX outside components
- Use content-visibility for long lists
- Use ternary, not && for conditional rendering
- Prefer useTransition for non-urgent updates

## Hooks
- useAnime: encapsulate anime.js with useRef + useEffect + cleanup
- usePermission: check roles/permissions from Inertia shared data
- useDebounce: debounce search/filter inputs
