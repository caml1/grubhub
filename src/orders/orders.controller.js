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
function create(req, res, next) {
    const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
  
    // Validations
    if (!deliverTo) {
      return res.status(400).json({ error: "Order must include a deliverTo" });
    }
    if (deliverTo === "") {
      return res.status(400).json({ error: "Order must include a deliverTo" });
    }
    if (!mobileNumber) {
      return res.status(400).json({ error: "Order must include a mobileNumber" });
    }
    if (mobileNumber === "") {
      return res.status(400).json({ error: "Order must include a mobileNumber" });
    }
    if (!dishes) {
      return res.status(400).json({ error: "Order must include a dish" });
    }
    if (!Array.isArray(dishes)) {
      return res.status(400).json({ error: "Order must include at least one dish" });
    }
    if (dishes.length === 0) {
      return res.status(400).json({ error: "Order must include at least one dish" });
    }
    for (let i = 0; i < dishes.length; i++) {
      const dish = dishes[i];
      if (!dish.quantity) {
        return res.status(400).json({ error: `Dish ${i} must have a quantity that is an integer greater than 0` });
      }
      if (!Number.isInteger(dish.quantity) || dish.quantity <= 0) {
        return res.status(400).json({ error: `Dish ${i} must have a quantity that is an integer greater than 0` });
      }
    }
  
    // Create new order
    const newOrder = {
      id: nextId(),
      deliverTo,
      mobileNumber,
      status,
      dishes,
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
    const { orderId } = req.params;
    const { data: { id, deliverTo, mobileNumber, status, dishes } = {} } = req.body;

    // Validations
    if (id && id !== orderId) {
        return res.status(400).json({ error: `Order id does not match route id. Order: ${id}, Route: ${orderId}.` });
    }

    if (!deliverTo) {
        return res.status(400).json({ error: "Order must include a deliverTo" });
    }
    if (deliverTo === "") {
        return res.status(400).json({ error: "Order must include a deliverTo" });
    }
    if (!mobileNumber) {
        return res.status(400).json({ error: "Order must include a mobileNumber" });
    }
    if (mobileNumber === "") {
        return res.status(400).json({ error: "Order must include a mobileNumber" });
    }
    if (!dishes) {
        return res.status(400).json({ error: "Order must include a dish" });
    }
    if (!Array.isArray(dishes)) {
        return res.status(400).json({ error: "Order must include at least one dish" });
    }
    if (dishes.length === 0) {
        return res.status(400).json({ error: "Order must include at least one dish" });
    }
    for (let i = 0; i < dishes.length; i++) {
        const dish = dishes[i];
        if (!dish.quantity) {
            return res.status(400).json({ error: `Dish ${i} must have a quantity that is an integer greater than 0` });
        }
        if (!Number.isInteger(dish.quantity) || dish.quantity <= 0) {
            return res.status(400).json({ error: `Dish ${i} must have a quantity that is an integer greater than 0` });
        }
    }

    if (!status) {
        return res.status(400).json({ error: "Order must have a status of pending, preparing, out-for-delivery, delivered" });
    }
    if (status === "") {
        return res.status(400).json({ error: "Order must have a status of pending, preparing, out-for-delivery, delivered" });
    }
    const validStatuses = ["pending", "preparing", "out-for-delivery", "delivered"];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Order must have a status of pending, preparing, out-for-delivery, delivered" });
    }
    if (order.status === "delivered") {
        return res.status(400).json({ error: "A delivered order cannot be changed" });
    }

    // Update the order
    order.deliverTo = deliverTo;
    order.mobileNumber = mobileNumber;
    order.status = status;
    order.dishes = dishes;

    res.json({ data: order });
}

// Delete
function destroy(req, res) {
    const { orderId } = req.params;
    const index = orders.findIndex(order => order.id === orderId);

    if (index === -1) {
        return res.status(404).json({ error: `Order ID ${orderId} not found` });
    }

    if (orders[index].status !== 'pending') {
        return res.status(400).json({ error: "Order is not pending" });
    }

    orders.splice(index, 1);
    return res.sendStatus(204);
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