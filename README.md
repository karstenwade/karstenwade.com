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

- **Next.js 16** - React framework with App Router and static export
- **React 18.3** - UI component library
- **TypeScript 5.6** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS framework
- **Strapi CMS** - Headless CMS for blog content
- **Vitest** - Unit testing framework
- **ESLint** - Code quality and consistency

## Project Structure

```
karstenwade.com/
├── app/                  # Next.js App Router (pages + components)
│   ├── components/       # React components (including ui/)
│   ├── blog/            # Blog pages (Strapi-powered)
│   ├── cv/              # CV page route
│   ├── papers/          # Papers pages with dynamic routes
│   ├── writing/         # Writing page route
│   ├── layout.tsx       # Root layout with metadata
│   ├── page.tsx         # Home page
│   ├── not-found.tsx    # 404 page
│   └── globals.css      # Global styles
├── data/                 # Static content data files
├── lib/                  # Shared utilities and services
│   ├── services/        # contentService, paperService, githubApi
│   ├── strapi.ts        # Strapi API client
│   ├── utils.ts         # cn() utility
│   └── zerodb-client.ts # ZeroDB search client
├── types/                # TypeScript type definitions
├── styles/               # Design system (CSS variables)
├── test/                 # Test setup and utilities
├── cms/                  # Strapi CMS (separate npm project)
├── public/               # Static assets
├── scripts/              # Build scripts (sitemap generation)
├── docs/                 # Project documentation
├── .github/workflows/    # CI/CD pipelines
└── out/                  # Static export output (generated)
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

```bash
npm run dev
```

The site will be available at `http://localhost:3001`

#### Start Strapi CMS

```bash
cd cms
npm run develop
```

Strapi admin runs at `http://localhost:1337/admin`

#### Build for Production

Create an optimized static export:

```bash
npm run build
```

Output will be in the `out/` directory as static HTML, CSS, and JavaScript.

#### Preview Production Build

Serve the static export locally:

```bash
npx serve out -p 3001
```

### Testing

#### Run Unit Tests

```bash
npm run test:unit
```

#### Test Coverage

```bash
npm run test:coverage
```

### Code Quality

#### Linting

```bash
npm run lint
```

#### Type Checking

```bash
npm run type-check
```

## Deployment

### Vercel (Primary)

The site is automatically deployed to Vercel:

1. Push changes to the `main` branch
2. Vercel builds the site with `npm run build`
3. Static files deploy automatically
4. Available at `https://karstenwade.com`

### GitHub Pages (Mirror)

A mirror deployment to GitHub Pages runs via GitHub Actions on push to main.

### Custom Domain Configuration

- **Primary Domain:** karstenwade.com
- **HTTPS:** Enforced automatically
- **CDN:** Global CDN for fast delivery

### Automated Paper Syncing

The site automatically syncs papers from the [karstenwade/papers](https://github.com/karstenwade/papers) repository:

- Runs daily at 00:00 UTC via GitHub Actions
- Fetches latest papers from GitHub
- Regenerates sitemap with new papers
- Vercel auto-deploys from main branch

## SEO & Analytics

### Google Analytics 4
- Automatic page view tracking on route changes
- See `docs/GOOGLE_ANALYTICS.md` for configuration details

### Google Search Console
- Sitemap submitted at `https://karstenwade.com/sitemap.xml`
- See `docs/GOOGLE_SEARCH_CONSOLE.md` for setup guide

### Structured Data
- Schema.org Person markup for Karsten Wade
- Schema.org CreativeWork for poems and essays
- Schema.org ScholarlyArticle for papers

### Meta Tags
- Open Graph tags for social media sharing
- Twitter Cards for Twitter/X previews
- Bluesky creator tag
- Custom meta tags per page via Next.js Metadata API

## Development Methodology

This project follows **Test-Driven Development (TDD)** principles:

1. **RED** - Write failing tests first
2. **GREEN** - Implement minimal code to pass tests
3. **REFACTOR** - Improve code quality while keeping tests green

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
