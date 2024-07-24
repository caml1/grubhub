const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assign IDs when necessary
const nextId = require("../utils/nextId");

// Middleware to validate order existence
function orderExists(req, res, next) {
    const { orderId } = req.params;
    const foundOrder = orders.find(order => order.id === orderId);
    if (foundOrder) {
        res.locals.order = foundOrder;
        return next();
    }
    next({
        status: 404,
        message: `Order ID ${orderId} not found`,
    });
}

// Create
function create(req, res) {
    const { data: { name, description, image_url, price, quantity } = {} } = req.body;
    const newOrder = {
        id: nextId(),
        name,
        description,
        image_url,
        price,
        quantity,
    };
    orders.push(newOrder);
    res.status(201).json({ data: newOrder });
}

// Read
function read(req, res) {
    res.json({ data: res.locals.order });
}

// Update
function update(req, res) {
    const order = res.locals.order;
    const { data: { name, description, image_url, price, quantity } = {} } = req.body;

    // Update the order
    order.name = name;
    order.description = description;
    order.image_url = image_url;
    order.price = price;
    order.quantity = quantity;

    res.json({ data: order });
}

// Delete
function destroy(req, res) {
    const { orderId } = req.params;
    const index = orders.findIndex(order => order.id === orderId);

    if (index !== -1) {
        orders.splice(index, 1);
        return res.sendStatus(204);
    }
    res.status(404).json({ error: `Order ID ${orderId} not found` });
}

// List
function list(req, res) {
    res.json({ data: orders });
}

module.exports = {
    create,
    read: [orderExists, read],
    update: [orderExists, update],
    delete: [orderExists, destroy],
    list,
};