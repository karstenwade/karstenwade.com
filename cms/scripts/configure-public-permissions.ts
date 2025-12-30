/**
 * Configure Public Read Permissions for Strapi CMS
 *
 * This script enables public read access (find and findOne) for all content types.
 * Requires Strapi admin credentials or API token.
 */

import * as readline from 'readline';

const STRAPI_URL = 'http://localhost:1337';

interface StrapiRole {
  id: number;
  name: string;
  description: string;
  type: string;
  permissions: any[];
}

interface StrapiAuthResponse {
  data: {
    token: string;
    user: {
      id: number;
      email: string;
    };
  };
}

interface StrapiPermission {
  id?: number;
  action: string;
  subject?: string;
  properties?: any;
  conditions?: any[];
}

/**
 * Authenticate with Strapi admin API
 */
async function authenticateAdmin(email: string, password: string): Promise<string> {
  console.log('🔐 Authenticating with Strapi admin API...');

  const response = await fetch(`${STRAPI_URL}/admin/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Authentication failed: ${response.status} ${error}`);
  }

  const data: StrapiAuthResponse = await response.json();
  console.log('✅ Successfully authenticated as:', data.data.user.email);

  return data.data.token;
}

/**
 * Get all roles from Strapi
 */
async function getRoles(token: string): Promise<StrapiRole[]> {
  console.log('📋 Fetching roles...');

  const response = await fetch(`${STRAPI_URL}/admin/roles`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to fetch roles: ${response.status} ${error}`);
  }

  const data = await response.json();
  console.log('✅ Found roles:', data.data.map((r: StrapiRole) => r.name));

  return data.data;
}

/**
 * Get permissions for a specific role
 */
async function getRolePermissions(token: string, roleId: number): Promise<any> {
  console.log(`📋 Fetching permissions for role ID ${roleId}...`);

  const response = await fetch(`${STRAPI_URL}/admin/roles/${roleId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to fetch role permissions: ${response.status} ${error}`);
  }

  return await response.json();
}

/**
 * Get all permissions from Strapi
 */
async function getAllPermissions(token: string): Promise<any[]> {
  console.log('📋 Fetching all available permissions...');

  const response = await fetch(`${STRAPI_URL}/admin/permissions`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to fetch permissions: ${response.status} ${error}`);
  }

  const data = await response.json();
  return data.data;
}

/**
 * Update role permissions
 */
async function updateRolePermissions(
  token: string,
  roleId: number,
  permissions: any
): Promise<void> {
  console.log(`🔧 Updating permissions for role ID ${roleId}...`);

  const response = await fetch(`${STRAPI_URL}/admin/roles/${roleId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(permissions),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to update role permissions: ${response.status} ${error}`);
  }

  console.log('✅ Successfully updated permissions');
}

/**
 * Configure public read permissions for content types
 */
async function configurePublicPermissions(token: string): Promise<void> {
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
  ];

  const readActions = ['find', 'findOne'];

  console.log('\n📝 Content types to configure:', contentTypes);
  console.log('📝 Actions to enable:', readActions);

  // Get the public role
  const roles = await getRoles(token);
  const publicRole = roles.find(r => r.type === 'public');

  if (!publicRole) {
    throw new Error('Public role not found');
  }

  console.log(`\n🎯 Found public role: ID ${publicRole.id}`);

  // Get current role data
  const roleData = await getRolePermissions(token, publicRole.id);
  console.log(`📊 Current permissions count: ${roleData.data.permissions?.length || 0}`);

  // Get all available permissions to find the correct IDs
  const allPermissions = await getAllPermissions(token);

  // Build permissions array
  const permissionsToEnable: number[] = [];

  for (const contentType of contentTypes) {
    for (const action of readActions) {
      const fullAction = `${contentType}.${action}`;

      // Find the permission ID for this action
      const permission = allPermissions.find((p: any) =>
        p.action === fullAction ||
        (p.action === `plugin::content-manager.explorer.${action}` && p.subject === contentType)
      );

      if (permission) {
        permissionsToEnable.push(permission.id);
        console.log(`  ✓ Found permission: ${fullAction} (ID: ${permission.id})`);
      } else {
        console.log(`  ⚠ Warning: Permission not found for ${fullAction}`);
      }
    }
  }

  // Update the role with new permissions
  const updatePayload = {
    ...roleData.data,
    permissions: permissionsToEnable,
  };

  await updateRolePermissions(token, publicRole.id, updatePayload);

  console.log(`\n✅ Successfully configured public read permissions for ${contentTypes.length} content types`);
}

/**
 * Prompt for user input
 */
function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

/**
 * Main execution
 */
async function main() {
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║  Strapi Public Permissions Configuration Script          ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');

  try {
    // Check if Strapi is running
    console.log('🔍 Checking Strapi server...');
    const healthCheck = await fetch(`${STRAPI_URL}/_health`);
    if (!healthCheck.ok) {
      throw new Error('Strapi server is not running at http://localhost:1337');
    }
    console.log('✅ Strapi server is running\n');

    // Get admin credentials
    const email = await prompt('Enter admin email (default: admin@example.com): ') || 'admin@example.com';
    const password = await prompt('Enter admin password: ');

    if (!password) {
      throw new Error('Password is required');
    }

    // Authenticate
    const token = await authenticateAdmin(email, password);

    // Configure permissions
    await configurePublicPermissions(token);

    console.log('\n🎉 Configuration complete!');
    console.log('\n📝 You can now test the API:');
    console.log('   curl http://localhost:1337/api/blog-posts');
    console.log('   curl http://localhost:1337/api/authors');
    console.log('   curl http://localhost:1337/api/categories');

  } catch (error) {
    console.error('\n❌ Error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

export { configurePublicPermissions, authenticateAdmin, getRoles };
