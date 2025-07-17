const express = require('express');
const app = express();
const PORT = 4000;
const da = require("./data-access");
const bodyParser = require('body-parser');

console.log("🔍 DEBUG: API_KEY on server startup:", process.env.API_KEY);
console.log("🔍 DEBUG: All environment variables:", Object.keys(process.env));

app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/customers/find', async (req, res) => {
    const queryKeys = Object.keys(req.query);
    if (queryKeys.length === 0) {
        return res.status(400).json({error: "query string is required"});
    }
    if (queryKeys.length > 1) {
        return res.status(400).json({error: "only one search parameter is allowed"});
    }
    const searchField = queryKeys[0];
    const alllowedFields = ['id', 'email', 'password'];
    if (!alllowedFields.includes(searchField)) {
        return res.status(400).json({ 
            error: "name must be one of the following (id, email, password)" 
        });
    }
    const searchValue = req.query[searchField];

    const [customers, error] = await da.findCustomers(searchField, searchValue);
    if (error) {
        return res.status(500).json({ error });
    }
    
    if (customers.length === 0) {
        return res.status(404).json({ 
            error: "no matching customer documents found" 
        });
    }
    
    res.json(customers);
});
app.get("/customers", requireApiKey, async(req, res) => {
    const [customers, error] = await da.getCustomers();
    if (error) {
        console.error('Error', error);
        return res.status(500).json({error: 'Failed to fetch'});
    }
    res.send(customers);
});

app.get('/customers/:id', requireApiKey, async (req, res) => {
    const id = req.params.id;
    const [cust, err] = await da.getCustomerById(id);
    if (!cust){
        res.status(404);
        res.send(err);
    } else {
        res.send(cust);
    }
})

app.post('/customers', requireApiKey, async(req, res) => {
    const newCustomer = req.body;
    if (!newCustomer || newCustomer === null || Object.keys(newCustomer).length===0) {
        res.status(400).send("missing request body");
    } 
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
);

app.put('/customers/:id', requireApiKey, async (req, res) => {
    const id = req.params.id;
    const updatedCustomer = req.body;
    if (updatedCustomer === null || Object.keys(newCustomer).length===0) {
        res.status(404).send('missing request body');
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

app.delete('/customers/:id', requireApiKey, async (req, res) => {
    const id = req.params.id;
    const [message, errMessage] = await da.deleteCustomerById(id);
    if (message) {
        res.send(message);
    } else {
        res.status(404);
        res.send(errMessage);
    }
})

app.post("/reset", async(req, res) => {
    const [result, error] = await da.resetCustomers();
    if (error) {
        return res.status(500).json({error: 'Failed to reset'});
    }
    res.send(result);
})

function requireApiKey(req, res, next) {
    console.log("🔐 Middleware called! Checking API key...");
    console.log("Provided key:", req.headers['x-api-key']);
    console.log("Expected key:", process.env.API_KEY);
    
    const providedKey = req.headers['x-api-key'];
    const correctKey = process.env.API_KEY;
    
    if (!providedKey) {
        console.log("❌ No API key provided");
        return res.status(401).json({ error: "API Key is missing" });
    }
    
    if (providedKey !== correctKey) {
        console.log("❌ API key invalid");
        return res.status(403).json({ error: "API Key is invalid" });
    }
    
    console.log("✅ API key valid");
    next();
}

app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`)
})

