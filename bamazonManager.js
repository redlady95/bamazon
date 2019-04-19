(function runManager() {

  var mysql = require("mysql");

  var inquirer = require("inquirer");

  var asTable = require("as-table");

 

  var connection = mysql.createConnection({

    host: "localhost",

    port: 3307,

 

    // Your username

    user: "root",

 

    // Your password

    password: "root",

    database: "bamazon"

  });

 

  var choices = [

    "View Products for Sale",

    "View Low Inventory",

    "Add to Inventory",

    "Add New Product"

  ];

 

  function start() {

    inquirer

      .prompt({

        name: "command",

        type: "rawlist",

        message: "What would you like to do?",

        choices: choices

      })

      .then(function(answer) {

        if (answer.command === "View Products for Sale") {

          showInventory(start);

        } else if (answer.command === "View Low Inventory") {

          viewLowInventory(start);

        } else if (answer.command === "Add to Inventory") {

          showInventory(addInterface);

        } else if (answer.command === "Add New Product") {

          showInventory(productAddInterface);

        } else {

          console.log("something wrong happened");

          start();

         

        }

      });

  }

 

  function showInventory(func) {

    var query = "SELECT item_id AS ID, product_name AS Name, department_name AS Department, price AS PPU, stock_quantity AS QTY, product_sales AS Sales FROM products";

    connection.query(query, function(err, results) {

      if (err) throw err;

      console.log(asTable(results));

      func();

    });

  }

 

  function viewLowInventory(func) {

    var query = "SELECT item_id AS ID, product_name AS Name, department_name AS Department, price AS PPU, stock_quantity AS QTY, product_sales AS Sales FROM products WHERE stock_quantity < 6";

    connection.query(query, function(err, results) {

      if (err) throw err;

      console.log(asTable(results));

      func();

    });

  }

 

  function addInterface() {

    inquirer

      .prompt({

        name: "id",

        type: "input",

        message: "What is the ID of the item you would like to increment?",

        validate: function(value) {

          if (!isNaN(value)) {

            return true;

          }

          return "pick a number!";

        }

      })

      .then(function(answer) {

        var id = answer.id;

        getProductInfo(id, selectQuantity);

      });

  }

 

  function getProductInfo(id, func) {

    var query = "SELECT * FROM products WHERE ?";

    connection.query(

      query,

      {

        item_id: id

      },

      function(err, results) {

        if (err) throw err;

        func(results[0]);

      }

    );

  }

 

  function selectQuantity(productObj) {

 

    var productName = productObj.product_name;

    var itemId = productObj.item_id;

    var stockQuantity = productObj.stock_quantity;

 

    inquirer

      .prompt({

        name: "quantity",

        type: "input",

        message: "How many " + productName + "'(s) do you want to add?",

        validate: function (value) {

          if (!isNaN(value)) {

              return true;

          }

          return "pick a number!";

        }

      })

      .then(function (answer) {

        var quantity = answer.quantity;

        addInventory(productObj, quantity);

      });

  }

 

  function addInventory(productObj, quantity) {

    var productName = productObj.product_name;

    var itemId = productObj.item_id;

    var stockQuantity = productObj.stock_quantity;

 

   var newQuantity = parseInt(stockQuantity) + parseInt(quantity);

 

    var query = "UPDATE products SET ? WHERE ?";

    connection.query(query, [

    {

      stock_quantity: newQuantity

    },

    {

      item_id: itemId

    }

  ],

    function(err, results){

      if (err) throw err;

      console.log("Added " + quantity + " of " + productName);

      console.log("You now have " + newQuantity + " of " + productName)

      console.log("==================================");

      start();

    });

  }

 

  function productAddInterface(){

    inquirer

    .prompt([

      {

        name: "item",

        type: "input",

        message: "What is the name of the item you would like to add?"

      },

      {

        name: "department",

        type: "input",

        message: "What department does this belong to?"

      },

      {

        name: "ppu",

        type: "input",

        message: "What is the price per unit?",

        validate: function(value) {

          if (!isNaN(value)) {

            return true;

         }

          return false;

        }

      },

      {

        name: "quantity",

        type: "input",

        message: "How many do you have?",

        validate: function(value) {

          if (!isNaN(value)) {

            return true;

          }

          return false;

        }

      }

    ])

    .then(function(answer) {

      // when finished prompting, insert a new item into the db with that info

      connection.query(

        "INSERT INTO products SET ?",

        {

          product_name: answer.item,

          department_name: answer.department,

          price: answer.ppu,

          stock_quantity: answer.quantity

        },

        function(err) {

          if (err) throw err;

          console.log("Your item was added successfully!");

         // re-prompt the user for if they want to bid or post

          showInventory(start);

        }

      );

    });

  }

 

  connection.connect(function(err) {

    if (err) throw err;

    // run the start function after the connection is made to prompt the user

    start();

  });

})();