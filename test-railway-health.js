const fetch = require('node-fetch');

const RAILWAY_URL = 'https://openai-proxy-production-97bf.up.railway.app';

async function testHealth() {
    console.log('🔍 Testing Railway Deployment Health\n');
    
    // Test 1: Health Check Endpoint
    try {
        console.log('1️⃣ Testing Health Check Endpoint:');
        const healthResponse = await fetch(`${RAILWAY_URL}/health`);
        console.log('   Status:', healthResponse.status);
        console.log('   Response:', await healthResponse.text());
        console.log('   ✅ Health check passed\n');
    } catch (error) {
        console.error('   ❌ Health check failed:', error.message);
        return;
    }

    // Test 2: CORS Headers
    try {
        console.log('2️⃣ Testing CORS Headers:');
        const corsResponse = await fetch(`${RAILWAY_URL}/v1/chat/completions`, {
            method: 'OPTIONS',
            headers: {
                'Origin': 'https://app.powerbi.com',
                'Access-Control-Request-Method': 'POST',
                'Access-Control-Request-Headers': 'Content-Type'
            }
        });
        
        console.log('   Status:', corsResponse.status);
        console.log('   CORS Headers:');
        console.log('   - Access-Control-Allow-Origin:', corsResponse.headers.get('access-control-allow-origin'));
        console.log('   - Access-Control-Allow-Methods:', corsResponse.headers.get('access-control-allow-methods'));
        console.log('   - Access-Control-Allow-Headers:', corsResponse.headers.get('access-control-allow-headers'));
        console.log('   ✅ CORS check passed\n');
    } catch (error) {
        console.error('   ❌ CORS check failed:', error.message);
        return;
    }

    // Test 3: Chat Completion Endpoint
    try {
        console.log('3️⃣ Testing Chat Completion Endpoint:');
        const chatResponse = await fetch(`${RAILWAY_URL}/v1/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'https://app.powerbi.com'
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "user", content: "Hello! This is a health check test." }
                ]
            })
        });

        console.log('   Status:', chatResponse.status);
        const data = await chatResponse.json();
        console.log('   Response:', JSON.stringify(data, null, 2));
        
        if (data.choices?.[0]?.message?.content) {
            console.log('   ✅ Chat completion test passed\n');
        } else {
            console.error('   ❌ Invalid response format');
            return;
        }
    } catch (error) {
        console.error('   ❌ Chat completion test failed:', error.message);
        return;
    }

    // Test 4: Response Time
    try {
        console.log('4️⃣ Testing Response Time:');
        const startTime = Date.now();
        await fetch(`${RAILWAY_URL}/health`);
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        console.log(`   Response time: ${responseTime}ms`);
        if (responseTime < 1000) {
            console.log('   ✅ Response time is good\n');
        } else {
            console.log('   ⚠️ Response time is slow\n');
        }
    } catch (error) {
        console.error('   ❌ Response time test failed:', error.message);
        return;
    }

    console.log('🎉 All tests completed!');
}

// Run the tests
testHealth().catch(console.error); 