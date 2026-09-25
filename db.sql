CREATE TABLE users(
    id SERIAL PRIMARY KEY ,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password TEXT NOT NULL
)

CREATE TABLE products(
    id BIGINT SERIAL PRIMARY KEY,
    name VARCHAR(50),
    category VARCHAR(50),
    brand VARCHAR(50),
    price INT,
    rating FLOAT DEFAULT 2.1,
    stock INT DEFAULT 0,
    instock BOOLEAN DEFAULT false
)

