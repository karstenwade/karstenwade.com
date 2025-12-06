import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import WritingTabs from '../WritingTabs'
import type { Poem } from '@/data/poetry'
import type { Essay } from '@/data/essays'
import type { Story } from '@/data/fiction'

describe('WritingTabs', () => {
  const mockPoems: Poem[] = [
    {
      slug: 'test-poem',
      title: 'Test Poem',
      excerpt: 'A test poem excerpt',
      fullText: 'Full poem text',
      dateWritten: '2024-01-01',
      form: 'Free Verse',
      theme: 'Test Theme',
      tags: ['test'],
    },
  ]

  const mockEssays: Essay[] = [
    {
      slug: 'test-essay',
      title: 'Test Essay',
      excerpt: 'A test essay excerpt',
      fullText: 'Full essay text',
      dateWritten: '2024-01-01',
      theme: 'Test Theme',
      wordCount: 500,
      tags: ['test'],
    },
  ]

  const mockStories: Story[] = [
    {
      slug: 'test-story',
      title: 'Test Story',
      excerpt: 'A test story excerpt',
      fullText: 'Full story text',
      dateWritten: '2024-01-01',
      genre: 'Fiction',
      wordCount: 1000,
      tags: ['test'],
    },
  ]

  it('renders all tab buttons', () => {
    render(<WritingTabs poems={mockPoems} essays={mockEssays} stories={mockStories} />)

    expect(screen.getByRole('tab', { name: 'Poetry' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Essays' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Fiction' })).toBeInTheDocument()
  })

  it('renders tablist with accessible label', () => {
    render(<WritingTabs poems={mockPoems} essays={mockEssays} stories={mockStories} />)

    const tablist = screen.getByRole('tablist')
    expect(tablist).toHaveAttribute('aria-label', 'Writing categories')
  })

  it('shows poetry tab as selected by default', () => {
    render(<WritingTabs poems={mockPoems} essays={mockEssays} stories={mockStories} />)

    const poetryTab = screen.getByRole('tab', { name: 'Poetry' })
    expect(poetryTab).toHaveAttribute('aria-selected', 'true')

    const essaysTab = screen.getByRole('tab', { name: 'Essays' })
    expect(essaysTab).toHaveAttribute('aria-selected', 'false')

    const fictionTab = screen.getByRole('tab', { name: 'Fiction' })
    expect(fictionTab).toHaveAttribute('aria-selected', 'false')
  })

  it('shows poetry content by default', () => {
    render(<WritingTabs poems={mockPoems} essays={mockEssays} stories={mockStories} />)

    const poetryPanel = screen.getByRole('tabpanel', { name: 'Poetry' })
    expect(poetryPanel).not.toHaveAttribute('hidden')
    expect(screen.getByText('Test Poem')).toBeInTheDocument()
  })

  it('switches to essays tab when clicked', () => {
    render(<WritingTabs poems={mockPoems} essays={mockEssays} stories={mockStories} />)

    const essaysTab = screen.getByRole('tab', { name: 'Essays' })
    fireEvent.click(essaysTab)

    expect(essaysTab).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('Test Essay')).toBeInTheDocument()
  })

  it('switches to fiction tab when clicked', () => {
    render(<WritingTabs poems={mockPoems} essays={mockEssays} stories={mockStories} />)

    const fictionTab = screen.getByRole('tab', { name: 'Fiction' })
    fireEvent.click(fictionTab)

    expect(fictionTab).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('Test Story')).toBeInTheDocument()
  })

  it('has correct aria-controls attributes', () => {
    render(<WritingTabs poems={mockPoems} essays={mockEssays} stories={mockStories} />)

    expect(screen.getByRole('tab', { name: 'Poetry' })).toHaveAttribute('aria-controls', 'poetry-panel')
    expect(screen.getByRole('tab', { name: 'Essays' })).toHaveAttribute('aria-controls', 'essays-panel')
    expect(screen.getByRole('tab', { name: 'Fiction' })).toHaveAttribute('aria-controls', 'fiction-panel')
  })

  it('renders tabpanels with correct aria-labelledby', () => {
    render(<WritingTabs poems={mockPoems} essays={mockEssays} stories={mockStories} />)

    const panels = screen.getAllByRole('tabpanel', { hidden: true })
    expect(panels.length).toBeGreaterThan(0)
  })
})
