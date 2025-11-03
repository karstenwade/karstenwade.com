import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders Karsten Wade heading', () => {
    render(<App />);
    const heading = screen.getByRole('heading', { name: /karsten wade/i, level: 1 });
    expect(heading).toBeInTheDocument();
  });

  it('displays collaborative experience consulting tagline', () => {
    render(<App />);
    const tagline = screen.getByText(/collaborative experience consulting/i);
    expect(tagline).toBeInTheDocument();
  });

  it('shows expertise areas', () => {
    render(<App />);
    expect(screen.getByText(/collaborative experience consulting/i)).toBeInTheDocument();
    expect(screen.getByText(/developer experience/i)).toBeInTheDocument();
    expect(screen.getByText(/open collaboration/i)).toBeInTheDocument();
  });

  it('has proper semantic HTML structure', () => {
    render(<App />);
    expect(screen.getByRole('banner')).toBeInTheDocument(); // header
    expect(screen.getByRole('main')).toBeInTheDocument(); // main
    expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // footer
  });
});
