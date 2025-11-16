// Essays data
// Corresponds to content in content/essays/

export interface Essay {
  title: string
  excerpt: string
  fullText: string
  dateWritten: string
  theme: string
  wordCount: number
  tags: string[]
  slug: string
  featured: boolean
}

export const essays: Essay[] = []
