// ========== Dotenv stuff that didnt really work ========== //

//  require("dotenv").config();

// var key = require("./key.js");

// var sqlPass = new sqlPass(key.sqlPass);

// console.log(sqlPass.password);



// -------- Requires and Connection Statement ------------ //

var inquirer = require("inquirer");
var mysql = require("mysql");
// var methods = require("./functions")

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "Fuckmysql69!",
    database: "shmamazon_DB"
});

connection.connect(function (err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId + "\n");
});

// =================== FUNCTION LAND ========================= //

// Function to display everything in the databse
function viewInventory() {

    var query = "SELECT * FROM products"
    connection.query(query, function (err, result) {
        if (err) throw err;
        for (i = 0; i < result.length; i++) {
            console.log("Name: " + result[i].product_name);
            console.log("Price: $" + result[i].price)
            console.log("Product SKU: " + result[i].item_id);
            console.log("------------------------------------");
        }
    })
}

// Function to set everything in motion
function start() {

    console.log("Hello and welcome to Shmamazon! Here's what we have for sale:");
    // Spaces for readability
    console.log("");
    console.log("");
    viewInventory();
    askQuestion();
};

// This is where most everything actually happens
function askQuestion() {

    var query = "SELECT * FROM products"
    connection.query(query, function (err, result) {
        if (err) throw err;
        inquirer.prompt([

            // Names of the items
            {
                type: "rawlist",
                message: "What would you like to buy?",
                choices: function () {
                    var choiceArray = [];
                    for (i = 0; i < result.length; i++) {
                        choiceArray.push(result[i].product_name);
                    }
                    return choiceArray;
                },
                name: "choice"
            },

            // How much to buy
            {
                type: "input",
                message: "How many would you like to buy?",
                name: "quantity"
            }

            // Handle Answers
        ]).then(answers => {
            handleQuantity(answers.choice, answers.quantity);
            calculatePrice(answers.choice, answers.quantity);
        });
    })
}

function handleQuantity(productString, desiredQuantity) {

    var query = "SELECT stock_quantity FROM products WHERE ?"
    connection.query(query, { product_name: productString }, function (err, res) {

        // Make product quantity a variable to better call on it
        var productQuantity = res[0].stock_quantity;

        // If the amount desired is too high
        if (productQuantity < parseInt(desiredQuantity)) {
            console.log("Aw, man I'm sorry we don't have enough of that for you!");
            return;

            // If we have enough
        } else {
            console.log("Alright, we can definitely help you with that!");

            console.log("=========================================")

            var newNumber = productQuantity -= parseInt(desiredQuantity);

            updateStock(newNumber, productString);
        }
    });
};


function updateStock(newNumber, productString) {


    var query = "UPDATE products SET ? WHERE ?";
    connection.query(query, [{ stock_quantity: newNumber }, { product_name: productString }], function (err, res) {
        console.log(productString + " Stock Updated! There are now " + newNumber + " remaining!");
    })
}

function calculatePrice(choice, quantity) {

    var query = "SELECT price FROM products WHERE ?"
    connection.query(query, { product_name: choice }, function (err, result) {

        var productPrice = result[0].price;

        var priceForCustomer = productPrice * quantity;

        console.log("You're total for today is: $" + priceForCustomer);
    })

}

// ==============  THE ACTUAL APPLICATION ================= //  

start();



