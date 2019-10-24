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
        console.table(data);
        promptUser();
    });
}

// prompt user for prechase- item # and item qty
function promptUser() {
    inquirer.prompt([{
            name: "ID",
            type: "input",
            message: "Please enter the ID of the item you would like to purchase.",
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
        updateItemById(IDrequested, quantityNeeded);
    });
};


function updateItemById(updateItem, customerOrder) {
    var currentStock;
    var currentPrice;
    // var query = "UPDATE products SET stock_quantity = stock_quantity-" + customerOrder + " WHERE item_id =" + updateItem;
    // console.log(query);

    // 1. get stock_quantity of selected item
    connection.query("SELECT stock_quantity, price FROM products WHERE item_id = " + updateItem, function(err, res) {
        if (err) {
            consolelog(err);
        }
        currentStock = (res[0].stock_quantity);
        currentPrice = (res[0].price);
        // 2. compare vs quantity requested
        // 3. If qty is bad, respond with "Item on backorder, please choose another item" and run promptUser function again 
        if (customerOrder > currentStock) {
            console.log("Not enough stock");

            promptUser();
        } else {
            // 4.  If qty is good update database with new qty (subtract stock_quantiy minus order qty) and give user their total (order qty * price)
            var total = currentPrice * customerOrder
            var newQty = currentStock - customerOrder
            console.log("Your total is $" + total)
            connection.query("UPDATE products SET stock_quantity = ? WHERE item_id =?", [newQty, updateItem], function(err, data) {
                if (err) {
                    console.log(err);
                };
            })
            getAllProducts();
        }
    })
};

getAllProducts();