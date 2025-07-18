async function getCustomers() {
    const response = await fetch('/customers', {
        headers: { 'x-api-key': 'abcde' }
    });
    const data = await response.json();
    document.getElementById('results').innerHTML = JSON.stringify(data, null, 2);
}

async function resetData() {
    const response = await fetch('/reset', { method: 'POST' });
    const result = await response.text();
    document.getElementById('results').innerHTML = result;
}
