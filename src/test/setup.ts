import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Import CSS variables for testing
import '../styles/variables.css';
import '../styles/index.css';

// Extend Vitest's expect method with jest-dom matchers
expect.extend(matchers);

// Cleanup after each test case
afterEach(() => {
  cleanup();
});

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  notFound: vi.fn(),
}));

// Mock next/link - using createElement to avoid JSX in .ts file
vi.mock('next/link', async () => {
  const React = await import('react');
  return {
    default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => {
      return React.createElement('a', { href, ...props }, children);
    },
  };
});

// Mock next/script - using createElement to avoid JSX in .ts file
vi.mock('next/script', async () => {
  const React = await import('react');
  return {
    default: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => {
      return React.createElement('script', props, children);
    },
  };
});
