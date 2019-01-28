
function create() {
	
    // -------------------------------------
    //  YOUR CODE
    //  Create user account on server
    // -------------------------------------    
    var status  = document.getElementById('status');
    var name2add = document.getElementById('NameField').value;
    var email2add = document.getElementById('EmailField').value;
    var password2add = document.getElementById('PasswordField').value;
    var url = '/account/create/' + name2add + '/' + email2add + '/' + password2add;

    superagent
        .get(url)
        .end(function(err, res){

            if(err){
                console.log(err);
                console.log('Account creation error');
                status.innerHTML = JSON.stringify('Account creation error');
                } else{
                    status.innerHTML = JSON.stringify(res.text); 
                    console.log(res.text); 
                }  
        });
};



function login() {
    // -------------------------------------
    //  YOUR CODE
    //  Confirm credentials on server
    // -------------------------------------
    var status  = document.getElementById('status');
    var email2log = document.getElementById('EmailField').value;
    var password2log = document.getElementById('PasswordField').value;
    var url = '/account/login/' + email2log + '/' + password2log;

    superagent
        .get(url)
        .end(function(err, res){
            if(err){
                console.log(err);
                console.log('Account login error');
                status.innerHTML = JSON.stringify('Login Error');
            }
            else{
                status.innerHTML = JSON.stringify(res.text);
                console.log(res);
            }
        });

};

function deposit() {
    // -------------------------------------
    //  YOUR CODE
    //  Deposit funds user funds on server
    // -------------------------------------
    var status  = document.getElementById('status');
    var balance  = document.getElementById('balance');
    var email2dep = document.getElementById('EmailField').value;
    var amount2dep = document.getElementById('DepositField').value;
    var url = '/account/deposit/' + email2dep + '/' + amount2dep;

    superagent
        .get(url)
        .end(function(err, res){
            if(err){
                console.log(err);
                console.log('Account deposit error');
                balance.innerHTML = JSON.stringify('Account deposit error');
            }
            else{
                balance.innerHTML = JSON.stringify(res.text);
                console.log(res);
                console.log('Account deposit correct');
            }
    });
};

function withdraw() {
    // -------------------------------------
    //  YOUR CODE
    //  Withdraw funds user funds on server
    // -------------------------------------
    var status  = document.getElementById('status');
    var balance  = document.getElementById('balance');
    var email = document.getElementById('EmailField').value;
    var amount = document.getElementById('WithdrawField').value;
    var url = '/account/withdraw/' + email + '/' + amount;

    superagent
        .get(url)
        .end(function(err, res){
            if(err){
                console.log(err);
                console.log('Account withdraw error');
                balance.innerHTML = JSON.stringify('Account withdraw error');
            }
            else{
                balance.innerHTML = JSON.stringify(res.text);
                console.log(res);
                console.log('Account withdraw correct');
            }
        });
};

function transactions() {
    // -------------------------------------
    //  YOUR CODE
    //  Get all user transactions
    // -------------------------------------
    var transaction  = document.getElementById('transaction');
    var email = document.getElementById('EmailField').value;
    var url = '/account/transactions/' + email;

    superagent
        .get(url)
        .end(function(err, res){
            if(err){
                console.log(err);
                console.log('Account transactions check error');
                transaction.innerHTML = JSON.stringify('Account transactions check error');
            }
            else{
                transaction.innerHTML = JSON.stringify(res.text);
                console.log(res);             
                console.log('Account transactions check correct');
            }
        });
};

function balance() {
    // -------------------------------------
    //  YOUR CODE
    //  Get user balance
    // -------------------------------------
    var email = document.getElementById('EmailField').value;
    var url = '/account/get/' + email;

    superagent
        .get(url)
        .end(function(err, res){
            if(err){
                console.log(err);
                console.log('Account balance check error');
                checkbalance.innerHTML = JSON.stringify('Balance Check Error');
            }
            else{
                checkbalance.innerHTML = JSON.stringify(res.text);
                console.log(res);
                console.log('Account balance check correct');
            }
        });
};

function allData() {
    // -------------------------------------
    //  YOUR CODE
    //  Get all data
    // -------------------------------------
    var status  = document.getElementById('status');
    var url = '/account/all';

    superagent
        .get(url)
        .end(function(err, res){
            if(err){
                console.log(err);
                status.innerHTML = JSON.stringify('All Data Check Error.');
            }
            else{
                status.innerHTML = JSON.stringify(res.body);
            }

        });
};

