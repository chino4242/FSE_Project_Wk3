const express = require('express');
const path = require('path');
const app = express();
const PORT = 4000;
const da = require("./data-access");


app.use(express.static('public'));

app.get("/customers", async(req, res) => {
    const [customers, error] = await da.getCustomers();
    if (error) {
        console.error('Error', error);
        return res.status(500).json({error: 'Failed to fetch'});
    }
    res.send(customers);
});

app.get("/reset", async(req, res) => {
    const [result, error] = await da.resetCustomers();
    if (error) {
        return res.status(500).json({error: 'Failed to reset'});
    }
    res.send(result);
})

app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`)
})

