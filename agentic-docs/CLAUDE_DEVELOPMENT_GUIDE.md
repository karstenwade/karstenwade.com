# Claude Development Workflow Guide

This guide documents the proper development process for working on karstenwade.com with Claude Code, including PRD updates, story management, GitHub issues, and pull requests.

## Table of Contents

1. [Development Philosophy](#development-philosophy)
2. [Epic and Story Creation](#epic-and-story-creation)
3. [GitHub Issues Integration](#github-issues-integration)
4. [Feature Branch Workflow](#feature-branch-workflow)
5. [Pull Request Paradigm](#pull-request-paradigm)
6. [Working from Personal Fork](#working-from-personal-fork)
7. [Code Review Standards](#code-review-standards)
8. [Testing Requirements](#testing-requirements)
9. [Continuous Integration](#continuous-integration)
10. [Deployment Process](#deployment-process)

---

## Development Philosophy

### PRD-Driven Development

All feature development follows a **Product Requirements Document (PRD) first** approach:

1. **Plan in PRD**: All new features start as Epics in `docs/PRD.md`
2. **Break into Stories**: Epics are decomposed into implementable Stories
3. **Create Issues**: Each Story gets a GitHub issue for tracking
4. **Implement**: Code is written to fulfill Story acceptance criteria
5. **Review**: Code is reviewed against PRD requirements
6. **Deploy**: Completed Stories are merged and deployed

**Key Principle**: The PRD is the single source of truth for what to build and why.

---

## Epic and Story Creation

### What is an Epic?

An **Epic** is a large feature or body of work that delivers significant user value:

```markdown
### Epic N: Epic Name 🔄 IN PROGRESS
- Story N.1: First sub-feature 🔲
- Story N.2: Second sub-feature 🔲
- Story N.3: Third sub-feature ✅
```

**Epic Status Icons**:
- 🔄 IN PROGRESS - Currently being worked on
- ✅ COMPLETE - All stories finished
- 🔲 PLANNED - Not yet started

### What is a Story?

A **Story** is a specific, implementable unit of work within an Epic:

```markdown
#### Story N.1: Story Title

**Acceptance Criteria:**
- [ ] Specific, testable requirement
- [ ] Another measurable outcome
- [ ] Clear definition of done

**Problem:**
Brief description of what user problem this solves

**Solution:**
Technical approach to solving the problem

**Files:**
- `path/to/file1.ts`
- `path/to/file2.tsx`
```

### Creating a New Epic

1. **Add Epic Header** to PRD.md:
   ```markdown
   ### Epic 12: Strapi CMS Integration 🔲 PLANNED
   - Story 12.1: Set up Strapi backend 🔲
   - Story 12.2: Create content types 🔲
   - Story 12.3: Build API integration 🔲
   ```

2. **Add Detailed Requirements** section:
   ```markdown
   ## Epic Name Requirements (Epic N)

   ### Story N.1: Story Title
   **Acceptance Criteria:**
   - [ ] Criterion 1
   - [ ] Criterion 2

   **Problem:** ...
   **Solution:** ...
   **Files:** ...
   ```

3. **Update Epic Status** as work progresses:
   - Start: 🔲 → 🔄
   - Complete: 🔄 → ✅

### Story Best Practices

- **Small & Focused**: 1-3 hours of work maximum
- **Testable**: Clear acceptance criteria
- **Independent**: Can be implemented separately
- **Valuable**: Delivers user-facing improvement

---

## GitHub Issues Integration

### Creating Issues from Stories

**Every Story gets a GitHub issue** for tracking:

```bash
gh issue create \
  --title "Story N.1: Story Title" \
  --body "## Story N.1: Story Title

### Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

### Problem
Description...

### Solution
Approach...

### Files
- \`path/to/file.ts\`

Part of Epic N: Epic Name" \
  --label "epic-N"
```

### Issue Labels

Create Epic-specific labels:

```bash
gh label create "epic-11" --description "Epic 11: Poetry & Essays" --color "0E8A16"
```

**Label Naming Convention**: `epic-N` where N is the Epic number

### Linking Issues to Stories

In the PRD, add issue links:

```markdown
- Story 11.1: Fix poetry formatting 🔲 ([#78](https://github.com/karstenwade/karstenwade.com/issues/78))
```

### Closing Issues

When a Story is complete, close the issue:

```bash
git commit -m "Fix poetry formatting

Implements Story 11.1 (Issue #78)"
```

GitHub automatically closes issues when commits reference "Closes #N" or "Fixes #N".

---

## Feature Branch Workflow

### Never Push Directly to Main

**IMPORTANT**: All work happens on feature branches:

```bash
# ❌ WRONG - Never do this
git add .
git commit -m "Add feature"
git push origin main

# ✅ CORRECT - Always use feature branches
git checkout -b feat/feature-name
git add .
git commit -m "Add feature"
git push -u origin feat/feature-name
```

### Branch Naming Convention

```
feat/descriptive-feature-name
fix/bug-description
docs/documentation-update
refactor/code-improvement
test/test-coverage
```

**Examples**:
- `feat/poetry-formatting-and-essays-section`
- `fix/sitemap-generation-paths`
- `docs/publishing-guide`

### Creating a Feature Branch

```bash
# Start from main
git checkout main
git pull origin main

# Create feature branch
git checkout -b feat/epic-11-poetry-essays

# Make changes, commit, push
git add .
git commit -m "Commit message"
git push -u origin feat/epic-11-poetry-essays
```

### Working on a Feature Branch

```bash
# Make changes
git add src/data/poetry.ts
git commit -m "Fix poetry formatting"

# Continue working
git add src/components/Essays.tsx
git commit -m "Add Essays component"

# Push all commits
git push
```

---

## Pull Request Paradigm

### When to Create a Pull Request

Create a PR when:
- Feature is complete
- All tests pass
- Code is ready for review
- Epic or Story is finished

### Creating a Pull Request

```bash
gh pr create \
  --title "Epic 11: Poetry Formatting & Essays Section" \
  --body "$(cat <<'EOF'
## Summary
- Fixed poetry formatting to preserve line breaks
- Added Essays section with tabbed interface
- Moved essay from fiction to essays
- Created publishing documentation
- Created development workflow guide

## Test plan
- [x] Poetry formatting displays correctly
- [x] Tabs switch between Poetry/Essays/Fiction
- [x] Essay appears in Essays tab
- [x] Documentation is comprehensive
- [x] All tests pass
- [x] Build succeeds

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

### PR Best Practices

**Title**: Concise summary of changes
- Good: "Epic 11: Poetry Formatting & Essays Section"
- Bad: "Updates"

**Summary**: Bullet points of what changed
- Use past tense
- Be specific
- Reference Stories/Issues

**Test Plan**: Checklist of testing done
- [ ] Manual testing completed
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Build succeeds
- [ ] Deployed to preview environment

### PR Review Process

1. **Create PR**: Submit for review
2. **CI Runs**: Automated tests and build
3. **Code Review**: Maintainer reviews code
4. **Address Feedback**: Make requested changes
5. **Approval**: PR is approved
6. **Merge**: Squash and merge to main
7. **Deploy**: GitHub Actions deploys to production

---

## Working from Personal Fork

### Forking the Repository

1. **Fork on GitHub**: Click "Fork" button
2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/karstenwade.com.git
   cd karstenwade.com/src/karstenwade.com
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/karstenwade/karstenwade.com.git
   ```

### Sync with Upstream

```bash
# Fetch upstream changes
git fetch upstream

# Update main
git checkout main
git merge upstream/main

# Push to your fork
git push origin main
```

### Creating a PR from Fork

```bash
# Create feature branch
git checkout -b feat/my-feature

# Make changes and commit
git add .
git commit -m "Add my feature"

# Push to your fork
git push -u origin feat/my-feature

# Create PR from fork to upstream
gh pr create \
  --repo karstenwade/karstenwade.com \
  --title "Add my feature" \
  --body "Description..."
```

---

## Code Review Standards

### What to Review

1. **PRD Alignment**: Does code fulfill Story acceptance criteria?
2. **Code Quality**: Clean, readable, maintainable
3. **Tests**: Adequate test coverage
4. **Documentation**: Comments and docs updated
5. **Performance**: No unnecessary performance issues
6. **Security**: No vulnerabilities introduced
7. **Accessibility**: ARIA labels, keyboard navigation

### Review Checklist

- [ ] All Story acceptance criteria met
- [ ] Code follows project conventions
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No TypeScript errors
- [ ] Build succeeds
- [ ] Manual testing completed
- [ ] Accessibility verified

---

## Testing Requirements

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Test Types

1. **Unit Tests**: Test individual functions/components
2. **Integration Tests**: Test component interactions
3. **E2E Tests**: Test complete user flows
4. **Accessibility Tests**: ARIA, keyboard navigation

### Writing Tests

```typescript
// src/components/__tests__/Essays.test.tsx
import { render, screen } from '@testing-library/react'
import Essays from '../Essays'

describe('Essays', () => {
  it('renders essay list', () => {
    render(<Essays />)
    expect(screen.getByLabelText('Essays')).toBeInTheDocument()
  })
})
```

---

## Continuous Integration

### GitHub Actions Workflow

Located in `.github/workflows/`:

```yaml
name: CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm test
      - run: npm run build
```

### What CI Checks

- ✅ TypeScript compilation
- ✅ Linting (ESLint)
- ✅ Tests pass
- ✅ Build succeeds
- ✅ No security vulnerabilities

### CI Failures

If CI fails:
1. Check GitHub Actions logs
2. Run tests locally: `npm test`
3. Run build locally: `npm run build`
4. Fix issues
5. Commit and push fixes

---

## Deployment Process

### Automatic Deployment

**Main branch**: Automatically deploys to GitHub Pages

```
Merge PR → GitHub Actions → Build → Deploy to gh-pages → Live
```

### Manual Deployment

```bash
# Build locally
npm run build

# Deploy to GitHub Pages
npm run deploy
```

### Deployment Checklist

- [ ] All tests pass
- [ ] Build succeeds locally
- [ ] PR reviewed and approved
- [ ] Changes merged to main
- [ ] CI/CD passes
- [ ] Site deployed successfully
- [ ] Verify live site works

---

## Quick Reference

### Common Commands

```bash
# Start development
git checkout main
git pull origin main
git checkout -b feat/my-feature

# Make changes
git add .
git commit -m "Description"
git push -u origin feat/my-feature

# Create PR
gh pr create --title "Title" --body "Description"

# After PR merged
git checkout main
git pull origin main
git branch -d feat/my-feature
```

### Workflow Summary

1. **Plan**: Add Epic/Stories to PRD
2. **Create Issues**: One issue per Story
3. **Branch**: Create feature branch
4. **Implement**: Code to acceptance criteria
5. **Test**: Run tests, manual testing
6. **Commit**: Clear commit messages
7. **Push**: Push to feature branch
8. **PR**: Create pull request
9. **Review**: Address feedback
10. **Merge**: Squash and merge
11. **Deploy**: Automatic deployment

---

## Common Mistakes to Avoid

### ❌ Pushing Directly to Main

```bash
# NEVER do this
git checkout main
git commit -m "Quick fix"
git push origin main
```

**Solution**: Always use feature branches

### ❌ Skipping the PR

**NEVER** merge without a pull request, even for "small" changes.

### ❌ Not Updating PRD

**ALWAYS** update PRD before implementing features.

### ❌ Missing Tests

**ALWAYS** write tests for new features.

### ❌ Forgetting to Link Issues

**ALWAYS** reference issues in commits: `Fixes #123`

---

## Questions?

- Check PRD.md for feature requirements
- Review existing PRs for examples
- Ask in GitHub Discussions
- Reference this guide regularly

---

**Last Updated**: 2024-11-16
**Version**: 1.0
