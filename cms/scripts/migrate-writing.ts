/**
 * Migration script to import writing content (poems, essays, stories) into Strapi
 *
 * Usage: npx ts-node scripts/migrate-writing.ts
 */

import { Core } from '@strapi/strapi';

// Import the writing data from the frontend data files
// These are the TypeScript data files with the actual content
const poems = [
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
];

const essays = [
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
    theme: 'Writing, identity, vulnerability, creative process',
    wordCount: 730,
    tags: ['writing', 'identity', 'vulnerability', 'essays', 'narrative', 'creativity'],
    slug: 'pardon-me-while-i-leak-some-life-onto-this-page',
    featured: true,
  },
];

// No fiction content yet
const stories: Array<{
  title: string;
  excerpt: string;
  fullText: string;
  dateWritten: string;
  genre: string;
  theme: string;
  wordCount: number;
  tags: string[];
  slug: string;
  featured: boolean;
}> = [];

export async function migrateWritingContent(strapi: Core.Strapi): Promise<void> {
  strapi.log.info('[Writing Migration] Starting writing content migration...');

  // Find Karsten Wade author
  const authors = await strapi.documents('api::author.author').findMany({
    filters: { name: 'Karsten Wade' },
  });

  const authorId = authors.length > 0 ? authors[0].documentId : null;

  if (!authorId) {
    strapi.log.warn('[Writing Migration] Karsten Wade author not found. Content will be created without author.');
  }

  // Migrate poems
  strapi.log.info(`[Writing Migration] Migrating ${poems.length} poems...`);
  for (const poem of poems) {
    try {
      // Check if poem already exists
      const existing = await strapi.documents('api::poem.poem').findMany({
        filters: { slug: poem.slug },
      });

      if (existing.length > 0) {
        strapi.log.info(`[Writing Migration] Poem "${poem.title}" already exists, updating...`);
        await strapi.documents('api::poem.poem').update({
          documentId: existing[0].documentId,
          data: {
            title: poem.title,
            slug: poem.slug,
            excerpt: poem.excerpt,
            first_line: poem.firstLine,
            full_text: poem.fullText,
            date_written: poem.dateWritten,
            form: poem.form,
            theme: poem.theme,
            tags: poem.tags,
            featured: poem.featured,
            author: authorId,
          },
          status: 'published',
        });
      } else {
        strapi.log.info(`[Writing Migration] Creating poem "${poem.title}"...`);
        await strapi.documents('api::poem.poem').create({
          data: {
            title: poem.title,
            slug: poem.slug,
            excerpt: poem.excerpt,
            first_line: poem.firstLine,
            full_text: poem.fullText,
            date_written: poem.dateWritten,
            form: poem.form,
            theme: poem.theme,
            tags: poem.tags,
            featured: poem.featured,
            author: authorId,
          },
          status: 'published',
        });
      }
    } catch (error) {
      strapi.log.error(`[Writing Migration] Failed to migrate poem "${poem.title}":`, error);
    }
  }

  // Migrate essays
  strapi.log.info(`[Writing Migration] Migrating ${essays.length} essays...`);
  for (const essay of essays) {
    try {
      // Check if essay already exists
      const existing = await strapi.documents('api::essay.essay').findMany({
        filters: { slug: essay.slug },
      });

      if (existing.length > 0) {
        strapi.log.info(`[Writing Migration] Essay "${essay.title}" already exists, updating...`);
        await strapi.documents('api::essay.essay').update({
          documentId: existing[0].documentId,
          data: {
            title: essay.title,
            slug: essay.slug,
            excerpt: essay.excerpt,
            full_text: essay.fullText,
            date_written: essay.dateWritten,
            theme: essay.theme,
            word_count: essay.wordCount,
            tags: essay.tags,
            featured: essay.featured,
            author: authorId,
          },
          status: 'published',
        });
      } else {
        strapi.log.info(`[Writing Migration] Creating essay "${essay.title}"...`);
        await strapi.documents('api::essay.essay').create({
          data: {
            title: essay.title,
            slug: essay.slug,
            excerpt: essay.excerpt,
            full_text: essay.fullText,
            date_written: essay.dateWritten,
            theme: essay.theme,
            word_count: essay.wordCount,
            tags: essay.tags,
            featured: essay.featured,
            author: authorId,
          },
          status: 'published',
        });
      }
    } catch (error) {
      strapi.log.error(`[Writing Migration] Failed to migrate essay "${essay.title}":`, error);
    }
  }

  // Migrate stories (fiction)
  if (stories.length > 0) {
    strapi.log.info(`[Writing Migration] Migrating ${stories.length} stories...`);
    for (const story of stories) {
      try {
        // Check if story already exists
        const existing = await strapi.documents('api::story.story').findMany({
          filters: { slug: story.slug },
        });

        if (existing.length > 0) {
          strapi.log.info(`[Writing Migration] Story "${story.title}" already exists, updating...`);
          await strapi.documents('api::story.story').update({
            documentId: existing[0].documentId,
            data: {
              title: story.title,
              slug: story.slug,
              excerpt: story.excerpt,
              full_text: story.fullText,
              date_written: story.dateWritten,
              genre: story.genre,
              theme: story.theme,
              word_count: story.wordCount,
              tags: story.tags,
              featured: story.featured,
              author: authorId,
            },
            status: 'published',
          });
        } else {
          strapi.log.info(`[Writing Migration] Creating story "${story.title}"...`);
          await strapi.documents('api::story.story').create({
            data: {
              title: story.title,
              slug: story.slug,
              excerpt: story.excerpt,
              full_text: story.fullText,
              date_written: story.dateWritten,
              genre: story.genre,
              theme: story.theme,
              word_count: story.wordCount,
              tags: story.tags,
              featured: story.featured,
              author: authorId,
            },
            status: 'published',
          });
        }
      } catch (error) {
        strapi.log.error(`[Writing Migration] Failed to migrate story "${story.title}":`, error);
      }
    }
  } else {
    strapi.log.info('[Writing Migration] No stories to migrate (fiction content is empty)');
  }

  strapi.log.info('[Writing Migration] Writing content migration complete!');
  strapi.log.info(`[Writing Migration] Summary: ${poems.length} poems, ${essays.length} essays, ${stories.length} stories`);
}

export default migrateWritingContent;
