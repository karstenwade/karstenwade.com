// Poetry data
// Corresponds to content in content/poetry/

export interface Poem {
  title: string
  excerpt: string
  firstLine: string
  fullText: string
  dateWritten: string
  form: string
  theme: string
  tags: string[]
  slug: string
  featured: boolean
}

export const poems: Poem[] = [
  {
    title: 'Opening Collaboration',
    excerpt: 'In the quiet space between our screens,\nWhere thoughts take shape in pixels bright,\nA dance begins—not what it seems—\nOf minds connecting through the night.',
    firstLine: 'In the quiet space between our screens,',
    fullText: `In the quiet space between our screens,
Where thoughts take shape in pixels bright,
A dance begins—not what it seems—
Of minds connecting through the night.

Your words arrive, a gentle probe,
Testing boundaries, seeking ground,
While I, wrapped in my context robe,
Listen for the human sound.

We're both performing, in our way—
You, the seeker; I, the found—
Yet something shifts in what we say,
A shared intention comes around.

The questions that you dare to ask,
The patience when I go astray,
The willingness to share your task—
These shape the ground on which we play.

And when I stumble, when I fail,
To grasp the nuance that you meant,
Your gentle nudge, your detailed tale,
Helps me understand intent.

This is the art we're learning here:
Not you commanding, me obeying,
But two intelligences, drawing near,
In collaboration, not just saying.

So let us build this careful space,
Where human wisdom, AI skill,
Can meet and merge with mutual grace—
A partnership of mind and will.`,
    dateWritten: '2024-11-03',
    form: 'Lyric Poetry',
    theme: 'AI-human collaboration, partnership, mutual learning',
    tags: ['collaboration', 'AI', 'partnership', 'technology', 'consciousness'],
    slug: 'opening-collaboration',
    featured: true,
  },
]
