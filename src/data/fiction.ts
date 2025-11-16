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
    title: 'Pardon me while I leak some life onto this page',
    excerpt: "I'm really rather nervous about this. For all the time I can remember, I have loved narrative. Telling stories, living stories, embodying stories. Being the story. Knowing the story. And sharing the story.",
    fullText: `I'm really rather nervous about this.

For all the time I can remember, I have loved narrative. Telling stories, living stories, embodying stories. Being the story. Knowing the story. And sharing the story. Sharing it rough and raw, sharing it polished and poised.

A long time ago maybe, I decided—in the way we must in adolescence—to *be a writer*. Since then I've written a lot. I went to school for writing. After I got out of the professional kitchens, all my jobs since have involved some amount of writing. I held roles as a project writer, tech writer, and leader of an open source documentation team. I helped bring a modest sized (but massively scoped) guidebook to life, and there is more than a bit of my writing in there.

But you know where I'm going here, right? None of that is the writer that I always wanted to be, meant to be. None of that are long, thoughtful essays you re-read from a dog-eared book on a cold Winter night. None of that are the longed-for tales that stir, stir the humanity in us. It may be a form of narrative, but it is not Narrative, writ large, cut deep. Like chisel marks on a gravestone. Like a river cuts a canyon.

Now in my life, here in the middleness, here in the middle of all things that have come before and have yet to come, here I have come to write. It may be that finally I have something to say? Or that I believe in the power of my voice to say it? I just know it's been lurking around the edges of my mind of late, like light leaking through the curtains at dawn.

This noticing that my fingertips just get on fire and write away, near to the speed of what I came to say.

So and hence, lo and behold, comes this space for me to write—for the first time in a very, very long time—as Karsten Wade, a writer. It's nice to see you all again. I can't promise it will always be comfortable here, in fact … I can assure the opposite. I'm a bit past the time of comfort oppressing all other feelings into fetal prose.

In here I write essays, I wrote poems, and I see just maybe if I'm ready to write fiction again. And someone will see it, or no one, and that's OK. I don't really know what I have to say, just that I have to say it. So I can't promise (yet) it will be interesting to you. I can only try to make it interesting to me, and then let it be.`,
    dateWritten: '2021-05-14',
    genre: 'Personal Essay',
    theme: 'Writing, identity, vulnerability, creative process',
    wordCount: 730,
    tags: ['writing', 'identity', 'vulnerability', 'essays', 'narrative', 'creativity'],
    slug: 'pardon-me-while-i-leak-some-life-onto-this-page',
    featured: true,
  },
]
