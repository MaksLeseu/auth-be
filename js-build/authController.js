"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const Role_1 = require("./models/Role");
const User_1 = require("./models/User");
const jwt = require("jsonwebtoken");
// Import the secret key.
const config_1 = require("./config");
// Функция, которая возвращает ошибки описанные в authRouter
const express_validator_1 = require("express-validator");
// import the bcrypt
const bcrypt = require('bcryptjs');
// Функция, которая создает JWT токен. Внутри объект который мы передаем с информацией в токен
const generateAccessToken = (id, roles) => {
    const payload = {
        id: id,
        roles: [roles]
    };
    return jwt.sign(payload, config_1.secretKey.secret, { expiresIn: '24h' }); // expiresIn - то, сколько будет жить токен
};
class AuthController {
    registration(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Получаем ошибки
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ message: 'Ошибка при регистрации.', errors });
                }
                // Return name and email and password from a body request
                const { username, email, password } = req.body;
                // Проверяем есть ли такой пользователь в базе данных
                const candidateEmail = yield User_1.User.findOne({ email });
                if (candidateEmail) {
                    return res.status(400).json({ message: 'This email is already in use.' });
                }
                const hashPassword = bcrypt.hashSync(password, 7);
                // Получаем роль с базы данных
                const userRole = yield Role_1.Role.findOne({ value: "USER" });
                // @ts-ignore
                const user = new User_1.User({ username, email, password: hashPassword, roles: [userRole.value] });
                // Save user in database
                yield user.save();
                return res.json({ message: 'Пользователь был успешно зарегистрирован.' });
            }
            catch (e) {
                console.log(e);
                res.status(400).json({ message: 'Registration error' });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.body.email;
                const password = req.body.password;
                const user = yield User_1.User.findOne({ email });
                if (!user)
                    return res.status(400).json({ message: `User ${email} not found!` });
                //const hashPassword = bcrypt.hashSync(password, 7)
                // Сравниваем 2 пароля. Тот что хэшированный из базы данных и тот, что пришел из логинизации
                // @ts-ignore
                const isPasswordCorrect = bcrypt.compareSync(password, user.password);
                if (!isPasswordCorrect)
                    return res.status(400).json({ message: `Incorrect password!` });
                // @ts-ignore
                const token = generateAccessToken(user._id, user.roles);
                return res.json({ token });
            }
            catch (e) {
                console.log(e);
                res.status(400).json({ message: 'Login error' });
            }
        });
    }
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                /* Добавляем в базу данных только 1 раз. По идее проверка ниже не нужна.
                // Проверяем, существуют ли уже роли "USER" и "ADMIN" в базе данных
                const userRole = await Role.findOne({ value: 'USER' });
                const adminRole = await Role.findOne({ value: 'ADMIN' });
    
                // Если роли не существуют, то создаем их
                if (!userRole) {
                    await new Role().save();
                }
                if (!adminRole) {
                    await new Role({ value: 'ADMIN' }).save();
                }*/
                const users = yield User_1.User.find();
                // Return message on client
                res.json(users);
            }
            catch (e) {
                res.json(`${e}`);
            }
        });
    }
}
exports.authController = new AuthController();
