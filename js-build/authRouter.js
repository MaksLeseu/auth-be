"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const authController_1 = require("./authController");
const express_validator_1 = require("express-validator");
// Exported the router's object
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post('/registration', [
    (0, express_validator_1.check)('username', 'Имя пользователя не может быть пустым.').notEmpty(),
    (0, express_validator_1.check)('email', 'Email не может быть пустым.').notEmpty(),
    (0, express_validator_1.check)('password', 'Пароль должен быть не менее 4 и не более 10 символов.').isLength({ min: 4, max: 10 }), // Валидация. Первым параметром - что валидируем, вторым сообщение.
], authController_1.authController.registration);
exports.authRouter.post('/login', authController_1.authController.login);
exports.authRouter.get('/users', authController_1.authController.getUsers); // authMiddleware - Делает так, что нужно зарегистрироваться, чтобы получить список пользователей
