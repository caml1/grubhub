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
function create(req, res, next) {
    const { data: { name, description, price, image_url } = {} } = req.body;
  
    // Validations
    if (!name) {
      return res.status(400).json({ error: "Dish must include a name" });
    }
    if (name === "") {
      return res.status(400).json({ error: "Dish must include a name" });
    }
    if (!description) {
      return res.status(400).json({ error: "Dish must include a description" });
    }
    if (description === "") {
      return res.status(400).json({ error: "Dish must include a description" });
    }
    if (!price) {
      return res.status(400).json({ error: "Dish must include a price" });
    }
    if (!Number.isInteger(price) || price <= 0) {
      return res.status(400).json({ error: "Dish must have a price that is an integer greater than 0" });
    }
    if (!image_url) {
      return res.status(400).json({ error: "Dish must include an image_url" });
    }
    if (image_url === "") {
      return res.status(400).json({ error: "Dish must include an image_url" });
    }
  
    // Create new dish
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
  const { dishId } = req.params;
  const { data: { id, name, description, price, image_url } = {} } = req.body;

    // Validations
    if (!name) {
        return res.status(400).json({ error: "Dish must include a name" });
    }
    if (name === "") {
        return res.status(400).json({ error: "Dish must include a name" });
    }
    if (!description) {
        return res.status(400).json({ error: "Dish must include a description" });
    }
    if (description === "") {
        return res.status(400).json({ error: "Dish must include a description" });
    }
    if (!price) {
        return res.status(400).json({ error: "Dish must include a price" });
    }
    if (!Number.isInteger(price) || price <= 0) {
        return res.status(400).json({ error: "Dish must have a price that is an integer greater than 0" });
    }
    if (!image_url) {
        return res.status(400).json({ error: "Dish must include an image_url" });
    }
    if (image_url === "") {
        return res.status(400).json({ error: "Dish must include an image_url" });
    }
    const foundDish = dishes.find((dish) => dish.id === dishId);
    if (!foundDish) {
    return res.status(404).json({ error: `Dish does not exist: ${dishId}` });
    }
    if (foundDish.id !== dishId) {
    return res.status(400).json({ error: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}` });
    }
    // Check if the id in the data matches the dishId in the route
  // if (id !== dishId) {
  //   // Update the dish
  //   dish.name = name;
  //   dish.description = description;
  //   dish.price = price;
  //   dish.image_url = image_url;

  //   return res.status(400).json({ error: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}` });
  // }

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
        // Dish exists, but returning 405 Method Not Allowed for existing dish
        return res.status(405).json({ error: `Method Not Allowed for existing Dish ID ${dishId}` });
    }

    // If dish does not exist, return 404 Not Found
    return res.status(405).json({ error: `Dish ID ${dishId} not found` });
}

// List
function list(req, res) {
    res.json({ data: dishes });
}

module.exports = {
    create,
    read: [dishExists, read],
    update: [dishExists, update],
    delete: [destroy],
    list,
};