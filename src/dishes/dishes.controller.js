const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// Middleware to validate order existence
function dishExists(req, res, next) {
    const { dishId } = req.params;
    const foundDish = dishes.find(dish => dish.id === dishId);
    if (foundDish) {
        res.locals.dish = foundDish;
        return next();
    }
    next({
        status: 404,
        message: `Dish ID ${dishId} not found`,
    });
}

// Create
function create(req, res) {
    const { data: { name, description,  price, image_url } = {} } = req.body;
    const newDish = {
        id: nextId(),
        name,
        description,
        price,
        image_url,
    };
    dishes.push(newDish);
    res.status(201).json({ data: newDish });
}

// Read
function read(req, res) {
    res.json({ data: res.locals.dish });
}

// Update
function update(req, res) {
    const dish = res.locals.dish;
    const { data: { name, description,  price, image_url } = {} } = req.body;

    // Update the dish
    dish.name = name;
    dish.description = description;
    dish.price = price;
    dish.image_url = image_url;

    res.json({ data: dish });
}

// Delete
function destroy(req, res) {
    const { dishId } = req.params;
    const index = dishes.findIndex(dish => dish.id === dishId);

    if (index !== -1) {
        dishes.splice(index, 1);
        return res.sendStatus(204);
    }
    res.status(404).json({ error: `Dish ID ${dishId} not found` });
}

// List
function list(req, res) {
    res.json({ data: dishes });
}

module.exports = {
    create,
    read: [dishExists, read],
    update: [dishExists, update],
    delete: [dishExists, destroy],
    list,
};