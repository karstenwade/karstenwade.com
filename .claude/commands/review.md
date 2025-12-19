# Code Review Checklist

Review the code changes with the following checklist:

## Functionality
- [ ] Code accomplishes the intended purpose
- [ ] Edge cases are handled
- [ ] Error handling is appropriate

## Code Quality
- [ ] Code is readable and self-documenting
- [ ] No unnecessary complexity
- [ ] DRY principle followed (no duplicate code)
- [ ] Functions/methods are focused (single responsibility)

## TypeScript
- [ ] Proper type annotations
- [ ] No `any` types without justification
- [ ] Interfaces/types defined for data structures

## Next.js/React
- [ ] Components are properly typed
- [ ] Static export compatible (`output: 'export'`)
- [ ] SEO metadata included where appropriate
- [ ] Accessibility considerations met

## Testing
- [ ] Tests exist for new functionality
- [ ] Tests cover edge cases
- [ ] Tests are readable and maintainable

## Security
- [ ] No hardcoded secrets or credentials
- [ ] Input validation where needed
- [ ] External links have `rel="noopener noreferrer"`

## Performance
- [ ] No obvious performance issues
- [ ] Images optimized
- [ ] No unnecessary re-renders

## Style
- [ ] Consistent with project conventions
- [ ] Tailwind classes organized
- [ ] No linting errors
