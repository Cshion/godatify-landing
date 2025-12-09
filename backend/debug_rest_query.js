
const qs = require('qs');

async function debugQuery() {
    const slug = 'data-engineering';
    const queryParams = qs.stringify({
        filters: {
            slug: {
                // No limit here, we slice in JS
            },
        },
        populate: {
            case_studies: true,
        },
    }, {
        encodeValuesOnly: true,
    });

    const url = `http://localhost:1337/api/services?${queryParams}`;
    console.log('Fetching URL:', url);

    try {
        const res = await fetch(url);
        console.log('Status:', res.status, res.statusText);

        const text = await res.text();
        console.log('Response Body:', text);
    } catch (e) {
        console.error('Fetch Error:', e);
    }
}

debugQuery();
