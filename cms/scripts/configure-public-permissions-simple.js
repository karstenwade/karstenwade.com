#!/usr/bin/env node
/**
 * Simple Strapi Public Permissions Configuration
 *
 * This script uses Strapi's admin API to enable public read access.
 * It's designed to work with Strapi v5.
 *
 * Usage: node configure-public-permissions-simple.js <email> <password>
 */

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

// Get credentials from command line or prompt
const args = process.argv.slice(2);
let email, password;

if (args.length >= 2) {
  [email, password] = args;
} else {
  console.error('Usage: node configure-public-permissions-simple.js <admin-email> <admin-password>');
  console.error('Example: node configure-public-permissions-simple.js admin@example.com myPassword123');
  process.exit(1);
}

/**
 * Main function
 */
async function main() {
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║  Strapi Public Permissions Setup                         ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');

  try {
    // 1. Check Strapi health
    console.log('🔍 Checking Strapi server...');
    const health = await fetch(`${STRAPI_URL}/_health`);
    if (!health.ok) {
      throw new Error(`Strapi not running at ${STRAPI_URL}`);
    }
    console.log('✅ Strapi is running\n');

    // 2. Authenticate
    console.log('🔐 Authenticating...');
    const authResponse = await fetch(`${STRAPI_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!authResponse.ok) {
      const error = await authResponse.text();
      throw new Error(`Authentication failed: ${error}`);
    }

    const authData = await authResponse.json();
    const token = authData.data.token;
    console.log('✅ Authenticated as:', authData.data.user.email);
    console.log('');

    // 3. Get content-type UIDs
    console.log('📋 Fetching content types...');
    const ctResponse = await fetch(`${STRAPI_URL}/admin/content-types`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!ctResponse.ok) {
      throw new Error('Failed to fetch content types');
    }

    const ctData = await ctResponse.json();
    const apiContentTypes = ctData.data.filter(ct =>
      ct.uid.startsWith('api::') &&
      !ct.uid.includes('admin') &&
      !ct.uid.includes('plugin')
    );

    console.log('✅ Found API content types:');
    apiContentTypes.forEach(ct => {
      console.log(`   - ${ct.uid} (${ct.info.displayName})`);
    });
    console.log('');

    // 4. Get permissions
    console.log('📋 Fetching permissions...');
    const permResponse = await fetch(`${STRAPI_URL}/admin/permissions`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!permResponse.ok) {
      throw new Error('Failed to fetch permissions');
    }

    const permData = await permResponse.json();
    console.log('✅ Retrieved permissions data\n');

    // 5. Get roles
    console.log('📋 Fetching roles...');
    const rolesResponse = await fetch(`${STRAPI_URL}/admin/roles`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!rolesResponse.ok) {
      throw new Error('Failed to fetch roles');
    }

    const rolesData = await rolesResponse.json();
    console.log('✅ Found roles:', rolesData.data.map(r => r.name).join(', '));

    // Find the public role
    const publicRole = rolesData.data.find(r => r.code === 'public' || r.name.toLowerCase() === 'public');

    if (!publicRole) {
      console.error('❌ Could not find "public" role');
      console.log('\nAvailable roles:', rolesData.data.map(r => ({ id: r.id, name: r.name, code: r.code })));
      throw new Error('Public role not found. This might be a Users & Permissions plugin role, not an admin role.');
    }

    console.log(`✅ Found public role: ${publicRole.name} (ID: ${publicRole.id})\n`);

    // 6. Get current role permissions
    console.log('📋 Fetching current role permissions...');
    const roleResponse = await fetch(`${STRAPI_URL}/admin/roles/${publicRole.id}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!roleResponse.ok) {
      throw new Error('Failed to fetch role details');
    }

    const roleData = await roleResponse.json();
    console.log(`✅ Current permissions count: ${roleData.data.permissions?.length || 0}\n`);

    // 7. Build permission IDs for public read access
    console.log('🔧 Configuring public read permissions...');

    const contentTypeUIDs = [
      'api::blog-post.blog-post',
      'api::paper.paper',
      'api::writing.writing',
      'api::tosw-chapter.tosw-chapter',
      'api::tutorial.tutorial',
      'api::event.event',
      'api::author.author',
      'api::category.category',
      'api::tag.tag',
    ];

    const readActions = ['find', 'findOne'];
    const permissionIds = new Set(roleData.data.permissions || []);

    // Find and add permission IDs
    let configured = 0;
    for (const uid of contentTypeUIDs) {
      for (const action of readActions) {
        // Look for permissions in the format: plugin::content-manager.explorer.find
        const permission = permData.data.find(p =>
          p.action === `plugin::content-manager.explorer.${action}` &&
          p.subject === uid
        );

        if (permission) {
          permissionIds.add(permission.id);
          configured++;
          console.log(`   ✓ ${uid}.${action} (ID: ${permission.id})`);
        } else {
          console.log(`   ⚠ ${uid}.${action} - permission not found`);
        }
      }
    }

    const finalPermissions = Array.from(permissionIds);
    console.log(`\n✅ Configured ${configured} permissions (Total: ${finalPermissions.length})\n`);

    // 8. Update the role
    console.log('💾 Updating role permissions...');
    const updateResponse = await fetch(`${STRAPI_URL}/admin/roles/${publicRole.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: roleData.data.name,
        description: roleData.data.description,
        permissions: finalPermissions,
      }),
    });

    if (!updateResponse.ok) {
      const error = await updateResponse.text();
      throw new Error(`Failed to update role: ${error}`);
    }

    console.log('✅ Successfully updated public role permissions\n');

    // 9. Test API access
    console.log('🧪 Testing public API access...');
    const testResponse = await fetch(`${STRAPI_URL}/api/blog-posts`);
    console.log(`   Blog Posts API: ${testResponse.status} ${testResponse.statusText}`);

    if (testResponse.status === 200) {
      console.log('   ✅ Public API access is working!');
    } else if (testResponse.status === 403) {
      console.log('   ⚠ Still getting 403 - permissions might need manual adjustment');
    }

    console.log('\n🎉 Configuration complete!\n');
    console.log('Test commands:');
    console.log(`  curl ${STRAPI_URL}/api/blog-posts`);
    console.log(`  curl ${STRAPI_URL}/api/authors`);
    console.log(`  curl ${STRAPI_URL}/api/categories`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.stack) {
      console.error('\nStack:', error.stack);
    }
    process.exit(1);
  }
}

main();
