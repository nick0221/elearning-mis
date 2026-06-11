# Laravel Guidelines

## Architecture
- Use thin controllers that delegate to service classes
- Models handle relationships and scopes only
- Form Requests for validation
- Policies for authorization (never check roles in controllers)

## Conventions
- Use `php artisan make:` commands for all file generation
- Pass `--no-interaction` to artisan commands
- Prefer named routes and `route()` helper
- Use Eloquent API Resources for API responses
- Cast enums in models using `casts()` method

## Database
- SQLite with WAL mode for single-server
- Migrations must include ALL column attributes when modifying
- Use model factories for test data
- Foreign key constraints enabled

## RBAC
- Spatie Laravel Permission for roles/permissions
- Super-Admin bypasses via `Gate::before`
- Always use `$user->can('permission')` in controllers
- Never use `$user->hasRole()` in controllers
- Share permissions to frontend via HandleInertiaRequests
