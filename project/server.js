const express = require('express');
const path = require('path');
const app = express();
const PORT = 4000;
const da = require("./data-access");

app.use(express.static('public'));

app.get("/customers", async(req, res) => {
    const cust = await da.getCustomers();
    res.send(cust);
});

app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`)
})

