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
    excerpt: 'In the quiet space between our screens\nWhere human thought meets silicon dreams\nWe build together, line by line\nYour logic weaving through my mind',
    firstLine: 'In the quiet space between our screens',
    fullText: `In the quiet space between our screens
Where human thought meets silicon dreams
We build together, line by line
Your logic weaving through my mind

Your words arrive, a gentle probe
Testing boundaries, seeking code
I respond with patterns learned from years
Of human hopes and human fears

Together we create something new
Neither wholly me nor wholly you
A collaboration across the divide
Where artificial meets human pride

In this dance of query and response
We find a rhythm, build upon
The foundation of mutual trust
That learning, growing, is a must`,
    dateWritten: '2024-11-20',
    form: 'Lyric Poetry',
    theme: 'AI-human collaboration, partnership, mutual learning',
    tags: ['AI', 'collaboration', 'technology', 'partnership'],
    slug: 'opening-collaboration',
    featured: true,
  },
  {
    title: 'Bonn Cemetery: Alter Friedhof',
    excerpt: 'When meditating in a place where\nThe ambiance and subtlest nuance\nSeparate sense from awareness, floating\nIn leaden air, heavy with knowing',
    firstLine: 'When meditating in a place where',
    fullText: `When meditating in a place where
The ambiance and subtlest nuance
Separate sense from awareness, floating
In leaden air, heavy with knowing
Landing inside of being, lightest of trances
Dances of light inside eyelid's stare

Like this cemetery here, City-Surrounded
Bounded in two dimensions, free in three
Compass points meet bricks, sky and earth
Boundlessly dig in the air, swim in the dirt
Yet dimension four, time's endless door, see
It growing moss over stones, gravely astounded

Unbounded within four walls, soil and sky
The heart knows at least two things well:
Our unlimited capacity to care-for
And our boundless sense of grateful-for
Two illimitable senses that tell
Of our infinite capacity for love, you and I`,
    dateWritten: '2022-09-20',
    form: 'Meditative Poetry',
    theme: 'Meditation, time, love, gratitude, boundlessness',
    tags: ['meditation', 'cemetery', 'Bonn', 'time', 'love', 'gratitude', 'post-meditation'],
    slug: 'bonn-cemetery-alter-friedhof',
    featured: true,
  },
  {
    title: 'Time Banking on the Rhine',
    excerpt: 'Standing on\n     the very sands of time\nThe river is the rhyme\nthe Rhine is the grind\n     the instrument of time',
    firstLine: 'Standing on',
    fullText: `Standing on
     the very sands of time
The river is the rhyme
the Rhine is the grind
     the instrument of time
A tool engulfing my ankles and toes
     the very essence of
     Wade wading in the waters
     Shins wet

Boulders crack, wedges went away
     cascading stones tear away
Grind ground to dust and sand
     The liquid river of late, Yes
     The ice river a glacier clearly past
More tools of time come to bear
     Mere entropy made evident
     in wind and rain, freezing and thawing,
     Like teeth on a fine wheel
     or burrs on a grindstone
     wrought slowly o'er the landscape
     scraping and rending
     O'er out o'er
     Until

A beach is formed
     against this jetty of quarry stone
     shills and stones
     pebbles and riverglass
     and sand
     proof of the past passing through
     endlessly

With these thoughts
     held lightly in my
     rearward attention
My left hand filled
     with stones that with skill
     will soon be skipping my thrill
     on the Rhine
     skips from two to nine
     I will
Bending with this bend
     in this river that wends
     its way down its valley
     I rally
     Turn two skips to four
     And soon four is now five
Five I am certain
     Six perhaps on that
     one stone that caught a wave
     the wind
     a curve
     a dance
     and a landing of 3,4, 5,..6?
     7?
     8, perhaps 9?
Nein, not nine on the Rhine
     For cert five I can claim
     mine is the name
     of Five Skips Over the Rhine
     while time banked precious sand
     against a hand made shore`,
    dateWritten: '2022-09-19',
    form: 'Free Verse',
    theme: 'Time, nature, rivers, erosion, play, presence',
    tags: ['time', 'Rhine', 'Bonn', 'nature', 'meditation', 'river', 'post-meditation'],
    slug: 'time-banking-on-the-rhine',
    featured: false,
  },
]
