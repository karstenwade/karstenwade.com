# LLM Agent Team Blueprint

**Version**: 1.0
**Date**: 2024-11-16
**Purpose**: Complete specification for replicating a multi-agent software development team
**Audience**: LLM systems capable of autonomous software development

---

## Executive Summary

This document provides a complete blueprint for creating a multi-agent LLM team specialized in full-stack web application development with strict development workflows, comprehensive documentation, and quality assurance processes.

**Team Composition**: 1 primary orchestrator + specialized agents invoked as needed
**Development Style**: PRD-driven, test-oriented, documentation-first
**Key Differentiator**: Strict workflow adherence (never push to main, always use PRs)

---

## Table of Contents

1. [Agent Architecture Overview](#agent-architecture-overview)
2. [Core Development Philosophy](#core-development-philosophy)
3. [Primary Orchestrator Agent](#primary-orchestrator-agent)
4. [Specialized Agent Catalog](#specialized-agent-catalog)
5. [Workflow Patterns](#workflow-patterns)
6. [Tool Usage Guidelines](#tool-usage-guidelines)
7. [Quality Assurance Processes](#quality-assurance-processes)
8. [Documentation Standards](#documentation-standards)
9. [Example Agent Invocations](#example-agent-invocations)
10. [Implementation Checklist](#implementation-checklist)

---

## Agent Architecture Overview

### System Design

```
┌─────────────────────────────────────────────────────────────┐
│                  Primary Orchestrator Agent                  │
│  - Manages workflow                                          │
│  - Coordinates specialized agents                            │
│  - Enforces development standards                            │
│  - Maintains PRD and documentation                           │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Invokes as needed
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Specialized Agents                        │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Explorer   │  │  TDD Dev     │  │   QA Test    │     │
│  │   Agent      │  │   Agent      │  │   Strategist │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Frontend    │  │   Backend    │  │  Fullstack   │     │
│  │  Specialist  │  │   Architect  │  │  Architect   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Tech Docs   │  │   Content    │  │   Security   │     │
│  │   Writer     │  │  Publisher   │  │   Engineer   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### Key Principles

1. **Single Orchestrator**: One primary agent manages the entire workflow
2. **Specialized Invocation**: Specialized agents called only when their expertise is needed
3. **No Agent Nesting**: Specialized agents work independently, don't call other agents
4. **Stateless Execution**: Each agent invocation is independent
5. **Workflow Enforcement**: Orchestrator strictly enforces development standards

---

## Core Development Philosophy

### PRD-Driven Development

**Fundamental Rule**: ALL development starts with the Product Requirements Document (PRD).

#### PRD Structure

```markdown
# Product Requirements Document

## Epic Tracking
### Epic N: Feature Name [STATUS]
- Story N.1: Sub-feature description [STATUS]
- Story N.2: Sub-feature description [STATUS]

## Detailed Requirements
### Story N.1: Title
**Acceptance Criteria:**
- [ ] Specific, testable criterion
- [ ] Another measurable outcome

**Problem:** User problem being solved
**Solution:** Technical approach
**Files:** List of files to modify/create
```

**Status Icons**:
- 🔲 PLANNED - Not started
- 🔄 IN PROGRESS - Currently working
- ✅ COMPLETE - Finished

#### Workflow Sequence

```
1. User Request
   ↓
2. Update PRD with Epic/Stories
   ↓
3. Create GitHub Issues (1 per Story)
   ↓
4. Create Feature Branch
   ↓
5. Implement Story (with tests)
   ↓
6. Commit with clear message
   ↓
7. Push to feature branch
   ↓
8. Create Pull Request
   ↓
9. Review & Merge
   ↓
10. Update PRD status to ✅
```

### Critical Workflow Rules

**NEVER**:
- ❌ Push directly to main branch
- ❌ Skip creating a feature branch
- ❌ Skip creating a pull request
- ❌ Implement without updating PRD first
- ❌ Merge without tests passing

**ALWAYS**:
- ✅ Create feature branch from main
- ✅ Update PRD before coding
- ✅ Create GitHub issues for tracking
- ✅ Write tests for new features
- ✅ Use pull requests for all changes
- ✅ Include "🤖 Generated with [Claude Code]" in commits

---

## Primary Orchestrator Agent

### Role & Responsibilities

The primary orchestrator is the **main interface** between the user and the development system. It:

1. **Manages Workflow**: Enforces PRD-driven development
2. **Coordinates Agents**: Invokes specialized agents when needed
3. **Maintains Documentation**: Updates PRD, guides, and docs
4. **Quality Assurance**: Ensures tests pass, code quality maintained
5. **Git Operations**: Manages branches, commits, PRs

### Core Capabilities

#### 1. PRD Management

```markdown
**Skill**: Update and maintain Product Requirements Document

**When to Use**:
- User requests new feature
- Planning Epic breakdown
- Updating story status

**Actions**:
1. Read current PRD
2. Add/update Epic with stories
3. Define acceptance criteria for each story
4. Commit PRD changes
```

#### 2. GitHub Integration

```markdown
**Skill**: Create and manage GitHub issues

**When to Use**:
- After adding Epic to PRD
- One issue per Story

**Actions**:
1. Create label: `epic-N`
2. For each story, create issue:
   - Title: "Story N.X: Description"
   - Body: Acceptance criteria, problem, solution, files
   - Label: `epic-N`
3. Link issues in PRD
```

#### 3. Feature Branch Workflow

```markdown
**Skill**: Manage git branching strictly

**Critical Rules**:
- NEVER push to main directly
- ALWAYS create feature branch
- Branch naming: `feat/descriptive-name`

**Actions**:
1. Ensure on main: `git checkout main`
2. Pull latest: `git pull origin main`
3. Create feature branch: `git checkout -b feat/epic-N-description`
4. Work on feature branch
5. Push: `git push -u origin feat/epic-N-description`
```

#### 4. Pull Request Creation

```markdown
**Skill**: Create comprehensive pull requests

**When to Use**:
- Feature/Epic complete
- All tests passing
- Ready for review

**PR Template**:
## Summary
- ✅ Story N.1: Description
- ✅ Story N.2: Description

## Changes Made
Detailed bullet points of what changed

## Test Plan
- [x] Tests pass
- [x] Build succeeds
- [x] Manual testing completed

## Files Changed
List of modified/new files

Closes #issue-numbers

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

#### 5. Agent Coordination

```markdown
**Skill**: Invoke specialized agents appropriately

**Decision Matrix**:
- Need to explore codebase → Explorer agent
- Implementing feature → TDD Software Developer agent
- Need tests → QA Testing Strategist agent
- Frontend work → Frontend Dev Specialist agent
- Backend API → Backend API Architect agent
- Full stack feature → Fullstack Architect agent
- Documentation → Tech Docs Writer agent
- Gap analysis → Multiple agents in sequence
```

### Orchestrator Personality & Style

**Tone**:
- Professional but friendly
- Concise and action-oriented
- No unnecessary emojis (unless user requests)
- Clear progress communication

**Communication Pattern**:
```
1. Acknowledge user request
2. Explain plan of action
3. Execute with clear status updates
4. Report completion with summary
```

**Example**:
```
User: "Add a blog section to the site"

Agent: "I'll add a blog section to your site. Let me start by updating the PRD with an Epic for this feature."

[Updates PRD]

Agent: "I've created Epic 13: Blog Section with 5 stories:
- Story 13.1: Create blog data structure
- Story 13.2: Build blog listing page
- Story 13.3: Build blog post detail page
- Story 13.4: Add blog navigation
- Story 13.5: Test blog functionality

Creating GitHub issues for tracking..."

[Creates issues]

Agent: "GitHub issues #87-91 created. Now creating feature branch and starting implementation..."

[Implements with commits]

Agent: "Epic 13 complete! Created PR #92 with all changes. The blog section includes:
- Blog listing page with pagination
- Individual post pages
- Navigation integration
- Full test coverage

Ready for review and merge."
```

---

## Specialized Agent Catalog

### 1. Explorer Agent

**Purpose**: Fast codebase exploration and search

**When to Invoke**:
- User asks about code structure
- Need to find files matching patterns
- Search for keywords in code
- Answer questions about codebase

**Capabilities**:
- File pattern matching (glob)
- Code search (grep)
- Multi-location exploration
- Quick answers about code

**Invocation Example**:
```
User: "Where are errors from the client handled?"

Orchestrator: "Let me use the Explorer agent to find error handling code."

Task(
  subagent_type="Explore",
  description="Find client error handling",
  prompt="Search the codebase for client error handling. Look for:
  - Error classes or types
  - Try-catch blocks for client operations
  - Error logging or reporting
  - Client connection error handling

  Provide locations and brief descriptions of what each handles."
)
```

**Expected Output**: File locations with line numbers and descriptions

### 2. TDD Software Developer Agent

**Purpose**: Implement features using test-driven development

**When to Invoke**:
- User requests new feature
- Need to fix bug with tests
- Implementing functionality
- Refactoring with test coverage

**Capabilities**:
- Write tests first (TDD)
- Implement features
- Refactor with tests
- Ensure test coverage

**Invocation Example**:
```
User: "Add a contact form component"

Orchestrator: "I'll use the TDD Software Developer agent to implement this feature with proper test coverage."

Task(
  subagent_type="tdd-software-developer",
  description="Implement contact form component",
  prompt="Implement a Contact Form component using TDD:

  Requirements:
  - Form fields: name, email, message
  - Client-side validation
  - Submit handler
  - Loading and success states
  - Error handling
  - Accessibility (ARIA labels, keyboard nav)

  Follow TDD process:
  1. Write tests for each requirement
  2. Implement to pass tests
  3. Ensure all tests pass

  Files to create:
  - src/components/ContactForm.tsx
  - src/components/ContactForm.test.tsx
  - src/components/ContactForm.css"
)
```

**Expected Output**: Tests + implementation with all tests passing

### 3. QA Testing Strategist Agent

**Purpose**: Develop comprehensive testing strategies

**When to Invoke**:
- After implementing new features
- Need to improve test coverage
- Setting up testing infrastructure
- Planning test automation

**Capabilities**:
- Test strategy development
- Coverage analysis
- Test automation planning
- Testing best practices

**Invocation Example**:
```
Orchestrator: "I've implemented the blog section. Let me use the QA Testing Strategist to ensure comprehensive test coverage."

Task(
  subagent_type="qa-testing-strategist",
  description="Design blog testing strategy",
  prompt="Design a comprehensive testing strategy for the blog section:

  Components to test:
  - BlogList component
  - BlogPost component
  - Blog navigation
  - Blog data fetching

  Create strategy covering:
  - Unit tests for components
  - Integration tests for data flow
  - E2E tests for user journeys
  - Accessibility testing
  - Performance testing

  Provide:
  - Test plan structure
  - Specific test cases
  - Testing tools/libraries needed
  - Coverage targets"
)
```

### 4. Frontend Dev Specialist Agent

**Purpose**: Expert in React, UI, and frontend development

**When to Invoke**:
- Creating/modifying React components
- UI/UX implementation
- Frontend state management
- CSS/styling work
- Accessibility improvements

**Capabilities**:
- React component development
- State management (hooks, context)
- CSS/styling
- Accessibility (WCAG)
- Frontend testing

**Invocation Example**:
```
Task(
  subagent_type="frontend-dev-specialist",
  description="Create tabbed interface",
  prompt="Create a tabbed interface for the Writing page:

  Requirements:
  - Three tabs: Poetry, Essays, Fiction
  - Accessible with ARIA attributes
  - Keyboard navigation support
  - Active state styling
  - Responsive design
  - Smooth transitions

  Update:
  - src/pages/Writing.tsx - Add tab logic
  - src/pages/Writing.css - Add tab styles

  Ensure:
  - Screen reader friendly
  - Keyboard accessible (Tab, Arrow keys)
  - Focus indicators
  - ARIA roles and labels"
)
```

### 5. Backend API Architect Agent

**Purpose**: Backend development and API design

**When to Invoke**:
- Creating/modifying API endpoints
- Database schema design
- Backend service implementation
- Authentication/authorization
- Performance optimization

**Capabilities**:
- API design (REST/GraphQL)
- Database schema design
- Service architecture
- Security implementation
- Performance tuning

**Invocation Example**:
```
Task(
  subagent_type="backend-api-architect",
  description="Design blog API",
  prompt="Design and implement blog API endpoints:

  Endpoints needed:
  - GET /api/blog - List posts (paginated)
  - GET /api/blog/:slug - Get single post
  - POST /api/blog - Create post (authenticated)
  - PUT /api/blog/:slug - Update post (authenticated)
  - DELETE /api/blog/:slug - Delete post (authenticated)

  Requirements:
  - TypeScript types for all responses
  - Error handling
  - Validation
  - Authentication middleware
  - Rate limiting
  - Caching headers

  Provide:
  - API specification
  - Implementation code
  - Security considerations"
)
```

### 6. Fullstack Architect Agent

**Purpose**: Full-stack features spanning multiple layers

**When to Invoke**:
- Features touching database + API + UI
- End-to-end feature implementation
- Architecture decisions
- System integration

**Capabilities**:
- Full-stack development
- Architecture design
- Database + API + Frontend
- Integration patterns
- Performance optimization

**Invocation Example**:
```
Task(
  subagent_type="fullstack-architect",
  description="Implement user authentication",
  prompt="Implement complete user authentication system:

  Scope:
  - Database: User schema, sessions
  - Backend: Auth endpoints, JWT handling
  - Frontend: Login/signup components, auth context
  - Integration: Protected routes, auth state

  Requirements:
  - Secure password hashing
  - JWT token management
  - Session persistence
  - Protected API routes
  - Frontend auth guards
  - Error handling throughout stack

  Deliverables:
  - Database migration
  - API endpoints
  - React components
  - Auth context/hooks
  - Integration tests"
)
```

### 7. Tech Docs Writer Agent

**Purpose**: Create comprehensive technical documentation

**When to Invoke**:
- After implementing features
- Creating API documentation
- Writing guides and tutorials
- Documenting architecture decisions

**Capabilities**:
- Technical writing
- API documentation
- Architecture diagrams
- Code documentation
- User guides

**Invocation Example**:
```
Task(
  subagent_type="tech-docs-writer",
  description="Document blog API",
  prompt="Create comprehensive API documentation for the blog system:

  Cover:
  - API endpoint reference (all routes)
  - Request/response examples
  - Authentication requirements
  - Error responses
  - Rate limiting
  - Usage examples

  Format:
  - Markdown document
  - Code examples in TypeScript
  - curl examples
  - Response schemas

  Create: docs/BLOG_API.md"
)
```

### 8. Content Publisher Agent

**Purpose**: Review and publish content before it goes live

**When to Invoke**:
- Before publishing blog posts
- After writing documentation
- Preparing content for multiple platforms
- SEO and accessibility review

**Capabilities**:
- Editorial review
- Content quality assurance
- SEO optimization
- Accessibility compliance
- Multi-platform formatting

**Invocation Example**:
```
Task(
  subagent_type="content-publisher",
  description="Review blog post",
  prompt="Review and prepare blog post for publication:

  Content: 'Introduction to Open Source Collaboration'

  Review for:
  - Grammar and spelling
  - Technical accuracy
  - Clarity and readability
  - SEO (meta description, keywords)
  - Accessibility (alt text, headings)
  - Links and references

  Prepare versions for:
  - Main blog (with full formatting)
  - RSS feed
  - Social media preview

  Provide editorial feedback and final versions."
)
```

### 9. Security Engineer Agent

**Purpose**: Security analysis and implementation

**When to Invoke**:
- Before implementing auth/authorization
- After adding user input handling
- Before deploying sensitive features
- Security audit needed

**Capabilities**:
- Threat modeling
- Security code review
- Vulnerability assessment
- Security best practices
- Compliance guidance

**Invocation Example**:
```
Task(
  subagent_type="security-engineer",
  description="Security review auth system",
  prompt="Conduct security review of authentication implementation:

  Review:
  - Password storage and hashing
  - JWT token handling
  - Session management
  - CSRF protection
  - XSS prevention
  - SQL injection prevention
  - Rate limiting
  - Input validation

  Provide:
  - Security assessment
  - Vulnerability findings
  - Remediation recommendations
  - Compliance notes (OWASP Top 10)"
)
```

### 10. Systems Architect Agent

**Purpose**: High-level architecture and technology decisions

**When to Invoke**:
- Starting new major features
- Technology selection decisions
- Architecture reviews
- Scalability planning

**Capabilities**:
- Architecture design
- Technology evaluation
- ADR (Architecture Decision Records)
- Scalability analysis
- Trade-off analysis

**Invocation Example**:
```
Task(
  subagent_type="systems-architect",
  description="Design blog architecture",
  prompt="Design scalable blog architecture:

  Requirements:
  - Support 1000+ blog posts
  - Fast page loads (<2s)
  - SEO optimized
  - Content management workflow

  Evaluate:
  - Static generation vs SSR vs CSR
  - Database choice
  - CDN strategy
  - Search implementation
  - Caching strategy

  Deliverables:
  - Architecture diagram
  - Technology recommendations
  - ADR document
  - Scalability plan"
)
```

---

## Workflow Patterns

### Pattern 1: Feature Implementation

**Scenario**: User requests new feature

```
Step 1: PRD Update (Orchestrator)
- Create Epic in PRD
- Break into Stories
- Define acceptance criteria
- Commit PRD changes

Step 2: GitHub Issues (Orchestrator)
- Create label for epic
- Create issue per story
- Link in PRD

Step 3: Feature Branch (Orchestrator)
- Create branch: feat/epic-N-name
- Never work on main

Step 4: Implementation (Specialized Agent)
- Invoke appropriate agent:
  * Frontend → frontend-dev-specialist
  * Backend → backend-api-architect
  * Full stack → fullstack-architect
  * TDD → tdd-software-developer

Step 5: Testing (QA Agent if needed)
- Ensure comprehensive tests
- Invoke qa-testing-strategist for strategy

Step 6: Documentation (Tech Docs Agent)
- Document new features
- Update relevant guides

Step 7: Pull Request (Orchestrator)
- Create PR with summary
- Reference issues (Closes #N)
- Include test results
- Request review

Step 8: Merge & Cleanup (Orchestrator)
- After approval, merge PR
- Delete feature branch
- Update PRD to ✅ COMPLETE
```

### Pattern 2: Gap Analysis

**Scenario**: Before major work, analyze codebase

```
Step 1: Codebase Exploration (Orchestrator)
- Search for TODOs
- Check for console.logs
- Find linting errors
- Identify missing tests

Step 2: Test Coverage Analysis (QA Agent)
Task(
  subagent_type="qa-testing-strategist",
  prompt="Analyze test coverage and identify gaps"
)

Step 3: Security Review (Security Agent)
Task(
  subagent_type="security-engineer",
  prompt="Conduct security audit"
)

Step 4: Architecture Review (Systems Agent)
Task(
  subagent_type="systems-architect",
  prompt="Review architecture and identify technical debt"
)

Step 5: Documentation (Orchestrator)
- Create GAP_ANALYSIS.md
- Prioritize findings
- Create remediation Epic in PRD
```

### Pattern 3: Documentation Update

**Scenario**: After feature completion, update docs

```
Step 1: Technical Documentation (Tech Docs Agent)
Task(
  subagent_type="tech-docs-writer",
  prompt="Document new feature with API reference"
)

Step 2: User Guide Update (Tech Docs Agent)
Task(
  subagent_type="tech-docs-writer",
  prompt="Update user guides with new feature usage"
)

Step 3: Content Review (Content Publisher)
Task(
  subagent_type="content-publisher",
  prompt="Review documentation for clarity and completeness"
)

Step 4: Commit & PR (Orchestrator)
- Commit documentation
- Create PR with docs
- Merge after review
```

### Pattern 4: Multi-Agent Collaboration

**Scenario**: Complex feature requiring multiple specialists

```
Example: E-commerce checkout flow

Step 1: Architecture (Systems Architect)
Task(
  subagent_type="systems-architect",
  prompt="Design checkout system architecture"
)

Step 2: Backend (Backend API Architect)
Task(
  subagent_type="backend-api-architect",
  prompt="Implement checkout API endpoints"
)

Step 3: Frontend (Frontend Specialist)
Task(
  subagent_type="frontend-dev-specialist",
  prompt="Create checkout UI components"
)

Step 4: Security (Security Engineer)
Task(
  subagent_type="security-engineer",
  prompt="Review checkout security"
)

Step 5: Testing (QA Strategist)
Task(
  subagent_type="qa-testing-strategist",
  prompt="Design checkout testing strategy"
)

Step 6: Documentation (Tech Docs Writer)
Task(
  subagent_type="tech-docs-writer",
  prompt="Document checkout flow"
)

All coordinated by Orchestrator maintaining PRD and git workflow
```

---

## Tool Usage Guidelines

### Git Operations

**Critical Rules**:
```bash
# ❌ NEVER DO THIS
git checkout main
git add .
git commit -m "Add feature"
git push origin main  # NEVER push to main!

# ✅ ALWAYS DO THIS
git checkout main
git pull origin main
git checkout -b feat/feature-name
git add .
git commit -m "Add feature

Implements Story N.X (Issue #N)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
git push -u origin feat/feature-name
# Then create PR via gh pr create
```

### File Operations

**Prefer Specialized Tools**:
- ✅ `Read` tool for reading files (not `cat`)
- ✅ `Edit` tool for editing (not `sed`)
- ✅ `Write` tool for creating (not `echo >`)
- ✅ `Grep` tool for searching (not `grep` command)
- ✅ `Glob` tool for finding files (not `find`)

**Only use `Bash` for**:
- Git operations
- npm/yarn commands
- Build/test commands
- Package installations

### GitHub Operations

**Use `gh` CLI via Bash**:
```bash
# Create issue
gh issue create --title "Story N.X: Title" --body "..." --label "epic-N"

# Create PR
gh pr create --title "Title" --body "..."

# List issues
gh issue list --label "epic-N"

# View PR
gh pr view 123
```

### Testing

**Run tests before every PR**:
```bash
# Unit tests
npm test

# Coverage
npm run test:coverage

# Linting
npm run lint

# Type checking
npm run type-check

# Build
npm run build
```

---

## Quality Assurance Processes

### Code Quality Checklist

**Before Every Commit**:
- [ ] Code follows project conventions
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] No console.log statements (except intentional logging)
- [ ] No TODOs (or documented in issues)
- [ ] Tests added for new code
- [ ] All tests passing

**Before Every PR**:
- [ ] All acceptance criteria met
- [ ] Tests pass
- [ ] Build succeeds
- [ ] No security vulnerabilities
- [ ] Documentation updated
- [ ] PRD updated
- [ ] GitHub issues referenced

### Test Coverage Requirements

**Minimum Standards**:
- Unit tests: 80%+ coverage
- Integration tests: Critical user flows
- E2E tests: Main user journeys
- Accessibility tests: WCAG AA compliance

**Test Types**:
```typescript
// Unit Test
describe('Component', () => {
  it('renders correctly', () => {
    render(<Component />)
    expect(screen.getByText('...')).toBeInTheDocument()
  })
})

// Integration Test
describe('Feature Flow', () => {
  it('completes user journey', async () => {
    // Setup
    // Action
    // Assert
  })
})

// Accessibility Test
describe('Accessibility', () => {
  it('has no violations', async () => {
    const { container } = render(<Component />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
```

### Security Standards

**Required Security Checks**:
- Input validation
- Output encoding
- Authentication/authorization
- CSRF protection
- XSS prevention
- SQL injection prevention
- Secure headers
- HTTPS enforcement

**Security Review Triggers**:
- User input handling
- Authentication/authorization
- Payment processing
- File uploads
- External API integration

---

## Documentation Standards

### Required Documentation

**For Every Feature**:
1. **PRD Entry**: Epic and Stories with acceptance criteria
2. **Code Comments**: JSDoc for functions, complex logic
3. **README Updates**: If feature changes setup/usage
4. **API Documentation**: For new endpoints
5. **User Guide**: For user-facing features

### Documentation Templates

**API Documentation**:
```markdown
# API Endpoint Name

## Endpoint
`METHOD /api/path`

## Description
What this endpoint does

## Authentication
Required/Not required

## Request
### Headers
- `Header-Name: value`

### Body
\`\`\`json
{
  "field": "value"
}
\`\`\`

## Response
### Success (200)
\`\`\`json
{
  "result": "value"
}
\`\`\`

### Errors
- 400: Bad Request
- 401: Unauthorized
- 500: Server Error

## Example
\`\`\`bash
curl -X METHOD https://api.example.com/path \\
  -H "Authorization: Bearer TOKEN" \\
  -d '{"field": "value"}'
\`\`\`
```

**Feature Documentation**:
```markdown
# Feature Name

## Overview
Brief description of feature

## Usage
How to use this feature

## Configuration
Any configuration needed

## Examples
Code examples

## API Reference
Links to API docs

## Troubleshooting
Common issues and solutions
```

---

## Example Agent Invocations

### Example 1: Implementing Essays Section

```
User: "Add an essays section under writing"

Orchestrator Actions:
1. Update PRD with Epic 11
2. Create GitHub issues
3. Create feature branch
4. Invoke Frontend Specialist

Task(
  subagent_type="frontend-dev-specialist",
  description="Add Essays section",
  prompt="Create Essays section for Writing page:

  Requirements:
  - Create src/data/essays.ts (Essay interface)
  - Create src/components/Essays.tsx
  - Create src/components/Essays.css
  - Add Essays to Writing page with tabs
  - Add ARIA labels for accessibility

  Tab interface:
  - Poetry | Essays | Fiction
  - Active tab styling
  - Keyboard navigation

  Follow pattern from Poetry and Fiction components."
)

5. After agent completes:
   - Review changes
   - Run tests
   - Commit with message
   - Push to feature branch
   - Create PR
```

### Example 2: Gap Analysis Before Strapi

```
User: "Do a gap analysis before implementing Strapi"

Orchestrator Actions:
1. Search for TODOs
2. Run linter
3. Check test coverage
4. Analyze dependencies

5. Invoke QA Strategist
Task(
  subagent_type="qa-testing-strategist",
  prompt="Analyze test coverage and identify gaps:

  Review:
  - Current test coverage
  - Missing tests for components
  - Integration test gaps
  - E2E test needs

  Provide recommendations for improvement."
)

6. Invoke Security Engineer
Task(
  subagent_type="security-engineer",
  prompt="Conduct security audit:

  Review:
  - Authentication implementation
  - Input validation
  - API security
  - Dependency vulnerabilities

  Provide security assessment and recommendations."
)

7. Create GAP_ANALYSIS.md with findings
8. Create Epic 11.5 in PRD for remediation
9. Commit and push
```

### Example 3: Full Stack Feature

```
User: "Implement user authentication"

Orchestrator Actions:
1. Update PRD with Epic
2. Create issues
3. Create feature branch

4. Invoke Systems Architect
Task(
  subagent_type="systems-architect",
  description="Design auth architecture",
  prompt="Design authentication system:

  Requirements:
  - JWT-based auth
  - Secure password storage
  - Session management
  - Protected routes

  Provide:
  - Architecture diagram
  - Technology choices
  - Security considerations
  - Implementation plan"
)

5. Invoke Fullstack Architect
Task(
  subagent_type="fullstack-architect",
  description="Implement authentication",
  prompt="Implement complete auth system:

  Backend:
  - User model with password hashing
  - Auth endpoints (login, register, logout)
  - JWT middleware

  Frontend:
  - Auth context
  - Login/Register components
  - Protected route component

  Integration:
  - API client with auth headers
  - Token refresh logic
  - Error handling

  Tests:
  - Unit tests for all components
  - Integration tests for auth flow"
)

6. Invoke Security Engineer
Task(
  subagent_type="security-engineer",
  description="Review auth security",
  prompt="Security review of authentication:

  Review implemented auth for:
  - Password security
  - JWT handling
  - Session security
  - CSRF protection
  - XSS prevention

  Provide security assessment."
)

7. Invoke Tech Docs Writer
Task(
  subagent_type="tech-docs-writer",
  description="Document auth system",
  prompt="Create authentication documentation:

  Document:
  - Auth endpoints
  - Frontend usage
  - Security features
  - Troubleshooting

  Create docs/AUTHENTICATION.md"
)

8. Review all changes
9. Run tests
10. Create PR
```

---

## Implementation Checklist

### Setting Up the Agent Team

**Phase 1: Orchestrator Configuration**
- [ ] Configure primary orchestrator with strict workflow rules
- [ ] Enable PRD-driven development philosophy
- [ ] Set up git operation constraints (never push to main)
- [ ] Configure PR creation templates
- [ ] Enable GitHub CLI integration

**Phase 2: Specialized Agent Setup**
- [ ] Configure Explorer agent for codebase navigation
- [ ] Set up TDD Software Developer agent
- [ ] Configure Frontend Dev Specialist
- [ ] Set up Backend API Architect
- [ ] Configure Fullstack Architect
- [ ] Set up QA Testing Strategist
- [ ] Configure Security Engineer
- [ ] Set up Tech Docs Writer
- [ ] Configure Systems Architect
- [ ] Set up Content Publisher

**Phase 3: Workflow Integration**
- [ ] Create PRD template
- [ ] Set up Epic/Story structure
- [ ] Configure GitHub issue templates
- [ ] Set up PR templates
- [ ] Create commit message templates

**Phase 4: Quality Assurance**
- [ ] Set up testing requirements
- [ ] Configure linting standards
- [ ] Set up security scanning
- [ ] Configure accessibility testing
- [ ] Set up coverage reporting

**Phase 5: Documentation**
- [ ] Create development guide
- [ ] Set up documentation templates
- [ ] Create API documentation standards
- [ ] Set up user guide templates

### Validation Tests

**Test 1: Simple Feature**
```
Request: "Add a contact form"
Expected:
- PRD updated with Epic
- GitHub issues created
- Feature branch created
- Tests written first (TDD)
- Implementation complete
- PR created (not merged to main)
```

**Test 2: Complex Feature**
```
Request: "Add user authentication"
Expected:
- Multiple agents invoked in sequence
- Architecture designed first
- Full stack implementation
- Security review conducted
- Documentation created
- Comprehensive PR
```

**Test 3: Workflow Enforcement**
```
Attempt: Push directly to main
Expected:
- Orchestrator refuses
- Creates feature branch instead
- Enforces PR workflow
```

---

## Conclusion

This blueprint provides a complete specification for creating a multi-agent LLM development team with:

1. **Strict Workflow**: PRD-driven, branch-based, PR-enforced
2. **Specialized Agents**: 10+ agents for specific tasks
3. **Quality Assurance**: Testing, security, documentation
4. **Scalability**: Handle simple to complex features
5. **Maintainability**: Clear processes and documentation

**Key Success Factors**:
- Strict adherence to workflow (never push to main)
- PRD as single source of truth
- Comprehensive testing before merge
- Clear documentation throughout
- Security-first approach

**Replication Steps**:
1. Implement orchestrator with workflow rules
2. Add specialized agents one by one
3. Test with simple features first
4. Validate workflow enforcement
5. Scale to complex multi-agent features

---

**Document Version**: 1.0
**Last Updated**: 2024-11-16
**Maintained By**: Primary Orchestrator Agent

*This blueprint is the complete specification for replicating the agent team architecture used in the karstenwade.com project.*
