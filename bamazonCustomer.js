(function runBamazon() {

 

  //* Variables *//

 

  var mysql = require("mysql");

  var inquirer = require("inquirer");

  var asTable = require("as-table");

  var connection = mysql.createConnection({

    host: "localhost",

    port: 3306,

 

    // Your username

    user: "root",

 

    // Your password

    password: "root",

    database: "bamazon"

  });

 

  //* Functions *//

 

  // function :  show all items for sale and then do something

  function showInventory(func) {

    var query = "SELECT item_id AS ID, product_name AS Name, department_name AS Department, price AS PPU, stock_quantity AS QTY, product_sales AS Sales FROM products";

    connection.query(query, function (err, results) {

      if (err) throw err;

      console.log(asTable(results));

      func();

    });

  }

 

  function chooseProduct() {

    inquirer

      .prompt({

        name: "id",

        type: "input",

        message: "What is the ID of the item you would like to buy?",

        validate: function (value) {

          if (!isNaN(value)) {

            return true;

          }

          return "pick a number!";

        }

      })

      .then(function (answer) {

        var id = answer.id;

        getProductInfo(id, selectQuantity);

      });

  }

 

  function getProductInfo(id, func) {

    var query = "SELECT * FROM products WHERE ?";

    connection.query(query, {

        item_id: id

      },

      function (err, results) {

       if (err) throw err;

        func(results[0]);

      })

  }

 

  function selectQuantity(productObj) {

 

    var productName = productObj.product_name;

    var itemId = productObj.item_id;

    var stockQuantity = productObj.stock_quantity;

 

    inquirer

      .prompt({

        name: "quantity",

        type: "input",

        message: "How many " + productName + "'(s) do you want to buy?",

        validate: function (value) {

          if (!isNaN(value)) {

            if (value <= stockQuantity){

              return true;

            } else {

              return "We don't have that many. Select a number less than the stock quantity of " + stockQuantity;

            }

          }

          return "pick a number!";

        }

      })

      .then(function (answer) {

        var quantity = answer.quantity;

        purchase(productObj, quantity);

      });

  }

 

  function purchase(productObj, quantity) {

    var productName = productObj.product_name;

    var itemId = productObj.item_id;

    var stockQuantity = productObj.stock_quantity;

    var price = productObj.price;

    var sales = productObj.product_sales;

 

    if (isNaN(sales)){

      sales = 0;

    }

 

    var newQuantity = stockQuantity - quantity;

    var total = price*quantity;

    total = total.toFixed(2);

    var totalSales = parseInt(sales) + parseInt(total);

    totalSales = totalSales.toFixed(2);

    var query = "UPDATE products SET ? WHERE ?";

    connection.query(query, [

    {

      stock_quantity: newQuantity,

      product_sales: totalSales

    },

    {

      item_id: itemId

    }

  ],

    function(err, results){

      if (err) throw err;

      console.log("Purchased - Quantity: " + quantity + " - Item: " + productName);

      console.log("Total Cost:  $" + total);

     console.log("Total Sales of this item: $" + totalSales);

      console.log("==================================");

    })

    showInventory(chooseProduct);

  }

 

  connection.connect(function (err) {

    if (err) throw err;

    // run the start function after the connection is made to prompt the user

    showInventory(chooseProduct);

  });

})();