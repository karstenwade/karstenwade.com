#!/bin/bash
# Create GitHub issues for Sprint 1 (Epic 1: Foundation & Infrastructure)

set -e

echo "Creating Epic 1: Foundation & Infrastructure issues..."

# Epic 1 tracker issue
gh issue create \
  --title "[Epic 1] Foundation & Infrastructure" \
  --body "# Epic 1: Foundation & Infrastructure

This epic covers the initial project setup, build tooling, and deployment pipeline.

## User Stories
- Story 1.1: Initialize React project structure (2 points)
- Story 1.2: Set up GitHub Actions deployment pipeline (3 points)
- Story 1.3: Create DreamHost sync script (2 points)

**Total Epic Points**: 7

## Dependencies
Must complete before other epics can begin.

See SPRINT-BACKLOG.md for detailed acceptance criteria and test cases." \
  --label "epic:foundation"

echo "✓ Created Epic 1 tracker issue"

# Story 1.1
gh issue create \
  --title "Story 1.1: Initialize React project structure" \
  --body "**As a** developer
**I want** a working React application scaffold
**So that** I can begin building site components

## Acceptance Criteria
- [ ] React app initialized with Vite or CRA
- [ ] Project builds successfully (\`npm run build\`)
- [ ] Development server runs (\`npm run dev\`)
- [ ] Basic folder structure created (src/, public/, content/)
- [ ] Test: Build produces static HTML output

## Test Cases (TDD)
\`\`\`bash
# RED: No build output exists
test -d build/ || dist/ → FAIL

# GREEN: Build succeeds and creates output
npm run build → SUCCESS
test -d build/ || dist/ → PASS
\`\`\`

## Story Points
**2 points** (2-4 hours)

## Epic
Part of Epic 1: Foundation & Infrastructure

See SPRINT-BACKLOG.md for full details." \
  --label "epic:foundation" \
  --label "size:2" \
  --label "tdd"

echo "✓ Created Story 1.1"

# Story 1.2
gh issue create \
  --title "Story 1.2: Set up GitHub Actions deployment pipeline" \
  --body "**As a** site owner
**I want** automated deployment to GitHub Pages
**So that** changes automatically publish when merged to main

## Acceptance Criteria
- [ ] .github/workflows/deploy.yml created
- [ ] Workflow triggers on push to main branch
- [ ] Build creates static site
- [ ] Deploys to gh-pages branch
- [ ] Test: Workflow runs successfully on commit

## Test Cases (TDD)
\`\`\`bash
# RED: No workflow file exists
test -f .github/workflows/deploy.yml → FAIL

# GREEN: Workflow file exists and is valid
test -f .github/workflows/deploy.yml → PASS
gh workflow view deploy → SUCCESS
\`\`\`

## Story Points
**3 points** (4-8 hours)

## Epic
Part of Epic 1: Foundation & Infrastructure

## Dependencies
Requires Story 1.1 to be completed first (needs working build)

See SPRINT-BACKLOG.md for full details." \
  --label "epic:foundation" \
  --label "size:3" \
  --label "tdd"

echo "✓ Created Story 1.2"

# Story 1.3
gh issue create \
  --title "Story 1.3: Create DreamHost sync script" \
  --body "**As a** site owner
**I want** automatic synchronization to DreamHost
**So that** the site mirrors from GitHub Pages every 5 minutes

## Acceptance Criteria
- [ ] sync-from-github.sh script created
- [ ] Script pulls from gh-pages branch
- [ ] Error handling and logging included
- [ ] Cron configuration documented
- [ ] Test: Script executes without errors

## Test Cases (TDD)
\`\`\`bash
# RED: Script doesn't exist
test -x scripts/sync-from-github.sh → FAIL

# GREEN: Script exists and executes
bash scripts/sync-from-github.sh → SUCCESS (or graceful failure with logging)
\`\`\`

## Story Points
**2 points** (2-4 hours)

## Epic
Part of Epic 1: Foundation & Infrastructure

## Dependencies
Requires Story 1.2 (gh-pages branch must exist)

## DreamHost Cron Configuration
\`\`\`bash
# Add to crontab:
*/5 * * * * cd /path/to/site && /path/to/scripts/sync-from-github.sh >> /path/to/logs/sync.log 2>&1
\`\`\`

See SPRINT-BACKLOG.md for full details." \
  --label "epic:foundation" \
  --label "size:2" \
  --label "tdd"

echo "✓ Created Story 1.3"

echo ""
echo "✅ All Epic 1 issues created!"
echo ""
echo "View issues: gh issue list --label epic:foundation"
