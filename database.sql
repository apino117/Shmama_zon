/* Create Database */
DROP DATABASE IF EXISTS shmamazon_DB;

CREATE database shmamazon_DB;

/* Make sure we use the database */
USE shmamazon_DB;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(50) NOT NULL,
  price INT(10) NOT NULL,
  stock_quantity INT,
  PRIMARY KEY (item_id)
);

/* Starting Items */
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES 
("Spanky's Gazpacho", "Food", 20, 5),
("Alan Tour's 'Ring Test'", "Arts & Crafts", 314, 66), 
("Actual Human Teeth", "Science", 5, 1000),
("Tomacco", "Tobacco Products", 4, 23), 
("Paper Toilets", "Bath Products", 25, 16),
("Sweet Dee's Murderin' Shears", "Home and Garden", 30, 8),
("The Harry Potter Conspiracy Documentary", "Entertainment", 16, 500),
("'Danny Devito' brand Hand Sanitizer", "Health & Wellness", 7, 19),
("'Being Positivity and Power the Thinking You Can' A Self-Help Book for the Ages", "Books", 22, 12),
("Nintendo 'Thém'", "Electronics", 250, 45);

SELECT * FROM products