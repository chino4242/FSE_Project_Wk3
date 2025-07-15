const express = require('express');
const path = require('path');
const app = express();
const PORT = 4000;

app.use(express.static('public'));

app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`)
})

