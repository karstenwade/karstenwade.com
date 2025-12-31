import type { Core } from '@strapi/strapi';
import { migrateWritingContent } from '../scripts/migrate-writing';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * Sets up public read permissions, creates default author, and migrates content.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Configure public permissions for read access
    await configurePublicPermissions(strapi);

    // Create default author if none exists
    await createDefaultAuthor(strapi);

    // Migrate writing content (poems, essays, stories)
    await migrateWritingContent(strapi);
  },
};

/**
 * Configure public role to allow read access for content types
 */
async function configurePublicPermissions(strapi: Core.Strapi) {
  const contentTypes = [
    'api::blog-post.blog-post',
    'api::paper.paper',
    'api::writing.writing',
    'api::tosw-chapter.tosw-chapter',
    'api::tutorial.tutorial',
    'api::event.event',
    'api::author.author',
    'api::category.category',
    'api::tag.tag',
    'api::poem.poem',
    'api::essay.essay',
    'api::story.story',
  ];

  try {
    // Get the public role
    const publicRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' } });

    if (!publicRole) {
      strapi.log.warn('[Bootstrap] Public role not found');
      return;
    }

    // Get current permissions
    const existingPermissions = await strapi
      .query('plugin::users-permissions.permission')
      .findMany({ where: { role: publicRole.id } });

    const existingActions = new Set(
      existingPermissions.map((p: any) => p.action)
    );

    // Check if permissions already configured
    const sampleAction = `api::blog-post.blog-post.find`;
    if (existingActions.has(sampleAction)) {
      strapi.log.info('[Bootstrap] Public permissions already configured');
      return;
    }

    strapi.log.info('[Bootstrap] Configuring public read permissions...');

    // Create permissions for each content type
    for (const contentType of contentTypes) {
      for (const action of ['find', 'findOne']) {
        const fullAction = `${contentType}.${action}`;

        if (!existingActions.has(fullAction)) {
          await strapi.query('plugin::users-permissions.permission').create({
            data: {
              action: fullAction,
              role: publicRole.id,
            },
          });
          strapi.log.debug(`[Bootstrap] Created permission: ${fullAction}`);
        }
      }
    }

    strapi.log.info(
      `[Bootstrap] Public read permissions configured for ${contentTypes.length} content types`
    );
  } catch (error) {
    strapi.log.error('[Bootstrap] Error configuring permissions:', error);
  }
}

/**
 * Ensure Karsten Wade author exists
 */
async function createDefaultAuthor(strapi: Core.Strapi) {
  try {
    // Check if Karsten Wade specifically exists
    const karstenAuthors = await strapi.documents('api::author.author').findMany({
      filters: { name: 'Karsten Wade' },
    });

    if (karstenAuthors.length > 0) {
      strapi.log.info('[Bootstrap] Karsten Wade author already exists');
      return;
    }

    strapi.log.info('[Bootstrap] Creating author: Karsten Wade');

    await strapi.documents('api::author.author').create({
      data: {
        name: 'Karsten Wade',
        email: 'karsten@karstenwade.com',
        bio: 'Open source community architect, strategist, and advocate with 25+ years of experience. Former Red Hat community manager and Fedora Project contributor. Author of The Open Source Way guidebook.',
        website: 'https://karstenwade.com',
        social_links: {
          twitter: 'https://twitter.com/quaid',
          github: 'https://github.com/karstenwade',
          linkedin: 'https://www.linkedin.com/in/karstenwade',
        },
      },
      status: 'published',
    });

    strapi.log.info('[Bootstrap] Karsten Wade author created successfully');
  } catch (error) {
    strapi.log.error('[Bootstrap] Error creating Karsten Wade author:', error);
  }
}
