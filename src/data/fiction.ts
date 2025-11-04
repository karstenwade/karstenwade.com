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

export const stories: Story[] = [
  {
    title: 'The Pull Request',
    excerpt: 'The notification arrived at 2:47 AM. Sarah stared at her phone, the blue glow illuminating her face in the darkness. Another pull request from Marcus. Of course it was from Marcus.',
    fullText: `The notification arrived at 2:47 AM. Sarah stared at her phone, the blue glow illuminating her face in the darkness. Another pull request from Marcus. Of course it was from Marcus.

She knew she should wait until morning. She knew she should set boundaries, maintain work-life balance, all the things the company's wellness program preached. But the preview showed changes to the authentication layer—the one they'd argued about for three weeks.

Sliding out of bed, careful not to wake Jamie, she grabbed her laptop from the desk and padded to the kitchen. The cold tile against her bare feet brought a small shock of awareness. This was ridiculous. She was checking code at 3 AM because Marcus couldn't wait until standup.

But as she opened the PR, something felt different. The comments weren't defensive. They weren't the usual walls of text justifying every decision. Instead, each change had a simple note: "You were right about this." "Following the pattern you suggested." "Implemented your feedback from Tuesday."

Sarah scrolled through the code, her irritation slowly morphing into something else. The refactoring was elegant. More than that—it was exactly what she'd been trying to articulate in their design meetings. Marcus had listened. Really listened.

At the bottom of the PR description, a single line: "Sorry for the late night ping. I finally understood what you were trying to tell me. Thank you for your patience."

She sat back, laptop warming her legs, and smiled at the screen. Maybe this collaboration thing could work after all.

Her fingers hovered over the keyboard. She could approve it now, leave a comment, close the loop. But instead, she saved a draft: "This is great work. Let's discuss the database migration strategy tomorrow at 10."

Tomorrow. Some conversations deserved the daylight.`,
    dateWritten: '2025-11-03',
    genre: 'Tech Fiction',
    theme: 'Collaboration, professional growth, work-life balance',
    wordCount: 324,
    tags: ['technology', 'collaboration', 'development', 'relationships', 'growth'],
    slug: 'the-pull-request',
    featured: true,
  },
]
