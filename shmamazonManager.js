// List a set of menu options:
// View Products for Sale
// View Low Inventory
// Add to Inventory
// Add New Product
// If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
// If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.
// If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
// If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.

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
    password: "",
    database: "shmamazon_DB"
});

connection.connect(function (err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId + "\n");
});

function viewMenu() {
    inquirer.prompt([
        {
            type: "list",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product",
                "Exit"
            ],
            name: "option"
        }
    ]).then(answers => {

        switch (answers.option) {

            case "View Products for Sale":
                productsForSale();
                break;
            case "View Low Inventory":
                viewLowInventory();
                break;
            case "Add to Inventory":
                viewInventory();
                break;
            case "Add New Product":
                addProduct();
                break;
            case "Exit":
            return;
        }
    });
};

function productsForSale() {
    var query = "SELECT * FROM products";
    connection.query(query, function (err, res) {
        if (err) throw err;
        for (i = 0; i < res.length; i++) {
            console.log("============================================")
            console.log("Product Name: " + res[i].product_name);
            console.log("SKU: " + res[i].item_id);
            console.log("Price: $" + res[i].price)
            console.log("Quantity: " + res[i].stock_quantity);
            console.log("============================================");
        };
    });
};

function viewLowInventory() {
    var query = "SELECT * FROM products WHERE stock_quantity < 10";
    connection.query(query, function (err, res) {
        if (err) throw err;
        for (i = 0; i < res.length; i++) {
            console.log(res[i]);
        };;
    });
};

function viewInventory() {

    var queryOne = "SELECT * FROM products"
    connection.query(queryOne, function (err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "list",
                choices: function () {
                    var choiceArray = [];
                    for (i = 0; i < res.length; i++) {
                        choiceArray.push(res[i].product_name);
                    }
                    return choiceArray;
                },
                message: "Which product would you like to update?",
                name: "ProductChoice"
            },
            {
                type: "input",
                message: "How much would you like to add?",
                name: "NumberChoice"
            }
        ]).then(answers => {
            var productToUpdate = answers.ProductChoice;
            var numberForUpdate = parseInt(answers.NumberChoice) + parseInt(res[0].stock_quantity);
            increaseInventory(numberForUpdate, productToUpdate);
        })
    });
}

function increaseInventory(numberForUpdate, productToUpdate) {

    var queryTwo = "UPDATE products SET ? WHERE ?";
    connection.query(queryTwo, [{ stock_quantity: numberForUpdate }, { product_name: productToUpdate }], function (err, res) {
        if (err) throw err;
        console.log("============================================")
        console.log(productToUpdate + " Successfully Updated!");
        console.log(numberForUpdate + " Now Remaining!");
        console.log("============================================")
    }); 
}

function addProduct() {

    inquirer.prompt([
        {
            type: "input",
            message: "what would you like to add?",
            name: "item"
        },
        {
            type: "input",
            message: "what department is that",
            name: "department"
        },
        {
            type: "input",
            message: "what's the price?'",
            name: "price"
        },
        {
            type: "input",
            message: "how many are we adding?",
            name: "quantity"
        },
    ]).then(answers => {


        var queryThree = "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ?";
        var values = [
            [answers.item, answers.department, answers.price, answers.quantity]
        ]
        connection.query(queryThree, [values], function (err, res) {
            if (err) throw err;
            console.log(answers.item + " Successfully Added!");
        });
    });


}

// Actual app going off
viewMenu();
