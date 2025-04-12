
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { body, validationResult } = require('express-validator');

// Esquema de validación para la creación de órdenes
const createOrderValidation = [
    body('items')
        .isArray({ min: 1 })
        .withMessage('La orden debe contener al menos un item.'),
    body('items.*.pizzaId')
        .notEmpty()
        .withMessage('Cada item debe tener un pizzaId.')
        .isString()
        .withMessage('El pizzaId debe ser una cadena de texto.'),
    body('items.*.quantity')
        .isInt({ min: 1 })
        .withMessage('La cantidad de cada item debe ser un número entero mayor o igual a 1.')
        .optional(), // La cantidad es opcional, por defecto es 1
];

router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrderById);
router.post('/', createOrderValidation, orderController.createOrder);

module.exports = router;
