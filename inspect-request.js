
const http = require('http');

const PORT = 9000;

const server = http.createServer((req, res) => {
    console.log('\n' + '='.repeat(70));
    console.log('📨 INCOMING REQUEST');
    console.log('='.repeat(70));
    console.log(`Method: ${req.method}`);
    console.log(`URL: ${req.url}`);
    console.log(`Headers:`);
    Object.entries(req.headers).forEach(([key, value]) => {
        console.log(`  ${key}: ${value}`);
    });

    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        console.log(`\nBody: ${body || '(empty)'}`);
        console.log('='.repeat(70));

        if (body) {
            try {
                const parsed = JSON.parse(body);
                console.log('Body is valid JSON');
                console.log('Parsed:', parsed);

                if (parsed.name) {
                    console.log(`"name" field found: "${parsed.name}"`);
                } else {
                    console.log('"name" field is missing!');
                }
            } catch (e) {
                console.log(' Body is NOT valid JSON:', e.message);
            }
        } else {
            console.log('Body is empty!');
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            message: 'Request received and logged to console',
            receivedBody: body
        }));
    });
});

server.listen(PORT, () => {
    console.log(`\n REQUEST INSPECTOR RUNNING ON PORT ${PORT}`);
    console.log(`\n TO TEST IN POSTMAN:`);
    console.log(`   1. Change URL to: http://localhost:${PORT}/categories`);
    console.log(`   2. Keep everything else the same`);
    console.log(`   3. Click Send`);
    console.log(`   4. Check this console for detailed request info\n`);
    console.log(`Press Ctrl+C to stop\n`);
});
