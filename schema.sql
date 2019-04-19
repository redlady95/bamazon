DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

 

USE bamazon;

 

CREATE TABLE products (

  item_id INT NOT NULL AUTO_INCREMENT,

  product_name VARCHAR(150) NOT NULL,

  department_name VARCHAR(150) NULL,

  price DECIMAL(10,4) NULL,

  stock_quantity INT NULL,

 

  PRIMARY KEY (item_id)

);

 

INSERT INTO products (product_name, department_name, price, stock_quantity)

VALUES ("Snickers", "Candy", 2.00, 100);

 

INSERT INTO products (product_name, department_name, price, stock_quantity)

VALUES ("Kleenex", "Health & Beauty", 3.50, 25);

 

INSERT INTO products (product_name, department_name, price, stock_quantity)

VALUES ("Pokemon", "Toys", 20.00, 10);

 

INSERT INTO products (product_name, department_name, price, stock_quantity)

VALUES ("Slow Cooker", "Appliances", 49.99, 40);

 

INSERT INTO products (product_name, department_name, price, stock_quantity)

VALUES (" My Pillow", "Bedding", 39.99, 60);

 

INSERT INTO products (product_name, department_name, price, stock_quantity)

VALUES ("Comforter", "Bedding", 80.00, 9);

 

INSERT INTO products (product_name, department_name, price, stock_quantity)

VALUES ("T-Shirts", "Clothing", 19.99, 50);

 

INSERT INTO products (product_name, department_name, price, stock_quantity)

VALUES ("Lee Jeans", "Clothing", 49.50, 30);

 

INSERT INTO products (product_name, department_name, price, stock_quantity)

VALUES ("Beats Headphones", "Electronics", 299.99, 32);

 

INSERT INTO products (product_name, department_name, price, stock_quantity)

VALUES ("65-inch Sony TV", "Electronics", 999.99, 30);

 

CREATE TABLE departments (

  department_id INT NOT NULL AUTO_INCREMENT,

  department_name VARCHAR(150) NULL,

  overhead_costs DECIMAL(10,4) NULL,

 

  PRIMARY KEY (department_id)

);

 

USE bamazon;

 

ALTER TABLE products

ADD product_sales DECIMAL(10,4);

 