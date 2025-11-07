# karstenwade.com

Personal website for **Karsten Wade** - Collaborative Experience Consulting

## About Karsten Wade

Karsten Wade is a leading expert in collaborative work and developer experience. His professional identity encompasses:

- **Collaborative experience consulting** - Helping organizations design better collaborative workflows
- **Collaboration catalyst** - Enabling teams to work together more effectively
- **Open collaboration expert** - Deep expertise in open source methodologies
- **Developer experience expert** - Optimizing DevEx and developer productivity
- **DevEx collaboration facilitator** - Bridging development teams and stakeholders
- **Human systems expertise** - Understanding the social dynamics of technical work
- **Community catalyst** - Building and nurturing technical communities
- **Contribution enabler** - Removing barriers to participation and contribution

## Technology Stack

This website is built with modern web technologies focused on performance, accessibility, and developer experience:

- **React 18.3** - UI component library
- **TypeScript 5.6** - Type-safe JavaScript
- **Vite 6.0** - Lightning-fast build tool and dev server
- **Vitest** - Unit testing framework
- **ESLint** - Code quality and consistency
- **GitHub Pages** - Static site hosting with custom domain

### Why Vite?

We chose Vite over Create React App because:

1. **Faster builds** - Uses esbuild for 10-100x faster builds than webpack
2. **Better DX** - Instant HMR (Hot Module Replacement) in development
3. **Static site generation** - Easy to configure for GitHub Pages
4. **Modern tooling** - Native ES modules, optimized for modern browsers
5. **TypeScript first** - Excellent TypeScript support out of the box

## Project Structure

```
karstenwade.com/
├── src/
│   ├── components/        # Reusable React components
│   ├── pages/            # Page-level components
│   ├── styles/           # CSS stylesheets
│   ├── types/            # TypeScript type definitions
│   ├── test/             # Test utilities and setup
│   ├── App.tsx           # Root application component
│   ├── main.tsx          # Application entry point
│   └── vite-env.d.ts     # Vite type declarations
├── public/               # Static assets (copied to dist/)
├── content/              # Content organized by type
│   ├── poetry/           # Poetry collection
│   ├── fiction/          # Fiction writing
│   ├── cv/               # Curriculum vitae
│   ├── theories/         # CollabX, ContribX frameworks
│   └── open-papers/      # Links to research papers
├── tests/                # Integration and acceptance tests
├── dist/                 # Build output (generated)
└── node_modules/         # Dependencies (generated)
```

## Getting Started

### Prerequisites

- **Node.js** 18.x or later (20.x recommended)
- **npm** 9.x or later
- **Git** for version control

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/karstenwade/karstenwade.com.git
   cd karstenwade.com
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development Workflow

#### Start Development Server

Run the local development server with hot module replacement:

```bash
npm run dev
```

The site will be available at `http://localhost:5173`

#### Build for Production

Create an optimized production build:

```bash
npm run build
```

Output will be in the `dist/` directory as static HTML, CSS, and JavaScript.

#### Preview Production Build

Test the production build locally:

```bash
npm run preview
```

The production preview will be available at `http://localhost:4173`

### Testing

#### Run TDD Integration Tests

Story 1.1 includes comprehensive TDD tests:

```bash
npm test
```

This runs the bash test suite that validates:
- ✅ Package configuration (package.json, dependencies)
- ✅ Build configuration (Vite, TypeScript)
- ✅ Folder structure (src/, content/, public/)
- ✅ Build output generation (dist/)
- ✅ Entry point files (index.html, App.tsx)
- ✅ Static site generation compatibility

#### Run Unit Tests

Component-level tests with Vitest:

```bash
npm run test:unit
```

#### Test Coverage

Generate code coverage reports:

```bash
npm run test:coverage
```

Coverage reports will be available in the `coverage/` directory.

### Code Quality

#### Linting

Check code quality with ESLint:

```bash
npm run lint
```

#### Type Checking

Verify TypeScript types without building:

```bash
npm run type-check
```

## Deployment

### GitHub Pages with Custom Domain

The site is automatically deployed to GitHub Pages via GitHub Actions:

1. Push changes to the `main` branch
2. GitHub Actions builds the site
3. Static files deploy to `gh-pages` branch
4. Available at `https://karstenwade.com` (custom domain)

### Custom Domain Configuration

- **Primary Domain:** karstenwade.com
- **DNS:** A records point to GitHub Pages IPs
- **HTTPS:** Enforced via GitHub Pages (automatic SSL)
- **CDN:** GitHub's global CDN for fast delivery

See `docs/PRD.md` for detailed DNS configuration.

## Development Methodology

This project follows **Test-Driven Development (TDD)** principles:

### TDD Cycle: RED → GREEN → REFACTOR

1. **RED Phase** - Write failing tests first
   - Define expected behavior with tests
   - Confirm tests fail (proving they work)
   - Document requirements through test cases

2. **GREEN Phase** - Implement minimal code to pass tests
   - Write simplest code that makes tests pass
   - Don't over-engineer or add untested features
   - Focus on making tests green

3. **REFACTOR Phase** - Improve code quality without changing behavior
   - Optimize TypeScript types
   - Extract reusable components
   - Improve naming and organization
   - Add documentation
   - Ensure tests still pass

### Story 1.1 Implementation Summary

**User Story**: As a developer, I want a working React application scaffold so that I can begin building site components.

**Test Results**: ✅ **23/23 tests passing**

#### What We Tested (RED Phase)

- Package.json exists with React dependency
- Build scripts configured (dev, build, test)
- Vite and TypeScript configuration files present
- Required folder structure created
- Build output directory generated
- Entry point files exist (index.html, App.tsx, main.tsx)
- Static site generation configured for GitHub Pages

#### What We Built (GREEN Phase)

- Initialized React 18.3 with TypeScript 5.6
- Configured Vite 6.0 for static site generation
- Created folder structure for content organization
- Built working App component with Karsten's professional identity
- Generated production-ready static HTML output
- Set up development server with HMR

#### What We Optimized (REFACTOR Phase)

- Added TypeScript type definitions (`src/types/`)
- Created Vitest configuration for unit testing
- Added React Testing Library setup
- Enhanced package.json scripts (lint, type-check, coverage)
- Optimized Vite build configuration (esbuild minification)
- Documented architecture decisions in README

## Contributing

This is a personal website, but suggestions and feedback are welcome! Please open an issue to discuss any changes.

## License

MIT License - See LICENSE file for details

## Contact

**Karsten Wade**
Email: karsten@karstenwade.com
GitHub: [@karstenwade](https://github.com/karstenwade)
Website: [karstenwade.com](https://karstenwade.com)

---

*Built with collaborative experience in mind*
