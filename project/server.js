const express = require('express');
const path = require('path');
const app = express();
const PORT = 4000;
const da = require("./data-access");
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(express.static('public'));

app.get("/customers", async(req, res) => {
    const [customers, error] = await da.getCustomers();
    if (error) {
        console.error('Error', error);
        return res.status(500).json({error: 'Failed to fetch'});
    }
    res.send(customers);
});

app.get('/customers/:id', async (req, res) => {
    const id = req.params.id;
    const [cust, err] = await da.getCustomerById(id);
    if (!cust){
        res.status(404);
        res.send(err);
    } else {
        res.send(cust);
    }
})

app.post('/customers', async(req, res) => {
    const newCustomer = req.body;
    if (newCustomer === null || req.body != {}) {
        res.status(400);
        res.send("missing request body");
    } else {
        const [status, id, errMessage] = await da.addCustomer(newCustomer);
        if (status ==='success') {
            res.status(201);
            let response = {...newCustomer};
            response["_id"] = id;
            res.send(response);
        } else {
            res.status(400);
            res.send(errMessage);
        }
    }
});

app.put('/customers/:id', async (req, res) => {
    const id = req.params.id;
    const updatedCustomer = req.body;
    if (updatedCustomer === null || req.body != {}) {
        res.status(404);
        res.send("missing request body");
    } else {
        delete updatedCustomer._id;
        const [message, errMessage] = await da.updateCustomer(updatedCustomer);
        if (message) {
            res.send(message);
        } else {
            res.status(400);
            res.send(errMessage);
        }
    }
});

app.delete('/customers/:id', async (req, res) => {
    const id = req.params.id;
    const [message, errMessage] = await da.deleteCustomerById(id);
    if (message) {
        res.send(message);
    } else {
        res.status(404);
        res.send(errMessage);
    }
})

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

