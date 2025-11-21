import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

// Mock SEO component to avoid react-helmet-async issues in tests
vi.mock('./components/SEO', () => ({
  default: () => null,
}))

// Mock StructuredData component
vi.mock('./components/StructuredData', () => ({
  default: () => null,
}))

// Mock contentService to return empty data for App tests
vi.mock('./services/contentService', () => ({
  contentService: {
    getEssays: vi.fn(() => Promise.resolve([])),
    getPoems: vi.fn(() => Promise.resolve([])),
    getStories: vi.fn(() => Promise.resolve([])),
    getPapers: vi.fn(() => Promise.resolve([])),
  },
}))

describe('App', () => {
  it('renders Karsten Wade heading', async () => {
    render(<App />);
    await waitFor(() => {
      const heading = screen.getByRole('heading', { name: /karsten wade/i, level: 1 });
      expect(heading).toBeInTheDocument();
    });
  });

  it('displays collaborative experience consulting tagline', async () => {
    render(<App />);
    await waitFor(() => {
      const tagline = screen.getByText(/collaborative experience consulting/i);
      expect(tagline).toBeInTheDocument();
    });
  });

  it('shows expertise areas', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/collaborative experience consulting/i)).toBeInTheDocument();
      expect(screen.getByText(/developer experience/i)).toBeInTheDocument();
      expect(screen.getByText(/open collaboration/i)).toBeInTheDocument();
    });
  });

  it('has proper semantic HTML structure', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByRole('banner')).toBeInTheDocument(); // header
      expect(screen.getByRole('main')).toBeInTheDocument(); // main
      expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // footer
    });
  });
});
