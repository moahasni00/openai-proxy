const fetch = require('node-fetch');

async function testEndpoint(useHttps = true) {
    const protocol = useHttps ? 'https' : 'http';
    const url = `${protocol}://openai-proxy-production-97bf.up.railway.app/v1/chat/completions`;
    const payload = {
        model: "gpt-3.5-turbo",
        messages: [
            { role: "user", content: "Hello!" }
        ]
    };

    try {
        console.log(`\nTesting ${protocol.toUpperCase()} endpoint:`);
        console.log('URL:', url);
        console.log('Payload:', JSON.stringify(payload, null, 2));

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'https://app.powerbi.com'
            },
            body: JSON.stringify(payload)
        });

        // Check CORS headers
        console.log('\nCORS Headers:');
        console.log('Access-Control-Allow-Origin:', response.headers.get('access-control-allow-origin'));
        console.log('Access-Control-Allow-Methods:', response.headers.get('access-control-allow-methods'));
        console.log('Access-Control-Allow-Headers:', response.headers.get('access-control-allow-headers'));
        console.log('Access-Control-Allow-Credentials:', response.headers.get('access-control-allow-credentials'));

        const data = await response.json();
        console.log('\nResponse status:', response.status);
        console.log('Response:', JSON.stringify(data, null, 2));

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Validate response structure
        if (!data.choices?.[0]?.message?.content) {
            throw new Error('Invalid response format: missing choices[0].message.content');
        }

        console.log(`\n✅ ${protocol.toUpperCase()} test passed! Endpoint is working correctly with CORS.`);
        console.log('Response content:', data.choices[0].message.content);
    } catch (error) {
        console.error(`\n❌ ${protocol.toUpperCase()} test failed:`, error.message);
        if (!useHttps) {
            process.exit(1);
        }
    }
}

// Test both HTTP and HTTPS
async function runTests() {
    console.log('Starting endpoint tests...');
    await testEndpoint(true);  // Test HTTPS
    await testEndpoint(false); // Test HTTP
}

runTests(); 