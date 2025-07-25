const MongoClient = require('mongodb').MongoClient;
const dbName = 'custdb';
const baseUrl = 'mongodb://127.0.0.1:27017';
const collectionName = 'customers'
const connectString = baseUrl + "/" + dbName;
let collection;

async function dbStartup() {
    const client = new MongoClient(connectString);
    await client.connect();
    collection = client.db(dbName).collection(collectionName);
}

async function getCustomers() {
    try {    
        const customers = await collection.find().toArray();
        return [customers, null];

    } catch (err) {
        console.log(err.message);
        return [null, err.message];

    }
}

async function addCustomer(newCustomer){
    try{
        const insertResult = await collection.insertOne(newCustomer);
        return ["success", insertResult.insertedId, null];
    } catch (err) {
        console.log(err.message);
        return ["fail", null, err.message];
    }
}

async function getCustomerById(id){
    try{
        const customer = await collection.findOne({"id": +id});
        if(!customer) {
            return [null, "invalid customer number"];
        }
        return [customer, null];
    } catch (err){
        console.log(err.message);
        return [null, err.message];
    }
}

async function updateCustomer(updatedCustomer){
    try {
        const filter = { "id": updatedCustomer.id};
        const setData = { $set: updatedCustomer};
        const updateResult = await collection.updateOne(filter, setData);
        return ["one record updated", null];

    } catch (err) {
        console.log(err.message);
        return [null, err.message];
    }
}

async function deleteCustomerById(id){
    try {
        const deleteResult = await collection.deleteOne({"id": +id});
        if (deleteResult.deletedCount === 0) {
            return [null, "no record deleted"];
        } else if (deleteResult.deletedCount === 1){
            return ['one record deleted', null];
        } else {
            return [null, "error deleting records"];
        }
    } catch (err) {
        console.log(err.message);
        return [null, err.message];
    }
}

async function findCustomers(field, value){
    try {
        const searchValue = (field === 'id') ? parseInt(value) : value;
        const filter = {[field]: searchValue};
        const customers = await collection.find(filter).toArray();
        return [customers, null];
    } catch (err){
        console.log(err.message);
        return [null, err.message];
    }
}

async function checkForDuplicate(email) {
    try {
        const existingCustomer = await collection.findOne({ email: email });
        return [existingCustomer, null];
    } catch (err) {
        console.log(err.message);
        return [null, err.message];
    }
}

async function resetCustomers() {
    let data = [{ "id": 0, "name": "Mary Jackson", "email": "maryj@abc.com", "password": "maryj" },
        { "id": 1, "name": "Karen Addams", "email": "karena@abc.com", "password": "karena" },
        { "id": 2, "name": "Scott Ramsey", "email": "scottr@abc.com", "password": "scottr" }];
    try {
    await collection.deleteMany({});
    await collection.insertMany(data);
    const customers = await collection.find().toArray();
    const cust_count = customers.length;
    message = "There are " + cust_count + " customers in the database."
    return [message, null];
    } catch (err) {
        console.log(err.message);
        return [null, err.message];
    }
}

dbStartup();
module.exports = { getCustomers, resetCustomers, addCustomer, getCustomerById, updateCustomer, deleteCustomerById, findCustomers, checkForDuplicate };