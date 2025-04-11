const express = require("express");
const { getAllPizzas } = require("../controllers/pizzaController");

const router = express.Router()
router.get('/', getAllPizzas)

module.exports = router;