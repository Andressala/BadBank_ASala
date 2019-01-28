// setup server
var express = require('express');
var app     = express();
var low     = require('lowdb');
var fs      = require('lowdb/adapters/FileSync');
var adapter = new fs('db.json');
var _       = require('lodash');
var db      = low(adapter);

// setup directory used to serve static files
app.use(express.static('public'));

// allow Cross-Origin Resource Sharing (CORS)
var cors = require('cors');
app.use(cors());

// setup data store
console.log('Load stored accounts...');
db.defaults({ accounts: []}).write();
console.log('Loaded');

//accounts:[
//    {name        : '',
//     email       : '',
//     balance     : 0,
//     password    : '',
//     transactions: []}
//] 


//-----ACCOUNT CREATION-----------------------------------------------------------------------------------------------------------------------------------------
app.get('/account/create/:name/:email/:password', function (req, res) {
    var message = '';
    console.log('Creating account...');
 
    var NewAccount = {
        'name'          : req.params.name,
        'email'         : req.params.email,
        'balance'       : 0,
        'password'      : req.params.password,
        'transactions'  : [{action: 'Create',amount: 0,timestamp: new Date()}]
    };

    //Control if email is already used
    var FindAccount =     db.get('accounts')
                            .find({email: req.params.email})
                            .value();

    if(FindAccount){
        //E-mail already used
        message = 'Account creation error: E-mail already used';
        console.log(message);
    }
    else{
        //add account
        db.get('accounts').push(NewAccount).write(); 
        message = 'Account created';
        console.log(message);
        console.log(NewAccount);
    }
    res.send(message);   
});
//-----END ACCOUNT CREATION-----------------------------------------------------------------------------------------------------------------------------------------


//-----ACCOUNT LOGIN-------------------------------------------------------------------------------------------------------------------------------------------------
app.get('/account/login/:email/:password', function (req, res) {

    var message = '';
    console.log('Login to',req.params.email,'...');
    
    //Control if account exists
    var FindAccount =     db.get('accounts')
    .find({email: req.params.email})
    .value();

    if(FindAccount){
    //Acount exists
            var TargetAccount =     db.get('accounts')
                                      .find({email: req.params.email} && {password: req.params.password})
                                      .value()
            if(TargetAccount==undefined){
                message = 'Login Error: Password Invalid'; 
                console.log(message);
            }
            else{

                db.get('accounts')
                .find({email: req.params.email})
                .assign({transactions: _.concat(TargetAccount.transactions,{action: 'Login',amount: 0,timestamp: new Date()})})
                .write()

                message = 'Login Successful'; 
                console.log(TargetAccount);
                console.log('Done!');
            }
    }
    else
    {
        message = 'Login Error: E-Mail Invalid'; 
        console.log(message);
    }
res.send(message);   
   
});
//-----END ACCOUNT LOGIN-------------------------------------------------------------------------------------------------------------------------------------------------


//-----ACCOUNT BALANCE-------------------------------------------------------------------------------------------------------------------------------------------------
app.get('/account/get/:email', function (req, res) {

    console.log('Check balance of account:',req.params.email,'...');

    var TargetAccount =     db.get('accounts')
                              .find({email: req.params.email})
                              .value()

    if(TargetAccount==undefined){
        console.log('Account does not exist.');
        res.send('Account does not exist.');  
    }
    else{

        db.get('accounts')
        .find({email: req.params.email})
        .assign({transactions: _.concat(TargetAccount.transactions,{action: 'CheckBalance',amount: 0,timestamp: new Date()})})
        .write()

        res.send('Balance: ' + TargetAccount.balance);
        console.log('Balance: ' + TargetAccount.balance);
        console.log('Success');
    }
});
//-----END ACCOUNT BALANCE-------------------------------------------------------------------------------------------------------------------------------------------------


//-----DEPOSIT-------------------------------------------------------------------------------------------------------------------------------------------------------------------
app.get('/account/deposit/:email/:amount', function (req, res) {

    var amount = Number(req.params.amount);
    console.log('Deposit of',amount,'to account:',req.params.email,'...');

    var TargetAccount =     db.get('accounts')
                              .find({email: req.params.email})
                              .value()

    if(TargetAccount==undefined){
        console.log('Account does not exist.');
        res.send('Account does not exist.');  
    }
    else{

        db.get('accounts')
        .find({email: req.params.email})
        .assign({balance: TargetAccount.balance = Number(TargetAccount.balance) + Number(amount)})
        .assign({transactions: _.concat(TargetAccount.transactions,{action: 'Deposit',amount: amount,timestamp: new Date()})})
        .write()

        var UpdatedTargetAccount =     db.get('accounts')
                                         .find({email: req.params.email})
                                         .value()

      
            res.send('New Balance: ' + UpdatedTargetAccount.balance);
            console.log('Balance: ' + UpdatedTargetAccount.balance);
            console.log('Success');
    }
});
//-----END_DEPOSIT---------------------------------------------------------------------------------------------------------------------------------------------------------------


//-----WITHDRAW---------------------------------------------------------------------------------------------------------------------------------------------------------------
app.get('/account/withdraw/:email/:amount', function (req, res) {

    var amount = Number(req.params.amount);
    console.log('Withdraw of',req.params.amount,'to account:',req.params.email,'...');
    

    var TargetAccount =     db.get('accounts')
                              .find({email: req.params.email})
                              .value()

    if(TargetAccount==undefined){
        console.log('Account does not exist.');
        res.send('Account does not exist.');  
    }
    else{

        if(amount>TargetAccount.balance){
            console.log('Insufficient account funds.');
            res.send('Insufficient account funds.'); 
        }
        else{
        db.get('accounts')
        .find({email: req.params.email})
        .assign({balance: TargetAccount.balance = Number(TargetAccount.balance) - Number(amount)})
        .assign({transactions: _.concat(TargetAccount.transactions,{action: 'Withdraw',amount: amount,timestamp: new Date()})})
        .write()

        var UpdatedTargetAccount =     db.get('accounts')
                                         .find({email: req.params.email})
                                         .value()

      
            res.send('New Balance: ' + UpdatedTargetAccount.balance);
            console.log('Balance: ' + UpdatedTargetAccount.balance);
            console.log('Success');
        }
    }
});
//-----END_WITHDRAW---------------------------------------------------------------------------------------------------------------------------------------------------------------


//-----TRANSACTIONS---------------------------------------------------------------------------------------------------------------------------------------------------------------
app.get('/account/transactions/:email', function (req, res) {
    // YOUR CODE 
     // Return all transactions for account
     console.log('Check transactions of account:',req.params.email,'...');

    var TargetAccount =     db.get('accounts')
                              .find({email: req.params.email})
                              .value()

    if(TargetAccount==undefined){
        console.log('Account does not exist.');
        res.send('Account does not exist.');  
    }
    else{
        res.send(TargetAccount.transactions);
        console.log('Transactions:');
        console.log(TargetAccount.transactions);
        console.log('End of transactions');
        console.log('Success');

        db.get('accounts')
        .find({email: req.params.email})
        .assign({transactions: _.concat(TargetAccount.transactions,{action: 'CheckTransactions',amount: 0,timestamp: new Date()})})
        .write()

    }
});
//-----END_TRANSACTIONS---------------------------------------------------------------------------------------------------------------------------------------------------------------

//-----ALL DATA---------------------------------------------------------------------------------------------------------------------------------------------------------------
app.get('/account/all', function (req, res) {

    // YOUR CODE
    // Return data for all accounts
    var BankAccounts = db.get('accounts').value();
     console.log('Bank Account Information...');
     res.send(BankAccounts);
     console.log(BankAccounts);
     console.log('Done!');

});
//-----END ALL DATA---------------------------------------------------------------------------------------------------------------------------------------------------------------


// start server
// -----------------------
app.listen(80, function(){
    console.log('Running on port 80');
});
