CREATE TABLE plant (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    unitprice_ati INT NOT NULL,
    quantity INT NOT NULL,
    category VARCHAR(50) NOT NULL,
    rating INT NOT NULL,
    url_picture VARCHAR(50) NOT NULL
);