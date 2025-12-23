
const http = require('http');

console.log('='.repeat(60));
console.log('DIAGNOSTIC TEST FOR /categories ENDPOINT');
console.log('='.repeat(60));

console.log('\n[TEST 1] Checking if server is running...');
http.get('http://localhost:8080/categories', (res) => {
    console.log(`Server is responding on port 8080`);
    console.log(`   Status: ${res.statusCode}`);

    console.log('\n[TEST 2] Testing POST /categories with {"name":"Electronics"}...');

    const postData = JSON.stringify({ name: 'Electronics' });

    const options = {
        hostname: 'localhost',
        port: 8080,
        path: '/categories',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    const req = http.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            console.log(`   Status: ${res.statusCode}`);
            console.log(`   Response:`, data);

            if (res.statusCode === 200 || res.statusCode === 201) {
                console.log('  SUCCESS: Category endpoint is working!');
            } else {
                console.log(' ERROR: Unexpected status code');
            }

            console.log('\n[TEST 3] Testing POST /categories with empty body...');
            testEmptyBody();
        });
    });

    req.on('error', (error) => {
        console.error(' Request failed:', error.message);
    });

    req.write(postData);
    req.end();

}).on('error', (error) => {
    console.error(' Server is not running or not accessible');
    console.error('   Error:', error.message);
    console.error('\n Make sure to run: npm run dev');
});

function testEmptyBody() {
    const postData = JSON.stringify({});

    const options = {
        hostname: 'localhost',
        port: 8080,
        path: '/categories',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    const req = http.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            console.log(`   Status: ${res.statusCode}`);
            console.log(`   Response:`, data);

            if (res.statusCode === 400) {
                console.log('Correctly returns 400 for missing name');
            }

            console.log('\n[TEST 4] Testing POST /products (should fail without auth)...');
            testProductsEndpoint();
        });
    });

    req.on('error', (error) => {
        console.error(' Request failed:', error.message);
    });

    req.write(postData);
    req.end();
}

function testProductsEndpoint() {
    const postData = JSON.stringify({ name: 'Test Product' });

    const options = {
        hostname: 'localhost',
        port: 8080,
        path: '/products',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    const req = http.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            console.log(`   Status: ${res.statusCode}`);
            console.log(`   Response:`, data);

            if (data.includes('Missing required fields')) {
                console.log('  This is the "Missing required fields" error from /products');
                console.log('  Make sure you\'re using /categories NOT /products in Postman!');
            }

            console.log('\n' + '='.repeat(60));
            console.log('SUMMARY');
            console.log('='.repeat(60));
            console.log('/categories endpoint should be working');
            console.log(' /products endpoint requires authentication');
            console.log('\n In Postman, verify your URL is:');
            console.log('   http://localhost:8080/categories');
            console.log('   NOT http://localhost:8080/products');
            console.log('='.repeat(60));
        });
    });

    req.on('error', (error) => {
        console.error(' Request failed:', error.message);
    });

    req.write(postData);
    req.end();
}
