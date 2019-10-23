var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazonDB"
});

connection.connect(function(err) {
    if (err) throw err;
});
// clears table and displays all products to user
function getAllProducts() {
    connection.query("SELECT * FROM products", function(err, data) {
        console.log(data);
        promptUser();
    });
}

// prompt user for prechase- item # and item qty
function promptUser() {
    inquirer.prompt([{
            name: "name",
            type: "input",
            message: "Please enter the item you would like to purhcase.",
            filter: Number
        },
        {
            name: "Quantity",
            type: "input",
            message: "How many items do you wish to purchase?",
            filter: Number
        },

    ]).then(function(answers) {
        // console.log("prompting user");
        var quantityNeeded = answers.Quantity;
        var IDrequested = answers.ID;
        purchaseOrder(IDrequested, quantityNeeded);
    });
};




function updateItemById(updateItem, customerOrder) {
    // var query = "UPDATE products SET stock_quantity = stock_quantity-" + customerOrder + " WHERE item_id =" + updateItem;
    // console.log(query);
    connection.query("UPDATE products SET stock_quantity = stock_quantity-" + customerOrder + " WHERE item_id =" + updateItem, function(err, data) {
        console.log(data);
    });
}

function getProductById(productID) {
    connection.query("SELECT * FROM products WHERE item_id =" + productID, function(err, data) {
        console.log(data);
    });
}

getAllProducts();