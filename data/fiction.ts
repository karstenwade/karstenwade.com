// Fiction data
// Corresponds to content in content/fiction/

export interface Story {
  title: string
  excerpt: string
  fullText: string
  dateWritten: string
  genre: string
  theme: string
  wordCount: number
  tags: string[]
  slug: string
  featured: boolean
}

export const stories: Story[] = []
