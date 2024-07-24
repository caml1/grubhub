const router = require("express").Router();
const controller = require("./dishes.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

// List and Create (GET and POST /orders)
router.route("/")
  .get(controller.list)      // List all orders
  .post(controller.create)   // Create a new order
  .all(methodNotAllowed);    // Handle other HTTP methods

// Read, Update, and Delete (GET, PUT, DELETE /orders/:orderId)
router.route("/:dishId")
  .get(controller.read)      // Read a specific order
  .put(controller.update)    // Update a specific order
  .delete(controller.delete) // Delete a specific order
  .all(methodNotAllowed);    // Handle other HTTP methods

module.exports = router;