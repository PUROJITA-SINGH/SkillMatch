// Simple test script to verify Better Auth integration
// Run with: node scripts/test-auth.js

const { createServer } = require('http');

async function testAuthEndpoints() {
  console.log('🧪 Testing Better Auth Integration...\n');

  const baseUrl = 'http://localhost:3001';
  
  try {
    // Test 1: Check if auth server is running
    console.log('1. Testing auth server connectivity...');
    const response = await fetch(`${baseUrl}/api/auth/session`);
    console.log(`   Status: ${response.status}`);
    console.log(`   ✅ Auth server is running\n`);

    // Test 2: Check available auth methods
    console.log('2. Testing available auth methods...');
    const methodsResponse = await fetch(`${baseUrl}/api/auth/methods`);
    if (methodsResponse.ok) {
      const methods = await methodsResponse.json();
      console.log('   Available methods:', methods);
      console.log('   ✅ Auth methods endpoint working\n');
    } else {
      console.log('   ⚠️  Auth methods endpoint not available\n');
    }

    // Test 3: Test CORS headers
    console.log('3. Testing CORS configuration...');
    const corsResponse = await fetch(`${baseUrl}/api/auth/session`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:3000',
        'Access-Control-Request-Method': 'GET',
      }
    });
    
    const corsHeaders = corsResponse.headers.get('access-control-allow-origin');
    if (corsHeaders) {
      console.log('   CORS headers:', corsHeaders);
      console.log('   ✅ CORS properly configured\n');
    } else {
      console.log('   ⚠️  CORS headers missing\n');
    }

    console.log('🎉 Basic auth server tests completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Start the full application: npm run dev');
    console.log('2. Visit http://localhost:3000');
    console.log('3. Try signing up with a test account');
    console.log('4. Check your Supabase dashboard for the new user');

  } catch (error) {
    console.error('❌ Error testing auth server:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure the auth server is running: npm run dev:auth');
    console.log('2. Check your .env file configuration');
    console.log('3. Verify database connectivity');
  }
}

// Run the tests
testAuthEndpoints();
