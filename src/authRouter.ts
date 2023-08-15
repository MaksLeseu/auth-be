import { Router } from 'express';
import {authController} from "./authController";
import {check} from "express-validator";
import {authMiddleware} from "./middleware/authMiddleware";

// Exported the router's object
export const authRouter = Router();

authRouter.post('/registration', [
    check('username', 'Имя пользователя не может быть пустым.').notEmpty(),  // Валидация. Первым параметром - что валидируем, вторым сообщение.
    check('email', 'Email не может быть пустым.').notEmpty(),  // Валидация. Первым параметром - что валидируем, вторым сообщение.
    check('password', 'Пароль должен быть не менее 4 и не более 10 символов.').isLength({min: 4, max: 10}),  // Валидация. Первым параметром - что валидируем, вторым сообщение.
], authController.registration);
authRouter.post('/login', authController.login);
authRouter.get('/users', authMiddleware, authController.getUsers);  // authMiddleware - Делает так, что нужно зарегистрироваться, чтобы получить список пользователей
authRouter.post('/posts', authController.posts);
authRouter.post('/logout', authController.logout);
authRouter.get('/refresh', authController.refresh);
authRouter.get('/username', authController.getUsername)


