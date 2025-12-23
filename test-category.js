
const testCategoryEndpoint = async () => {
    try {
        console.log('Testing POST /categories endpoint...');

        const response = await fetch('http://localhost:8080/categories', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: 'Electronics' })
        });

        const data = await response.json();

        console.log('Status:', response.status);
        console.log('Response:', data);

        if (response.ok) {
            console.log('SUCCESS: Category created!');
        } else {
            console.log(' ERROR:', data.message || data);
        }
    } catch (error) {
        console.error('Request failed:', error);
    }
};

testCategoryEndpoint();
