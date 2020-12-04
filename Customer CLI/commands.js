const program = require('commander');
const {
    addCustomer,
    findCustomer
} = require('./index');

program
    .version('1.0.0')
    .description('Client Management System')

program
    .command('add <firstname> <lastname> <phone> <email>')
    .alias('a')
    .description('Add a customer')
    .action((firstname, lastname, phone, email) => {
        addCustomer({firstname, lastname, phone, email});
    });

program
    .command('find <name>')
    .alias('f')
    .description('Find customer by name')
    .action(name => findCustomer(name));

program.parse(process.argv);