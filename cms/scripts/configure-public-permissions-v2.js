/**
 * Configure Public Read Permissions for Strapi CMS v5
 *
 * This script enables public read access using the Users & Permissions plugin.
 * It's a simpler approach that works with Strapi v5's permission system.
 */

const readline = require('readline');

const STRAPI_URL = 'http://localhost:1337';

/**
 * Prompt for user input
 */
function prompt(question) {
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
 * Authenticate with Strapi admin API
 */
async function authenticateAdmin(email, password) {
  console.log('🔐 Authenticating with Strapi admin API...');

  const response = await fetch(`${STRAPI_URL}/admin/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Authentication failed: ${response.status} - ${error}`);
  }

  const data = await response.json();
  console.log('✅ Successfully authenticated as:', data.data.user.email);

  return data.data.token;
}

/**
 * Get all users-permissions roles
 */
async function getUsersPermissionsRoles(token) {
  console.log('📋 Fetching Users & Permissions roles...');

  const response = await fetch(`${STRAPI_URL}/api/users-permissions/roles`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to fetch roles: ${response.status} - ${error}`);
  }

  const data = await response.json();
  console.log('✅ Found roles:', data.roles.map(r => `${r.name} (${r.type})`));

  return data.roles;
}

/**
 * Get specific role details
 */
async function getRoleDetails(token, roleId) {
  console.log(`📋 Fetching details for role ID ${roleId}...`);

  const response = await fetch(`${STRAPI_URL}/api/users-permissions/roles/${roleId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to fetch role details: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.role;
}

/**
 * Update role permissions
 */
async function updateRolePermissions(token, roleId, permissions) {
  console.log(`🔧 Updating permissions for role ID ${roleId}...`);

  const response = await fetch(`${STRAPI_URL}/api/users-permissions/roles/${roleId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      permissions,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to update permissions: ${response.status} - ${error}`);
  }

  console.log('✅ Successfully updated permissions');
  return await response.json();
}

/**
 * Configure public read permissions
 */
async function configurePublicPermissions(token) {
  const contentTypes = [
    'blog-post',
    'paper',
    'writing',
    'tosw-chapter',
    'tutorial',
    'event',
    'author',
    'category',
    'tag',
  ];

  console.log('\n📝 Content types to configure:', contentTypes);

  // Get roles
  const roles = await getUsersPermissionsRoles(token);
  const publicRole = roles.find(r => r.type === 'public');

  if (!publicRole) {
    throw new Error('Public role not found');
  }

  console.log(`\n🎯 Found public role: ${publicRole.name} (ID: ${publicRole.id})`);

  // Get current permissions
  const roleDetails = await getRoleDetails(token, publicRole.id);
  console.log(`📊 Current permissions:`, Object.keys(roleDetails.permissions || {}));

  // Build new permissions object
  const newPermissions = { ...roleDetails.permissions };

  // Enable find and findOne for each content type
  for (const contentType of contentTypes) {
    // API content types use the api:: prefix
    const apiKey = `api::${contentType}.${contentType}`;

    if (!newPermissions[apiKey]) {
      newPermissions[apiKey] = {};
    }

    // Enable controllers
    if (!newPermissions[apiKey].controllers) {
      newPermissions[apiKey].controllers = {};
    }

    if (!newPermissions[apiKey].controllers[contentType]) {
      newPermissions[apiKey].controllers[contentType] = {};
    }

    // Enable find and findOne actions
    newPermissions[apiKey].controllers[contentType].find = { enabled: true };
    newPermissions[apiKey].controllers[contentType].findOne = { enabled: true };

    console.log(`  ✓ Enabled public read for: ${contentType}`);
  }

  // Update the role
  await updateRolePermissions(token, publicRole.id, newPermissions);

  console.log(`\n✅ Successfully configured public read permissions for ${contentTypes.length} content types`);
}

/**
 * Main execution
 */
async function main() {
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║  Strapi Public Permissions Configuration Script v2       ║');
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
    const email = await prompt('Enter admin email: ');
    const password = await prompt('Enter admin password: ');

    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Authenticate
    const token = await authenticateAdmin(email, password);

    // Configure permissions
    await configurePublicPermissions(token);

    console.log('\n🎉 Configuration complete!');
    console.log('\n📝 Test the API with:');
    console.log('   curl http://localhost:1337/api/blog-posts');
    console.log('   curl http://localhost:1337/api/authors');
    console.log('   curl http://localhost:1337/api/categories');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.stack) {
      console.error('\nStack trace:', error.stack);
    }
    process.exit(1);
  }
}

// Run the script
main();
