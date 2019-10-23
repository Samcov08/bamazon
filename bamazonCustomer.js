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
            name: "ID",
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
        if (err) { console.log(err) };
        if (amtNeeded <= res[0].stock_quantity) {
            var totalCost = res[0].price * amtNeeded;
            console.log("Good news your order is in stock!");
            console.log("Your total cost for " + amtNeeded + " " + res[0].product_name + " is " + totalCost + " Thank you!");

            connection.query("UPDATE products SET stock_quantity = stock_quantity - " + amtNeeded + "WHERE item_id = " + ID);
        } else {
            console.log("Insufficient quantity, sorry we do not have enough " + res[0].product_name + "to complete your order.");
        };
        displayProducts();
    });
}

function getProductById(productID) {
    connection.query("SELECT * FROM products WHERE item_id =" + productID, function(err, data) {
        console.log(data);
    });
}

getAllProducts();