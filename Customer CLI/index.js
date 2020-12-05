const mongoose = require('mongoose');
const dotenv = require('dotenv');
//Import model
const Customer = require('./models/customer');
const customer = require('./models/customer');

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;

//Declare env
dotenv.config();

//Connect to db
const db = mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
});

//Add customer
const addCustomer = (customer) => {
    Customer.create(customer).then(customer => {
        console.info('New customer added');
        // db.close();
    });
};

//Find customer
const findCustomer = (name) => {
    //Make case insensitive
    const search = new RegExp(name, 'i');
    Customer.find({$or: [
        {firstname: search}, 
        {lastname: search}
    ]}).then(customer => {
        console.info(customer);
        console.info(`${customer.length} matches`);
        // db.close();
    })
}

//Update customer
const updateCustomer = (_id, customer) => {
    Customer.update({_id}, customer)
        .then(customer => {
            console.info('Customer updated');
        });
}


//Remove customer
const removeCustomer = (_id) => {
    Customer.remove({_id})
        .then(customer => {
            console.info('Customer removed');
        });
}

//List customers
const listCustomers = () => {
    Customer.find()
        .then(customers => {
            console.info(customers);
            console.info(`${customers.length} matches`);
        });
}

// Export All Methods
module.exports = {
    addCustomer,
    findCustomer,
    updateCustomer,
    removeCustomer,
    listCustomers
}