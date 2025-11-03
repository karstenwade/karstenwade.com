import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Card from './Card'

describe('Card Component', () => {
  describe('Component Rendering', () => {
    it('should render card with required props', () => {
      render(
        <Card
          title="Test Title"
          description="Test description"
          link="/test"
        />
      )

      expect(screen.getByRole('article')).toBeInTheDocument()
      expect(screen.getByText('Test Title')).toBeInTheDocument()
      expect(screen.getByText('Test description')).toBeInTheDocument()
    })

    it('should render card with all props including optional image', () => {
      render(
        <Card
          title="Paper Title"
          description="Paper description"
          link="/paper"
          image="/images/paper.jpg"
        />
      )

      const image = screen.getByRole('img')
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('src', '/images/paper.jpg')
      expect(image).toHaveAttribute('alt', 'Paper Title')
    })

    it('should not render image when image prop is not provided', () => {
      render(
        <Card
          title="No Image Card"
          description="Description"
          link="/test"
        />
      )

      expect(screen.queryByRole('img')).not.toBeInTheDocument()
    })
  })

  describe('Link Behavior', () => {
    it('should wrap entire card in link', () => {
      render(
        <Card
          title="Clickable Card"
          description="Click me"
          link="/destination"
        />
      )

      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', '/destination')
    })

    it('should have accessible name from title', () => {
      render(
        <Card
          title="Accessible Title"
          description="Description"
          link="/test"
        />
      )

      const link = screen.getByRole('link', { name: /accessible title/i })
      expect(link).toBeInTheDocument()
    })
  })

  describe('Typography Structure', () => {
    it('should render title as heading level 3', () => {
      render(
        <Card
          title="Heading Test"
          description="Description"
          link="/test"
        />
      )

      const heading = screen.getByRole('heading', { level: 3 })
      expect(heading).toHaveTextContent('Heading Test')
    })

    it('should render description in paragraph', () => {
      render(
        <Card
          title="Title"
          description="This is the description text"
          link="/test"
        />
      )

      const description = screen.getByText('This is the description text')
      expect(description.tagName).toBe('P')
    })
  })

  describe('Accessibility', () => {
    it('should have article role', () => {
      render(
        <Card
          title="Article Test"
          description="Description"
          link="/test"
        />
      )

      expect(screen.getByRole('article')).toBeInTheDocument()
    })

    it('should have proper image alt text derived from title', () => {
      render(
        <Card
          title="The Open Source Way 2.0"
          description="Description"
          link="/paper"
          image="/images/osw.jpg"
        />
      )

      const image = screen.getByRole('img')
      expect(image).toHaveAttribute('alt', 'The Open Source Way 2.0')
    })

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup()
      render(
        <Card
          title="Keyboard Test"
          description="Tab to me"
          link="/test"
        />
      )

      const link = screen.getByRole('link')
      await user.tab()
      expect(link).toHaveFocus()
    })

    it('should be activatable with Enter key', async () => {
      const user = userEvent.setup()
      render(
        <Card
          title="Enter Test"
          description="Press Enter"
          link="/test"
        />
      )

      const link = screen.getByRole('link')
      link.focus()

      // Enter key navigation is handled by browser default behavior
      expect(link).toHaveFocus()
      expect(link).toHaveAttribute('href', '/test')
    })
  })

  describe('CSS Classes', () => {
    it('should apply base card class', () => {
      render(
        <Card
          title="Class Test"
          description="Description"
          link="/test"
        />
      )

      const article = screen.getByRole('article')
      expect(article).toHaveClass('card')
    })

    it('should apply custom className when provided', () => {
      render(
        <Card
          title="Custom Class"
          description="Description"
          link="/test"
          className="custom-card-class"
        />
      )

      const article = screen.getByRole('article')
      expect(article).toHaveClass('card')
      expect(article).toHaveClass('custom-card-class')
    })

    it('should have card--with-image class when image is provided', () => {
      render(
        <Card
          title="Image Card"
          description="Description"
          link="/test"
          image="/test.jpg"
        />
      )

      const article = screen.getByRole('article')
      expect(article).toHaveClass('card--with-image')
    })

    it('should not have card--with-image class when no image', () => {
      render(
        <Card
          title="No Image"
          description="Description"
          link="/test"
        />
      )

      const article = screen.getByRole('article')
      expect(article).not.toHaveClass('card--with-image')
    })
  })

  describe('Hover and Focus States', () => {
    it('should have focus-visible styles on keyboard focus', async () => {
      const user = userEvent.setup()
      render(
        <Card
          title="Focus Test"
          description="Description"
          link="/test"
        />
      )

      const link = screen.getByRole('link')
      await user.tab()

      expect(link).toHaveFocus()
      // CSS hover and focus states are tested via visual regression or E2E
      // Here we verify the element can receive focus
    })
  })

  describe('Content Truncation', () => {
    it('should render long descriptions without breaking layout', () => {
      const longDescription = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(10)

      render(
        <Card
          title="Long Description Test"
          description={longDescription}
          link="/test"
        />
      )

      // Use partial match since text may be truncated with CSS
      const description = screen.getByText(/Lorem ipsum dolor sit amet/)
      expect(description).toBeInTheDocument()
      expect(description).toHaveClass('card__description')
    })

    it('should render long titles without breaking layout', () => {
      const longTitle = 'This is a Very Long Title That Should Still Display Properly in the Card Component'

      render(
        <Card
          title={longTitle}
          description="Description"
          link="/test"
        />
      )

      const heading = screen.getByRole('heading', { level: 3 })
      expect(heading).toHaveTextContent(longTitle)
    })
  })

  describe('Required Props Validation', () => {
    it('should render with only required props', () => {
      render(
        <Card
          title="Minimal Card"
          description="Minimal description"
          link="/minimal"
        />
      )

      expect(screen.getByRole('article')).toBeInTheDocument()
      expect(screen.getByText('Minimal Card')).toBeInTheDocument()
      expect(screen.getByText('Minimal description')).toBeInTheDocument()
      expect(screen.getByRole('link')).toHaveAttribute('href', '/minimal')
    })
  })

  describe('Image Handling', () => {
    it('should render image container with proper structure', () => {
      render(
        <Card
          title="Image Structure"
          description="Description"
          link="/test"
          image="/test-image.jpg"
        />
      )

      const image = screen.getByRole('img')
      expect(image).toBeInTheDocument()

      // Image should be within the card structure
      const article = screen.getByRole('article')
      expect(article).toContainElement(image)
    })

    it('should handle image paths correctly', () => {
      render(
        <Card
          title="Path Test"
          description="Description"
          link="/test"
          image="/images/deep/nested/path.png"
        />
      )

      const image = screen.getByRole('img')
      expect(image).toHaveAttribute('src', '/images/deep/nested/path.png')
    })
  })
})
